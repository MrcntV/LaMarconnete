const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');
const { requireAdmin } = require('../middleware/auth');

// GET /api/stock
router.get('/', requireAdmin, (req, res) => {
  try {
    const products = readDB('products.json');
    const stockItems = products.map(p => ({
      id: p.id,
      Titre: p.Titre,
      reference: p.reference,
      ImageProduit: p.ImageProduit,
      stock: p.stock || 0,
      stockAlert: p.stockAlert || 5,
      active: p.active
    }));
    res.json(stockItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/stock/:productId
router.put('/:productId', requireAdmin, (req, res) => {
  try {
    const products = readDB('products.json');
    const idx = products.findIndex(p => p.id === req.params.productId);
    if (idx === -1) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }
    if (req.body.stock !== undefined) {
      products[idx].stock = parseInt(req.body.stock, 10);
    }
    if (req.body.stockAlert !== undefined) {
      products[idx].stockAlert = parseInt(req.body.stockAlert, 10);
    }
    products[idx].updatedAt = new Date().toISOString();
    writeDB('products.json', products);
    res.json({ id: products[idx].id, stock: products[idx].stock, stockAlert: products[idx].stockAlert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stock/alerts
router.get('/alerts', requireAdmin, (req, res) => {
  try {
    const products = readDB('products.json');
    const alerts = products.filter(p => {
      const threshold = p.stockAlert || 5;
      return (p.stock || 0) < threshold;
    }).map(p => ({
      id: p.id,
      Titre: p.Titre,
      reference: p.reference,
      stock: p.stock || 0,
      stockAlert: p.stockAlert || 5,
      status: (p.stock || 0) === 0 ? 'out' : 'low'
    }));
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
