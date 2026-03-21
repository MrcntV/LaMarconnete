const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');
const { requireAdmin } = require('../middleware/auth');

const PROJECT = path.join(__dirname, '..', '..');

function runBuild(cwd, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.flushHeaders();

  const proc = exec('npm run build', { cwd, env: { ...process.env, CI: 'false' } });

  proc.stdout.on('data', chunk => res.write(chunk));
  proc.stderr.on('data', chunk => res.write(chunk));

  proc.on('close', code => {
    res.write(`\n--- Build terminé (code ${code}) ---\n`);
    res.end();
  });
}

// POST /api/build/site
router.post('/site', requireAdmin, (req, res) => {
  runBuild(PROJECT, res);
});

// POST /api/build/admin
router.post('/admin', requireAdmin, (req, res) => {
  runBuild(path.join(PROJECT, 'admin'), res);
});

module.exports = router;
