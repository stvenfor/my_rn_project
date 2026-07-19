#!/usr/bin/env node
/**
 * Post-check DoD signals on the Slice file + harness report.
 * Does not tick 08 — only blocks false "Accept ready" claims without evidence hooks.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  fail,
  loadReport,
  ok,
  parseArgs,
  readBriefFile,
  resolveSlicePath,
  REPO_ROOT,
  warn,
} from './lib/common.mjs';

const args = parseArgs();
if (!args.slice) {
  fail('check-dod requires --slice (or active-slice.txt from agent:pre)');
  process.exit(1);
}

const sliceAbs = resolveSlicePath(args.slice);
const brief = readBriefFile(sliceAbs);
const md = fs.readFileSync(sliceAbs, 'utf8');
const report = loadReport();
const errors = [];

if (!report?.pre?.ok) {
  errors.push('缺少成功的 agent:pre 报告（先跑 npm run agent:pre）');
}

if (!brief.isAudit) {
  if (!report?.verify?.ok && !args.skipVerify) {
    errors.push('实现类 Slice 需要 verify 通过（或 AGENT_SKIP_VERIFY=1 / --skip-verify）');
  }
  if (!report?.boundary?.ok) {
    errors.push('boundary 检查未通过或不存在');
  }
}

const hasContextCard = /##\s*Context Card/i.test(md);
if (!hasContextCard) {
  errors.push('Slice 文件缺少 Context Card 段落（结束后填写）');
}

if (brief.evidence) {
  const ev = brief.evidence.replace(/^[`\s]+|[`\s]+$/g, '');
  if (ev.includes('acceptance-records/')) {
    const rel = ev.match(
      /docs\/flutter-to-rn-lego-migration\/acceptance-records\/[^\s`]+/,
    )?.[0];
    if (rel) {
      const abs = path.join(REPO_ROOT, rel);
      if (!fs.existsSync(abs)) {
        warn(`证据路径尚未落盘: ${rel}`);
      } else {
        ok(`Evidence file present: ${rel}`);
      }
    }
  }
}

if (!report?.boundary?.ok && brief.isAudit) {
  // audit may have no code changes — boundary skip is ok if report says skipped
  warn('audit Slice: boundary may be skip');
}

if (errors.length) {
  fail('DoD harness check failed', errors);
  process.exit(1);
}

ok('DoD harness signals OK (08 still requires human/reviewer tick)');
