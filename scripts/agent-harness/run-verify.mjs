#!/usr/bin/env node
/**
 * Run verify commands listed in the Slice Brief.
 */
import {spawnSync} from 'node:child_process';
import {
  fail,
  ok,
  parseArgs,
  readBriefFile,
  resolveSlicePath,
  REPO_ROOT,
  saveReport,
  loadReport,
  warn,
} from './lib/common.mjs';

const args = parseArgs();
if (!args.slice) {
  fail('run-verify requires --slice');
  process.exit(1);
}

const sliceAbs = resolveSlicePath(args.slice);
const brief = readBriefFile(sliceAbs);

if (args.skipVerify) {
  warn('skip-verify set — marking verify as skipped');
  const prev = loadReport() || {};
  saveReport({
    ...prev,
    slice: args.slice,
    verify: {ok: true, skipped: true, commands: []},
  });
  process.exit(0);
}

const commands = brief.verifyCommands.filter(
  c => c && !/^(无|n\/a|none|只读)/i.test(c),
);

if (commands.length === 0) {
  if (brief.isAudit) {
    ok('verify: audit Slice with no commands — skip');
    const prev = loadReport() || {};
    saveReport({
      ...prev,
      slice: args.slice,
      verify: {ok: true, skipped: true, commands: []},
    });
    process.exit(0);
  }
  fail('No runnable 验证命令 in Brief');
  process.exit(1);
}

const results = [];
for (const cmd of commands) {
  console.log(`\n→ ${cmd}`);
  const r = spawnSync(cmd, {
    cwd: REPO_ROOT,
    shell: true,
    stdio: 'inherit',
    env: process.env,
  });
  const code = r.status ?? 1;
  results.push({cmd, code});
  if (code !== 0) {
    const prev = loadReport() || {};
    saveReport({
      ...prev,
      slice: args.slice,
      verify: {ok: false, commands: results},
    });
    fail(`verify failed: ${cmd} (exit ${code})`);
    process.exit(1);
  }
}

const prev = loadReport() || {};
saveReport({
  ...prev,
  slice: args.slice,
  verify: {ok: true, commands: results},
});
ok(`verify OK (${commands.length} command(s))`);
