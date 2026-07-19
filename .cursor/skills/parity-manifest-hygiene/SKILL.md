---
name: parity-manifest-hygiene
description: >-
  Keep page-resource-parity-manifest.ts honest when adding or changing pages
  or assets: status enums, Degraded notes, silent-missing audit, check-manifest.
  Use when migrating screens, registering routes, syncing Flutter assets, or
  closing B10-style inventory gaps.
---

# Parity Manifest Hygiene

## When

- 新增 / 改动业务页、路由、资源 registry
- 改 `page-resource-parity-manifest.ts`
- B10 / silent-missing 审计；声称 Migrated / Accept 前自检

## 真相源

| 角色 | 路径 |
|------|------|
| 机读 | `docs/flutter-to-rn-lego-migration/page-resource-parity-manifest.ts` |
| 人读验收 | `docs/flutter-to-rn-lego-migration/08-acceptance-checklist.md` |
| 机检 | `npm run agent:check-manifest`（pre/post 内也会跑） |

Harness **不另起**第三套验收标准。

## Status enums（仅此五态）

`Migrated` | `Degraded` | `Placeholder` | `Deferred` | `Removed`

| 规则 | 说明 |
|------|------|
| 能进路由 ≠ Migrated | 占位 / 缺资源 / 未 1:1 → 勿标 Migrated |
| note 必填 | `Degraded` / `Placeholder` / `Deferred` **必须**有 `note` |
| Removed | 明示删除（如 `auth-dev-home`）；勿静默漏登记 |
| 未更新 manifest | **视为未完成** |

短规则副本：`.harness/rules/status-enums.md`。

## 决策树（改页 / 资源时）

```text
页/资源是否在 Flutter 源仍存在？
  ├─ 否 → Removed + note（或确认本就不迁）
  └─ 是 → RN 是否可路由且 1:1？
        ├─ 是 → Migrated
        ├─ 可进但有已知差距 → Degraded + note（差距一句）
        ├─ 壳/占位 → Placeholder + note
        └─ 本 Slice 不做 → Deferred + note（指向 Epic/Slice）
```

## Silent-missing 审计（思路）

**静默消失** = Flutter 业务 `*_page.dart`（或约定资源）在源仓存在，但 manifest **无对应条目**。

建议步骤（只读审计 Slice 可用）：

1. 列源仓 Flutter `packages/features/**/view/*_page.dart`（或本仓约定范围）。
2. 对照 manifest 每条 `flutterPath` / id。
3. 缺口 → 登记（合法 status + note），**禁止**长期 silent。
4. 机跑：`npx jest src/__tests__/pageParity.test.ts src/__tests__/assetParity.test.ts --no-coverage`

基线样例：`acceptance-records/2026-07-19-b10-inventory.md`。

## 改动清单（Do）

1. 实现页/资源的同一 PR/Slice 内更新 manifest。
2. 跑 `npm run agent:check-manifest`（或完整 `agent:post`）。
3. 若只改业务未改 manifest → post 可能 skip 扫描，**审查仍应拒绝**「未登记」。

## Don't

- 假 Migrated / 无 note 的 Degraded
- 用单测绿代替 manifest 登记
- 把临时差距表当长期真相源（差距进 `note` 或 Epic）

## Refs

| 资源 | 路径 |
|------|------|
| Manifest | `docs/flutter-to-rn-lego-migration/page-resource-parity-manifest.ts` |
| check-manifest | `scripts/agent-harness/check-manifest.mjs` |
| 栈入口 | `.cursor/skills/flutter-to-rn-lego-module/SKILL.md` |
