#!/usr/bin/env node
/**
 * Run machine verify commands from the Slice Brief (机跑验证 / legacy 验证命令).
 * Never executes 人证清单 lines (H4).
 */
import path from 'node:path';
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

const HARNESS_DOC =
  'docs/flutter-to-rn-lego-migration/10-agent-prompt-harness.md';

const args = parseArgs();
if (!args.slice) {
  fail('run-verify requires --slice');
  process.exit(1);
}

const sliceAbs = resolveSlicePath(args.slice);
const sliceRel = path.relative(REPO_ROOT, sliceAbs);
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

// Only 机跑验证 / 验证命令 (via parseBrief.verifyCommands). 人证清单 is ignored.
const commands = brief.verifyCommands.filter(
  c => c && !/^(无|n\/a|none|只读)/i.test(c),
);

if (brief.humanEvidence?.length) {
  console.log(
    `ℹ 人证清单 (${brief.humanEvidence.length} item(s)) — not run by run-verify`,
  );
}

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
  fail('No runnable 机跑验证/验证命令 in Brief', [
    `Slice: ${sliceRel}`,
    `See ${HARNESS_DOC} (agent:post / run-verify)`,
    'Put jest/typecheck under 「机跑验证」(or legacy 「验证命令」); keep screenshots in 「人证清单」',
  ]);
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
    // H3: failure output points at harness doc + slice
    fail(`verify failed: ${cmd} (exit ${code})`, [
      `Slice: ${sliceRel}`,
      `See ${HARNESS_DOC} (agent:post / run-verify)`,
      'Fix the failing command, or move non-machine steps to 「人证清单」 (not executed here)',
    ]);
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
