/**
 * Migration JSON → MongoDB
 * Lance avec : node scripts/migrate-to-mongo.js
 *
 * Importe customers.json et users.json dans MongoDB.
 * Les mots de passe sont déjà hashés (bcrypt) dans les JSON → on les copie tels quels
 * sans repasser par le pre-save hook.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/marconnete';

// Charger les modèles
const Customer = require('../api/models/Customer');
const AdminUser = require('../api/models/AdminUser');

function readJSON(filename) {
  const filePath = path.join(__dirname, '..', 'data', filename);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

async function migrate() {
  await mongoose.connect(MONGODB_URI);
  console.log('[Migration] Connecté à MongoDB');

  // ─── Customers ──────────────────────────────────────────────────────────────
  const customersJSON = readJSON('customers.json');
  let custCreated = 0, custSkipped = 0;

  for (const c of customersJSON) {
    const exists = await Customer.findOne({ email: c.email });
    if (exists) { custSkipped++; continue; }

    // Insert raw — bypass pre-save hook pour ne pas re-hasher un hash existant
    await Customer.collection.insertOne({
      email: c.email,
      passwordHash: c.passwordHash,
      firstName: c.firstName || '',
      lastName: c.lastName || '',
      phone: c.phone || '',
      address: c.address || '',
      city: c.city || '',
      postalCode: c.postalCode || '',
      country: c.country || 'France',
      orders: c.orders || [],
      newsletter: !!c.newsletter,
      active: c.active !== false,
      createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
      updatedAt: new Date(),
    });
    custCreated++;
  }
  console.log(`[Migration] Clients : ${custCreated} créés, ${custSkipped} ignorés (déjà existants)`);

  // ─── AdminUsers ─────────────────────────────────────────────────────────────
  const usersJSON = readJSON('users.json');
  let adminCreated = 0, adminSkipped = 0;

  for (const u of usersJSON) {
    const exists = await AdminUser.findOne({ email: u.email });
    if (exists) { adminSkipped++; continue; }

    await AdminUser.collection.insertOne({
      email: u.email,
      passwordHash: u.passwordHash,
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      role: u.role || 'admin',
      active: u.active !== false,
      createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
      updatedAt: new Date(),
    });
    adminCreated++;
  }
  console.log(`[Migration] Admins : ${adminCreated} créés, ${adminSkipped} ignorés`);

  await mongoose.disconnect();
  console.log('[Migration] Terminée ✓');
}

migrate().catch(err => {
  console.error('[Migration] Erreur :', err.message);
  process.exit(1);
});
