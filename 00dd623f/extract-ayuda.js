const fs = require('fs');
const s = fs.readFileSync('asistente.js', 'utf8');
const start = s.indexOf('m=[[') + 2;
let i = start;
let depth = 0;
let q = null;
let esc = false;
for (; i < s.length; i++) {
  const c = s[i];
  if (q) {
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (c === q) { q = null; }
    continue;
  }
  if (c === "'" || c === '"' || c === '`') { q = c; continue; }
  if (c === '[') depth++;
  else if (c === ']') {
    depth--;
    if (depth === 0) { i++; break; }
  }
}
const code = s.slice(start, i);
const m = new Function('return ' + code)();
fs.writeFileSync('ayuda-data.json', JSON.stringify(m));
console.log('items', m.length, 'bytes', code.length);
for (const x of m) console.log(x[0], '|', x[1], '|', x[3].slice(0, 60));
