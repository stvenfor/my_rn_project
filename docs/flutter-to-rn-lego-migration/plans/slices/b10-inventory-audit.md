# Slice — b10-inventory-audit

> Epic：[../epics/b10-inventory.md](../epics/b10-inventory.md)  
> 状态：**Done**（2026-07-19）

```md
## Slice Brief
- FLUTTER_MODULE: (inventory — all features)
- RN_FEATURE: (manifest + packages/features)
- Flutter 入口: /Users/mac/Desktop/github/my_ai_project/packages/features/**/view/*_page.dart
- RN 目标: docs/flutter-to-rn-lego-migration/page-resource-parity-manifest.ts
- 本轮 ONLY: 只读审计 — 对比 Flutter 业务页与 manifest；更新 Epic 差距表与 backlog；不改业务代码、不勾 08
- 不做: 实现缺失页；Harmony；支付 SDK；改 packages/features 业务逻辑；勾选 08 §B10
- 验收: epics/b10-inventory.md 差距表非空或明确「零静默」；每条可映射 08 §B10；backlog 可执行
- 文件白名单:
  - docs/flutter-to-rn-lego-migration/plans/
  - docs/flutter-to-rn-lego-migration/10-agent-prompt-harness.md
- 验证命令:
  - 无
- 证据: docs/flutter-to-rn-lego-migration/plans/epics/b10-inventory.md
- 工具: migration-os-harness；对照 Flutter packages/features 与 manifest
```

## 审计结论摘要

- Flutter `*_page.dart`：**51/51** 已在 manifest，**零静默**  
- classroom：8/8 已登记（Migrated/Degraded），非 Deferred/Removed  
- Soft：`bfui/home_screen.dart` 未单列（Low）  
- 详见 Epic 差距表 G1–G3  

## 开工前 10 项

- [x] 08 行：§B10  
- [x] Flutter 路径：features/*/view  
- [x] RN：manifest  
- [x] 入口：审计-only  
- [x] ONLY / 不做成对  
- [x] 本刀不写业务降级实现  
- [x] 无 feature→feature 改动  
- [x] 不涉及二级页 chrome  
- [x] 验证命令：无 / 只读  
- [x] `npm run agent:pre` 绿  

## Context Card — b10-inventory-audit

```md
## Context Card — b10-inventory-audit
- 已完成: 51/51 对账；Epic G1–G3；零静默结论
- 未做/Deferred: 勾 08；acceptance-record；可选 bfui-home 登记
- 关键文件: plans/epics/b10-inventory.md ; plans/slices/b10-inventory-audit.md
- harness: agent:pre ok；待 agent:post
- 下一 Slice 建议: b10-evidence
- 已知坑: 08 §B10 第一行文案与 classroom 现状不符（G1）
```
