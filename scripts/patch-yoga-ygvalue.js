#!/usr/bin/env node
/**
 * Clang 18+ warns on Yoga's deprecated user-defined literal syntax:
 *   operator"" _pt  →  operator""_pt
 * RN 0.72 bundles the old form in ReactCommon/yoga; Harmony copies it via oh_modules.
 */
const fs = require('fs');
const path = require('path');

const YGVALUE_REL = path.join('ReactCommon', 'yoga', 'yoga', 'YGValue.h');

function patchYgValue(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const patched = content
    .replace(/operator"" _pt/g, 'operator""_pt')
    .replace(/operator"" _percent/g, 'operator""_percent');

  if (patched === content) {
    return false;
  }

  fs.writeFileSync(filePath, patched);
  console.log(`[patch-yoga] YGValue.h literal operators → ${filePath}`);
  return true;
}

function findYgValueFiles(rootDir) {
  const results = [];
  if (!fs.existsSync(rootDir)) {
    return results;
  }

  const stack = [rootDir];
  while (stack.length > 0) {
    const dir = stack.pop();
    for (const ent of fs.readdirSync(dir, {withFileTypes: true})) {
      const fullPath = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        stack.push(fullPath);
      } else if (ent.name === 'YGValue.h' && fullPath.includes('yoga')) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

const root = path.join(__dirname, '..');
const targets = new Set([
  path.join(root, 'node_modules', 'react-native', YGVALUE_REL),
  ...findYgValueFiles(path.join(root, 'harmony', 'oh_modules')),
]);

let patchedCount = 0;
for (const filePath of targets) {
  if (patchYgValue(filePath)) {
    patchedCount += 1;
  }
}

if (patchedCount === 0) {
  process.exit(0);
}
