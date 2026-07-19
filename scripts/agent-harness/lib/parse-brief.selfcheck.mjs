#!/usr/bin/env node
/**
 * Tiny unit-like self-check for parseBrief (H4 / §4.4 fields).
 * Run: node scripts/agent-harness/lib/parse-brief.selfcheck.mjs
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseBrief, REPO_ROOT} from './common.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1) New fields: 机跑验证 preferred; 人证清单 excluded from verifyCommands
const modern = parseBrief(`
## Slice Brief
- 本轮 ONLY: one page
- 不做: nothing
- 验收: 08
- 机跑验证:
  - npx jest packages/features/home --no-coverage
- 人证清单:
  - shots/a.png
  - npm run ios
- Accept 模式: Partial
- Partial 时未证项:
  - Login success
- 证据: docs/flutter-to-rn-lego-migration/acceptance-records/x.md
`);
assert.deepEqual(modern.verifyCommands, [
  'npx jest packages/features/home --no-coverage',
]);
assert.deepEqual(modern.humanEvidence, ['shots/a.png', 'npm run ios']);
assert.equal(modern.acceptMode, 'Partial');
assert.deepEqual(modern.partialGaps, ['Login success']);
assert.ok(!modern.verifyCommands.includes('npm run ios'));

// 2) Legacy-only 验证命令 still works (backward compatible)
const legacy = parseBrief(`
- 本轮 ONLY: legacy
- 不做: x
- 验收: y
- 验证命令:
  - npm run typecheck
`);
assert.deepEqual(legacy.verifyCommands, ['npm run typecheck']);
assert.equal(legacy.acceptMode, 'Full');
assert.deepEqual(legacy.humanEvidence, []);

// 3) Prefer 机跑验证 when both present
const both = parseBrief(`
- 机跑验证:
  - echo machine
- 验证命令:
  - echo legacy
`);
assert.deepEqual(both.verifyCommands, ['echo machine']);

// 4) Existing slice file (legacy 验证命令) still parses
const slicePath = path.join(
  REPO_ROOT,
  'docs/flutter-to-rn-lego-migration/plans/slices/m2-device-smoke-ios.md',
);
if (fs.existsSync(slicePath)) {
  const fromFile = parseBrief(fs.readFileSync(slicePath, 'utf8'));
  assert.ok(
    fromFile.verifyCommands.includes('npm run typecheck'),
    'existing slice 验证命令 should populate verifyCommands',
  );
  assert.equal(fromFile.acceptMode, 'Full');
}

console.log('✓ parse-brief.selfcheck OK');
console.log(`  (selfcheck dir: ${__dirname})`);
