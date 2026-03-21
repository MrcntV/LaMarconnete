const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const { generateId } = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// POST /api/orders/stripe-webhook (must be before /:id routes)
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const payload = req.body;
    let event;
    try {
      event = JSON.parse(payload.toString());
    } catch (e) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    console.log('[Stripe Webhook] Event:', event.type);
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      await Order.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { paymentStatus: 'paid', status: 'confirmed' }
      );
    }
    res.json({ received: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/customer/:customerId
router.get('/customer/:customerId', requireAuth, async (req, res) => {
  try {
    if (req.user.customerId !== req.params.customerId && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    const customerOrders = await Order.find({ customerId: req.params.customerId }).sort({ date: -1 });
    res.json(customerOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      const q = new RegExp(search, 'i');
      query.$or = [
        { orderNumber: q },
        { customerName: q },
        { customerEmail: q },
      ];
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

// GET /api/orders/:id
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.id });
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    res.json(order);
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
      colissimoLabel: null,
      invoiceId: null,
      notes: '',
    });

    // Update customer orders array if customerId provided
    if (newOrder.customerId) {
      await Customer.findByIdAndUpdate(
        newOrder.customerId,
        { $push: { orders: newOrder.id } }
      ).catch(() => {}); // silently ignore if customer not found by _id
    }

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id/status
router.put('/:id/status', requireAdmin, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { id: req.params.id },
      { status: req.body.status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    if (req.body.status === 'shipped') {
      console.log(`[Colissimo] Commande ${order.orderNumber} expédiée — webhook Colissimo à configurer`);
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id/tracking
router.put('/:id/tracking', requireAdmin, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { id: req.params.id },
      { trackingNumber: req.body.trackingNumber },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders/:id/invoice
router.post('/:id/invoice', requireAdmin, async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.id });
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    const count = await Invoice.countDocuments();
    const invoiceNumber = `FACT-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    const newInvoice = await Invoice.create({
      id: generateId('inv'),
      invoiceNumber,
      orderId: order.id,
      customerId: order.customerId,
      customerName: order.customerName,
      date: new Date(),
      items: order.items.map(item => ({ ...item.toObject ? item.toObject() : item, total: item.qty * item.price })),
      subtotal: order.subtotal,
      taxRate: 20,
      taxAmount: parseFloat((order.subtotal * 0.2).toFixed(2)),
      total: order.total,
      status: 'draft',
      pdfPath: null,
    });

    await Order.findOneAndUpdate({ id: req.params.id }, { invoiceId: newInvoice.id });

    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
