# 分期计划

## Phase 0 — Foundation + Shell

- npm workspaces、core/ui 包、Redux store
- 修复 iOS moduleName
- Splash → Main Tab（Home/Chat/Community/Mine）
- Mock Auth + Environment + HTTP

## Phase 1 — Core Features

- auth/home/chat/community/settings 屏幕与 store
- 社区 Tab 需登录拦截

## Phase 2 — Infra + 占位模块 ✅

- `@core/webview` Bridge 壳 + module handler 注册表
- friend/live/pay/video Scaffold（含 liveRoom、shortVideo 子路由）
- iOS boost.podspec 自动 patch（`postinstall`）

## Phase 3 — Long-tail ✅

- `react-native-track-player` + OH 适配（`@core/media-player` facade，Mock 回退）
- music 列表 / Now Playing / 迷你播放条
- bfui 17 模板 RN 布局迁移（12 migrated + 5 effect degraded）

详见 [`../flutter-to-rn-lego-migration/03-module-migration-plan.md`](../flutter-to-rn-lego-migration/03-module-migration-plan.md)。
