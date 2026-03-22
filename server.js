require('dotenv').config();
const express = require('express');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { exec } = require('child_process');
const { connectDB } = require('./api/config/mongoose');

const app = express();
const PORT = process.env.PORT || 43749;

// Connexion MongoDB + seed auto de toutes les collections si vides
console.log('[MongoDB] Connexion en cours...');
connectDB().then(async () => {
  const fs = require('fs');

  // Produits : source de vérité = MongoDB uniquement (pas de seed JSON)

  // Seed Orders
  try {
    const Order = require('./api/models/Order');
    if (await Order.countDocuments() === 0) {
      const f = path.join(__dirname, 'data', 'orders.json');
      if (fs.existsSync(f)) {
        const items = JSON.parse(fs.readFileSync(f, 'utf-8'));
        if (items.length > 0) { await Order.insertMany(items, { ordered: false }); console.log(`[Seed] ${items.length} commandes importées`); }
      }
    }
  } catch (e) {
    console.error('[Seed] Erreur seed orders :', e.message);
  }

  // Seed Invoices
  try {
    const Invoice = require('./api/models/Invoice');
    if (await Invoice.countDocuments() === 0) {
      const f = path.join(__dirname, 'data', 'invoices.json');
      if (fs.existsSync(f)) {
        const items = JSON.parse(fs.readFileSync(f, 'utf-8'));
        if (items.length > 0) { await Invoice.insertMany(items, { ordered: false }); console.log(`[Seed] ${items.length} factures importées`); }
      }
    }
  } catch (e) {
    console.error('[Seed] Erreur seed invoices :', e.message);
  }

  // Seed Newsletter
  try {
    const Newsletter = require('./api/models/Newsletter');
    if (await Newsletter.countDocuments() === 0) {
      const f = path.join(__dirname, 'data', 'newsletter.json');
      if (fs.existsSync(f)) {
        const items = JSON.parse(fs.readFileSync(f, 'utf-8'));
        if (items.length > 0) { await Newsletter.insertMany(items, { ordered: false }); console.log(`[Seed] ${items.length} abonnés newsletter importés`); }
      }
    }
  } catch (e) {
    console.error('[Seed] Erreur seed newsletter :', e.message);
  }

  // Seed Content (single doc)
  try {
    const Content = require('./api/models/Content');
    if (await Content.countDocuments() === 0) {
      const f = path.join(__dirname, 'data', 'content.json');
      if (fs.existsSync(f)) {
        const data = JSON.parse(fs.readFileSync(f, 'utf-8'));
        await Content.create({ key: 'main', ...data });
        console.log('[Seed] Contenu importé');
      }
    }
  } catch (e) {
    console.error('[Seed] Erreur seed content :', e.message);
  }

  // Seed Locations
  try {
    const Location = require('./api/models/Location');
    if (await Location.countDocuments() === 0) {
      const f = path.join(__dirname, 'data', 'locations.json');
      if (fs.existsSync(f)) {
        const locs = JSON.parse(fs.readFileSync(f, 'utf-8'));
        await Location.insertMany(locs.map(l => ({
          name: l.name, address: l.address || '', city: l.city,
          postalCode: l.postalCode, département: l.département || '',
          lat: l.lat, lng: l.lng, phone: l.phone || '',
          email: l.email || '', schedule: l.schedule || '',
          image: l.image || '', active: l.active !== false,
        })));
        console.log(`[Seed] ${locs.length} points de vente importés`);
      }
    }
  } catch (e) {
    console.error('[Seed] Erreur seed locations :', e.message);
  }

  app.listen(PORT, () => {
    console.log(`[Main] Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('[MongoDB] Fatal:', err.message);
  process.exit(1);
});

const GITHUB_WEBHOOK_SECRET = 'J@mltlja345h';
const PROJECT_PATH = __dirname;
const PM2_APP_NAME = 'marconnete';

// JWT Secret (set in .env for production)
const JWT_SECRET = process.env.JWT_SECRET || 'marconnete-secret-jwt-2024';

// CORS — origines autorisées (lues depuis .env)
const ADMIN_DOMAIN = process.env.ADMIN_DOMAIN || 'admin.mrcntv.com';
const SITE_DOMAIN  = process.env.SITE_DOMAIN  || 'mrcntv.com';

app.use(cors({
  origin: [
    `https://${ADMIN_DOMAIN}`,
    `https://${SITE_DOMAIN}`,
    `https://www.${SITE_DOMAIN}`,
    'http://localhost:43750',
    'http://localhost:3001',
  ],
  credentials: true
}));

// IMPORTANT: Stripe webhook requires raw body parser.
// The route /api/stripe/webhook and /api/orders/stripe-webhook
// use their own express.raw() middleware inside the route files.
// We skip express.json() for those paths here.

// JSON body parser for /api routes (skip stripe webhook paths)
app.use('/api', (req, res, next) => {
  if (req.path === '/stripe/webhook' || req.path === '/orders/stripe-webhook') {
    return next();
  }
  express.json()(req, res, next);
});

// File upload middleware (for image uploads in products)
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  createParentPath: true,
  abortOnLimit: true
}));

// Fichiers statiques React (main site)
app.use(express.static(path.join(__dirname, 'build')));

// Public assets — images uploadées (produits, points de vente, etc.)
// Accessible à la fois sous /public/... et directement sous /...
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Petit header perso
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'mrcntv');
  next();
});

// =============================================
// API ROUTES — must be BEFORE the catch-all *
// =============================================
app.use('/api/auth', require('./api/routes/auth'));
app.use('/api/products', require('./api/routes/products'));
app.use('/api/orders', require('./api/routes/orders'));
app.use('/api/customers', require('./api/routes/customers'));
app.use('/api/newsletter', require('./api/routes/newsletter'));
app.use('/api/locations', require('./api/routes/locations'));
app.use('/api/invoices', require('./api/routes/invoices'));
app.use('/api/content', require('./api/routes/content'));
app.use('/api/stock', require('./api/routes/stock'));
app.use('/api/stripe', require('./api/routes/stripe'));
app.use('/api/build', require('./api/routes/build'));
app.use('/api/settings', require('./api/routes/settings'));
app.use('/api/media', require('./api/routes/media'));

// Route API status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    hostname: os.hostname(),
    platform: process.platform,
    port: PORT
  });
});

// Page de bienvenue
app.get('/welcome', (req, res) => {
  res.send(`
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Bienvenue</title>
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #0f172a;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .card {
            background: #1e293b;
            padding: 32px;
            border-radius: 16px;
            max-width: 700px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.35);
          }
          h1 { margin-top: 0; color: #38bdf8; }
          p, li { line-height: 1.6; }
          code {
            background: #0f172a;
            padding: 2px 6px;
            border-radius: 6px;
          }
          a { color: #38bdf8; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Bienvenue sur mrcntv.com</h1>
          <p>Le serveur est bien en ligne et prêt à répondre.</p>
          <ul>
            <li><strong>Port :</strong> ${PORT}</li>
            <li><strong>Heure serveur :</strong> ${new Date().toLocaleString()}</li>
            <li><strong>Statut API :</strong> <a href="/api/status">/api/status</a></li>
            <li><strong>Webhook GitHub :</strong> <code>/webhook</code></li>
            <li><strong>Admin panel :</strong> <a href="http://localhost:43750">port 43750</a></li>
          </ul>
          <p>Le reverse proxy Nginx, le certificat SSL et le webhook GitHub sont maintenant prévus pour un auto-déploiement propre.</p>
        </div>
      </body>
    </html>
  `);
});

// Vérification signature GitHub
function verifyGitHubSignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return false;

  const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(req.body).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  } catch (error) {
    console.error('Erreur comparaison signature :', error.message);
    return false;
  }
}

// Route de test webhook
app.get('/webhook', (req, res) => {
  res.status(200).send('Webhook endpoint OK');
});

// Webhook GitHub : raw body obligatoire
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  console.log('--- WEBHOOK REÇU ---');
  console.log('Event:', req.headers['x-github-event']);
  console.log('Delivery:', req.headers['x-github-delivery']);
  console.log('User-Agent:', req.headers['user-agent']);

  if (!verifyGitHubSignature(req)) {
    console.error('Signature invalide');
    return res.status(401).send('Signature invalide');
  }

  const event = req.headers['x-github-event'];

  if (event !== 'push') {
    console.log('Événement ignoré :', event);
    return res.status(200).send('Événement ignoré');
  }

  const command = `
    cd ${PROJECT_PATH} &&
    git pull origin main &&
    npm install --legacy-peer-deps &&
    npm run build &&
    pm2 startOrRestart ${PROJECT_PATH}/pm2.config.js --env production
  `;

  console.log('Commande lancée :', command);

  exec(command, (error, stdout, stderr) => {
    console.log('STDOUT:', stdout || 'Aucune sortie');
    console.log('STDERR:', stderr || 'Aucune erreur');

    if (error) {
      console.error('Erreur auto pull :', error.message);
      return res.status(500).send('Échec du déploiement');
    }

    console.log('Déploiement OK');
    return res.status(200).send('Déploiement effectué');
  });
});

// Fallback React SPA — MUST be last
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

