const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const { generateId } = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes('xxxxx')) return null;
  return require('stripe')(key);
};

const LABELS_DIR = path.join(__dirname, '..', '..', 'public', 'labels');

const generateColissimoLabel = async ({ order, type, poids, insurance, insuranceValue }) => {
  const login = process.env.COLISSIMO_LOGIN;
  const password = process.env.COLISSIMO_PASSWORD;
  if (!login || !password) throw new Error('Identifiants Colissimo non configurés (COLISSIMO_LOGIN / COLISSIMO_PASSWORD dans .env)');

  // Auth
  const authRes = await fetch('https://ws.colissimo.fr/api-login/rest/v2/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  });
  if (!authRes.ok) throw new Error(`Colissimo auth error: ${authRes.status}`);
  const { token } = await authRes.json();

  const addr = order.shippingAddress || {};
  const body = {
    contractNumber: process.env.COLISSIMO_CONTRACT || login,
    password,
    outputFormat: { x: 0, y: 15, outputPrintingType: 'PDF_10x15_300dpi' },
    letter: {
      service: {
        productCode: type === 'retour' ? 'CORE' : 'DOS',
        depositDate: new Date().toISOString().slice(0, 10),
        orderNumber: order.orderNumber,
      },
      parcel: {
        weight: Math.max((poids || 500) / 1000, 0.01),
        insuranceValue: insurance ? (insuranceValue || 0) : 0,
      },
      sender: {
        senderParcelRef: order.orderNumber,
        address: {
          companyName: 'La marcOnnête',
          lastName: 'MARCONNETE',
          line2: process.env.SHOP_ADDRESS || '1 rue de la marcOnnête',
          city: process.env.SHOP_CITY || 'Paris',
          zipCode: process.env.SHOP_ZIP || '75001',
          countryCode: 'FR',
          email: 'contact@lamarconnete.fr',
          phoneNumber: process.env.SHOP_PHONE || '',
        },
      },
      addressee: {
        address: {
          lastName: addr.lastName || order.customerName,
          firstName: addr.firstName || '',
          line2: addr.address || '',
          city: addr.city || '',
          zipCode: addr.postalCode || '',
          countryCode: 'FR',
          email: order.customerEmail || '',
          phoneNumber: addr.phone || order.customerPhone || '',
        },
      },
    },
  };

  const labelRes = await fetch('https://ws.colissimo.fr/sls-ws/SlsServiceWSRest/2.0/generateLabel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });

  if (!labelRes.ok) {
    const errText = await labelRes.text();
    throw new Error(`Colissimo generateLabel error: ${errText}`);
  }

  const buf = await labelRes.arrayBuffer();
  const base64 = Buffer.from(buf).toString('base64');
  const trackingNumber = labelRes.headers.get('X-Colissimo-Tracking-Number') || `COL-${Date.now()}`;
  return { base64, trackingNumber };
};

// ── Routes ──────────────────────────────────────────────────────────────────

// GET /api/orders
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      const q = new RegExp(search, 'i');
      query.$or = [{ orderNumber: q }, { customerName: q }, { customerEmail: q }];
    }
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ date: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.json({ orders, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/customer/:customerId
router.get('/customer/:customerId', requireAuth, async (req, res) => {
  try {
    if (req.user.customerId !== req.params.customerId && req.user.role !== 'admin' && req.user.role !== 'superadmin')
      return res.status(403).json({ error: 'Accès refusé' });
    const orders = await Order.find({ customerId: req.params.customerId }).sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });

    const stripe = getStripe();
    let stripeDetails = null;
    if (stripe && order.paymentIntentId && order.paymentIntentId.startsWith('pi_')) {
      try {
        const pi = await stripe.paymentIntents.retrieve(order.paymentIntentId, {
          expand: ['latest_charge.payment_method_details'],
        });
        const charge = pi.latest_charge;
        if (charge?.payment_method_details?.card) {
          const card = charge.payment_method_details.card;
          stripeDetails = {
            chargeId: charge.id,
            cardBrand: card.brand,
            cardLast4: card.last4,
            cardFunding: card.funding,
            amountCaptured: charge.amount_captured / 100,
            receiptUrl: charge.receipt_url,
          };
          await Order.findOneAndUpdate({ id: order.id }, {
            stripeChargeId: charge.id, cardLast4: card.last4,
            cardBrand: card.brand, cardFunding: card.funding,
          });
        }
      } catch (e) {
        console.log('[Stripe] Could not fetch charge:', e.message);
      }
    }

    const orderObj = order.toJSON();
    if (stripeDetails) orderObj.stripeDetails = stripeDetails;
    res.json(orderObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const count = await Order.countDocuments();
    const orderNumber = `MRC-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    const newOrder = await Order.create({
      id: generateId('order'),
      orderNumber,
      ...req.body,
      date: new Date(),
      status: 'pending',
      paymentStatus: 'pending',
      trackingNumber: null,
      colissimoLabels: [],
      invoiceId: null,
      notes: '',
    });
    if (newOrder.customerId) {
      await Customer.findByIdAndUpdate(newOrder.customerId, { $push: { orders: newOrder.id } }).catch(() => {});
    }
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id/status
router.put('/:id/status', requireAdmin, async (req, res) => {
  try {
    const update = { status: req.body.status };
    if (req.body.notes !== undefined) update.notes = req.body.notes;
    const order = await Order.findOneAndUpdate({ id: req.params.id }, update, { new: true });
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id/tracking
router.put('/:id/tracking', requireAdmin, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { id: req.params.id }, { trackingNumber: req.body.trackingNumber }, { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id/address
router.put('/:id/address', requireAdmin, async (req, res) => {
  try {
    const { type, address } = req.body;
    const field = type === 'billing' ? 'billingAddress' : 'shippingAddress';
    const order = await Order.findOneAndUpdate({ id: req.params.id }, { [field]: address }, { new: true });
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id/shipping-cost
router.put('/:id/shipping-cost', requireAdmin, async (req, res) => {
  try {
    const { shipping } = req.body;
    const order = await Order.findOne({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });
    const newShipping = parseFloat(shipping) || 0;
    const newTotal = (order.subtotal || 0) + newShipping - (order.discount || 0);
    const updated = await Order.findOneAndUpdate(
      { id: req.params.id }, { shipping: newShipping, total: newTotal }, { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders/:id/refund
router.post('/:id/refund', requireAdmin, async (req, res) => {
  try {
    const { amount, reason = 'requested_by_customer' } = req.body;
    const order = await Order.findOne({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });
    const stripe = getStripe();
    if (!stripe) return res.status(400).json({ error: 'Stripe non configuré' });

    const refundParams = { reason };
    if (order.stripeChargeId) refundParams.charge = order.stripeChargeId;
    else if (order.paymentIntentId) refundParams.payment_intent = order.paymentIntentId;
    else return res.status(400).json({ error: 'Aucun paiement Stripe associé à cette commande' });
    if (amount) refundParams.amount = Math.round(parseFloat(amount) * 100);

    const refund = await stripe.refunds.create(refundParams);
    const isFullRefund = !amount || parseFloat(amount) >= order.total;

    const updated = await Order.findOneAndUpdate({ id: req.params.id }, {
      refundId: refund.id,
      refundAmount: refund.amount / 100,
      refundStatus: isFullRefund ? 'full' : 'partial',
      status: isFullRefund ? 'cancelled' : order.status,
      paymentStatus: isFullRefund ? 'refunded' : 'partial_refund',
    }, { new: true });

    res.json({ success: true, refundId: refund.id, amount: refund.amount / 100, status: refund.status, order: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders/:id/label
router.post('/:id/label', requireAdmin, async (req, res) => {
  try {
    const { type = 'aller', poids = 500, insurance = false, insuranceValue = 0 } = req.body;
    const order = await Order.findOne({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });

    let labelData;
    try {
      labelData = await generateColissimoLabel({ order, type, poids, insurance, insuranceValue });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    fs.mkdirSync(LABELS_DIR, { recursive: true });
    const filename = `${order.orderNumber}-${type}-${Date.now()}.pdf`;
    fs.writeFileSync(path.join(LABELS_DIR, filename), Buffer.from(labelData.base64, 'base64'));

    const newLabel = {
      type, trackingNumber: labelData.trackingNumber,
      labelUrl: `/labels/${filename}`, labelBase64: labelData.base64,
      insurance, insuranceValue, poids, createdAt: new Date(),
    };

    const updated = await Order.findOneAndUpdate(
      { id: req.params.id },
      {
        $push: { colissimoLabels: newLabel },
        ...(type !== 'retour' ? { trackingNumber: labelData.trackingNumber } : {}),
        ...(type !== 'retour' ? { status: 'shipped' } : {}),
      },
      { new: true }
    );
    res.json({ label: newLabel, order: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/orders/:id/label/:idx
router.delete('/:id/label/:idx', requireAdmin, async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });
    const idx = parseInt(req.params.idx, 10);
    const label = order.colissimoLabels?.[idx];
    if (label?.labelUrl) {
      const absPath = path.join(__dirname, '..', '..', 'public', label.labelUrl);
      if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
    }
    order.colissimoLabels.splice(idx, 1);
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders/:id/invoice
router.post('/:id/invoice', requireAdmin, async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });
    const count = await Invoice.countDocuments();
    const invoiceNumber = `FACT-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    const newInvoice = await Invoice.create({
      id: generateId('inv'),
      invoiceNumber, orderId: order.id, customerId: order.customerId,
      customerName: order.customerName, date: new Date(),
      items: order.items.map(item => ({ ...item.toObject ? item.toObject() : item, total: item.qty * item.price })),
      subtotal: order.subtotal, taxRate: 20,
      taxAmount: parseFloat((order.subtotal * 0.2).toFixed(2)),
      total: order.total, status: 'draft', pdfPath: null,
    });
    await Order.findOneAndUpdate({ id: req.params.id }, { invoiceId: newInvoice.id });
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
