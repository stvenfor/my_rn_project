#!/usr/bin/env node
/**
 * Compares RN asset manifests on disk against page-resource-parity-manifest entries.
 * Run: node scripts/asset-parity-audit.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const manifestPath = path.join(
  ROOT,
  'docs/flutter-to-rn-lego-migration/page-resource-parity-manifest.ts',
);

function collectAssetPathsFromManifest(source) {
  const matches = source.matchAll(/rnPath:\s*'([^']+)'/g);
  return [...matches].map(m => m[1]);
}

function main() {
  const source = fs.readFileSync(manifestPath, 'utf8');
  const paths = collectAssetPathsFromManifest(source);
  const missing = paths.filter(p => !fs.existsSync(path.join(ROOT, p)));
  const found = paths.length - missing.length;

  console.log(`Asset parity audit: ${found}/${paths.length} files on disk`);
  if (missing.length) {
    console.error('Missing:');
    missing.forEach(p => console.error(`  - ${p}`));
    process.exit(1);
  }
  console.log('All manifest asset paths exist.');
}

main();
