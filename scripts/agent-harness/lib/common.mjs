/**
 * Shared helpers for agent harness (prompt contract + machine checks).
 * @see docs/flutter-to-rn-lego-migration/10-agent-prompt-harness.md
 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execSync} from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, '../../..');

export const HARNESS_DIR = path.join(REPO_ROOT, '.cursor', 'agent-harness');
export const REPORT_PATH = path.join(HARNESS_DIR, 'harness-report.json');
export const ACTIVE_SLICE_PATH = path.join(HARNESS_DIR, 'active-slice.txt');

export const VALID_MANIFEST_STATUSES = new Set([
  'Migrated',
  'Degraded',
  'Placeholder',
  'Deferred',
  'Removed',
]);

export function ensureHarnessDir() {
  fs.mkdirSync(HARNESS_DIR, {recursive: true});
}

export function parseArgs(argv = process.argv.slice(2)) {
  const out = {
    slice: process.env.AGENT_SLICE || null,
    skipVerify: process.env.AGENT_SKIP_VERIFY === '1',
    base: process.env.AGENT_DIFF_BASE || 'HEAD',
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') {
      out.help = true;
    } else if (a === '--slice' || a === '-s') {
      out.slice = argv[++i];
    } else if (a === '--skip-verify') {
      out.skipVerify = true;
    } else if (a === '--base') {
      out.base = argv[++i];
    }
  }
  if (!out.slice && fs.existsSync(ACTIVE_SLICE_PATH)) {
    out.slice = fs.readFileSync(ACTIVE_SLICE_PATH, 'utf8').trim() || null;
  }
  return out;
}

export function resolveSlicePath(sliceArg) {
  if (!sliceArg) {
    return null;
  }
  const abs = path.isAbsolute(sliceArg)
    ? sliceArg
    : path.join(REPO_ROOT, sliceArg);
  return abs;
}

export function setActiveSlice(sliceAbsPath) {
  ensureHarnessDir();
  const rel = path.relative(REPO_ROOT, sliceAbsPath);
  fs.writeFileSync(ACTIVE_SLICE_PATH, `${rel}\n`, 'utf8');
}

/**
 * Parse Slice Brief markdown into structured fields.
 * Accepts both Chinese labels and English aliases.
 */
export function parseBrief(markdown) {
  const text = markdown.replace(/\r\n/g, '\n');
  const lines = text.split('\n');

  const fieldLine = (labels) => {
    for (const label of labels) {
      const re = new RegExp(
        `^[-*]\\s*${escapeRegExp(label)}\\s*[:：]\\s*(.*)$`,
        'i',
      );
      for (const line of lines) {
        const m = line.trim().match(re);
        if (m) {
          return m[1].trim();
        }
      }
    }
    return null;
  };

  const field = (labels) => fieldLine(labels);

  /** Nested bullets under `- Label:` until next top-level `- Key:`. */
  const listField = (labels) => {
    for (const label of labels) {
      const headerRe = new RegExp(
        `^[-*]\\s*${escapeRegExp(label)}\\s*[:：]\\s*(.*)$`,
        'i',
      );
      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        const m = trimmed.match(headerRe);
        if (!m) {
          continue;
        }
        // Require this line itself to be a top-level brief field (no leading indent in source,
        // or inside fence — still OK if it matches after trim).
        const items = [];
        const inline = m[1].trim();
        if (inline && !inline.startsWith('[')) {
          items.push(inline);
        }
        for (let j = i + 1; j < lines.length; j++) {
          const raw = lines[j];
          if (/^\s*$/.test(raw)) {
            continue;
          }
          const t = raw.trim();
          // Next top-level field: `- Name:` / `- Name：`
          if (/^[-*]\s+[^:：]+[:：]/.test(t) && !/^\s/.test(raw)) {
            break;
          }
          // Also break on top-level even if fenced content has no indent variance:
          if (
            /^[-*]\s+[^:：]+[:：]/.test(t) &&
            !raw.startsWith('  ') &&
            !raw.startsWith('\t')
          ) {
            break;
          }
          const nested = raw.match(/^\s+[-*]\s+(.+)$/);
          if (nested) {
            items.push(nested[1].trim());
            continue;
          }
          break;
        }
        return items.filter(Boolean);
      }
    }
    return [];
  };

  const only = field(['本轮 ONLY', 'ONLY', '本轮']);
  const dont = field(["不做", "DON'T", 'Do not']);
  const acceptance = field(['验收', 'Acceptance']);
  const flutterModule = field(['FLUTTER_MODULE', 'Flutter 模块']);
  const rnFeature = field(['RN_FEATURE', 'RN 模块']);
  const evidence = field(['证据', 'Evidence']);
  const modeHint = field(['harness.mode', 'Harness mode', '模式']);

  const whitelist = listField(['文件白名单', 'Whitelist', '白名单']);
  const blacklist = listField(['文件黑名单', 'Blacklist', '黑名单']);
  // H4: prefer 机跑验证; fallback 验证命令 for older slices. Never merge 人证清单.
  const machineVerify = listField(['机跑验证', 'Machine verify']);
  const legacyVerify = listField(['验证命令', 'Verify', '验证']);
  const verifyCommands =
    machineVerify.length > 0 ? machineVerify : legacyVerify;
  const humanEvidence = listField(['人证清单', 'Human evidence', '人证']);
  const acceptModeRaw = field(['Accept 模式', 'Accept mode']);
  const acceptMode = /partial/i.test(acceptModeRaw || '')
    ? 'Partial'
    : 'Full';
  const partialGaps = listField([
    'Partial 时未证项',
    'Partial gaps',
    '未证项',
  ]);

  const isAudit =
    /audit|只读|不改代码|不改业务|差距表/i.test(only || '') ||
    modeHint === 'audit';

  return {
    only,
    dont,
    acceptance,
    flutterModule,
    rnFeature,
    evidence,
    whitelist,
    blacklist,
    verifyCommands,
    humanEvidence,
    acceptMode,
    partialGaps,
    isAudit,
    raw: text,
  };
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function readBriefFile(sliceAbs) {
  if (!sliceAbs || !fs.existsSync(sliceAbs)) {
    throw new Error(`Slice file not found: ${sliceAbs || '(empty)'}`);
  }
  return parseBrief(fs.readFileSync(sliceAbs, 'utf8'));
}

export function gitDiffNames(base = 'HEAD') {
  try {
    const staged = execSync('git diff --cached --name-only', {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    const unstaged = execSync(`git diff --name-only ${base}`, {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    const untracked = execSync('git ls-files --others --exclude-standard', {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    const interesting = (f) =>
      f.startsWith('packages/') ||
      f.startsWith('src/') ||
      f.startsWith('docs/flutter-to-rn-lego-migration/') ||
      f.startsWith('.cursor/hooks') ||
      f.startsWith('scripts/agent-harness/') ||
      f === 'package.json' ||
      f === '.cursor/hooks.json';

    const set = new Set(
      [...staged.split('\n'), ...unstaged.split('\n'), ...untracked.split('\n')]
        .map(s => s.trim())
        .filter(Boolean)
        .filter(interesting),
    );
    return [...set].sort();
  } catch {
    return [];
  }
}

export function loadReport() {
  if (!fs.existsSync(REPORT_PATH)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
}

export function saveReport(report) {
  ensureHarnessDir();
  const next = {
    ...report,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  return next;
}

export function fail(message, details = []) {
  console.error(`✗ ${message}`);
  for (const d of details) {
    console.error(`  - ${d}`);
  }
  process.exitCode = 1;
}

export function ok(message) {
  console.log(`✓ ${message}`);
}

export function warn(message) {
  console.warn(`⚠ ${message}`);
}
