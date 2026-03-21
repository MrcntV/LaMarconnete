const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

function readDB(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[DB] Error reading ${filename}:`, err.message);
    return [];
  }
}

function writeDB(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`[DB] Error writing ${filename}:`, err.message);
    return false;
  }
}

function generateId(prefix) {
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).substr(2, 5);
  return `${prefix || 'id'}_${ts}_${rnd}`;
}

module.exports = { readDB, writeDB, generateId };
