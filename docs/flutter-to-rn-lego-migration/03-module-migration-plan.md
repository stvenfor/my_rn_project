# 模块迁移计划

## 优先级总览

| 阶段 | 目标 | 模块 |
|---|---|---|
| P0 Foundation | monorepo、边界规则、核心模板 | root, `apps/mobile`, `@core/navigation`, `@core/domain`, `@ui/design-system` |
| P1 Core Features | 打通可用 App 主流程 | auth, home, settings, api-client, storage, config, supabase |
| P2 Social/Media | 迁移主要复杂业务 | chat, community, music, video, im, media-player, media-picker |
| P3 Infra | 迁移平台/基础设施专项 | linking, realtime, bluetooth, webview, permissions |
| P4 Long-tail | 模板与低耦合入口 | bfui, live, friend, pay |

## P0 Foundation Checklist

- [ ] 将当前 RN app 迁入 `packages/apps/mobile`，保持 iOS/Android/HarmonyOS 原生目录随 app 包移动或保留根目录并配置 workspace 脚本。
- [ ] 根 `package.json` 增加 npm workspaces。
- [ ] 建立所有空包及 `src/index.ts`。
- [ ] 建立 TS path aliases。
- [ ] 建立 ESLint module boundary rules。
- [ ] 建立 `FeatureRegistration`、`RouteRegistration`、`TabRegistration` 类型。
- [ ] App 可在无业务实现时启动到空 shell。

## Feature Modules

### `@features/auth`

| 项 | 内容 |
|---|---|
| Flutter 源路径 | `packages/features/auth` |
| RN 目标路径 | `packages/feature-modules/@features/auth` |
| 职责 | 登录、密码登录、验证码登录、注册、会话状态 |
| Core 依赖 | `@core/domain`, `@core/navigation`, `@core/supabase`, `@core/storage` |
| UI 依赖 | `@ui/design-system` |
| 工作量 | 高 |

文件映射：

| Flutter | RN |
|---|---|
| `user/view/login_page.dart` | `src/screens/LoginScreen.tsx` |
| `user/view/login_password_page.dart` | `src/screens/LoginPasswordScreen.tsx` |
| `user/view/login_otp_page.dart` | `src/screens/LoginOtpScreen.tsx` |
| `user/view/register_page.dart` | `src/screens/RegisterScreen.tsx` |
| `user/view/auth_dev_home_page.dart` | `src/screens/AuthDevHomeScreen.tsx` |
| `user/controller/auth_controller.dart` | `src/store/authSlice.ts`, `src/store/authThunks.ts` |
| `session/auth_session.dart` | `@core/domain/src/auth/AuthSession.ts` contract + feature adapter |
| `session/user_service_impl.dart` | `src/services/userServiceAdapter.ts` |
| `auth_module.dart` | `src/registerAuthFeature.ts` |

验收：

- [ ] 登录页、密码登录页、验证码登录页、注册页可通过 route 进入。
- [ ] 登录成功写入 session，登出清理 session。
- [ ] 不依赖其他 `@features/*`。
- [ ] Supabase 错误映射有单元测试。

### `@features/home`

| 项 | 内容 |
|---|---|
| Flutter 源路径 | `packages/features/home` |
| RN 目标路径 | `packages/feature-modules/@features/home` |
| 职责 | 首页、学习报告、签到商城、全部服务 |
| Core 依赖 | `@core/api-client`, `@core/navigation`, `@core/webview`, `@core/domain` |
| 工作量 | 中 |

文件映射：

| Flutter | RN |
|---|---|
| `home/view/home_page.dart` | `src/screens/HomeScreen.tsx` |
| `home/view/home_learning_report_page.dart` | `src/screens/HomeLearningReportScreen.tsx` |
| `home/view/check_in_mall_page.dart` | `src/screens/CheckInMallScreen.tsx` |
| `home/view/all_services_page.dart` | `src/screens/AllServicesScreen.tsx` |
| `home/view/widgets/*` | `src/components/*` |
| `home/controller/home_controller.dart` | `src/store/homeSlice.ts` |
| `home/controller/all_services_controller.dart` | `src/store/allServicesSlice.ts` |
| `home/api/*` | `src/services/homeApi.ts` |
| `home/model/*` | `src/models/*` |
| `home/web/home_web_handlers.dart` | `src/web/registerHomeWebHandlers.ts` |
| `home_module.dart` | `src/registerHomeFeature.ts` |

特殊处理：

- `all_services_data.dart` 中跳转到 bfui/music/video 的 route key 保留为字符串/typed route，不 import 目标 feature。
- 首页不渲染 music mini player。mini player 由 app shell 或 `@features/music` slot 提供。

### `@features/settings`

| 项 | 内容 |
|---|---|
| Flutter 源路径 | `packages/features/settings` |
| RN 目标路径 | `packages/feature-modules/@features/settings` |
| 职责 | 我的、设置、HTTP 测试、发票 demo |
| Core 依赖 | `@core/api-client`, `@core/navigation`, `@core/domain` |
| 工作量 | 高 |

文件映射：

| Flutter | RN |
|---|---|
| `mine/view/mine_page.dart` | `src/screens/MineScreen.tsx` |
| `settings/view/settings_page.dart` | `src/screens/SettingsScreen.tsx` |
| `settings/view/dialog_demo_page.dart` | `src/screens/DialogDemoScreen.tsx` |
| `mine/view/mine_http_test_page.dart` | `src/screens/MineHttpTestScreen.tsx` |
| `deal_invoice/view/*` | `src/screens/dealInvoice/*` |
| `mine/widgets/*` | `src/components/mine/*` |
| `deal_invoice/widgets/*` | `src/components/dealInvoice/*` |
| `mine/controller/mine_controller.dart` | `src/store/mineSlice.ts` |
| `deal_invoice/viewmodel/*` | `src/store/dealInvoiceSlice.ts` |
| `settings/viewmodel/settings_viewmodel.dart` | `src/store/settingsSlice.ts` |
| `settings_module.dart` | `src/registerSettingsFeature.ts` |

特殊处理：

- linking/realtime/im/bluetooth debug routes 不由 settings 直接 import 页面。
- settings 只展示入口；实际 route registration 由对应 core-block 或 app shell 注册。

### `@features/chat`

| 项 | 内容 |
|---|---|
| Flutter 源路径 | `packages/features/chat` |
| RN 目标路径 | `packages/feature-modules/@features/chat` |
| 职责 | 会话列表、聊天详情、消息输入、消息展示 |
| Core 依赖 | `@core/im`, `@core/domain`, `@core/navigation` |
| 工作量 | 高 |

关键映射：

- `chat/view/chat_page.dart` -> `src/screens/ChatScreen.tsx`
- `chat/view/chat_detail_page.dart` -> `src/screens/ChatDetailScreen.tsx`
- `chat/widgets/*` -> `src/components/*`
- `chat/models/*` -> `src/models/*`
- `chat/repository/*` -> `src/services/chatRepository.ts`
- `chat/viewmodel/*` -> `src/store/chatSlice.ts`, `src/store/chatDetailSlice.ts`

验收：

- [ ] 会话列表 mock 数据可展示。
- [ ] chat detail typed params 支持 private/group。
- [ ] 消息列表 FlatList key 稳定。
- [ ] IM 实现通过 `@core/im` 注入。

### `@features/community`

职责：动态流、发布、评论、富文本、图片/视频预览。

关键映射：

- `community/view/community_page.dart` -> `src/screens/CommunityScreen.tsx`
- `community/view/publish_page.dart` -> `src/screens/PublishScreen.tsx`
- `community/view/image_preview_page.dart` -> `src/screens/ImagePreviewScreen.tsx`
- `community/view/video_play_page.dart` -> `src/screens/VideoPreviewScreen.tsx`
- `community/widgets/*` -> `src/components/*`
- `community/services/rich_text_parser.dart` -> `src/services/richTextParser.ts`
- `community/viewmodel/community_viewmodel.dart` -> `src/store/communitySlice.ts`

风险：富文本点击、图片网格、视频预览库兼容性。

### `@features/music`

职责：音乐列表、Now Playing、迷你播放条 UI。

关键映射：

- `view/music_list_page.dart` -> `src/screens/MusicListScreen.tsx`
- `view/now_playing_page.dart` -> `src/screens/NowPlayingScreen.tsx`
- `controller/music_playback_controller.dart` -> `src/store/musicSlice.ts`
- `service/audio_player_service.dart` -> `@core/media-player/src/audio`
- `widgets/music_mini_player_bar.dart` -> `src/slots/MusicMiniPlayerBar.tsx`

特殊处理：

- 音频播放 facade 放在 `@core/media-player`。
- `MusicMiniPlayerBar` 可被 app shell import，但 home 不允许 import。

### `@features/video`

职责：视频入口、短视频列表、短视频播放。

关键映射：

- `videos/view/video_page.dart` -> `src/screens/VideoScreen.tsx`
- `short_video/view/short_video_page.dart` -> `src/screens/ShortVideoScreen.tsx`
- `short_video/view/short_video_play_page.dart` -> `src/screens/ShortVideoPlayScreen.tsx`
- `short_video/widgets/*` -> `src/components/shortVideo/*`
- `short_video/mapper/short_video_player_mapper.dart` -> `src/services/shortVideoMapper.ts`

视频播放依赖 `@core/media-player`，不直接封装 native player。

### `@features/bfui`

职责：BFUI 模板展示。

迁移策略：

- 保持单独 feature，不拆成 hotel/fitness/course 多个 feature。
- 资源和字体迁入 `src/assets` 或 app assets。
- 动效复杂页面允许阶段性降级，但必须标注差异。

优先级低，建议在核心业务稳定后迁移。

### `@features/live`, `@features/friend`, `@features/pay`

低复杂度入口模块：

- `live/view/live_page.dart` -> `@features/live/src/screens/LiveScreen.tsx`
- `live/view/live_room_page.dart` -> `@features/live/src/screens/LiveRoomScreen.tsx`
- `friend/view/friend_page.dart` -> `@features/friend/src/screens/FriendScreen.tsx`
- `pay/view/pay_page.dart` -> `@features/pay/src/screens/PayScreen.tsx`

## Core Blocks 迁移清单

| Core block | 源路径 | 工作 |
|---|---|---|
| `@core/domain` | `commons/core/lib/model`, `service`, `web` | 类型和接口优先迁移，不带实现 |
| `@core/navigation` | `packages/route` | route constants、registry、auth guard、navigation ref |
| `@core/api-client` | `commons/network` | axios manager、interceptors、retry、typed error |
| `@core/storage` | `commons/storage`, `sp_utils` | AsyncStorage、SQLite adapter、本地 settings |
| `@core/config` | `commons/core/lib/env` | env config、runtime flags |
| `@core/supabase` | `infrastructure/supabase` | Auth/Profile adapter |
| `@core/linking` | `infrastructure/linking` | deep link parser、route intent、push payload |
| `@core/realtime` | `infrastructure/realtime` | WebSocket、reconnect、heartbeat、queue |
| `@core/im` | `infrastructure/rongcloud_im` | IM session/profile/backup adapters |
| `@core/webview` | `commons/ui/kit/web` | WebView page、bridge registry |
| `@core/bluetooth` | `infrastructure/bluetooth` | BLE connection/permission/debug route |

