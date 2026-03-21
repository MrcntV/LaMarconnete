const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { requireAdmin } = require('../middleware/auth');

// GET /api/stock
router.get('/', requireAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    const stockItems = products.map(p => ({
      id: p.id,
      Titre: p.Titre,
      reference: p.reference,
      ImageProduit: p.ImageProduit,
      stock: p.stock || 0,
      stockAlert: p.stockAlert || 5,
      active: p.active,
    }));
    res.json(stockItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/stock/:productId
router.put('/:productId', requireAdmin, async (req, res) => {
  try {
    const update = {};
    if (req.body.stock !== undefined) {
      update.stock = parseInt(req.body.stock, 10);
    }
    if (req.body.stockAlert !== undefined) {
      update.stockAlert = parseInt(req.body.stockAlert, 10);
    }
    const product = await Product.findOneAndUpdate(
      { id: req.params.productId },
      update,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }
    res.json({ id: product.id, stock: product.stock, stockAlert: product.stockAlert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stock/alerts
router.get('/alerts', requireAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    const alerts = products
      .filter(p => {
        const threshold = p.stockAlert || 5;
        return (p.stock || 0) < threshold;
      })
      .map(p => ({
        id: p.id,
        Titre: p.Titre,
        reference: p.reference,
        stock: p.stock || 0,
        stockAlert: p.stockAlert || 5,
        status: (p.stock || 0) === 0 ? 'out' : 'low',
      }));
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
