const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const ADMIN_PORT = process.env.ADMIN_PORT || 43750;
const API_PORT   = process.env.PORT        || 43749;

// ── Proxy /api/* → serveur principal (port 43749) ───────────────────────────
// Permet à l'admin d'appeler /api/... sur sa propre origine sans CORS.
app.use('/api', (req, res) => {
  const options = {
    hostname: '127.0.0.1',
    port: API_PORT,
    path: '/api' + req.url,
    method: req.method,
    headers: { ...req.headers, host: `127.0.0.1:${API_PORT}` },
  };

  const proxy = http.request(options, (apiRes) => {
    res.writeHead(apiRes.statusCode, apiRes.headers);
    apiRes.pipe(res, { end: true });
  });

  proxy.on('error', (err) => {
    console.error('[Admin proxy] Erreur :', err.message);
    res.status(502).json({ error: 'API indisponible' });
  });

  req.pipe(proxy, { end: true });
});

// ── Panel admin (fichiers statiques) ────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'admin', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'build', 'index.html'));
});

app.listen(ADMIN_PORT, () => {
  console.log(`[Admin] Server running on port ${ADMIN_PORT}`);
  console.log(`[Admin] API proxied → localhost:${API_PORT}`);
});
