# Slice — home-b2-audit

> Epic：[../epics/home-b2.md](../epics/home-b2.md)  
> 状态：Ready（下一执行刀）

```md
## Slice Brief
- FLUTTER_MODULE: home
- RN_FEATURE: @features/home
- Flutter 入口: packages/features/home/lib/（审计时列具体 page）
- RN 目标: packages/features/home/src/
- 本轮 ONLY: 完成 Epic home-b2 差距表与 backlog 排序；默认不改业务 UI（除非发现阻塞审计的 P0 入口断点并在实现前更新本 Brief）
- 不做: music/video/bfui/auth/settings 行为变更；Harmony 专项；支付 SDK；勾选 08（留给 home-b2-evidence）
- 验收: epics/home-b2.md 差距表非空；每条映射 08 §B2；backlog 序可执行
- 文件白名单:
  - docs/flutter-to-rn-lego-migration/plans/epics/home-b2.md
  - docs/flutter-to-rn-lego-migration/plans/slices/home-b2-audit.md
- 文件黑名单:
  - packages/features/music（只读除外）
  - packages/features/video
  - packages/features/bfui
- 验证命令: 只读审计；若有入口热修则 `npx jest packages/features/home --no-coverage`
- 证据: home-b2.md diff（差距表 + backlog）
- 工具: flutter-to-rn-lego-module skill；Codegraph/搜索定位 Flutter home 路由与页
```

## 开工前 10 项

- [x] 08 行：§B2 全表（审计映射）  
- [ ] Flutter 路径在审计中补全  
- [x] RN 目标：`packages/features/home`  
- [x] 入口：HomeTab + All Services 等（审计核实）  
- [x] ONLY / 不做成对  
- [x] 本刀不写降级 note（除非发现假 Migrated）  
- [x] 无 feature→feature 改动  
- [x] 不涉及新二级页 chrome  
- [x] 验证命令已写  
- [x] 证据：更新 Epic 文档  

## Context Card（完成后填）

```md
## Context Card — home-b2-audit
- 已完成:
- 未做/Deferred:
- 关键文件:
- 下一 Slice 建议:
- 已知坑:
```
