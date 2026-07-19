# Slice — home-b2-audit

> Epic：[../epics/home-b2.md](../epics/home-b2.md)  
> 状态：**Done**（2026-07-19）

```md
## Slice Brief
- FLUTTER_MODULE: home
- RN_FEATURE: @features/home
- Flutter 入口: packages/features/home/lib/home/view/home_page.dart 等
- RN 目标: packages/features/home/src/
- 本轮 ONLY: 完成 Epic home-b2 差距表与 backlog 排序；不改业务 UI（只读审计）
- 不做: music/video/bfui/auth/settings 行为变更；Harmony；支付 SDK；勾选 08
- 验收: epics/home-b2.md 差距表非空；每条映射 08 §B2；backlog 序可执行
- 文件白名单:
  - docs/flutter-to-rn-lego-migration/plans/
- 验证命令:
  - 无
- 证据: docs/flutter-to-rn-lego-migration/plans/epics/home-b2.md
```

## 审计结论摘要

| B2 项 | 快照 |
|-------|------|
| 主区块顺序 | ✅ 与 Flutter 1:1 |
| 三入口可进 | ✅ |
| All Services RoutePath-only | ✅（目录相对 Flutter 多 Gallery/Invite → G1） |
| registry 文件齐全 | ✅ 78/78（配音装饰未接线 → G2） |
| loading/empty/error | ⚠️ 有 load/error；refresh rejected 不写 error → G6 |
| Mini player 不由 home 渲染 | ✅ |

差距 ID：**G1–G8**（详见 Epic）。无 P0 入口断点热修。

## 开工前 10 项

- [x] 08 行：§B2 全表  
- [x] Flutter 路径已在 Epic 差距表补全  
- [x] RN 目标：`packages/features/home`  
- [x] 入口核实  
- [x] ONLY / 不做成对  
- [x] 本刀未写业务降级（G3/G4 留给 evidence）  
- [x] 无 feature→feature 改动  
- [x] 不涉及新二级页 chrome  
- [x] 只读审计  
- [x] 证据：Epic 文档已更新  

## Context Card — home-b2-audit

```md
## Context Card — home-b2-audit
- 已完成: 差距表 G1–G8；B2 六项快照；backlog 重排（visuals 优先）
- 未做/Deferred: 实现刀；08 勾选
- 关键文件: docs/.../plans/epics/home-b2.md ; docs/.../plans/slices/home-b2-audit.md
- 下一 Slice 建议: home-dubbing-visuals（并行可选 all-services-route-audit）
- 已知坑: G1 保留 B8 入口并 note；勿为 1:1 删除 Gallery
```
