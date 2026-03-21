const express = require('express');
const path = require('path');

const app = express();
const ADMIN_PORT = process.env.ADMIN_PORT || 43750;

// Serve admin panel static build
app.use(express.static(path.join(__dirname, 'admin', 'build')));

// Catch-all for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'build', 'index.html'));
});

app.listen(ADMIN_PORT, () => {
  console.log(`[Admin] Server running on port ${ADMIN_PORT}`);
});
