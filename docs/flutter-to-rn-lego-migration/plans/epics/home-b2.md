# Epic Plan — B2 `@features/home`

| 项 | 内容 |
|----|------|
| Checklist | [`08` §B2](../08-acceptance-checklist.md) |
| Flutter | `/Users/mac/Desktop/github/my_ai_project/packages/features/home/` |
| RN | `packages/features/home/` |
| Program | [2026-07-19-program.md](../2026-07-19-program.md) |
| 状态 | **Accept ✅**（2026-07-19） |

## Epic DoD

- [x] 08 §B2 全部 ✅，证据列有路径  
- [x] `acceptance-records/2026-07-19-home-b2.md`  
- [x] manifest 中 home 相关条目 status/note 诚实  
- [x] 相关 jest 绿；无新增 feature→feature  
- [x] All Services 跳转仅 `RoutePath`（不 import bfui/music/video）

## 08 §B2 映射

| 项 | Slice | 结果 | 证据 |
|----|-------|------|------|
| HomeTab 主区块顺序 1:1 | `home-tab-blocks` | ✅ | `RoutePath.communityTab` |
| Learning Report / Check-in / All Services | `home-secondary-routes` | ✅ | 注册 + 入口 |
| All Services 仅 RoutePath | `all-services-route-audit` | ✅ | `allServicesRoutes.test.ts` |
| 首页资源 registry | `home-dubbing-visuals` + registry | ✅ | 78/78 + 装饰接线 |
| loading / empty / error | `home-states` | ✅ | refresh rejected 写 error |
| Mini player 不由 home 渲染 | `home-miniplayer-boundary` | ✅ | shell + inset |

## 审计差距表（关闭状态）

| ID | 处理 |
|----|------|
| G1 | 保留 Gallery/Invite + manifest note |
| G2 | 装饰图接线；余量见 DEGRADE 文档 |
| G3/G4 | manifest notes |
| G5 | 形态差仅 note（页内 spinner） |
| G6 | refresh rejected → error |
| G7 | 可选未用资源，不挡 Accept |
| G8 | `RoutePath.communityTab` |

## Slice backlog

| 序 | Slice ID | 状态 |
|----|----------|------|
| 0 | `home-b2-audit` | ✅ |
| 1 | `all-services-route-audit` | ✅ |
| 2 | `home-dubbing-visuals` | ✅ |
| 3 | `home-tab-blocks` | ✅（CommunityTab→RoutePath） |
| 4 | `home-secondary-routes` | ✅（审计已可进，无额外改动） |
| 5 | `home-states` | ✅ |
| 6 | `home-miniplayer-boundary` | ✅（审计确认） |
| 7 | `home-b2-evidence` | ✅ |

## Context Card — home-b2

```md
## Context Card — home-b2
- 已完成: B2 全切片 + 08 勾选 + acceptance record
- 进行中 Slice: （无）
- 未做/Deferred: DEGRADE-home-dubbing-visuals 所列布局/文案
- 关键路径: packages/features/home/** ; plans/epics/home-b2.md ; acceptance-records/2026-07-19-home-b2.md
- 下一 Epic 建议: B1 auth（Program 队列）
- 已知坑: Club 已改 RoutePath；Gallery 为 RN 增量
```

## 变更记录

| 日期 | 变更 |
|------|------|
| 2026-07-19 | audit → 并行 visuals + all-services → 收口 evidence；Epic Accept |
