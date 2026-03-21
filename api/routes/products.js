const express = require('express');
const router = express.Router();
const path = require('path');
const { readDB, writeDB, generateId } = require('../db');
const { requireAdmin } = require('../middleware/auth');

// GET /api/products
router.get('/', (req, res) => {
  try {
    const products = readDB('products.json');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  try {
    const products = readDB('products.json');
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products
router.post('/', requireAdmin, async (req, res) => {
  try {
    const products = readDB('products.json');
    const newProduct = {
      id: generateId('prod'),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Handle image upload
    if (req.files && req.files.image) {
      const image = req.files.image;
      const filename = `${newProduct.id}_${Date.now()}${path.extname(image.name)}`;
      const uploadPath = path.join(__dirname, '../../public/images', filename);
      await image.mv(uploadPath);
      newProduct.ImageProduit = `/images/${filename}`;
    }

    products.push(newProduct);
    writeDB('products.json', products);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const products = readDB('products.json');
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }

    // Handle image upload
    if (req.files && req.files.image) {
      const image = req.files.image;
      const filename = `${req.params.id}_${Date.now()}${path.extname(image.name)}`;
      const uploadPath = path.join(__dirname, '../../public/images', filename);
      await image.mv(uploadPath);
      req.body.ImageProduit = `/images/${filename}`;
    }

    products[idx] = { ...products[idx], ...req.body, updatedAt: new Date().toISOString() };
    writeDB('products.json', products);
    res.json(products[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const products = readDB('products.json');
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }
    products.splice(idx, 1);
    writeDB('products.json', products);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id/stock
router.put('/:id/stock', requireAdmin, (req, res) => {
  try {
    const products = readDB('products.json');
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }
    products[idx].stock = parseInt(req.body.stock, 10);
    products[idx].updatedAt = new Date().toISOString();
    writeDB('products.json', products);
    res.json(products[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
