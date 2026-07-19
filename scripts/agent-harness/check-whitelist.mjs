#!/usr/bin/env node
/**
 * Optional: fail if changed files escape Brief whitelist prefixes.
 * Wired into agent:post when whitelist is non-empty.
 */
import path from 'node:path';
import {
  fail,
  gitDiffNames,
  ok,
  parseArgs,
  readBriefFile,
  resolveSlicePath,
  warn,
} from './lib/common.mjs';

const args = parseArgs();
if (!args.slice) {
  fail('--slice required');
  process.exit(1);
}

const brief = readBriefFile(resolveSlicePath(args.slice));
if (brief.isAudit || brief.whitelist.length === 0) {
  ok('Whitelist: skipped (audit or empty)');
  process.exit(0);
}

const alwaysAllow = [
  'docs/flutter-to-rn-lego-migration/',
  '.cursor/agent-harness/',
  'package-lock.json',
];

const changed = gitDiffNames(args.base);
const escaped = [];

for (const file of changed) {
  if (alwaysAllow.some(p => file.startsWith(p))) {
    continue;
  }
  const allowed = brief.whitelist.some(w => {
    const prefix = w.replace(/^\.\//, '').replace(/\*\*$/, '').replace(/\*$/, '');
    return file === prefix || file.startsWith(prefix.replace(/\/?$/, '/')) || file.startsWith(prefix);
  });
  if (!allowed) {
    escaped.push(file);
  }
}

if (escaped.length) {
  fail('Files outside Brief whitelist', escaped.slice(0, 40));
  warn('Expand whitelist in Slice Brief or revert stray files');
  process.exit(1);
}

ok(`Whitelist OK (${changed.length} changed file(s))`);
