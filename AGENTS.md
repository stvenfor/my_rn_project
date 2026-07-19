# AGENTS.md — my_rn_project

RN LEGO monorepo（含 Harmony）。主线工作曾是 Flutter→RN 1:1 迁移；日常改动仍须遵守模块边界与诚实完成态。

## 技术栈基线（禁止擅自升级主版本）

- React Native 0.72.5 · React Navigation 6 · Redux Toolkit · npm + package-lock.json
- Harmony：@react-native-oh/react-native-harmony 0.72.140
- 包路径：`packages/features/*`、`packages/core/*`、`packages/ui/*`（以仓库实际为准）

## 快速导航

| 你想… | 去读 |
|-------|------|
| 迁移怎么验收 | `docs/flutter-to-rn-lego-migration/08-acceptance-checklist.md` |
| 页/资源是否 Migrated | `docs/flutter-to-rn-lego-migration/page-resource-parity-manifest.ts` |
| 下一刀做什么 | `docs/flutter-to-rn-lego-migration/plans/README.md`（当前 Program / Epic / Slice 以该 README 为准） |
| 开一轮怎么跑 | `docs/flutter-to-rn-lego-migration/10-agent-prompt-harness.md` |
| 选哪个 Agent | `.harness/agents/README.md`（**conductor** → planner / executor / reviewer） |
| 新任务怎么派活 | `.harness/agents/conductor.md` + `skills/conductor-handoff` |
| Flutter↔RN 怎么写 | `.cursor/skills/flutter-to-rn-lego-module/SKILL.md` |
| 架构与依赖方向 | `docs/flutter-to-rn-lego-migration/02-lego-monorepo-architecture.md` |
| 本轮 Slice 指针 | `.harness/changes/current.md`（conductor 主写 Role/Next） |
| Harness 编排角色 | `.harness/README.md` |
| Metro/Babel 别名坑 | `.harness/rules/metro-babel-aliases.md`（长文：`docs/.../appendices/metro-babel-module-resolver.md`） |
| Agent 入口地图 | 本文（仓库根 `AGENTS.md`） |

## 硬性规则（违反 = Rework）

1. **禁止** feature→feature、core→feature 直接 import；跨模块用 RoutePath / app shell 注入 / LoginRedirect。
2. Parity status 仅：`Migrated | Degraded | Placeholder | Deferred | Removed`；非 Migrated 须有 `note`。
3. 迁移执行单位只能是 **Slice Brief 落盘文件**；先 `npm run agent:pre`，后 `npm run agent:post`。
4. `agent:post` 未绿 → **不得**勾 08、不得自称 Accept。
5. **不得**用 Metro/Harmony bundle 成功冒充真机 Splash→Tabs / Login / 主业务。
6. commit / push / `--force` / 改 git config：**仅当用户明确要求**。

## 迁移最短路径

1. **conductor**：收任务 → 路由（Handoff + 更新 `changes/current.md`）。
2. 若需 Brief：**planner** 确认 Program 队首 → 落盘 Slice（读 `plans/README.md`）；**人批 Brief**。
3. **executor**：`npm run agent:pre -- --slice <path>`
4. 白名单内改动；更新 manifest；写 Context Card。
5. `npm run agent:post`；写 `acceptance-records/`。
6. **reviewer** → 人审查与 commit；Rework/Blocked 回 **conductor** 再派。

## 验证常用命令

- `npm run typecheck`
- `npm run agent:check-boundary`
- `npx jest src/__tests__/pageParity.test.ts src/__tests__/assetParity.test.ts --no-coverage`
- 平台 packaging：`react-native bundle` / `npm run dev`（≠ 真机交互）

## 不要做

- 整模块「一把梭」无 Slice
- 假 Migrated / 无截图勾真机交互
- 关闭 ESLint 边界规则装绿
- 把长文规范整份贴进对话（用导航表按需 Read）
