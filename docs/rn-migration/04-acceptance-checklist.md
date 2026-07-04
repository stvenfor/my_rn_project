# 验收清单

## 三端启动

- [x] `npm start` Metro 正常（8081 可响应）
- [ ] `npm run ios` 进入 Splash → Main Tab（需本机 Xcode 验证）
- [ ] `npm run android` 进入 Splash → Main Tab（本轮专项未验收 Android）
- [x] `npm run dev && npm run harmony` Harmony bundle 可生成并打包进 HAP

## Phase 0

- [x] iOS `moduleName` = `MyRnProject`
- [x] Tab 四页可切换（代码已注册 Home/Chat/Community/Mine）
- [x] 未登录点社区/聊天跳转登录（`createAuthTabListener` + 单测）
- [x] 设置页可切换环境（测试/预发/线上）（app 层注入 `onSetEnv`）
- [x] Mock 登录/登出可用（auth slice + 错误 Alert）

## Phase 1

- [x] Home 学习报告 / 签到商城 / 全部服务（含 19 图标本地资源）
- [x] Chat 列表 + 详情 + 图片预览路由
- [x] Community Feed + 发布 + 图片预览 + 视频播放
- [x] Settings/Mine + dialog demo + invoice demo/upload

## Phase 2

- [x] `@core/webview` Bridge + H5 测试页
- [x] `refreshDashboard` 模块 handler（home 注册）
- [x] friend / live / pay / video UI 迁移（live realtime / pay SDK 标 Deferred）
- [x] Mine HTTP 测试页（WanAndroid Banner）
- [x] Video mock JSON + 播放 facade

## Phase 3

- [x] music 列表 → 播放（本地 lady/music_record 资源）→ 迷你播放条
- [x] bfui 17 模板 + 54 资源/字体；动效 4 项 visual-degraded

## 页面与资源 Parity（2026-07-04 专项返工）

- [x] `page-resource-parity-matrix.md` + `page-resource-parity-manifest.ts`（52 页 / 76 资源）
- [x] first-party 资源迁移至 `packages/features/*/assets` + `@commons/toolkit`
- [x] typed registries：`homeAssets` / `musicAssets` / `bfuiAssets` / `videoMockSources`
- [x] `collectFeatureRoutes()` 自动装配 stack routes
- [x] `pageParity.test.ts` / `assetParity.test.ts` / `routeRegistration.test.ts`
- [x] Home screen render smoke tests
- [x] iOS bundle 复制 first-party 资源（79 asset files）

## 工程质量

- [x] `npm run lint` 0 error
- [x] `npm run typecheck` 通过
- [x] `npm run test -- --runInBand --detectOpenHandles` 12 suites / 24 tests 通过
- [x] `packages/` 无 `@app/` 反向依赖
- [x] ESLint 模块边界规则已落地（core/features/ui overrides）
- [x] FeatureRegistration 路由注册（`register*Feature.routes`）
