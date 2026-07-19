# 12 — 架构优化备注（DEFER 与路径漂移）

> **状态：** Notes（2026-07-19）  
> **配套：** [`02-lego-monorepo-architecture.md`](./02-lego-monorepo-architecture.md) · [`11-conversion-retrospective-and-extraction.md`](./11-conversion-retrospective-and-extraction.md) §8 · [`AGENTS.md`](../../AGENTS.md)

本文只记录 **已决定暂缓** 的架构项与 **文档 vs 仓库路径漂移**，避免 Agent/人把目标结构误当成现状。

---

## 1. DEFER：`apps/mobile` 物理迁入

| 项 | 内容 |
|----|------|
| 目标态（02） | `packages/apps/mobile` 为唯一 app 壳 |
| 现状 | 根目录即 RN app（`App.tsx`、`src/`、`android/`、`ios/`、`harmony/`） |
| 决策 | **DEFER**（M2 不做；P2 高风险） |
| 原因 | Metro / 原生工程路径 / Harmony 入口牵涉面大；收益不阻塞真机 smoke / lint / token |
| 何时再开 | 独立 Epic；须单独 Brief + 白名单含原生工程；禁止混进业务 Slice |

---

## 2. DEFER：Maestro / Detox 真机门禁

| 项 | 内容 |
|----|------|
| 动机 | 替代不稳定的 HID 点按；Login 成功自动化 |
| 决策 | **DEFER**（P3；可选） |
| 现状 | 08 §D 靠人证截图/日志 + Partial Accept；无 E2E CI |
| CI | `.github/workflows/agent-gates.yml` **不含** device smoke / E2E |
| 何时再开 | iOS Login 成功需稳定机证，或发布强制自动化时另开 Epic |

---

## 3. 路径漂移：文档 02 vs 仓库实际

| 02 曾写 / 目标图 | 仓库实际 | 处理 |
|------------------|----------|------|
| `feature-modules/@features/...` | `packages/features/*` | **以代码为准**；02 顶部 callout |
| `core-blocks/@core/...` | `packages/core/*` | 同上 |
| `ui-blocks/@ui/...` | `packages/ui/*` | 同上 |
| `packages/apps/mobile` | 根 app + `src/` | DEFER 迁入；AGENTS 写清现状 |

Agent 白名单、boundary 机检、Brief 路径一律用 **`packages/features|core|ui`**，勿写 `feature-modules/`。

---

## 4. 相关短线（非本篇 DEFER）

| 项 | 状态 |
|----|------|
| lint 全仓清零 | M2 Epic `m2-lint-debt`；基线 Slice `m2-lint-baseline` |
| design-token 抽检 | M2 Epic；审计 Slice `m2-design-tokens-audit` |
| CI：typecheck + boundary + manifest | `agent-gates.yml` |

---

## 变更记录

| 日期 | 变更 |
|------|------|
| 2026-07-19 | 初稿：apps/mobile DEFER · Maestro/Detox DEFER · 路径漂移说明 |
