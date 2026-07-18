import fs from 'fs';
import path from 'path';
import {
  META_DIR,
  REPORTS_DIR,
  ensureDirs,
  getRepoConfig,
  getYuqueRoot,
  loadEnvLocal,
} from './lib/env.mjs';
import { getDoc, sleep, updateDoc } from './lib/yuque-api.mjs';

const YUQUE_CLI = process.env.YUQUE_CLI_PATH || `${process.env.HOME}/.local/bin/yuque`;

function loadInventory() {
  const inventoryPath = path.join(META_DIR, 'inventory.json');
  if (!fs.existsSync(inventoryPath)) {
    throw new Error('未找到 inventory.json，请先运行 npm run yuque:inventory');
  }
  return JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
}

function loadChangedDocs() {
  const summaryPath = path.join(REPORTS_DIR, 'diff-summary.json');
  if (fs.existsSync(summaryPath)) {
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
    return new Set(summary.changes.map(c => c.rel_path));
  }
  return null;
}

function stripYuqueFooter(content) {
  const footerMarkers = [
    /\n---\n+\s*>\s*本文档(?:永久)?链接/,
    /\n>\s*作者：/,
    /\n>\s*链接：\s*https:\/\/www\.yuque\.com\//,
  ];
  let result = content;
  for (const marker of footerMarkers) {
    const idx = result.search(marker);
    if (idx !== -1) {
      result = result.slice(0, idx).trimEnd();
    }
  }
  return result;
}

async function pushOne({ yuqueRoot, doc, dryRun, useCli, defaultGroup }) {
  const absPath = path.join(yuqueRoot, doc.rel_path);
  const group = doc.group || defaultGroup;
  const book = doc.book;
  if (!fs.existsSync(absPath)) {
    return { slug: doc.slug, status: 'skipped', reason: '本地文件不存在' };
  }

  if (!doc.slug) {
    return { slug: null, status: 'skipped', reason: '缺少 slug' };
  }

  if (dryRun) {
    return { slug: doc.slug, status: 'dry-run', rel_path: doc.rel_path };
  }

  const body = stripYuqueFooter(fs.readFileSync(absPath, 'utf8'));
  const metaPath = absPath.replace(/\.md$/, '.meta.json');

  const remote = await getDoc(group, book, doc.slug);
  if (!remote.ok) {
    return {
      slug: doc.slug,
      status: 'failed',
      reason: `获取远程文档失败 HTTP ${remote.status}`,
    };
  }

  const remoteDoc = remote.data?.data;
  const remoteUpdatedAt = remoteDoc?.updated_at;

  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    if (meta.remote_updated_at && meta.remote_updated_at !== remoteUpdatedAt) {
      return {
        slug: doc.slug,
        status: 'conflict',
        reason: '云端已被他人修改，跳过写回',
        remote_updated_at: remoteUpdatedAt,
        local_snapshot: meta.remote_updated_at,
      };
    }
  }

  if (useCli && fs.existsSync(YUQUE_CLI)) {
    const { spawnSync } = await import('child_process');
    const target = `${group}/${book}/${doc.slug}`;
    const pushResult = spawnSync(
      YUQUE_CLI,
      ['doc', 'update', target, '-F', absPath],
      { encoding: 'utf8' },
    );
    if (pushResult.status !== 0) {
      return {
        slug: doc.slug,
        status: 'failed',
        reason: pushResult.stderr || pushResult.stdout || 'yuque-cli 失败',
      };
    }
  } else {
    const res = await updateDoc(group, book, doc.slug, body);
    if (!res.ok) {
      return {
        slug: doc.slug,
        status: 'failed',
        reason: `写回失败 HTTP ${res.status}: ${JSON.stringify(res.data)?.slice(0, 200)}`,
      };
    }
  }

  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    meta.remote_updated_at = remoteUpdatedAt;
    meta.last_pushed_at = new Date().toISOString();
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
  }

  return { slug: doc.slug, status: 'pushed', rel_path: doc.rel_path };
}

async function main() {
  ensureDirs();
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const useCli = args.includes('--use-cli');
  const folderFilter = args.find(a => a.startsWith('--folder='))?.split('=')[1];

  const env = loadEnvLocal();
  const { group: defaultGroup } = getRepoConfig(env);
  const yuqueRoot = getYuqueRoot(env);
  const { documents } = loadInventory();
  const changedSet = loadChangedDocs();

  let targets = documents.filter(d => d.optimizable && d.slug);
  if (folderFilter) {
    targets = targets.filter(
      d =>
        d.folder_path === folderFilter ||
        d.folder_path === folderFilter.replace(/^\//, ''),
    );
  }
  if (changedSet) {
    targets = targets.filter(d => changedSet.has(d.rel_path));
  }

  console.log(`📤 写回目标: ${targets.length} 篇 (${dryRun ? 'dry-run' : 'live'})`);

  const results = [];
  for (const doc of targets) {
    const result = await pushOne({ yuqueRoot, doc, dryRun, useCli, defaultGroup });
    results.push(result);
    const icon =
      result.status === 'pushed' || result.status === 'dry-run'
        ? '✅'
        : result.status === 'conflict'
          ? '⚠️'
          : result.status === 'skipped'
            ? '⏭️'
            : '❌';
    console.log(
      `${icon} ${doc.rel_path} — ${result.status}${result.reason ? `: ${result.reason}` : ''}`,
    );
    if (!dryRun) {
      await sleep(220);
    }
  }

  const logPath = path.join(META_DIR, 'push-log.json');
  const prev = fs.existsSync(logPath)
    ? JSON.parse(fs.readFileSync(logPath, 'utf8'))
    : { runs: [] };
  prev.runs.push({
    at: new Date().toISOString(),
    dry_run: dryRun,
    folder_filter: folderFilter || null,
    total: targets.length,
    pushed: results.filter(r => r.status === 'pushed').length,
    failed: results.filter(r => r.status === 'failed').length,
    conflicts: results.filter(r => r.status === 'conflict').length,
    results,
  });
  fs.writeFileSync(logPath, JSON.stringify(prev, null, 2));

  const failed = results.filter(r => r.status === 'failed').length;
  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error(`❌ ${err.message}`);
  process.exit(1);
});
