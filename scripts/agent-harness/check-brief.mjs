#!/usr/bin/env node
/**
 * Validate Slice Brief contract fields.
 * Usage: node check-brief.mjs --slice plans/slices/<id>.md
 */
import path from 'node:path';
import {
  fail,
  ok,
  parseArgs,
  readBriefFile,
  resolveSlicePath,
  REPO_ROOT,
  setActiveSlice,
  warn,
} from './lib/common.mjs';

const args = parseArgs();
if (args.help || !args.slice) {
  console.log(`Usage: node scripts/agent-harness/check-brief.mjs --slice <path>

Required Brief fields:
  - 本轮 ONLY
  - 不做
  - 验收
  - 机跑验证 (or legacy 验证命令; audit-only may be empty / "无")
  - 文件白名单 (audit-only optional)
Optional: 人证清单, Accept 模式 (Full|Partial), Partial 时未证项
`);
  process.exit(args.help ? 0 : 1);
}

const sliceAbs = resolveSlicePath(args.slice);
let brief;
try {
  brief = readBriefFile(sliceAbs);
} catch (e) {
  fail(e.message);
  process.exit(1);
}

const errors = [];
if (!brief.only) {
  errors.push('缺少「本轮 ONLY」');
}
if (!brief.dont) {
  errors.push('缺少「不做」');
}
if (!brief.acceptance) {
  errors.push('缺少「验收」');
}
if (!brief.isAudit && brief.whitelist.length === 0) {
  errors.push('实现类 Slice 必须填写「文件白名单」');
}
if (!brief.isAudit && brief.verifyCommands.length === 0) {
  errors.push('实现类 Slice 必须填写「机跑验证」或旧字段「验证命令」');
}
if (brief.isAudit && brief.verifyCommands.length === 0) {
  warn('audit Slice 无机跑验证（允许）；建议写「无 / 只读」');
}

if (errors.length) {
  fail(`Brief 合同不完整: ${path.relative(REPO_ROOT, sliceAbs)}`, errors);
  process.exit(1);
}

setActiveSlice(sliceAbs);
ok(`Brief OK (${brief.isAudit ? 'audit' : 'implement'}): ${path.relative(REPO_ROOT, sliceAbs)}`);
if (brief.whitelist.length) {
  console.log(`  whitelist: ${brief.whitelist.join(', ')}`);
}
if (brief.verifyCommands.length) {
  console.log(`  verify (机跑): ${brief.verifyCommands.join(' && ')}`);
}
if (brief.humanEvidence?.length) {
  console.log(`  人证 (not run-verify): ${brief.humanEvidence.join('; ')}`);
}
if (brief.acceptMode === 'Partial') {
  console.log(
    `  Accept 模式: Partial${brief.partialGaps?.length ? ` — 未证: ${brief.partialGaps.join('; ')}` : ''}`,
  );
}
