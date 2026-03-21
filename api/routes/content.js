const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const { requireAdmin } = require('../middleware/auth');

// GET /api/content
router.get('/', async (req, res) => {
  try {
    const doc = await Content.findOne({ key: 'main' });
    if (!doc) {
      return res.json({});
    }
    res.json(doc.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/content
router.put('/', requireAdmin, async (req, res) => {
  try {
    const doc = await Content.findOneAndUpdate(
      { key: 'main' },
      { key: 'main', ...req.body },
      { upsert: true, new: true }
    );
    res.json(doc.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/content/:section
router.put('/:section', requireAdmin, async (req, res) => {
  try {
    const doc = await Content.findOneAndUpdate(
      { key: 'main' },
      { $set: { [req.params.section]: req.body } },
      { upsert: true, new: true }
    );
    res.json(doc.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
