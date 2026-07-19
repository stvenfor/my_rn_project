# Flutter to React Native LEGO Migration Docs

本文档包用于指导 Cursor 将 Flutter 项目 `/Users/mac/Desktop/github/my_ai_project` 迁移到 React Native LEGO Monorepo，并让 Codex 在后续实现过程中负责监督、代码审查和验收。

目标 RN 仓库：`/Users/mac/Desktop/github/my_rn_project`

## 文档导航

| 文档 | 用途 | 主要读者 |
|---|---|---|
| **`07-1to1-migration-guide.md`** | **1:1 迁移执行指南（路径约定、步骤、parity）** | Cursor, Codex |
| **`08-acceptance-checklist.md`** | **验收权威清单（后续按此验收）** | Codex, QA, Cursor |
| **`09-agent-programming-playbook.md`** | **Agent 编程方法（拆解/上下文/测试闭环/边界/复盘/交互验证）** | Cursor, Codex, 人 |
| **`10-agent-prompt-harness.md`** | **提示词合同 + Harness（agent:pre/post）与 Cursor Hooks** | Cursor, Codex, 人 |
| **`plans/README.md`** | **Planning 操作系统（Program / Epic / Slice）** | 人, Cursor, Codex |
| `01-flutter-analysis-report.md` | Flutter 项目结构、包职责、路由、状态和依赖分析 | Cursor, Codex |
| `02-lego-monorepo-architecture.md` | RN LEGO 目标架构、目录结构、依赖图和边界规则 | Cursor, Codex |
| `03-module-migration-plan.md` | 每个模块的迁移清单、优先级、风险和 Cursor checklist | Cursor |
| `04-cursor-execution-spec.md` | Cursor 执行规范、模板、提交报告格式和禁止事项 | Cursor |
| `05-acceptance-and-qa-plan.md` | 分层验收、模块验收、三端 smoke test 和专项验收 | Codex, Cursor |
| `06-supervision-playbook.md` | Codex 监督实现、review、返工和放行标准 | Codex |
| `page-resource-parity-manifest.ts` | 页面/资源 parity machine-readable 真相源 | Cursor, CI |
| `page-resource-parity-matrix.md` | Parity 人读摘要 | Codex, QA |
| `appendices/dependency-mapping.md` | Flutter 依赖到 RN 依赖的映射和归属 | Cursor |
| `appendices/conversion-cheatsheet.md` | Flutter 到 RN 的转换速查表 | Cursor |
| `appendices/module-boundary-rules.md` | import 边界、ESLint 草案、跨模块通信规范 | Cursor |
| `appendices/risk-register.md` | 风险台账、触发条件、缓解方案、验收证据 | Codex, Cursor |

## Skill

- 项目入口：`.cursor/skills/flutter-to-rn-lego-module/SKILL.md`
- 完整 skill：`/Users/mac/Desktop/skills/flutter-to-rn-lego-module/`（结构对称于 `flutter-to-harmony-module`）

## Cursor 执行顺序

1. 阅读 **`07-1to1-migration-guide.md`**，锁定源/目标路径与 1:1 规则。
2. 阅读 **`plans/README.md`** + 当前 `plans/*-program.md`，确认队首 Epic / Slice（不要跳过规划队列）。
3. 阅读 **`09-agent-programming-playbook.md`** + **`10-agent-prompt-harness.md`**，按 Slice 落盘 → `agent:pre` → 实现 → `agent:post` → 交互验证组织每轮工作。
4. 阅读 `01-flutter-analysis-report.md`，确认迁移基于真实 Flutter 包结构。
5. 阅读 `02-lego-monorepo-architecture.md`，确认 monorepo 与模块边界（路径以 `packages/features/*` 为准）。
6. 按 `plans/epics/*` 与（历史）`03-module-migration-plan.md` 的优先级执行；单模块流程跟 skill `flutter-to-rn-lego-module`。
7. 每阶段按 `04-cursor-execution-spec.md` 产出 Delivery Report + UX 证据（附 harness-report 摘要）。
8. 提交审查前：`agent:post` 绿 + 按 **`08-acceptance-checklist.md`** 自检（权威）；`05` 作补充说明。
9. 如退回返工，按 `06-supervision-playbook.md` + `09` 失败复盘卡补充证据。

## Codex 监督职责

Codex 不直接替代 Cursor 长期实现。Codex 的职责是：

- 检查 Cursor 是否遵守 LEGO 架构依赖方向。
- 审查每轮变更是否完整满足阶段 checklist。
- 验证 `lint`、`test`、`typecheck`、平台 smoke test 的真实输出。
- 对 feature-to-feature import、core 反向依赖、硬编码 design token、路由参数不安全等问题提出返工。
- 维护验收结论：放行、条件放行、返工、阻塞。

## 迁移阶段总览

```text
Phase 0 Foundation
  monorepo workspaces, package templates, lint boundaries, TS paths

Phase 1 Shell
  apps/mobile, navigation registry, splash, main tabs, app providers

Phase 2 Core Features
  auth, home, settings, design system, api/storage/domain/config

Phase 3 Media and Realtime
  chat, community, music, video, realtime, im, linking, media-player

Phase 4 BFUI and Long-tail
  bfui, live, friend, pay, bluetooth, platform-specific acceptance
```

## 全局默认

- 包管理：沿用当前 RN 仓库的 npm + `package-lock.json`。
- React Native：沿用当前 RN 0.72.5 和 HarmonyOS 依赖。
- 状态管理：Redux Toolkit。
- 路由：React Navigation。
- UI 令牌：所有颜色、字体、间距来自 `@ui/design-system/theme`。
- 模块边界：feature modules 之间禁止直接依赖。

