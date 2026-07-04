# Flutter to React Native LEGO Migration Docs

本文档包用于指导 Cursor 将 Flutter 项目 `/Users/mac/Desktop/github/my_ai_project` 迁移到 React Native LEGO Monorepo，并让 Codex 在后续实现过程中负责监督、代码审查和验收。

目标 RN 仓库：`/Users/mac/Desktop/github/my_rn_project`

## 文档导航

| 文档 | 用途 | 主要读者 |
|---|---|---|
| `01-flutter-analysis-report.md` | Flutter 项目结构、包职责、路由、状态和依赖分析 | Cursor, Codex |
| `02-lego-monorepo-architecture.md` | RN LEGO 目标架构、目录结构、依赖图和边界规则 | Cursor, Codex |
| `03-module-migration-plan.md` | 每个模块的迁移清单、优先级、风险和 Cursor checklist | Cursor |
| `04-cursor-execution-spec.md` | Cursor 执行规范、模板、提交报告格式和禁止事项 | Cursor |
| `05-acceptance-and-qa-plan.md` | 分层验收、模块验收、三端 smoke test 和专项验收 | Codex, Cursor |
| `06-supervision-playbook.md` | Codex 监督实现、review、返工和放行标准 | Codex |
| `appendices/dependency-mapping.md` | Flutter 依赖到 RN 依赖的映射和归属 | Cursor |
| `appendices/conversion-cheatsheet.md` | Flutter 到 RN 的转换速查表 | Cursor |
| `appendices/module-boundary-rules.md` | import 边界、ESLint 草案、跨模块通信规范 | Cursor |
| `appendices/risk-register.md` | 风险台账、触发条件、缓解方案、验收证据 | Codex, Cursor |

## Cursor 执行顺序

1. 阅读 `01-flutter-analysis-report.md`，确认迁移基于真实 Flutter 包结构。
2. 阅读 `02-lego-monorepo-architecture.md`，先建立目标 monorepo 和模块边界。
3. 按 `03-module-migration-plan.md` 的优先级执行：Foundation -> Shell -> Core Features -> Media/Realtime -> BFUI/Long-tail。
4. 每个阶段执行前，按 `04-cursor-execution-spec.md` 生成阶段执行报告。
5. 每个阶段提交给 Codex 审查前，按 `05-acceptance-and-qa-plan.md` 运行对应验收。
6. 如 Codex 退回返工，按 `06-supervision-playbook.md` 的返工格式补充证据。

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

