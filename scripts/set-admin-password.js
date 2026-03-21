#!/usr/bin/env node
/**
 * Modifier le mot de passe d'un compte admin
 * Usage : node scripts/set-admin-password.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const AdminUser = require('../api/models/AdminUser');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/marconnete';

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function askHidden(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    const stdin = process.stdin;
    const wasRaw = stdin.isTTY;
    if (wasRaw) stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    let input = '';

    function onData(char) {
      if (char === '\r' || char === '\n') {
        stdin.removeListener('data', onData);
        if (wasRaw) stdin.setRawMode(false);
        stdin.pause();
        process.stdout.write('\n');
        resolve(input);
      } else if (char === '\u0003') {
        process.stdout.write('\n');
        process.exit(0);
      } else if (char === '\u007f' || char === '\b') {
        if (input.length > 0) {
          input = input.slice(0, -1);
          process.stdout.write('\b \b');
        }
      } else {
        input += char;
        process.stdout.write('*');
      }
    }

    stdin.on('data', onData);
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
    await mongoose.disconnect();
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
    await mongoose.disconnect();
    process.exit(1);
  }

  const target = admins[idx];
  console.log(`\nCompte : ${target.email}`);

  const pwd1 = await askHidden('Nouveau mot de passe : ');
  if (pwd1.length < 8) {
    console.log('\nMot de passe trop court (8 caractères minimum).\n');
    await mongoose.disconnect();
    process.exit(1);
  }

  const pwd2 = await askHidden('Confirmer            : ');
  if (pwd1 !== pwd2) {
    console.log('\nLes mots de passe ne correspondent pas.\n');
    await mongoose.disconnect();
    process.exit(1);
  }

  const hash = await bcrypt.hash(pwd1, 10);
  await AdminUser.findByIdAndUpdate(target._id, { passwordHash: hash });

  console.log(`\n✓ Mot de passe mis à jour pour ${target.email}`);
  console.log('  Connectez-vous sur le panel admin avec ce nouveau mot de passe.\n');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(async (err) => {
  console.error('\nErreur :', err.message, '\n');
  await mongoose.disconnect();
  process.exit(1);
});
