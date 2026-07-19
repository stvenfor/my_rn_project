# Slice — c-ux-spotcheck

> Epic：[../epics/c-ux-spotcheck.md](../epics/c-ux-spotcheck.md)  
> 状态：**Done**（2026-07-19）

```md
## Slice Brief
- FLUTTER_MODULE: n/a（抽检对照既有 Flutter 源 + 已 Accept 模块）
- RN_FEATURE: auth/home/community/music/bfui（只读举证）
- 本轮 ONLY: 按 08 §C 五样本做证据矩阵；勾选 §C；写 acceptance-record；更新 Program/changes；不改业务 UI
- 不做: 新截图拍摄入库（Deferred）；改 feature 代码；§D 三端 smoke；清 lint
- 验收: record 含五样本×§C 项映射；08 §C ✅；agent:post 绿
- 文件白名单:
  - docs/flutter-to-rn-lego-migration/
  - .harness/changes/
- 验证命令:
  - npx jest packages/features/auth/src/__tests__/LoginScreen.test.tsx packages/features/home/src/__tests__/HomeScreens.test.tsx --no-coverage
- 证据: docs/flutter-to-rn-lego-migration/acceptance-records/2026-07-19-c-ux-spotcheck.md
```

## Context Card — c-ux-spotcheck

```md
## Context Card — c-ux-spotcheck
- 已完成: 五样本矩阵；08 §C ✅；Program 队首→可选 D
- 未做/Deferred: 真机截图入库
- 关键文件: acceptance-records/2026-07-19-c-ux-spotcheck.md ; 08 ; plans/*
- harness: pre/post ok
- 下一 Slice 建议: d-smoke（可选）或停
- 已知坑: 无截图文件时 §E 仍可能 ☐
```
