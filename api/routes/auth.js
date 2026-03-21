const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDB, writeDB, generateId } = require('../db');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/admin/login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    const users = readDB('users.json');
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/customer/login
router.post('/customer/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    const customers = readDB('customers.json');
    const customer = customers.find(c => c.email === email && c.active);
    if (!customer) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const valid = await bcrypt.compare(password, customer.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const token = jwt.sign(
      { id: customer.id, email: customer.email, customerId: customer.id, firstName: customer.firstName, lastName: customer.lastName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    const { passwordHash, ...safeCustomer } = customer;
    res.json({ token, customer: safeCustomer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/customer/register
router.post('/customer/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
    }
    const customers = readDB('customers.json');
    if (customers.find(c => c.email === email)) {
      return res.status(409).json({ error: 'Un compte existe déjà avec cet email' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newCustomer = {
      id: generateId('cust'),
      email,
      passwordHash,
      firstName,
      lastName,
      phone: phone || '',
      address: '',
      city: '',
      postalCode: '',
      country: 'France',
      createdAt: new Date().toISOString(),
      orders: [],
      newsletter: false,
      active: true
    };
    customers.push(newCustomer);
    writeDB('customers.json', customers);
    const token = jwt.sign(
      { id: newCustomer.id, email: newCustomer.email, customerId: newCustomer.id, firstName: newCustomer.firstName, lastName: newCustomer.lastName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    const { passwordHash: _, ...safeCustomer } = newCustomer;
    res.status(201).json({ token, customer: safeCustomer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/customer/me
router.get('/customer/me', requireAuth, (req, res) => {
  try {
    const customers = readDB('customers.json');
    const customer = customers.find(c => c.id === req.user.id);
    if (!customer) {
      return res.status(404).json({ error: 'Client introuvable' });
    }
    const { passwordHash, ...safeCustomer } = customer;
    res.json(safeCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/auth/customer/me
router.put('/customer/me', requireAuth, async (req, res) => {
  try {
    const customers = readDB('customers.json');
    const idx = customers.findIndex(c => c.id === req.user.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Client introuvable' });
    }
    const { passwordHash, id, email, createdAt, orders, ...updateFields } = req.body;
    customers[idx] = { ...customers[idx], ...updateFields };
    if (req.body.newPassword) {
      customers[idx].passwordHash = await bcrypt.hash(req.body.newPassword, 10);
    }
    writeDB('customers.json', customers);
    const { passwordHash: _, ...safeCustomer } = customers[idx];
    res.json(safeCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/customer/forgot-password
router.post('/customer/forgot-password', (req, res) => {
  const { email } = req.body;
  console.log(`[Auth] Forgot password requested for: ${email}`);
  // TODO: Integrate EmailJS or SMTP for actual email sending
  res.json({ success: true, message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' });
});

module.exports = router;
