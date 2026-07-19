#!/usr/bin/env node
/**
 * Fail if working tree introduces feature→feature or core→feature imports.
 * Scans changed .ts/.tsx under packages/features and packages/core.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  fail,
  gitDiffNames,
  ok,
  parseArgs,
  REPO_ROOT,
  warn,
} from './lib/common.mjs';

const FEATURE_IMPORT = /from\s+['"]@features\/([a-z0-9-]+)['"]/g;
const CORE_TO_FEATURE = /from\s+['"]@features\//g;

const args = parseArgs();
const changed = gitDiffNames(args.base);
const targets = changed.filter(
  f =>
    /\.(ts|tsx)$/.test(f) &&
    (f.startsWith('packages/features/') || f.startsWith('packages/core/')),
);

if (targets.length === 0) {
  ok('Boundary: no feature/core TS changes in working tree');
  process.exit(0);
}

const violations = [];

for (const rel of targets) {
  const abs = path.join(REPO_ROOT, rel);
  if (!fs.existsSync(abs)) {
    continue;
  }
  const src = fs.readFileSync(abs, 'utf8');
  const featureMatch = rel.match(/^packages\/features\/([^/]+)\//);
  if (featureMatch) {
    const self = featureMatch[1];
    let m;
    FEATURE_IMPORT.lastIndex = 0;
    while ((m = FEATURE_IMPORT.exec(src))) {
      const imported = m[1];
      if (imported !== self) {
        violations.push(`${rel}: imports @features/${imported} (feature→feature)`);
      }
    }
  }
  if (rel.startsWith('packages/core/')) {
    CORE_TO_FEATURE.lastIndex = 0;
    if (CORE_TO_FEATURE.test(src)) {
      violations.push(`${rel}: core→feature import`);
    }
  }
}

if (violations.length) {
  fail('Module boundary violated', violations);
  process.exit(1);
}

ok(`Boundary OK (${targets.length} file(s) scanned)`);
if (targets.length > 40) {
  warn('Large diff — consider narrower Slice whitelist');
}
