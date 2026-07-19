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
  - 验证命令 (audit-only may be empty / "无")
  - 文件白名单 (audit-only optional)
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
  errors.push('实现类 Slice 必须填写「验证命令」');
}
if (brief.isAudit && brief.verifyCommands.length === 0) {
  warn('audit Slice 无验证命令（允许）；建议写「无 / 只读」');
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
  console.log(`  verify: ${brief.verifyCommands.join(' && ')}`);
}
