const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const AdminUser = require('../models/AdminUser');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

// ─── Admin ────────────────────────────────────────────────────────────────────

// POST /api/auth/admin/login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    const user = await AdminUser.findOne({ email, active: true }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Customer ─────────────────────────────────────────────────────────────────

// POST /api/auth/customer/login
router.post('/customer/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    const customer = await Customer.findOne({ email, active: true }).select('+passwordHash');
    if (!customer) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const valid = await customer.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const token = jwt.sign(
      { id: customer._id, email: customer.email, customerId: customer._id, firstName: customer.firstName, lastName: customer.lastName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, customer: customer.toSafeObject() });
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
    if (password.length < 8) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères' });
    }
    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Un compte existe déjà avec cet email' });
    }
    // passwordHash will be hashed by the pre-save hook
    const customer = new Customer({
      email,
      passwordHash: password,
      firstName,
      lastName,
      phone: phone || '',
    });
    await customer.save();
    const token = jwt.sign(
      { id: customer._id, email: customer.email, customerId: customer._id, firstName: customer.firstName, lastName: customer.lastName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({ token, customer: customer.toSafeObject() });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Un compte existe déjà avec cet email' });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/customer/me
router.get('/customer/me', requireAuth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ error: 'Client introuvable' });
    }
    res.json(customer.toSafeObject());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/auth/customer/me
router.put('/customer/me', requireAuth, async (req, res) => {
  try {
    const { newPassword, passwordHash, _id, email, createdAt, ...updateFields } = req.body;
    const customer = await Customer.findById(req.user.id).select('+passwordHash');
    if (!customer) {
      return res.status(404).json({ error: 'Client introuvable' });
    }
    Object.assign(customer, updateFields);
    if (newPassword) {
      customer.passwordHash = newPassword; // will be re-hashed by pre-save
    }
    await customer.save();
    res.json(customer.toSafeObject());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/customer/forgot-password
router.post('/customer/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log(`[Auth] Forgot password for: ${email}`);
  // TODO: send reset email via EmailJS / SMTP
  res.json({ success: true, message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' });
});

module.exports = router;
