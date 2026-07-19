# Acceptance Record — M2 Lint 基线审计（docs-only）

Date: 2026-07-19  
Command: `npm run lint`  
Decision: **Baseline only**（不清债；不勾 08 §A1 lint 全仓零 error）

## Accept 模式

**Partial**（审计 Slice；清债属后续 `m2-lint-*`）

## 机跑摘要

| 项 | 值 |
|----|-----|
| 命令 | `npm run lint`（`eslint App.tsx src packages --ext .ts,.tsx`） |
| 合计 | **152 problems** |
| errors | **≈ 40** |
| warnings | **≈ 112** |
| `--fix` 可修 | 约 39 errors + 1 warning（多为 `prettier/prettier`） |

与 M-close-gap `2026-07-19-a-gates.md` 基线（~40 error / ~112 warning）**一致**，无显著回归。

## 错误形态（抽样）

- 大量 `prettier/prettier`（换行/空格）
- 少量 `react-native/no-inline-styles`、`react/no-unstable-nested-components`、`no-void` 等 warning
- 触及路径示例：`packages/features/settings`、`packages/features/video`、`src/navigation/*`、`src/__tests__/*`

## Deferred / 未证

| Item | 原因 | Owner | Phase |
|------|------|-------|-------|
| 08 §A1 lint 全仓零 error | 本 Slice 只建基线，不改代码 | Agent | M2 `m2-lint-debt` 分包 Slice |
| warning 清零 | Epic 默认二期 | — | 可选 |

## 08 映射

| 行 | 本轮 |
|----|------|
| §A1 lint 全仓零 error | ☐ 仍 Deferred；基线已落盘 |
| typecheck | 未本轮重跑；维持 A 政策 |

## 结论

基线冻结：**40 errors / 112 warnings**。下一刀按 Epic 建议切 `m2-lint-src` / `m2-lint-features-*` / `m2-lint-core-ui`，禁止 silent Accept。
