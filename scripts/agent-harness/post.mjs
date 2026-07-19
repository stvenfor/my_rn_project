#!/usr/bin/env node
/**
 * agent:post — run after implementing a Slice (before claiming Accept).
 */
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {
  parseArgs,
  resolveSlicePath,
  REPO_ROOT,
  saveReport,
  loadReport,
  ok,
  fail,
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
  npm run agent:post -- --slice docs/flutter-to-rn-lego-migration/plans/slices/<id>.md
  npm run agent:post   # uses .cursor/agent-harness/active-slice.txt from agent:pre

  --skip-verify   skip Brief 验证命令 (emergency only)
`);
  process.exit(args.help ? 0 : 1);
}

const sliceAbs = resolveSlicePath(args.slice);
const sliceArgs = ['--slice', sliceAbs];
if (args.base) {
  sliceArgs.push('--base', args.base);
}
if (args.skipVerify) {
  sliceArgs.push('--skip-verify');
}

console.log('══ agent:post ══');

let code = runNode('check-boundary.mjs', sliceArgs);
if (code !== 0) {
  const prev = loadReport() || {};
  saveReport({...prev, post: {ok: false, step: 'check-boundary'}, boundary: {ok: false}});
  process.exit(code);
}

code = runNode('check-manifest.mjs', sliceArgs);
if (code !== 0) {
  const prev = loadReport() || {};
  saveReport({...prev, post: {ok: false, step: 'check-manifest'}, manifest: {ok: false}});
  process.exit(code);
}

code = runNode('check-whitelist.mjs', sliceArgs);
if (code !== 0) {
  const prev = loadReport() || {};
  saveReport({...prev, post: {ok: false, step: 'check-whitelist'}, whitelist: {ok: false}});
  process.exit(code);
}

code = runNode('run-verify.mjs', sliceArgs);
if (code !== 0) {
  const prev = loadReport() || {};
  saveReport({...prev, post: {ok: false, step: 'run-verify'}});
  process.exit(code);
}

code = runNode('check-dod.mjs', sliceArgs);
if (code !== 0) {
  const prev = loadReport() || {};
  saveReport({...prev, post: {ok: false, step: 'check-dod'}});
  process.exit(code);
}

const prev = loadReport() || {};
saveReport({
  ...prev,
  slice: path.relative(REPO_ROOT, sliceAbs),
  boundary: {ok: true},
  manifest: {ok: true},
  post: {ok: true, at: new Date().toISOString()},
});

ok('agent:post passed — Delivery Report + human review before commit/push');
console.log(`Report: .cursor/agent-harness/harness-report.json`);
