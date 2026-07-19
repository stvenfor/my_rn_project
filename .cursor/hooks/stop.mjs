#!/usr/bin/env node
/**
 * stop — if active slice exists but post not green, ask for one follow-up.
 */
import fs from 'node:fs';
import path from 'node:path';

function readStdin() {
  try {
    return JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
  } catch {
    return {};
  }
}

readStdin();

const root = process.cwd();
const activePath = path.join(root, '.cursor/agent-harness/active-slice.txt');
const reportPath = path.join(root, '.cursor/agent-harness/harness-report.json');

const out = {};

if (fs.existsSync(activePath)) {
  const slice = fs.readFileSync(activePath, 'utf8').trim();
  let postOk = false;
  if (fs.existsSync(reportPath)) {
    try {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      postOk = Boolean(report?.post?.ok);
    } catch {
      postOk = false;
    }
  }
  if (slice && !postOk) {
    out.followup_message = [
      `Active slice \`${slice}\` has no green agent:post yet.`,
      'If this turn finished implementation, run `npm run agent:post` and fill Context Card;',
      'if still auditing/planning only, say so and clear or keep the slice.',
      'Do not tick 08 or ask to commit until harness post passes (unless human overrides).',
    ].join(' ');
  }
}

process.stdout.write(JSON.stringify(out));
