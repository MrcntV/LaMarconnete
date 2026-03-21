const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/marconnete';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[MongoDB] Connecté à', MONGODB_URI);
  } catch (err) {
    console.error('[MongoDB] Erreur de connexion :', err.message);
    process.exit(1);
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Déconnecté');
});

module.exports = { connectDB, mongoose };
