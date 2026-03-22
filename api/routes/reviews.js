const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');

// Use Content model with a specific key to cache reviews
const mongoose = require('mongoose');

// ── Cache schema (simple single-document approach) ──────────────────────────
let ReviewsCache;
try {
  ReviewsCache = mongoose.model('ReviewsCache');
} catch {
  const schema = new mongoose.Schema({
    key: { type: String, default: 'google', unique: true },
    reviews: [{ type: mongoose.Schema.Types.Mixed }],
    rating: Number,
    totalRatings: Number,
    lastRefreshed: Date,
  }, { strict: false });
  ReviewsCache = mongoose.model('ReviewsCache', schema);
}

const fetchFromGoogle = async () => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId || apiKey.includes('xxxxx'))
    throw new Error('GOOGLE_PLACES_API_KEY et GOOGLE_PLACE_ID non configurés');

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&language=fr&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== 'OK') throw new Error(`Google Places API: ${data.status} — ${data.error_message || ''}`);

  const result = data.result;
  return {
    reviews: (result.reviews || []).map(r => ({
      author: r.author_name,
      rating: r.rating,
      text: r.text,
      time: r.time,
      profilePhoto: r.profile_photo_url,
      relativeTime: r.relative_time_description,
    })),
    rating: result.rating,
    totalRatings: result.user_ratings_total,
  };
};

// GET /api/reviews — public
router.get('/', async (req, res) => {
  try {
    const cache = await ReviewsCache.findOne({ key: 'google' });
    if (!cache) return res.json({ reviews: [], rating: null, totalRatings: 0, configured: false });

    // Auto-refresh if older than 24h
    const stale = !cache.lastRefreshed || (Date.now() - new Date(cache.lastRefreshed).getTime()) > 24 * 60 * 60 * 1000;
    if (stale && process.env.GOOGLE_PLACES_API_KEY && !process.env.GOOGLE_PLACES_API_KEY.includes('xxxxx')) {
      try {
        const fresh = await fetchFromGoogle();
        await ReviewsCache.findOneAndUpdate({ key: 'google' }, { ...fresh, lastRefreshed: new Date() }, { upsert: true });
        return res.json({ ...fresh, lastRefreshed: new Date(), configured: true });
      } catch (e) {
        console.log('[Reviews] Auto-refresh failed:', e.message);
      }
    }

    res.json({
      reviews: cache.reviews || [],
      rating: cache.rating,
      totalRatings: cache.totalRatings,
      lastRefreshed: cache.lastRefreshed,
      configured: true,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews/refresh — admin manual refresh
router.post('/refresh', requireAdmin, async (req, res) => {
  try {
    const data = await fetchFromGoogle();
    await ReviewsCache.findOneAndUpdate(
      { key: 'google' },
      { ...data, lastRefreshed: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true, ...data, lastRefreshed: new Date() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
