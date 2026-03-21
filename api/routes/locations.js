const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const { requireAdmin } = require('../middleware/auth');

// GET /api/locations (public, active only)
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find({ active: true }).sort({ département: 1, city: 1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/locations/all (admin)
router.get('/all', requireAdmin, async (req, res) => {
  try {
    const locations = await Location.find().sort({ département: 1, city: 1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/locations
router.post('/', requireAdmin, async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/locations/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!location) return res.status(404).json({ error: 'Point de vente introuvable' });
    res.json(location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/locations/:id (deactivate)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!location) return res.status(404).json({ error: 'Point de vente introuvable' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
