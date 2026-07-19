#!/usr/bin/env node
/**
 * sessionStart — inject L0 harness reminder into agent context.
 */
import fs from 'node:fs';
import path from 'node:path';

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '{}';
  }
}

readStdin();

const activePath = path.join(
  process.cwd(),
  '.cursor/agent-harness/active-slice.txt',
);
let active = '(none — set with npm run agent:pre -- --slice <path>)';
if (fs.existsSync(activePath)) {
  active = fs.readFileSync(activePath, 'utf8').trim() || active;
}

const additional_context = [
  '## Agent harness (this repo)',
  '- Contract: Slice Brief must be a file under docs/flutter-to-rn-lego-migration/plans/slices/',
  '- Before implement: `npm run agent:pre -- --slice <slice.md>`',
  '- After implement: `npm run agent:post` (uses active slice)',
  '- Spec: docs/flutter-to-rn-lego-migration/10-agent-prompt-harness.md',
  `- Active slice: ${active}`,
  '- Do not tick 08 or claim Accept if agent:post failed.',
  '- Commit/push only when the human explicitly asks.',
].join('\n');

process.stdout.write(JSON.stringify({additional_context}));
