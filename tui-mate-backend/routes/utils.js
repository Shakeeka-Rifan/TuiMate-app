// routes/utils.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/reverse', async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ message: 'lat/lng required' });

  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${process.env.OPENCAGE_API_KEY}&limit=1&no_annotations=1`;
    const { data } = await axios.get(url);
    const best = data?.results?.[0];
    if (!best) return res.status(404).json({ message: 'No address found' });

    const c = best.components || {};
    const parts = [
      c.road || c.pedestrian || c.footway || c.path || c.neighbourhood,
      c.suburb || c.village || c.town || c.city || c.county,
      c.state,
      c.postcode,
      c.country
    ].filter(Boolean);

    const formatted = parts.join(', ') || best.formatted;
    return res.json({ formatted, confidence: best.confidence });
  } catch (e) {
    console.error('Reverse error', e?.response?.status || e.message);
    return res.status(500).json({ message: 'Reverse geocoding failed' });
  }
});


module.exports = router;
