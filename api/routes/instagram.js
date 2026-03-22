const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const mongoose = require('mongoose');

let InstagramCache;
try {
  InstagramCache = mongoose.model('InstagramCache');
} catch {
  const schema = new mongoose.Schema({
    key: { type: String, default: 'feed', unique: true },
    posts: [{ type: mongoose.Schema.Types.Mixed }],
    lastRefreshed: Date,
    tokenExpiresAt: Date,
  }, { strict: false });
  InstagramCache = mongoose.model('InstagramCache', schema);
}

const getToken = () => process.env.INSTAGRAM_ACCESS_TOKEN;
const getUserId = () => process.env.INSTAGRAM_USER_ID;
const isConfigured = () => {
  const t = getToken();
  const u = getUserId();
  return t && u && !t.includes('xxxxx') && !u.includes('xxxxx');
};

// Refresh long-lived token (valid 60 days, refresh when < 30 days left)
const refreshToken = async () => {
  const token = getToken();
  if (!token) throw new Error('INSTAGRAM_ACCESS_TOKEN non configuré');
  const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data; // { access_token, token_type, expires_in }
};

const fetchFromInstagram = async () => {
  const token = getToken();
  const userId = getUserId();
  if (!token || !userId) throw new Error('INSTAGRAM_ACCESS_TOKEN et INSTAGRAM_USER_ID non configurés');

  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=20&access_token=${token}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.error) throw new Error(`Instagram API: ${data.error.message} (code ${data.error.code})`);

  // Keep only images and videos (skip stories/carousels without media_url)
  const posts = (data.data || [])
    .filter(p => p.media_url || p.thumbnail_url)
    .map(p => ({
      id: p.id,
      caption: p.caption || '',
      mediaType: p.media_type,
      mediaUrl: p.media_url || p.thumbnail_url,
      permalink: p.permalink,
      timestamp: p.timestamp,
    }));

  return posts;
};

// GET /api/instagram/feed — public
router.get('/feed', async (req, res) => {
  try {
    const cache = await InstagramCache.findOne({ key: 'feed' });

    if (!isConfigured()) {
      return res.json({ posts: [], configured: false });
    }

    // Auto-refresh if older than 24h
    const stale = !cache?.lastRefreshed || (Date.now() - new Date(cache.lastRefreshed).getTime()) > 24 * 60 * 60 * 1000;
    if (stale) {
      try {
        const posts = await fetchFromInstagram();
        await InstagramCache.findOneAndUpdate(
          { key: 'feed' },
          { posts, lastRefreshed: new Date() },
          { upsert: true, new: true }
        );
        return res.json({ posts, lastRefreshed: new Date(), configured: true });
      } catch (e) {
        console.log('[Instagram] Auto-refresh failed:', e.message);
        // Fall through to return cached data
      }
    }

    if (!cache) return res.json({ posts: [], configured: true });
    res.json({ posts: cache.posts || [], lastRefreshed: cache.lastRefreshed, configured: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/instagram/refresh — admin force refresh
router.post('/refresh', requireAdmin, async (req, res) => {
  try {
    if (!isConfigured()) return res.status(400).json({ error: 'INSTAGRAM_ACCESS_TOKEN et INSTAGRAM_USER_ID non configurés dans .env' });
    const posts = await fetchFromInstagram();
    await InstagramCache.findOneAndUpdate(
      { key: 'feed' },
      { posts, lastRefreshed: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true, count: posts.length, lastRefreshed: new Date() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/instagram/refresh-token — admin refresh access token
router.post('/refresh-token', requireAdmin, async (req, res) => {
  try {
    const data = await refreshToken();
    // Note: the new token must be saved manually in .env (we can't write .env from code in production)
    res.json({
      success: true,
      newToken: data.access_token,
      expiresIn: data.expires_in,
      message: 'Nouveau token généré. Mettez à jour INSTAGRAM_ACCESS_TOKEN dans votre .env et redémarrez le serveur.',
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/instagram/status — admin check status
router.get('/status', requireAdmin, async (req, res) => {
  try {
    const cache = await InstagramCache.findOne({ key: 'feed' });
    res.json({
      configured: isConfigured(),
      postCount: cache?.posts?.length || 0,
      lastRefreshed: cache?.lastRefreshed || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
