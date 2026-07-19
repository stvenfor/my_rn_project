# Slice — all-services-route-audit

> Epic：[../epics/home-b2.md](../epics/home-b2.md)  
> 状态：**Done**（2026-07-19）

```md
## Slice Brief
- FLUTTER_MODULE: home
- RN_FEATURE: @features/home
- Flutter 入口: packages/features/home/lib/.../all_services_data.dart
- RN 目标: packages/features/home/src/data/allServicesData.ts ; HomeAllServicesScreen.tsx
- 本轮 ONLY: 复核全部跳转仅 RoutePath；G1 决策落地——保留 BFUI Gallery/Invite，并准备给 evidence 的 note 文案（本刀可不改 manifest，只在 Epic/本 Slice 记下）
- 不做: 删除 Gallery 入口；改 bfui/music/video 包；勾 08
- 验收: openService 全部分支可解释；无 @features/* import；G1 决策写进 Epic Context
- 文件白名单:
  - packages/features/home/src/data/allServicesData.ts
  - packages/features/home/src/screens/HomeAllServicesScreen.tsx
  - packages/features/home/src/__tests__/**
  - docs/.../plans/epics/home-b2.md（G1 决策句）
- 验证命令: npx jest packages/features/home --no-coverage
- 证据: 命令摘要 + G1 决策一句话
```

## Context Card（完成后填）

```md
## Context Card — all-services-route-audit
- 已完成: RoutePath-only 复核（`allServicesData.ts` / `HomeAllServicesScreen.tsx` 无 `@features/*`）；G1 决策保留 BFUI Gallery + Invite Friend；`allServicesRoutes.test.ts` 新增；Epic G1 决策句 + evidence note 文案
- 未做/Deferred: manifest `home-all-services` note（G4，仅 `home-b2-evidence`）；08 §B2 勾选（evidence 刀）
- 关键文件: `packages/features/home/src/data/allServicesData.ts`, `HomeAllServicesScreen.tsx`, `__tests__/allServicesRoutes.test.ts`
- 下一 Slice 建议: `home-dubbing-visuals`（P0 配音视觉）或并行 `home-tab-blocks`
- 已知坑: openService 对 bfuiTemplate 走 templateId 分支、其余走 RoutePath switch；无缺失分支；RN 其他服务比 Flutter 多 2 项为 intentional delta
```
