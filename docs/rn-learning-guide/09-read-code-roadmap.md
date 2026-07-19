# 09 · 读代码路线图（按真实模块练）

学完 01–07 后，用本仓 **已验收业务** 练「打开文件 → 三问 → 改一处」。  
不必一次读完；每条路径约 30–60 分钟。

## 读任何一页前的三问

1. **状态从哪来？** props / `useState` / selector / mock 数据  
2. **交互改谁？** `dispatch` / 本地 `setState` / 调 `@core/*` service  
3. **成功去哪？** `RoutePath` + `navigate` / `goBack` / Toast

二级页再多看一眼：有没有 `AppNavBar` + `showBackButton`（见 [02 §5–5b](./02-jsx-components-and-styles.md)）。

---

## 路径 A · 列表 → 详情（chat）

| 步骤 | 打开 |
|------|------|
| 1 | `packages/features/chat/src/registerChatFeature.ts`（路由怎么挂上） |
| 2 | `.../screens/ChatListScreen.tsx`（列表 + 点进详情） |
| 3 | `.../screens/ChatDetailScreen.tsx`（读 `route.params`） |
| 4 | `.../theme/chatTheme.ts`（feature 专属色，不散落魔法数） |

**练手：** 改一条 mock 会话标题，确认列表与详情一致。  
**对照：** Flutter iOS/iMessage 风格；验收笔记在 `acceptance-records/*chat*`。

---

## 路径 B · Tab 根页 + 资源 registry（community / home）

| 步骤 | 打开 |
|------|------|
| 1 | `packages/features/community/src/screens/...`（Feed 卡片结构） |
| 2 | `packages/features/home/src/assets/homeAssets.ts`（`require` 注册表） |
| 3 | `packages/features/home/src/data/allServicesData.ts`（全部服务 → 路由 / templateId） |
| 4 | `HomeAllServicesScreen.tsx` 的 `openService`（`switch (routePath)`） |

**练手：** 在全部服务加一个指向 `RoutePath.bfuiGallery` 的入口（或先读现有「BFUI 模板目录」）。  
**边界：** home **不要** import `@features/bfui` 内部文件，只 `navigate(RoutePath.xxx)`。

---

## 路径 C · 跨层能力（music）

| 步骤 | 打开 |
|------|------|
| 1 | `packages/features/music/...` 列表 / Now Playing |
| 2 | `index.js` 里 `TrackPlayer.registerPlaybackService` |
| 3 | `AppBootstrap` 的 `initMusicPlayer` |
| 4 | home 的 `useHomeMiniPlayerInset`（Tab 根页给迷你条留白） |

**练手：** 理解「播放器状态不该塞进随便一个 Screen 的局部 state」。  
**降级概念：** Harmony 上 blur/Hero 可能 Degraded——见 manifest `note`，不是 silently 删 UI。

---

## 路径 D · 复杂详情 + WebView（video）

| 步骤 | 打开 |
|------|------|
| 1 | `packages/features/video/src/screens/DubbingVideoListScreen.tsx`（`navBar` + 返回） |
| 2 | `DubbingVideoDetailScreen.tsx`（区块顺序） |
| 3 | `components/dubbing/PlayableVideoHeader.tsx`（WebView 播放壳） |
| 4 | `dubbing/dubbingMediaMockData.ts`（详情所需字段要从 mock 补齐） |

**练手：** 对比「列表字段」和「详情字段」；缺字段时详情会空壳。  
**诚实降级：** 进度条无真实 seek → 写在 manifest `note`，验收仍可 Accept。

---

## 路径 E · 模板画廊（bfui）

| 步骤 | 打开 |
|------|------|
| 1 | `packages/features/bfui/src/bfuiCatalog.ts`（17 模板 + status） |
| 2 | `screens/BfuiScreens.tsx`（Gallery + Template 外包 NavBar） |
| 3 | `templates/templateScreens.tsx` + `assets/bfuiAssets.ts` |
| 4 | 全部服务 →「BFUI 模板目录」走一遍真机 |

**练手：** 给某一模板标题加 `fontFamily: BFUI_FONTS.workSansBold`，确认字体链路。

---

## 路径 F · Smoke 入口（live / friend / pay）

这些模块产品路径可能很浅，但 **Settings → 开发调试** 有 smoke 入口（`__DEV__`）。

| 步骤 | 打开 |
|------|------|
| 1 | `packages/features/settings/.../SettingsScreen.tsx`（开发调试区） |
| 2 | `packages/features/live/src/index.tsx`（列表 → LiveRoom + Mock realtime） |
| 3 | `packages/features/pay/src/PayScreen.tsx`（Mock 支付 vs SDK Deferred toast） |
| 4 | `src/screens/DebugScreens.tsx` →「进入 Mock 直播房」 |

**练手：** 说清「UI Migrated」和「能力 Deferred」可以同时成立。  
**证据：** `acceptance-records/2026-07-19-b9-live-friend-pay.md`。

---

## 推荐顺序（由浅入深）

```text
A chat 列表详情
  → B home 全部服务 / registry
  → C music 跨层播放
  → D video 详情区块
  → E bfui 画廊
  → F live/pay smoke + Deferred
```

每条路径结束后，用 [08 速查表](./08-cheatsheet.md) 默写：别名、导航三件套、新 Feature 清单。

---

## 和验收文档怎么对表

读业务时若看到 `Migrated` / `Degraded` / `Deferred`：

| 状态 | 学习者该怎么理解 |
|------|------------------|
| Migrated | 产品路径可进 + 主 UI/交互对齐；可当「标准样板」读 |
| Degraded | 主流程在，某能力简化（要有 `note`） |
| Deferred | 明确不做 / 后做；页面可能仍有壳或入口 |

真相源：`page-resource-parity-manifest.ts` + `08-acceptance-checklist.md`。

---

## 小练习（选一条做完打勾）

- [ ] 从 Settings DEV 走进 LiveRoom，发一条 mock 信令  
- [ ] 从全部服务进配音视频详情，按返回回到列表  
- [ ] 在任意二级页故意去掉 `showBackButton`，感受「进得去出不来」  
- [ ] 给 `friend` 或 `pay` 的 smoke 测试补一句 assertion（读现有 `__tests__`）
