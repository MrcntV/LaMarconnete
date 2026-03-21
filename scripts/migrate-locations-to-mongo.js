/**
 * Migration locations JSON → MongoDB
 * Usage : node scripts/migrate-locations-to-mongo.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Location = require('../api/models/Location');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/marconnete';

async function migrate() {
  await mongoose.connect(MONGODB_URI);
  console.log('[Migration] Connecté à MongoDB');

  const filePath = path.join(__dirname, '..', 'data', 'locations.json');
  if (!fs.existsSync(filePath)) {
    console.error('[Migration] data/locations.json introuvable');
    process.exit(1);
  }

  const locations = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let created = 0, skipped = 0;

  for (const loc of locations) {
    const exists = await Location.findOne({ name: loc.name, city: loc.city, postalCode: loc.postalCode });
    if (exists) { skipped++; continue; }

    await Location.create({
      name:        loc.name,
      address:     loc.address || '',
      city:        loc.city,
      postalCode:  loc.postalCode,
      département: loc.département || '',
      lat:         loc.lat,
      lng:         loc.lng,
      phone:       loc.phone || '',
      email:       loc.email || '',
      schedule:    loc.schedule || '',
      image:       loc.image || '',
      active:      loc.active !== false,
    });
    created++;
  }

  console.log(`[Migration] Locations : ${created} créées, ${skipped} ignorées (déjà existantes)`);
  await mongoose.disconnect();
  console.log('[Migration] Terminée ✓');
}

migrate().catch(err => {
  console.error('[Migration] Erreur :', err.message);
  process.exit(1);
});
