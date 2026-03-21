const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');
const { requireAdmin } = require('../middleware/auth');

// GET /api/content
router.get('/', (req, res) => {
  try {
    const content = readDB('content.json');
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/content
router.put('/', requireAdmin, (req, res) => {
  try {
    writeDB('content.json', req.body);
    res.json(req.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/content/:section
router.put('/:section', requireAdmin, (req, res) => {
  try {
    const content = readDB('content.json');
    content[req.params.section] = req.body;
    writeDB('content.json', content);
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
