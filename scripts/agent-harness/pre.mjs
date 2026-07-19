#!/usr/bin/env node
/**
 * agent:pre — run before implementing a Slice.
 * Checks Brief contract, optionally records active slice, scans boundary+manifest on current tree.
 */
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {
  fail,
  ok,
  parseArgs,
  resolveSlicePath,
  REPO_ROOT,
  saveReport,
  setActiveSlice,
} from './lib/common.mjs';

function runNode(script, extraArgs = []) {
  const r = spawnSync(
    process.execPath,
    [path.join(REPO_ROOT, 'scripts/agent-harness', script), ...extraArgs],
    {cwd: REPO_ROOT, stdio: 'inherit', env: process.env},
  );
  return r.status ?? 1;
}

const args = parseArgs();
if (args.help || !args.slice) {
  console.log(`Usage:
  npm run agent:pre -- --slice docs/flutter-to-rn-lego-migration/plans/slices/<id>.md

Env:
  AGENT_SLICE=...   same as --slice
  AGENT_DIFF_BASE   git diff base (default HEAD)
`);
  process.exit(args.help ? 0 : 1);
}

const sliceAbs = resolveSlicePath(args.slice);
const sliceArgs = ['--slice', sliceAbs];
if (args.base) {
  sliceArgs.push('--base', args.base);
}

console.log('══ agent:pre ══');
let code = runNode('check-brief.mjs', sliceArgs);
if (code !== 0) {
  saveReport({
    slice: path.relative(REPO_ROOT, sliceAbs),
    pre: {ok: false, step: 'check-brief'},
  });
  process.exit(code);
}

setActiveSlice(sliceAbs);

code = runNode('check-boundary.mjs', sliceArgs);
const boundaryOk = code === 0;
if (!boundaryOk) {
  saveReport({
    slice: path.relative(REPO_ROOT, sliceAbs),
    pre: {ok: false, step: 'check-boundary'},
    boundary: {ok: false},
  });
  process.exit(code);
}

code = runNode('check-manifest.mjs', sliceArgs);
const manifestOk = code === 0;
if (!manifestOk) {
  saveReport({
    slice: path.relative(REPO_ROOT, sliceAbs),
    pre: {ok: false, step: 'check-manifest'},
    boundary: {ok: true},
    manifest: {ok: false},
  });
  process.exit(code);
}

saveReport({
  slice: path.relative(REPO_ROOT, sliceAbs),
  pre: {ok: true, at: new Date().toISOString()},
  boundary: {ok: true},
  manifest: {ok: true},
});

ok('agent:pre passed — implement only within Brief whitelist');
console.log(`Active slice: ${path.relative(REPO_ROOT, sliceAbs)}`);
console.log('Next: implement → npm run agent:post');
