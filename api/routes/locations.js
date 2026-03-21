const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Location = require('../models/Location');
const { requireAdmin } = require('../middleware/auth');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'public', 'images', 'PointsDeVentes');

// POST /api/locations/upload-image
router.post('/upload-image', requireAdmin, (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({ error: 'Aucun fichier reçu' });
  }
  const file = req.files.image;
  const ext = path.extname(file.name).toLowerCase();
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  if (!allowed.includes(ext)) {
    return res.status(400).json({ error: 'Format non supporté (jpg, png, webp)' });
  }
  const filename = `loc_${Date.now()}${ext}`;
  const dest = path.join(UPLOAD_DIR, filename);
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  file.mv(dest, err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ path: `/images/PointsDeVentes/${filename}` });
  });
});

// GET /api/locations (public, active only)
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find({ active: { $ne: false } });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/locations/all (admin)
router.get('/all', requireAdmin, async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/locations
router.post('/', requireAdmin, async (req, res) => {
  try {
    const newLoc = new Location({ active: true, ...req.body });
    await newLoc.save();
    res.status(201).json(newLoc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/locations/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const loc = await Location.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!loc) return res.status(404).json({ error: 'Point de vente introuvable' });
    res.json(loc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/locations/:id (deactivate)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const loc = await Location.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!loc) return res.status(404).json({ error: 'Point de vente introuvable' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
