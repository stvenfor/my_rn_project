#!/usr/bin/env node
/**
 * afterFileEdit — soft reminder when editing feature packages.
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
const file =
  input.file_path ||
  input.filePath ||
  input.path ||
  input.uri ||
  '';

const out = {};
if (/packages\/features\//.test(String(file))) {
  out.additional_context = [
    `Edited feature file: ${file}`,
    'Remember: no @features/* cross-imports; stay inside Slice whitelist; run agent:post before Accept.',
  ].join('\n');
}

process.stdout.write(JSON.stringify(out));
