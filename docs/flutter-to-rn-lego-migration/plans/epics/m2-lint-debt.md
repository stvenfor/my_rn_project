# Epic Plan — M2 Lint 清债

| 项 | 内容 |
|----|------|
| Checklist | [`08` §A1 lint](../08-acceptance-checklist.md) |
| Program | [2026-07-19-m2-program.md](../2026-07-19-m2-program.md) |
| 状态 | **Ready** |
| 基线 | M-close-gap：`npm run lint` ≈ **40 error / ~112 warning**（见 `2026-07-19-a-gates.md`） |

## 目标

将 A 政策从「改动路径零新增 error」升级为 **`npm run lint` 零 error**；无法清的项必须冻结清单 + owner + 理由（禁止 silent Accept）。

## Epic DoD

- [ ] `npm run lint` 零 error，**或** `lint-freeze.md` 列出剩余 error + owner  
- [ ] 08 §A1 lint 行更新为诚实状态  
- [ ] typecheck 仍全仓绿  
- [ ] `acceptance-records/YYYY-MM-DD-m2-lint-debt.md`  
- [ ] 各 Slice `agent:post` 绿；白名单按包切开  

## 建议切 Slice（按包，白名单不相交可并行）

| Slice | 范围示意 |
|-------|----------|
| `m2-lint-src` | `src/` |
| `m2-lint-features-*` | 按 feature 分包 |
| `m2-lint-core-ui` | `packages/core*` / `packages/ui*` |
| `m2-lint-accept` | 汇总勾 08 + Record |

## 不做

- 为消 warning 做无行为收益的大重构（warning 可二期）  
- 关闭 ESLint 规则装绿  

## Context Card

```md
## Context Card — m2-lint-debt
- 已完成: Epic 落盘；基线指向 a-gates record
- 下一: 先跑 lint 刷新基线 → 按包开 Slice
```
