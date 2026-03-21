const express = require('express');
const router = express.Router();
const { readDB, writeDB, generateId } = require('../db');
const { requireAdmin } = require('../middleware/auth');

// GET /api/locations (public, active only)
router.get('/', (req, res) => {
  try {
    const locations = readDB('locations.json');
    res.json(locations.filter(l => l.active));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/locations/all (admin, all)
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
    const newLocation = {
      id: generateId('loc'),
      ...req.body,
      active: req.body.active !== false
    };
    locations.push(newLocation);
    writeDB('locations.json', locations);
    res.status(201).json(newLocation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/locations/:id
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const locations = readDB('locations.json');
    const idx = locations.findIndex(l => l.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Point de vente introuvable' });
    }
    locations[idx] = { ...locations[idx], ...req.body };
    writeDB('locations.json', locations);
    res.json(locations[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/locations/:id (deactivate)
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const locations = readDB('locations.json');
    const idx = locations.findIndex(l => l.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Point de vente introuvable' });
    }
    locations[idx].active = false;
    writeDB('locations.json', locations);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
