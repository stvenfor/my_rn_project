# 依赖映射表

## Flutter 到 RN 依赖映射

| Flutter 依赖 | Flutter 用途 | RN 替代方案 | LEGO 归属 | HarmonyOS 风险 |
|---|---|---|---|---|
| `get` | 路由、DI、状态 | React Navigation + Redux Toolkit | app/core/features | 低 |
| `dio` | HTTP client | `axios` | `@core/api-client` | 低 |
| `shared_preferences` | KV 存储 | `@react-native-async-storage/async-storage` | `@core/storage` | 中，需确认 OHOS package |
| `sqflite` | SQLite | SQLite RN adapter 或 WatermelonDB | `@core/storage` | 高 |
| `supabase_flutter` | Auth/Profile | `@supabase/supabase-js` | `@core/supabase` | 中 |
| `web_socket_channel` | WebSocket | RN global WebSocket | `@core/realtime` | 中 |
| `uuid` | ID | `uuid` | core/features | 低 |
| `connectivity_plus` | 网络状态 | `@react-native-community/netinfo` | `@core/network-status` | 中 |
| `audioplayers` | 音频播放 | `react-native-track-player` 或平台 adapter | `@core/media-player` | 高 |
| `video_player` | 视频播放 | `react-native-video` | `@core/media-player` | 高 |
| `flutter_inappwebview` | WebView | `react-native-webview` | `@core/webview` | 高 |
| `permission_handler` | 权限 | `react-native-permissions` | `@core/permissions` | 高 |
| `image_picker` | 图片选择 | `react-native-image-picker` | `@core/media-picker` | 高 |
| `cached_network_image` | 图片缓存 | RN Image 或 fast image adapter | `@ui/design-system`/core | 中 |
| `flutter_svg` | SVG | `react-native-svg` | `@ui/design-system` | 中 |
| `lottie` | 动效 | `lottie-react-native` | feature/ui | 高 |
| `flutter_screenutil` | 屏幕适配 | design-system scaling helpers | `@ui/design-system` | 低 |
| `flutter_easyloading` | Loading | design-system Loading portal | `@ui/design-system` | 低 |
| `flutter_easyrefresh` | Refresh | `RefreshControl` wrapper | `@ui/design-system` | 低 |
| `photo_view` | 图片预览 | image zoom viewer | feature/community | 中 |
| `flutter_rating_bar` | 评分 | custom component | feature/bfui | 低 |
| `font_awesome_flutter` | icons | `react-native-vector-icons` or SVG assets | ui/feature | 中 |
| `flutter_blue_plus` | BLE | RN BLE adapter | `@core/bluetooth` | 高 |
| `intl` | i18n/date | `i18next`, `date-fns` | `@core/i18n`, utils | 低 |

## 内部包映射

| Flutter 包 | RN 包 |
|---|---|
| `module_route` | `@core/navigation` |
| `module_core` | `@core/domain`, `@core/config` |
| `module_http` | `@core/api-client` |
| `module_global_cache` | `@core/storage` |
| `module_common_ui` | `@ui/design-system`, `@core/webview` |
| `module_utils` | `@utils/helpers`, `@core/media-player`, `@core/permissions`, `@core/media-picker` |
| `module_supabase` | `@core/supabase` |
| `module_linking` | `@core/linking` |
| `module_realtime` | `@core/realtime` |
| `module_rongcloud_im` | `@core/im` |
| `module_bluetooth` | `@core/bluetooth` |
| `module_auth` | `@features/auth` |
| `module_home` | `@features/home` |
| `module_chat` | `@features/chat` |
| `module_community` | `@features/community` |
| `module_settings` | `@features/settings` |
| `module_music` | `@features/music` |
| `module_video` | `@features/video` |
| `module_bfui` | `@features/bfui` |
| `module_live` | `@features/live` |
| `module_friend` | `@features/friend` |
| `module_pay` | `@features/pay` |

