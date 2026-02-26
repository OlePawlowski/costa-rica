#!/usr/bin/env node
/**
 * Aktualisiert data.json mit exportierten Notizen.
 * Nutzung: node update-data.js < costa-rica-notizen.json
 * Oder: cat deine-notizen.json | node update-data.js
 */
const fs = require('fs');
const path = require('path');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input || '{}');
    const out = path.join(__dirname, 'data.json');
    fs.writeFileSync(out, JSON.stringify(data, null, 2), 'utf8');
    console.log('data.json aktualisiert.');
  } catch (e) {
    console.error('Fehler:', e.message);
    process.exit(1);
  }
});
