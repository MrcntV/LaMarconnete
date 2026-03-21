const express = require('express');
const router = express.Router();
const { readDB, writeDB, generateId } = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// POST /api/orders/stripe-webhook (must be before /:id routes)
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), (req, res) => {
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
      const orders = readDB('orders.json');
      const idx = orders.findIndex(o => o.paymentIntentId === paymentIntent.id);
      if (idx !== -1) {
        orders[idx].paymentStatus = 'paid';
        orders[idx].status = 'confirmed';
        writeDB('orders.json', orders);
      }
    }
    res.json({ received: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/customer/:customerId
router.get('/customer/:customerId', requireAuth, (req, res) => {
  try {
    if (req.user.customerId !== req.params.customerId && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    const orders = readDB('orders.json');
    const customerOrders = orders.filter(o => o.customerId === req.params.customerId);
    res.json(customerOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders
router.get('/', requireAdmin, (req, res) => {
  try {
    const orders = readDB('orders.json');
    const { status, page = 1, limit = 20, search } = req.query;
    let filtered = orders;
    if (status && status !== 'all') {
      filtered = filtered.filter(o => o.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
      );
    }
    // Sort by date desc
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    const total = filtered.length;
    const start = (parseInt(page) - 1) * parseInt(limit);
    const paginated = filtered.slice(start, start + parseInt(limit));
    res.json({ orders: paginated, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', requireAdmin, (req, res) => {
  try {
    const orders = readDB('orders.json');
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders
router.post('/', (req, res) => {
  try {
    const orders = readDB('orders.json');
    const orderNumber = `MRC-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`;
    const newOrder = {
      id: generateId('order'),
      orderNumber,
      ...req.body,
      date: new Date().toISOString(),
      status: 'pending',
      paymentStatus: 'pending',
      trackingNumber: null,
      colissimoLabel: null,
      invoiceId: null,
      notes: ''
    };
    orders.push(newOrder);
    writeDB('orders.json', orders);

    // Update customer orders array if customerId provided
    if (newOrder.customerId) {
      const customers = readDB('customers.json');
      const cIdx = customers.findIndex(c => c.id === newOrder.customerId);
      if (cIdx !== -1) {
        customers[cIdx].orders = customers[cIdx].orders || [];
        customers[cIdx].orders.push(newOrder.id);
        writeDB('customers.json', customers);
      }
    }

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id/status
router.put('/:id/status', requireAdmin, (req, res) => {
  try {
    const orders = readDB('orders.json');
    const idx = orders.findIndex(o => o.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    orders[idx].status = req.body.status;
    if (req.body.status === 'shipped') {
      // Placeholder for Colissimo webhook
      console.log(`[Colissimo] Commande ${orders[idx].orderNumber} expédiée — webhook Colissimo à configurer`);
    }
    writeDB('orders.json', orders);
    res.json(orders[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id/tracking
router.put('/:id/tracking', requireAdmin, (req, res) => {
  try {
    const orders = readDB('orders.json');
    const idx = orders.findIndex(o => o.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    orders[idx].trackingNumber = req.body.trackingNumber;
    writeDB('orders.json', orders);
    res.json(orders[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders/:id/invoice
router.post('/:id/invoice', requireAdmin, (req, res) => {
  try {
    const orders = readDB('orders.json');
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    const invoices = readDB('invoices.json');
    const invoiceNumber = `FACT-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
    const newInvoice = {
      id: generateId('inv'),
      invoiceNumber,
      orderId: order.id,
      customerId: order.customerId,
      customerName: order.customerName,
      date: new Date().toISOString(),
      items: order.items.map(item => ({ ...item, total: item.qty * item.price })),
      subtotal: order.subtotal,
      taxRate: 20,
      taxAmount: parseFloat((order.subtotal * 0.2).toFixed(2)),
      total: order.total,
      status: 'draft',
      pdfPath: null
    };
    invoices.push(newInvoice);
    writeDB('invoices.json', invoices);

    const oIdx = orders.findIndex(o => o.id === req.params.id);
    orders[oIdx].invoiceId = newInvoice.id;
    writeDB('orders.json', orders);

    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
