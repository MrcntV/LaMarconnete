const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { readDB, writeDB, generateId } = require('../db');
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
router.get('/', (req, res) => {
  try {
    const locations = readDB('locations.json');
    res.json(locations.filter(l => l.active !== false));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/locations/all (admin)
router.get('/all', requireAdmin, (req, res) => {
  try {
    const locations = readDB('locations.json');
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/locations
router.post('/', requireAdmin, (req, res) => {
  try {
    const locations = readDB('locations.json');
    const newLoc = { id: generateId('loc'), active: true, ...req.body };
    locations.push(newLoc);
    writeDB('locations.json', locations);
    res.status(201).json(newLoc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/locations/:id
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const locations = readDB('locations.json');
    const idx = locations.findIndex(l => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Point de vente introuvable' });
    locations[idx] = { ...locations[idx], ...req.body, id: req.params.id };
    writeDB('locations.json', locations);
    res.json(locations[idx]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/locations/:id (deactivate)
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const locations = readDB('locations.json');
    const idx = locations.findIndex(l => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Point de vente introuvable' });
    locations[idx].active = false;
    writeDB('locations.json', locations);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
