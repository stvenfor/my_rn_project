# Epic Plan — B2 `@features/home`

| 项 | 内容 |
|----|------|
| Checklist | [`08` §B2](../08-acceptance-checklist.md) |
| Flutter | `/Users/mac/Desktop/github/my_ai_project/packages/features/home/` |
| RN | `packages/features/home/` |
| Program | [2026-07-19-program.md](../2026-07-19-program.md) |
| 状态 | **In progress — 待审计填差距** |

## Epic DoD

- [ ] 08 §B2 全部 ✅，证据列有路径  
- [ ] `acceptance-records/YYYY-MM-DD-home-b2.md`  
- [ ] manifest 中 home 相关条目 status/note 诚实  
- [ ] 相关 jest 绿；无新增 feature→feature  
- [ ] All Services 跳转仅 `RoutePath`（不 import bfui/music/video）

## 08 §B2 映射（勾选时回填证据）

| 项 | Slice（计划） | 结果 | 证据 |
|----|---------------|------|------|
| HomeTab 主区块顺序 1:1 | `home-tab-blocks` | ☐ | |
| Learning Report / Check-in Mall / All Services 可进入 | `home-secondary-routes` | ☐ | |
| All Services 跳转仅用 RoutePath | `all-services-route-audit` | ☐ | |
| 首页资源 registry 齐全 | `home-assets-registry` | ☐ | |
| loading / empty / error（若 Flutter 有） | `home-states` | ☐ | |
| Mini player 不由 home 渲染 | `home-miniplayer-boundary` | ☐ | |

## 审计差距表（Slice `home-b2-audit` 填写）

> 先只读对照 Flutter ↔ RN，再改 backlog 顺序。空表 = Epic 尚未可执行实现刀。

| ID | 缺口 | P0? | 类型 | 建议 Slice | Flutter 路径 | RN 路径 |
|----|------|-----|------|------------|--------------|---------|
| | | | 入口/资源/交互/stub | | | |

类型枚举：`入口` · `资源` · `交互` · `stub` · `note修正`

## Slice backlog（有序）

| 序 | Slice ID | ONLY（一句话） | 依赖 | 并行 |
|----|----------|----------------|------|------|
| 0 | `home-b2-audit` | 填满上方差距表 + 确认 backlog | — | — |
| 1 | `home-tab-blocks` | HomeTab 主区块顺序 1:1 | 0 | |
| 2 | `all-services-route-audit` | 宫格跳转仅 RoutePath + 入口可达 | 0 | 与 1 文件不冲突时可 \|\| |
| 3 | `home-secondary-routes` | Learning Report / Check-in / All Services 可进 | 0 | |
| 4 | `home-assets-registry` | all_services 等 registry 齐全 | 0 | |
| 5 | `home-states` | Flutter 有则补 loading/empty/error | 1 | |
| 6 | `home-miniplayer-boundary` | 确认 mini player 不由 home 渲染 + inset | 1 | 勿改 music 播放逻辑 |
| 7 | `home-b2-evidence` | Record + 勾 08 §B2 | 1–6 | 独占写 08/manifest |

具体 Brief：复制 [../slices/_template.md](../slices/_template.md) → `slices/home-*.md`，或会话内粘贴。

### 建议首刀 Brief（audit）

```md
## Slice Brief
- FLUTTER_MODULE: home
- RN_FEATURE: @features/home
- Flutter 入口: packages/features/home/lib/（审计时列具体 page）
- RN 目标: packages/features/home/src/
- 本轮 ONLY: 完成 Epic home-b2 差距表与 backlog 排序；不改业务 UI（除非发现阻塞审计的 P0 入口断点并在 Brief 中单列）
- 不做: music/video/bfui 行为变更；Harmony 专项；支付 SDK；扩大到 auth/settings
- 验收: epics/home-b2.md 差距表非空且每条映射 08 §B2；backlog 序可执行
- 文件白名单: docs/flutter-to-rn-lego-migration/plans/epics/home-b2.md ；必要时只读 packages/features/home、my_ai_project home
- 文件黑名单: packages/features/music、video、bfui（只读除外）
- 验证命令: 只读；若有入口热修则 npx jest packages/features/home --no-coverage
- 证据: 本 Epic 文档更新 diff
```

## 共享文件锁

| 文件 | 策略 |
|------|------|
| `HomeScreen.tsx` 及主 Tab 区块组件 | `home-tab-blocks` 独占期 |
| `allServicesData.ts` / `HomeAllServicesScreen.tsx` | `all-services-*` 独占期 |
| `homeAssets.ts` | `home-assets-registry` 独占期 |
| `page-resource-parity-manifest.ts` / `08-acceptance-checklist.md` | 仅 `home-b2-evidence` 写；中途 note 小改需串行 |

## 已知约束 / 风险

- Mini player：shell slot + home inset；改 inset 时回归 music  
- All Services 已含 BFUI Gallery / PayMembership 等——只验跳转边界，不改目标 feature  
- 与 B1 auth 的登录门禁相关用例留给 auth Epic，home 只保证未登录行为与 Flutter 一致（若有）

## Context Card（Epic 进行中更新）

```md
## Context Card — home-b2
- 已完成:
- 进行中 Slice:
- 未做/Deferred:
- 关键路径:
- 下一 Slice:
- 已知坑:
```

## 变更记录

| 日期 | 变更 |
|------|------|
| 2026-07-19 | 初版 backlog；待 `home-b2-audit` 填差距表 |
