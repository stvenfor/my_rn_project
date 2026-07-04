# 页面与资源 Parity 返工验收记录

Date: 2026-07-04  
Scope: Phase A–D 完整返工（不含 Android 构建/启动）  
Baseline report: `2026-07-04-cursor-reimplementation-visual-resource-acceptance.md`

## 结论

**Decision: Ready for re-review**

本轮已完成页面/资源同步专项返工：52 个 Flutter 页面全部纳入 parity matrix；76 个 first-party 业务资源（含 `video_mock_sources.json`）已迁移并建立 typed registry；核心占位页已替换为真实布局；自动化 parity 测试与 iOS bundle 资源证据已补齐。

## 命令证据

| 检查项 | 命令 | 结果 |
|--------|------|------|
| ESLint | `npm run lint` | exit 0 |
| TypeScript | `npm run typecheck` | exit 0 |
| Jest | `npm run test -- --runInBand --detectOpenHandles` | exit 0；12 suites / 24 tests；无 open handles 警告 |
| 资源数量 | `find packages -type f \( png\|jpg\|jpeg\|ttf \) \| wc -l` | 75 图/字体 + 1 JSON registry |
| iOS Metro bundle | `npx react-native bundle --platform ios --dev false ...` | exit 0；**Copying 79 asset files** |

## Phase A — 同步基线

- 新增 [page-resource-parity-matrix.md](../page-resource-parity-matrix.md)
- 新增 [page-resource-parity-manifest.ts](../page-resource-parity-manifest.ts)（机器可读，供 Jest 消费）
- 更新 [01-module-mapping.md](../../rn-migration/01-module-mapping.md) 成熟度列
- BFUI `status` taxonomy：`migrated` | `visual-degraded` | `shell` | `placeholder`

## Phase B — 资源迁移

| 模块 | 路径 | Registry |
|------|------|----------|
| home | `packages/features/home/assets/all_services/` (19) | `homeAssets.ts` |
| music | `packages/features/music/assets/defaults/` (2) | `musicAssets.ts` |
| bfui | `packages/features/bfui/assets/` (54) | `bfuiAssets.ts` |
| toolkit | `packages/commons/toolkit/assets/data/video_mock_sources.json` | `videoMockSources.ts` |

- 新增 `react-native.config.js`（BFUI 字体链接）
- 新增 `@commons/toolkit` workspace 包

## Phase C — 页面补齐

| 区域 | 交付 |
|------|------|
| Home | 学习报告 / 签到商城 / 全部服务（19 图标网格） |
| Settings | dialog demo / invoice demo / invoice upload |
| Community | 发布表单 / 图片预览 / 视频播放 |
| Chat | 图片预览路由 |
| Video | mock JSON 列表 + 播放 facade UI |
| Music | 本地封面/唱片图 |
| BFUI | 模板引入本地图片；hero/list/help/feedback/invite 视觉对齐 |
| Friend/Pay/Live | UI 迁移；realtime/pay SDK 在 matrix 标 Deferred |

路由：`collectFeatureRoutes()` + 各 `register*Feature.routes`；`RootNavigator` 自动渲染 feature routes。

## Phase D — 测试

- `src/__tests__/pageParity.test.ts`
- `src/__tests__/assetParity.test.ts`
- `src/navigation/__tests__/routeRegistration.test.ts`
- `packages/features/home/src/__tests__/HomeScreens.test.tsx`
- Jest `fileMock` + `mockAudioPlayer` `afterEach(dispose)` 修复 open handles

## Deferred（矩阵已标注）

- infrastructure debug 页（BLE/linking/realtime/IM）→ v0.3
- Live realtime WebSocket 深集成 → v0.2
- Pay SDK 接入 → v0.2
- `auth_dev_home_page` → Removed（Flutter 模块 dev 专用）

## 与上轮差异

| 上轮（资源验收报告） | 本轮 |
|---------------------|------|
| RN first-party 资源 0 | 76 registry 条目 / 75 图字体 + 1 JSON |
| Home 子页占位文案 | 真实布局 + 数据模型 |
| BFUI migrated 无资源 | 本地图片/字体 + visual-degraded 定义 |
| 14 tests（slice only） | 24 tests（parity + smoke + route） |
| iOS bundle 4 assets | iOS bundle 79 assets |

## 待复验方确认

- [ ] Codex 对照 matrix 逐项 spot-check 截图
- [ ] Android 构建/启动（用户明确本轮跳过）
- [ ] BFUI 动效模板是否接受 visual-degraded 判定
