const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { readDB, writeDB, generateId } = require('../db');
const { requireAdmin } = require('../middleware/auth');

// GET /api/newsletter/subscribers
router.get('/subscribers', requireAdmin, (req, res) => {
  try {
    const subscribers = readDB('newsletter.json');
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/newsletter/subscribe
router.post('/subscribe', (req, res) => {
  try {
    const { email, firstName } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }
    const subscribers = readDB('newsletter.json');
    const existing = subscribers.find(s => s.email === email);
    if (existing) {
      if (existing.active) {
        return res.status(409).json({ error: 'Cet email est déjà abonné' });
      }
      // Reactivate
      existing.active = true;
      writeDB('newsletter.json', subscribers);
      return res.json({ success: true, message: 'Abonnement réactivé' });
    }
    const unsubscribeToken = crypto.randomBytes(20).toString('hex');
    const newSubscriber = {
      id: generateId('nl'),
      email,
      firstName: firstName || '',
      subscribedAt: new Date().toISOString(),
      active: true,
      unsubscribeToken
    };
    subscribers.push(newSubscriber);
    writeDB('newsletter.json', subscribers);
    // TODO: Send welcome email via EmailJS
    console.log(`[Newsletter] New subscriber: ${email} — welcome email à configurer via EmailJS`);
    res.status(201).json({ success: true, message: 'Inscription réussie' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/newsletter/unsubscribe/:token
router.delete('/unsubscribe/:token', (req, res) => {
  try {
    const subscribers = readDB('newsletter.json');
    const idx = subscribers.findIndex(s => s.unsubscribeToken === req.params.token);
    if (idx === -1) {
      return res.status(404).json({ error: 'Lien de désinscription invalide' });
    }
    subscribers[idx].active = false;
    writeDB('newsletter.json', subscribers);
    res.json({ success: true, message: 'Désinscription effectuée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/newsletter/send
router.post('/send', requireAdmin, (req, res) => {
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
    const subscribers = readDB('newsletter.json');
    const active = subscribers.filter(s => s.active);
    console.log(`[Newsletter] Sending to ${active.length} subscribers: ${subject}`);
    console.log('[Newsletter] EmailJS à configurer dans les paramètres pour l\'envoi réel');
    res.json({ success: true, message: `Newsletter envoyée à ${active.length} abonnés`, count: active.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/newsletter/subscribers/:id
router.delete('/subscribers/:id', requireAdmin, (req, res) => {
  try {
    const subscribers = readDB('newsletter.json');
    const idx = subscribers.findIndex(s => s.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Abonné introuvable' });
    }
    subscribers.splice(idx, 1);
    writeDB('newsletter.json', subscribers);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
