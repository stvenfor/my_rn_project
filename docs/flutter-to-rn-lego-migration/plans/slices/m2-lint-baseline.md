# Slice — m2-lint-baseline

> Epic：[../epics/m2-lint-debt.md](../epics/m2-lint-debt.md)  
> Program：[../2026-07-19-m2-program.md](../2026-07-19-m2-program.md)  
> 状态：**Ready**（docs-only 审计）

```md
## Slice Brief
- FLUTTER_MODULE: n/a
- RN_FEATURE: n/a（全仓 lint 基线）
- 本轮 ONLY: 跑 npm run lint 刷新基线数字；写 acceptance-record；不改业务代码
- 不做: 清债修 error；关 ESLint 规则；改 packages/features 业务；真机 smoke；假勾 08 §A1 全仓零 error
- 验收: Record 含 approx error/warning 计数；与 a-gates 基线可对照
- Accept 模式: Partial
- Partial 时未证项:
  - 08 §A1 lint 全仓零 error（属后续清债 Slice）
- 文件白名单:
  - docs/flutter-to-rn-lego-migration/
  - .harness/changes/
- 机跑验证:
  - npm run typecheck
- 人证清单:
  - acceptance-records/2026-07-19-m2-lint-baseline.md（lint 输出摘要）
- 证据: docs/flutter-to-rn-lego-migration/acceptance-records/2026-07-19-m2-lint-baseline.md
```

## 审计步骤

1. `npm run lint 2>&1 | tee /tmp/lint-baseline.txt | tail -40`  
2. 记录 `✖ N problems (E errors, W warnings)`  
3. 写入 Record；更新 Epic Context 若数字漂移  

## Context Card — m2-lint-baseline

```md
## Context Card — m2-lint-baseline
- 已完成: Ready Brief；基线 Record 模板路径已定
- 未做/Deferred: 全仓零 error
- 关键文件: plans/slices/m2-lint-baseline.md ; acceptance-records/2026-07-19-m2-lint-baseline.md
- harness: 本 Slice docs-only；执行时 agent:pre/post
- 下一 Slice 建议: m2-lint-src 或按包 m2-lint-features-*
- 已知坑: 多数为 prettier；`--fix` 可批量修但须分 Slice 白名单
```
