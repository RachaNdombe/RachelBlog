const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function checkJsSyntax(file) {
  const filePath = path.join(root, file);
  try {
    execSync(`node --check "${filePath}"`, { stdio: 'pipe' });
    console.log(`  OK  ${file}`);
  } catch {
    errors.push(`Erreur de syntaxe dans ${file}`);
    console.log(`  ERR ${file}`);
  }
}

console.log('Build — vérification du projet RachelBlog\n');

console.log('Syntaxe JavaScript :');
['server.js', 'script.js'].forEach(checkJsSyntax);

console.log('\nFichiers requis :');
const requiredFiles = [
  'index.html',
  'styles.css',
  'server.js',
  'script.js',
  'images/invitia.png',
  'images/gmms-sarlu.png',
  'images/rptc-oprotec.png',
  'images/memoire-cryptage-facial.png',
];

requiredFiles.forEach((file) => {
  const exists = fs.existsSync(path.join(root, file));
  console.log(`  ${exists ? 'OK' : 'ERR'}  ${file}`);
  check(exists, `Fichier manquant : ${file}`);
});

console.log('\nImages référencées dans index.html :');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const imageRefs = [...html.matchAll(/src="images\/([^"]+)"/g)].map((m) => m[1]);

imageRefs.forEach((image) => {
  const exists = fs.existsSync(path.join(root, 'images', image));
  console.log(`  ${exists ? 'OK' : 'ERR'}  images/${image}`);
  check(exists, `Image manquante : images/${image}`);
});

console.log('');
if (errors.length) {
  console.error('Build échoué :');
  errors.forEach((err) => console.error(`  - ${err}`));
  process.exit(1);
}

console.log('Build réussi — aucune erreur détectée.');
