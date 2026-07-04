# Flutter 项目分析报告

分析对象：`/Users/mac/Desktop/github/my_ai_project`

## 结构结论

该 Flutter 项目已经是包级模块化结构，不是单一 `lib/modules` 结构。主工程 `lib/` 负责 App 壳、启动、GetX 路由聚合和主 Tab；业务与基础能力主要位于 `packages/`。

```text
lib/
├── main.dart
├── app/
│   ├── app.dart
│   ├── app_binding.dart
│   ├── app_controller.dart
│   └── app_pages.dart
├── config/module_manifest.dart
├── pages/
│   ├── main_page.dart
│   └── splash_page.dart
├── route/app_route_container.dart
└── l10n/

packages/
├── commons/
│   ├── core
│   ├── network
│   ├── storage
│   ├── toolkit
│   └── ui
├── features/
│   ├── auth
│   ├── bfui
│   ├── chat
│   ├── community
│   ├── friend
│   ├── home
│   ├── live
│   ├── music
│   ├── pay
│   ├── settings
│   └── video
├── infrastructure/
│   ├── bluetooth
│   ├── linking
│   ├── realtime
│   ├── rongcloud_im
│   └── supabase
└── route
```

## App 壳与模块机制

主工程使用 GetX：

- `lib/app/app.dart` 创建 `GetMaterialApp`，配置主题、语言、初始路由、全局 builder。
- `lib/config/module_manifest.dart` 显式启用 `HomeModule`、`ChatModule`、`CommunityModule`、`SettingsModule`、`AuthModule`、`FriendModule`、`LiveModule`、`PayModule`、`VideoModule`、`BfuiModule`、`MusicModule`。
- `packages/route/lib/module/module_registry.dart` 负责注册 `FeatureModule`，收集 routes、main tabs、bindings。
- `lib/pages/main_page.dart` 从 `ModuleRegistry.collectMainTabs()` 生成主 Tab，并包含登录拦截和音乐迷你播放条。

RN 迁移时应保留这种“宿主 app 聚合 feature registration”的思想，但实现应替换为 React Navigation + Redux Toolkit + 显式 provider/registry。

## Flutter 包分类

| 包 | 文件数 | 类型 | 职责 |
|---|---:|---|---|
| `packages/features/auth` | 16 | Feature | 登录、验证码登录、密码登录、注册、会话 |
| `packages/features/home` | 38 | Feature | 首页、学习报告、签到商城、全部服务、Web handlers |
| `packages/features/chat` | 31 | Feature | 会话列表、聊天详情、消息模型和 UI |
| `packages/features/community` | 26 | Feature | 社区动态、发布、评论、富文本、媒体预览 |
| `packages/features/settings` | 46 | Feature | 我的、设置、HTTP 测试、发票 demo、调试入口 |
| `packages/features/music` | 14 | Feature | 音乐列表、播放页、播放控制器、迷你播放条 |
| `packages/features/video` | 13 | Feature | 视频入口、短视频列表、短视频播放 |
| `packages/features/bfui` | 55 | Feature | Best Flutter UI Templates 迁移 demo |
| `packages/features/live` | 5 | Feature | 直播入口、直播间 |
| `packages/features/friend` | 4 | Feature | 好友页 |
| `packages/features/pay` | 3 | Feature | 支付入口页 |
| `packages/commons/core` | 31 | Core contract | 用户、认证、IM、Realtime、WebBridge 类型和服务接口 |
| `packages/commons/network` | 8 | Core infra | Dio HTTP、拦截器、重试、日志 |
| `packages/commons/storage` | 6 | Core infra | SharedPreferences、SQLite、本地设置 |
| `packages/commons/toolkit` | 32 | Mixed | 工具、权限、图片选择、视频播放器、缓存图片、事件总线 |
| `packages/commons/ui` | 25 | UI/Core mixed | 主题、布局、弹窗、刷新、WebView、Loading |
| `packages/infrastructure/linking` | 22 | Core infra | Deep link、push intent、导航调度、隐私同意 |
| `packages/infrastructure/realtime` | 22 | Core infra | WebSocket、重连、心跳、队列、通知 |
| `packages/infrastructure/rongcloud_im` | 13 | Core infra | IM SDK adapter、session、profile cache |
| `packages/infrastructure/supabase` | 8 | Core infra | Supabase Auth/Profile 实现 |
| `packages/infrastructure/bluetooth` | 4 | Core infra | BLE controller 和 demo |
| `packages/route` | 14 | Core navigation | FeatureModule、RoutePath、ModuleRegistry、standalone runner |

## 业务路由清单

| 模块 | 路由 |
|---|---|
| auth | `/login`, `/login/password`, `/login/otp`, `/auth/dev_home`, `/register` |
| home | `/home`, `/home/learning_report`, `/home/check_in_mall`, `/home/all_services` |
| chat | `/chat`, `/chat/detail` |
| community | `/community`, `/community/publish` |
| settings | `/mine`, `/mine/http_test`, `/settings`, `/settings/dialog_demo`, `/settings/linking_debug`, `/settings/realtime_debug`, `/settings/im_debug`, `/settings/bluetooth_demo`, `/settings/deal_invoice_demo`, `/settings/deal_invoice/upload` |
| video | `/video`, `/video/short`, `/video/short/play` |
| music | `/music/list`, `/music/now_playing` |
| bfui | `/bfui/*` 模板 demo 路由 |
| live | `/live`, `/live/room` |
| friend | `/friend` |
| pay | `/pay` |

## 状态管理分析

| Flutter 位置 | 当前机制 | RN 迁移 |
|---|---|---|
| `AuthController`, `AuthBinding` | GetX controller/binding | `authSlice`, thunks, typed selectors |
| `HomeController`, `AllServicesController` | GetX | `homeSlice` 或 screen-local hooks |
| `ChatViewModel`, `ChatDetailViewModel` | GetX ViewModel | `chatSlice`, entity adapter, async thunks |
| `CommunityViewModel` | GetX | `communitySlice` |
| `MineController`, settings viewmodels | GetX | `settingsSlice`, `invoiceSlice` |
| `MusicPlaybackController` | GetX reactive playback state | `@core/media-player` service + `musicSlice` |
| `MainTabController` | infrastructure linking controls selected tab | `navigationSlice` 或 navigation ref service |

## 已发现的架构问题

1. `home -> music`
   - Flutter `home` 依赖 `module_music`，`MainPage` 也直接引用 `MusicMiniPlayerBar`。
   - RN 目标中不允许 feature 互依赖。
   - 处理：`home` 只通过 route key 跳转音乐页；迷你播放条由 app shell 或 media-player slot 承载。

2. `infrastructure -> auth`
   - `linking`、`realtime`、`rongcloud_im` 依赖 `module_auth`。
   - RN 目标中 core-block 不能依赖 feature。
   - 处理：认证状态抽象进入 `@core/domain`，`@features/auth` 在 app 启动时注入实现。

3. `settings -> infrastructure debug pages`
   - `settings_module.dart` 直接 import linking/realtime/im/bluetooth debug page。
   - 处理：settings 只展示 debug menu entry；实际 debug routes 由 app 或对应 core-block 注册。

4. `commons/toolkit` 职责混杂
   - 包含纯工具、设备能力、权限、图片选择、视频播放器、mock 数据、UI widget。
   - 处理：纯函数进 `@utils/helpers`；设备/权限/媒体进 core-block；短视频播放器能力进 `@core/media-player`。

5. `commons/ui` 同时包含 UI 和 WebView infra
   - 处理：主题、布局、弹窗、刷新进入 `@ui/design-system`；WebView 和 bridge 进入 `@core/webview`。

