# Slice — a-gates-policy

> Epic：[../epics/a-gates-policy.md](../epics/a-gates-policy.md)  
> 状态：**Done**（2026-07-19）

```md
## Slice Brief
- FLUTTER_MODULE: n/a
- RN_FEATURE: app shell / docs
- 本轮 ONLY: 落盘 A 门禁政策；修复全仓 typecheck 唯一错误（Mine logout reset 类型）；诚实勾选 08 §A 可证项；写 acceptance-record
- 不做: 清全仓 40+ lint error（Deferred M2）；Harmony/三端 smoke；改业务 feature UI；假勾 lint 全绿
- 验收: typecheck 绿；政策写入 Epic；08 §A 与 record 一致；agent:post 绿
- 文件白名单:
  - docs/flutter-to-rn-lego-migration/
  - .harness/changes/
  - src/screens/SettingsWrappers.tsx
- 验证命令:
  - npm run typecheck
  - npx jest src/__tests__/pageParity.test.ts src/__tests__/assetParity.test.ts src/navigation/__tests__/routeRegistration.test.ts --no-coverage
  - npm run agent:check-boundary
- 证据: docs/flutter-to-rn-lego-migration/acceptance-records/2026-07-19-a-gates.md
```

## Context Card — a-gates-policy

```md
## Context Card — a-gates-policy
- 已完成: A 政策；typecheck 绿；08 §A 条件勾选；SettingsWrappers root reset；record
- 未做/Deferred: 全仓 lint；token 抽检；§D
- 关键文件: SettingsWrappers.tsx ; 08 ; a-gates*.md ; program
- harness: pre/post ok
- 下一 Slice 建议: c-ux-spotcheck
- 已知坑: lint 基线 ~40 error，勿假勾全绿
```
