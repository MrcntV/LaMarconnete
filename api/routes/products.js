const express = require('express');
const router = express.Router();
const path = require('path');
const Product = require('../models/Product');
const { generateId } = require('../db');
const { requireAdmin } = require('../middleware/auth');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
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
    const newProduct = {
      id: generateId('prod'),
      ...req.body,
    };

    // Handle image upload
    if (req.files && req.files.image) {
      const image = req.files.image;
      const filename = `${newProduct.id}_${Date.now()}${path.extname(image.name)}`;
      const uploadPath = path.join(__dirname, '../../public/images', filename);
      await image.mv(uploadPath);
      newProduct.ImageProduit = `/images/${filename}`;
    }

    const product = await Product.create(newProduct);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    // Handle image upload
    if (req.files && req.files.image) {
      const image = req.files.image;
      const filename = `${req.params.id}_${Date.now()}${path.extname(image.name)}`;
      const uploadPath = path.join(__dirname, '../../public/images', filename);
      await image.mv(uploadPath);
      req.body.ImageProduit = `/images/${filename}`;
    }

    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id/stock
router.put('/:id/stock', requireAdmin, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      { stock: parseInt(req.body.stock, 10) },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
