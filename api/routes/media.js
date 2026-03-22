const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { requireAdmin } = require('../middleware/auth');

const MEDIA_ROOT = path.join(__dirname, '..', '..', 'public', 'images', 'Produits');

// GET /api/media/product/:productId — liste les images d'un produit
router.get('/product/:productId', requireAdmin, (req, res) => {
  const dir = path.join(MEDIA_ROOT, req.params.productId);
  if (!fs.existsSync(dir)) return res.json([]);
  const files = fs.readdirSync(dir)
    .filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
    .map(f => `/images/Produits/${req.params.productId}/${f}`);
  res.json(files);
});

// POST /api/media/product/:productId/upload — upload une image dans le dossier du produit
router.post('/product/:productId/upload', requireAdmin, (req, res) => {
  if (!req.files || !req.files.image) return res.status(400).json({ error: 'Aucun fichier reçu' });
  const file = req.files.image;
  const ext = path.extname(file.name).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext))
    return res.status(400).json({ error: 'Format non supporté (jpg, png, webp, gif)' });

  const dir = path.join(MEDIA_ROOT, req.params.productId);
  fs.mkdirSync(dir, { recursive: true });

  const filename = `${Date.now()}${ext}`;
  const dest = path.join(dir, filename);
  file.mv(dest, err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ path: `/images/Produits/${req.params.productId}/${filename}` });
  });
});

// DELETE /api/media — supprime une image par chemin
router.delete('/', requireAdmin, (req, res) => {
  const { filePath } = req.body;
  if (!filePath || !filePath.startsWith('/images/Produits/'))
    return res.status(400).json({ error: 'Chemin non autorisé' });

  const abs = path.join(__dirname, '..', '..', 'public', filePath);
  if (!fs.existsSync(abs)) return res.status(404).json({ error: 'Fichier introuvable' });

  // Sécurité : vérifier que le chemin absolu est bien dans MEDIA_ROOT
  if (!abs.startsWith(MEDIA_ROOT)) return res.status(403).json({ error: 'Accès refusé' });

  fs.unlinkSync(abs);
  res.json({ success: true });
});

module.exports = router;
