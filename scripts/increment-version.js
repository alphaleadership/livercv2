const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const versionParts = packageJson.version.split('.').map(Number);
versionParts[2] += 1;
packageJson.version = versionParts.join('.');

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
console.log(`Version incremented to ${packageJson.version}`);
