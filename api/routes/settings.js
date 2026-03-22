const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');

function maskKey(val) {
  if (!val) return null;
  if (val.length <= 8) return '***';
  return val.slice(0, 10) + '...' + val.slice(-4);
}

function isSet(val) {
  return !!val && !val.startsWith('changer') && !val.includes('...');
}

// GET /api/settings/env — état des variables d'environnement
router.get('/env', requireAdmin, (req, res) => {
  const vars = {
    // MongoDB
    MONGODB_URI: {
      set: isSet(process.env.MONGODB_URI),
      preview: process.env.MONGODB_URI ? maskKey(process.env.MONGODB_URI) : null,
    },
    // JWT
    JWT_SECRET: {
      set: isSet(process.env.JWT_SECRET),
      preview: null, // never expose
    },
    // Stripe live
    STRIPE_PUBLIC_KEY: {
      set: isSet(process.env.STRIPE_PUBLIC_KEY),
      preview: process.env.STRIPE_PUBLIC_KEY ? maskKey(process.env.STRIPE_PUBLIC_KEY) : null,
    },
    STRIPE_SECRET_KEY: {
      set: isSet(process.env.STRIPE_SECRET_KEY),
      preview: null,
    },
    STRIPE_WEBHOOK_SECRET: {
      set: isSet(process.env.STRIPE_WEBHOOK_SECRET),
      preview: null,
    },
    STRIPE_TEST_WEBHOOK_SECRET: {
      set: isSet(process.env.STRIPE_TEST_WEBHOOK_SECRET),
      preview: null,
    },
    // Stripe test
    STRIPE_TEST_PUBLIC_KEY: {
      set: isSet(process.env.STRIPE_TEST_PUBLIC_KEY),
      preview: process.env.STRIPE_TEST_PUBLIC_KEY ? maskKey(process.env.STRIPE_TEST_PUBLIC_KEY) : null,
    },
    STRIPE_TEST_SECRET_KEY: {
      set: isSet(process.env.STRIPE_TEST_SECRET_KEY),
      preview: null,
    },
    // EmailJS
    EMAILJS_SERVICE_ID: {
      set: isSet(process.env.EMAILJS_SERVICE_ID),
      preview: process.env.EMAILJS_SERVICE_ID || null,
    },
    EMAILJS_TEMPLATE_ID: {
      set: isSet(process.env.EMAILJS_TEMPLATE_ID),
      preview: process.env.EMAILJS_TEMPLATE_ID || null,
    },
    EMAILJS_PUBLIC_KEY: {
      set: isSet(process.env.EMAILJS_PUBLIC_KEY),
      preview: null,
    },
    // Colissimo
    COLISSIMO_API_KEY: {
      set: isSet(process.env.COLISSIMO_API_KEY),
      preview: null,
    },
    COLISSIMO_ACCOUNT_NUMBER: {
      set: isSet(process.env.COLISSIMO_ACCOUNT_NUMBER),
      preview: process.env.COLISSIMO_ACCOUNT_NUMBER || null,
    },
    // Admin
    ADMIN_EMAIL: {
      set: isSet(process.env.ADMIN_EMAIL),
      preview: process.env.ADMIN_EMAIL || null,
    },
    // Domaines
    SITE_DOMAIN: {
      set: isSet(process.env.SITE_DOMAIN),
      preview: process.env.SITE_DOMAIN || null,
    },
    ADMIN_DOMAIN: {
      set: isSet(process.env.ADMIN_DOMAIN),
      preview: process.env.ADMIN_DOMAIN || null,
    },
  };

  res.json(vars);
});

// POST /api/settings/stripe/test — teste la connexion Stripe (mode test ou live)
router.post('/stripe/test', requireAdmin, async (req, res) => {
  const { mode } = req.body; // 'test' | 'live'

  const secretKey = mode === 'test'
    ? process.env.STRIPE_TEST_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY;

  if (!secretKey || secretKey.includes('...')) {
    return res.status(400).json({ ok: false, error: `Clé STRIPE_${mode === 'test' ? 'TEST_' : ''}SECRET_KEY non configurée dans .env` });
  }

  try {
    const stripe = require('stripe')(secretKey);
    const balance = await stripe.balance.retrieve();
    res.json({
      ok: true,
      mode: balance.livemode ? 'live' : 'test',
      available: balance.available.map(b => `${(b.amount / 100).toFixed(2)} ${b.currency.toUpperCase()}`),
    });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

module.exports = router;
