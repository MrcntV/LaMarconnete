#!/usr/bin/env node
/**
 * Modifier le mot de passe d'un compte admin
 * Usage : node scripts/set-admin-password.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdminUser = require('../api/models/AdminUser');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/marconnete';

function ask(question, hidden = false) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    const stdin = process.stdin;
    stdin.resume();
    stdin.setEncoding('utf8');
    if (hidden && stdin.isTTY) stdin.setRawMode(true);

    let input = '';
    stdin.once('data', function handler(data) {
      const char = data.toString();
      if (hidden && stdin.isTTY) {
        // raw mode : lire caractère par caractère jusqu'à Entrée
        if (char === '\r' || char === '\n') {
          stdin.setRawMode(false);
          stdin.removeListener('data', handler);
          process.stdout.write('\n');
          resolve(input);
        } else if (char === '\u0003') { // Ctrl+C
          process.exit(0);
        } else if (char === '\u007f') { // Backspace
          input = input.slice(0, -1);
          process.stdout.write('\b \b');
        } else {
          input += char;
          process.stdout.write('*');
          stdin.once('data', handler); // continuer à lire
        }
      } else {
        stdin.pause();
        resolve(char.trim());
      }
    });
  });
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('\n========================================');
  console.log('   Modifier le mot de passe admin');
  console.log('========================================\n');

  const admins = await AdminUser.find({}, 'email firstName lastName role active');
  if (admins.length === 0) {
    console.log('Aucun compte admin trouvé.');
    console.log("Lance d'abord : node scripts/migrate-to-mongo.js\n");
    process.exit(1);
  }

  console.log('Comptes admin :');
  admins.forEach((a, i) => {
    const status = a.active ? '✓ actif' : '✗ inactif';
    console.log(`  ${i + 1}. ${a.email}  (${a.firstName} ${a.lastName} — ${a.role} — ${status})`);
  });

  const choiceRaw = await ask('\nNuméro du compte : ');
  const idx = parseInt(choiceRaw) - 1;
  if (isNaN(idx) || idx < 0 || idx >= admins.length) {
    console.log('\nChoix invalide.\n');
    process.exit(1);
  }

  const target = admins[idx];
  console.log(`\nCompte : ${target.email}`);

  const pwd1 = await ask('Nouveau mot de passe : ', true);
  if (pwd1.length < 8) {
    console.log('\nMot de passe trop court (8 caractères minimum).\n');
    process.exit(1);
  }

  const pwd2 = await ask('Confirmer            : ', true);
  if (pwd1 !== pwd2) {
    console.log('\nLes mots de passe ne correspondent pas.\n');
    process.exit(1);
  }

  const hash = await bcrypt.hash(pwd1, 10);
  await AdminUser.findByIdAndUpdate(target._id, { passwordHash: hash });

  console.log(`\n✓ Mot de passe mis à jour pour ${target.email}`);
  console.log('  Connectez-vous sur le panel admin avec ce nouveau mot de passe.\n');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('\nErreur :', err.message, '\n');
  process.exit(1);
});
