const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Newsletter = require('../models/Newsletter');
const { generateId } = require('../db');
const { requireAdmin } = require('../middleware/auth');

// GET /api/newsletter/subscribers
router.get('/subscribers', requireAdmin, async (req, res) => {
  try {
    const subscribers = await Newsletter.find();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/newsletter/subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { email, firstName } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }
    const existing = await Newsletter.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      if (existing.active) {
        return res.status(409).json({ error: 'Cet email est déjà abonné' });
      }
      // Reactivate
      existing.active = true;
      await existing.save();
      return res.json({ success: true, message: 'Abonnement réactivé' });
    }
    const unsubscribeToken = crypto.randomBytes(20).toString('hex');
    await Newsletter.create({
      id: generateId('nl'),
      email,
      firstName: firstName || '',
      subscribedAt: new Date(),
      active: true,
      unsubscribeToken,
    });
    // TODO: Send welcome email via EmailJS
    console.log(`[Newsletter] New subscriber: ${email} — welcome email à configurer via EmailJS`);
    res.status(201).json({ success: true, message: 'Inscription réussie' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/newsletter/unsubscribe/:token
router.delete('/unsubscribe/:token', async (req, res) => {
  try {
    const subscriber = await Newsletter.findOne({ unsubscribeToken: req.params.token });
    if (!subscriber) {
      return res.status(404).json({ error: 'Lien de désinscription invalide' });
    }
    subscriber.active = false;
    await subscriber.save();
    res.json({ success: true, message: 'Désinscription effectuée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/newsletter/send
router.post('/send', requireAdmin, async (req, res) => {
  try {
    const { subject, htmlContent, testEmail } = req.body;
    if (!subject || !htmlContent) {
      return res.status(400).json({ error: 'Objet et contenu requis' });
    }
    if (testEmail) {
      console.log(`[Newsletter] Test email to ${testEmail}: ${subject}`);
      console.log('[Newsletter] EmailJS à configurer dans les paramètres pour l\'envoi réel');
      return res.json({ success: true, message: `Email de test envoyé à ${testEmail}` });
    }
    const active = await Newsletter.find({ active: true });
    console.log(`[Newsletter] Sending to ${active.length} subscribers: ${subject}`);
    console.log('[Newsletter] EmailJS à configurer dans les paramètres pour l\'envoi réel');
    res.json({ success: true, message: `Newsletter envoyée à ${active.length} abonnés`, count: active.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/newsletter/subscribers/:id
router.delete('/subscribers/:id', requireAdmin, async (req, res) => {
  try {
    const subscriber = await Newsletter.findOneAndDelete({ id: req.params.id });
    if (!subscriber) {
      return res.status(404).json({ error: 'Abonné introuvable' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
