#!/usr/bin/env node
/**
 * 封装 yuque-dl 同步到 YUQUE_DATA_DIR（默认 /Users/mac/Desktop/yuque）
 *
 * npm run yuque:sync          # 同步 .env.local 中配置的单库
 * npm run yuque:sync -- --all # 同步账号下所有知识库
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  META_DIR,
  ensureDirs,
  getRepoConfig,
  getSessionValue,
  getYuqueRoot,
  loadEnvLocal,
  validateYuqueAuth,
} from './lib/env.mjs';

const args = process.argv.slice(2);
const forceFull = args.includes('--full');
const syncAll = args.includes('--all');
const dryRun = args.includes('--dry-run');

function runYuqueDl(cmdArgs) {
  if (dryRun) {
    console.log(`   [dry-run] npx yuque-dl ${cmdArgs.join(' ')}`);
    return 0;
  }
  const result = spawnSync('npx', ['yuque-dl', ...cmdArgs], {
    cwd: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'),
    stdio: 'inherit',
    env: { ...process.env },
  });
  return result.status ?? 1;
}

function appendSyncLog(entry) {
  const syncLogPath = path.join(META_DIR, 'sync-log.json');
  const prev = fs.existsSync(syncLogPath)
    ? JSON.parse(fs.readFileSync(syncLogPath, 'utf8'))
    : { runs: [] };
  prev.runs.push(entry);
  prev.lastSync = new Date().toISOString();
  fs.writeFileSync(syncLogPath, JSON.stringify(prev, null, 2));
}

function main() {
  ensureDirs();
  const env = loadEnvLocal();
  const authError = validateYuqueAuth(env);
  if (authError) {
    console.error(`❌ ${authError}`);
    process.exit(1);
  }
  const sessionValue = getSessionValue(env);

  const yuqueRoot = getYuqueRoot(env);
  fs.mkdirSync(yuqueRoot, { recursive: true });

  if (syncAll) {
    const cmdArgs = ['user', '-d', yuqueRoot, '-t', sessionValue, '--toc'];
    if (!forceFull) cmdArgs.push('--incremental');

    console.log(`📥 同步账号下所有知识库 → ${yuqueRoot}`);
    const status = runYuqueDl(cmdArgs);
    if (status !== 0) {
      console.error('❌ yuque-dl 全量同步失败');
      process.exit(status);
    }
    appendSyncLog({
      at: new Date().toISOString(),
      mode: forceFull ? 'full-all' : 'incremental-all',
      yuqueRoot,
    });
  } else {
    const { repoUrl, book, mirrorDir } = getRepoConfig(env);
    fs.mkdirSync(mirrorDir, { recursive: true });

    const cmdArgs = [repoUrl, '-d', mirrorDir, '-t', sessionValue, '--toc'];
    if (!forceFull) cmdArgs.push('--incremental');

    console.log(`📥 同步知识库: ${repoUrl}`);
    console.log(`   输出目录: ${mirrorDir}`);
    const status = runYuqueDl(cmdArgs);
    if (status !== 0) {
      console.error('❌ yuque-dl 同步失败');
      process.exit(status);
    }
    appendSyncLog({
      at: new Date().toISOString(),
      repoUrl,
      book,
      mode: forceFull ? 'full' : 'incremental',
      mirrorDir,
      yuqueRoot,
    });
  }

  console.log('✅ 同步完成，运行 npm run yuque:inventory 生成清单');
}

main();
