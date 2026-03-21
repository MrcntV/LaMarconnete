const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { readDB } = require('../db');
const { requireAdmin } = require('../middleware/auth');

// Mappe _id → id pour compatibilité frontend
const toClient = (c) => {
  if (!c) return c;
  const { _id, __v, passwordHash, ...rest } = c;
  return { id: _id.toString(), ...rest };
};

// GET /api/customers
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { search, active, page = 1, limit = 20 } = req.query;
    const query = {};
    if (active !== undefined) query.active = active === 'true';
    if (search) {
      const q = new RegExp(search, 'i');
      query.$or = [{ email: q }, { firstName: q }, { lastName: q }];
    }
    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();
    res.json({ customers: customers.map(toClient), total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/customers/:id
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).lean();
    if (!customer) return res.status(404).json({ error: 'Client introuvable' });
    res.json(toClient(customer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/customers/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { passwordHash, _id, createdAt, ...updateFields } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).lean();
    if (!customer) return res.status(404).json({ error: 'Client introuvable' });
    res.json(toClient(customer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/customers/:id  — désactive le compte (soft delete)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!customer) return res.status(404).json({ error: 'Client introuvable' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/customers/:id/orders — orders are still in JSON for now
router.get('/:id/orders', requireAdmin, async (req, res) => {
  try {
    const orders = readDB('orders.json');
    const customerOrders = orders
      .filter(o => o.customerId === req.params.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(customerOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
