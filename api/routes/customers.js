const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');
const { requireAdmin } = require('../middleware/auth');

// GET /api/customers
router.get('/', requireAdmin, (req, res) => {
  try {
    const customers = readDB('customers.json');
    const { search, active, page = 1, limit = 20 } = req.query;
    let filtered = customers;
    if (active !== undefined) {
      const isActive = active === 'true';
      filtered = filtered.filter(c => c.active === isActive);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.email.toLowerCase().includes(q) ||
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q)
      );
    }
    const total = filtered.length;
    const start = (parseInt(page) - 1) * parseInt(limit);
    const paginated = filtered.slice(start, start + parseInt(limit));
    const safe = paginated.map(({ passwordHash, ...c }) => c);
    res.json({ customers: safe, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/customers/:id
router.get('/:id', requireAdmin, (req, res) => {
  try {
    const customers = readDB('customers.json');
    const customer = customers.find(c => c.id === req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Client introuvable' });
    }
    const { passwordHash, ...safeCustomer } = customer;
    res.json(safeCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/customers/:id
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const customers = readDB('customers.json');
    const idx = customers.findIndex(c => c.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Client introuvable' });
    }
    const { passwordHash, id, createdAt, ...updateFields } = req.body;
    customers[idx] = { ...customers[idx], ...updateFields };
    writeDB('customers.json', customers);
    const { passwordHash: _, ...safeCustomer } = customers[idx];
    res.json(safeCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/customers/:id (deactivate)
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const customers = readDB('customers.json');
    const idx = customers.findIndex(c => c.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Client introuvable' });
    }
    customers[idx].active = false;
    writeDB('customers.json', customers);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/customers/:id/orders
router.get('/:id/orders', requireAdmin, (req, res) => {
  try {
    const orders = readDB('orders.json');
    const customerOrders = orders.filter(o => o.customerId === req.params.id);
    customerOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(customerOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
