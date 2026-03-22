const express = require('express');
const router = express.Router();
const PromoCode = require('../models/PromoCode');
const { generateId } = require('../db');
const { requireAdmin } = require('../middleware/auth');

// GET /api/promo — admin list
router.get('/', requireAdmin, async (req, res) => {
  try {
    const codes = await PromoCode.find().sort({ createdAt: -1 });
    res.json(codes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/promo/:id — admin detail
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const code = await PromoCode.findOne({ id: req.params.id });
    if (!code) return res.status(404).json({ error: 'Code introuvable' });
    res.json(code);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/promo — create
router.post('/', requireAdmin, async (req, res) => {
  try {
    const existing = await PromoCode.findOne({ code: req.body.code?.toUpperCase() });
    if (existing) return res.status(400).json({ error: 'Ce code existe déjà' });

    const promo = await PromoCode.create({
      id: generateId('promo'),
      ...req.body,
      code: req.body.code?.toUpperCase(),
      usedCount: 0,
      usedByCustomers: [],
    });
    res.status(201).json(promo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/promo/:id — update
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const promo = await PromoCode.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, code: req.body.code?.toUpperCase() },
      { new: true }
    );
    if (!promo) return res.status(404).json({ error: 'Code introuvable' });
    res.json(promo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/promo/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await PromoCode.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/promo/validate — validate code (public, called at checkout)
router.post('/validate', async (req, res) => {
  try {
    const { code, cartTotal = 0, cartItems = [], customerId = '' } = req.body;
    if (!code) return res.status(400).json({ error: 'Code requis' });

    const promo = await PromoCode.findOne({ code: code.toUpperCase(), active: true });
    if (!promo) return res.status(404).json({ valid: false, error: 'Code invalide ou inactif' });

    const now = new Date();
    if (promo.startDate && new Date(promo.startDate) > now)
      return res.status(400).json({ valid: false, error: 'Code pas encore actif' });
    if (promo.endDate && new Date(promo.endDate) < now)
      return res.status(400).json({ valid: false, error: 'Code expiré' });

    if (promo.maxUses > 0 && promo.usedCount >= promo.maxUses)
      return res.status(400).json({ valid: false, error: 'Code épuisé' });

    if (promo.maxUsesPerCustomer > 0 && customerId) {
      const usedByThisCustomer = promo.usedByCustomers.filter(id => id === customerId).length;
      if (usedByThisCustomer >= promo.maxUsesPerCustomer)
        return res.status(400).json({ valid: false, error: 'Code déjà utilisé (limite atteinte)' });
    }

    if (promo.minAmount > 0 && cartTotal < promo.minAmount)
      return res.status(400).json({ valid: false, error: `Montant minimum requis : ${promo.minAmount.toFixed(2)} €` });

    if (promo.minQuantity > 0) {
      const totalQty = cartItems.reduce((s, i) => s + (i.quantite || i.qty || 0), 0);
      if (totalQty < promo.minQuantity)
        return res.status(400).json({ valid: false, error: `Quantité minimum requise : ${promo.minQuantity} articles` });
    }

    // Calculate discount
    let discount = 0;
    let freeShipping = false;
    let freeItems = [];

    if (promo.type === 'percentage') {
      discount = parseFloat((cartTotal * promo.value / 100).toFixed(2));
    } else if (promo.type === 'fixed') {
      discount = Math.min(promo.value, cartTotal);
    } else if (promo.type === 'free_shipping') {
      freeShipping = true;
    } else if (promo.type === 'buy_x_get_y') {
      // count how many free items apply
      const totalQty = cartItems.reduce((s, i) => s + (i.quantite || i.qty || 0), 0);
      const sets = Math.floor(totalQty / promo.buyQuantity);
      const freeQty = sets * promo.getQuantity;
      freeItems = [{ qty: freeQty, productId: promo.getProductId || 'same' }];
    }

    res.json({
      valid: true,
      promo: {
        id: promo.id,
        code: promo.code,
        type: promo.type,
        value: promo.value,
        description: promo.description,
      },
      discount,
      freeShipping,
      freeItems,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/promo/use — mark code as used (called after successful order)
router.post('/use', async (req, res) => {
  try {
    const { code, customerId } = req.body;
    await PromoCode.findOneAndUpdate(
      { code: code?.toUpperCase() },
      { $inc: { usedCount: 1 }, ...(customerId ? { $push: { usedByCustomers: customerId } } : {}) }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
