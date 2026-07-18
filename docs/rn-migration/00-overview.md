# RN 迁移总览

源项目：`/Users/mac/Desktop/github/my_ai_project`（Flutter 3.44 + GetX Monorepo）  
目标项目：`/Users/mac/Desktop/github/my_rn_project`（RN 0.77.1 + RNOH 0.77.72）

## 迁移性质

**功能重写**，非代码搬运。Flutter `ohos/` 工程不可复用；Harmony 侧使用 RNOH + [CPF-RN usage-docs](https://gitcode.com/CPF-RN/usage-docs)。

## 默认决策

| 项 | 决策 |
|---|---|
| 统一包名 | `com.example.myrnproject`（iOS / Android / Harmony） |
| 包管理 | npm workspaces + 根目录保留 `android/` `ios/` `harmony/` |
| 状态管理 | Redux Toolkit |
| 路由 | React Navigation 7（Tab + Stack / `@react-native-ohos/stack`） |
| Auth 默认 | Mock Auth（`USE_MOCK_AUTH=true`） |
| 占位模块 | friend/live/pay/video 做 Scaffold 壳 |
| music/bfui | Phase 3 入口壳 + 文档化 |

## 实施变更说明（2026-07-04 返工）

原计划目录为 `packages/core-blocks/@core/*`、`packages/feature-modules/@features/*`；当前实施采用简化路径 `packages/core/*`、`packages/features/*`、`packages/ui/*`，npm 包名仍为 `@core/*`、`@features/*`、`@ui/design-system`。

模块边界由 ESLint `no-restricted-imports` 在 `packages/core`、`packages/features`、`packages/ui` 分层强制执行；app 壳（`src/`）负责组合 feature reducer 与注入 settings/webview handler。


完整 LEGO 规格见 [`../flutter-to-rn-lego-migration/00-index.md`](../flutter-to-rn-lego-migration/00-index.md)。
