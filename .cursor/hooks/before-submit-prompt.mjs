#!/usr/bin/env node
/**
 * beforeSubmitPrompt — remind when migration work is requested without harness mention.
 * Never blocks (fail-open); injects agent_message only.
 */
import fs from 'node:fs';

function readStdin() {
  try {
    return JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
  } catch {
    return {};
  }
}

const input = readStdin();
const prompt = String(
  input.prompt ?? input.user_prompt ?? input.text ?? input.message ?? '',
);

const looksLikeMigration =
  /\b(B\d+|Slice|Epic|08|manifest|Migrated|@features\/|迁移|验收|Accept)\b/i.test(
    prompt,
  );
const mentionsHarness =
  /agent:pre|agent:post|harness|10-agent-prompt-harness|plans\/slices\//i.test(
    prompt,
  );

const out = {continue: true};

if (looksLikeMigration && !mentionsHarness && prompt.length > 12) {
  out.agent_message = [
    'Harness reminder: prefer a landed Slice Brief + `npm run agent:pre -- --slice <path>` before coding;',
    'finish with `npm run agent:post`. See docs/flutter-to-rn-lego-migration/10-agent-prompt-harness.md',
  ].join(' ');
  out.user_message =
    '提示：迁移任务建议先落盘 Slice Brief 并跑 agent:pre / agent:post（见 10-agent-prompt-harness.md）。';
}

process.stdout.write(JSON.stringify(out));
