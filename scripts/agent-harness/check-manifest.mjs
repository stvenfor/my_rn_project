#!/usr/bin/env node
/**
 * If page-resource-parity-manifest.ts changed, validate status enums
 * and require note when status is Degraded/Placeholder/Deferred.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  fail,
  gitDiffNames,
  ok,
  parseArgs,
  REPO_ROOT,
  VALID_MANIFEST_STATUSES,
  warn,
} from './lib/common.mjs';

const MANIFEST_REL =
  'docs/flutter-to-rn-lego-migration/page-resource-parity-manifest.ts';

const args = parseArgs();
const changed = gitDiffNames(args.base);

if (!changed.includes(MANIFEST_REL)) {
  ok('Manifest: not in working tree changes (skip)');
  process.exit(0);
}

const abs = path.join(REPO_ROOT, MANIFEST_REL);
const src = fs.readFileSync(abs, 'utf8');
const errors = [];

// status: 'X'
const statusRe = /status:\s*['"]([A-Za-z]+)['"]/g;
let m;
const statuses = [];
while ((m = statusRe.exec(src))) {
  statuses.push(m[1]);
  if (!VALID_MANIFEST_STATUSES.has(m[1])) {
    errors.push(`illegal status: ${m[1]}`);
  }
}

// Entries with Degraded/Placeholder/Deferred should have note nearby (heuristic on object literals)
const entryRe =
  /\{[^{}]*status:\s*['"](Degraded|Placeholder|Deferred)['"][^{}]*\}/gs;
let entry;
while ((entry = entryRe.exec(src))) {
  const body = entry[0];
  if (!/note:\s*['"]/.test(body)) {
    errors.push(
      `${entry[1]} entry missing note: (near ${body.slice(0, 80).replace(/\s+/g, ' ')}…)`,
    );
  }
}

if (errors.length) {
  fail('Manifest check failed', [...new Set(errors)].slice(0, 30));
  process.exit(1);
}

ok(`Manifest OK (${statuses.length} status fields scanned)`);
if (!statuses.length) {
  warn('No status: fields found — check manifest format');
}
