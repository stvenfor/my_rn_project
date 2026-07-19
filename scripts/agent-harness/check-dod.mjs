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

const TEMPLATE_HINT =
  'docs/flutter-to-rn-lego-migration/plans/slices/_template.md';

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

/** Resolve evidence markdown path from Brief 「证据」 field. */
function resolveEvidenceAbs(evidenceField) {
  if (!evidenceField) {
    return null;
  }
  const ev = evidenceField.replace(/^[`\s]+|[`\s]+$/g, '');
  const rel =
    ev.match(
      /docs\/flutter-to-rn-lego-migration\/acceptance-records\/[^\s`]+/,
    )?.[0] ||
    ev.match(/acceptance-records\/[^\s`]+/)?.[0] ||
    (ev.endsWith('.md') && !/\s/.test(ev) ? ev : null);
  if (!rel) {
    return null;
  }
  const normalized = rel.startsWith('docs/')
    ? rel
    : path.join('docs/flutter-to-rn-lego-migration', rel);
  return path.join(REPO_ROOT, normalized);
}

if (brief.evidence) {
  const abs = resolveEvidenceAbs(brief.evidence);
  if (abs) {
    const rel = path.relative(REPO_ROOT, abs);
    if (!fs.existsSync(abs)) {
      warn(`证据路径尚未落盘: ${rel}`);
    } else {
      ok(`Evidence file present: ${rel}`);
    }
  }
}

// H1: Partial Accept requires Deferred/未证/Partial marker in evidence Record
if (String(brief.acceptMode).toLowerCase() === 'partial') {
  const abs = resolveEvidenceAbs(brief.evidence);
  if (!abs || !fs.existsSync(abs)) {
    errors.push(
      `Accept 模式=Partial：证据 Record 必须存在且含 Deferred/未证/Partial 表或标题。填写「证据」路径并落盘；模板见 ${TEMPLATE_HINT}`,
    );
  } else {
    const content = fs.readFileSync(abs, 'utf8');
    if (!/Deferred|未证|Partial/i.test(content)) {
      errors.push(
        `Accept 模式=Partial：${path.relative(REPO_ROOT, abs)} 须含 Deferred 表或标题（匹配 /Deferred|未证|Partial/i）。见 ${TEMPLATE_HINT}`,
      );
    } else {
      ok('Partial Accept: evidence contains Deferred/未证/Partial marker');
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
