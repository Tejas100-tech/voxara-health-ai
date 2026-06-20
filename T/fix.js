const fs = require('fs');
let f = fs.readFileSync('pnpm-workspace.yaml', 'utf8');
f = f.replace(/^  ".*": "-"$\r?\n/gm, '');
f = f.replace(/^  ".*": '-'$\r?\n/gm, '');
fs.writeFileSync('pnpm-workspace.yaml', f);
console.log('Fixed workspace file');
