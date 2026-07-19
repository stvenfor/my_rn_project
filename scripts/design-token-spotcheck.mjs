#!/usr/bin/env node
/**
 * Spot-check hardcoded hex colors under packages/features.
 * Docs-only audit aid for m2-design-tokens-audit — not a CI gate.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FEATURES = path.join(ROOT, 'packages', 'features');
const HEX_RE = /#(?:[0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})\b/g;
const EXT = new Set(['.ts', '.tsx', '.js', '.jsx']);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === 'build') continue;
    const abs = path.join(dir, name);
    const st = fs.statSync(abs);
    if (st.isDirectory()) walk(abs, out);
    else if (EXT.has(path.extname(name))) out.push(abs);
  }
  return out;
}

const files = walk(FEATURES);
const hits = [];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    const matches = line.match(HEX_RE);
    if (!matches) return;
    hits.push({
      file: path.relative(ROOT, file),
      line: i + 1,
      colors: [...new Set(matches)],
      snippet: line.trim().slice(0, 120),
    });
  });
}

const byFile = new Map();
for (const h of hits) {
  if (!byFile.has(h.file)) byFile.set(h.file, []);
  byFile.get(h.file).push(h);
}

console.log(`design-token-spotcheck: scanned ${files.length} files under packages/features`);
console.log(`hex hits: ${hits.length} lines in ${byFile.size} files`);
console.log('');

const sorted = [...byFile.entries()].sort((a, b) => b[1].length - a[1].length);
for (const [file, rows] of sorted.slice(0, 40)) {
  console.log(`${rows.length}\t${file}`);
}
if (sorted.length > 40) {
  console.log(`… and ${sorted.length - 40} more files`);
}

process.exit(0);
