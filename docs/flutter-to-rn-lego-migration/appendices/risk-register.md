# 风险台账

| ID | 风险 | 影响模块 | 严重级别 | 触发条件 | 缓解方案 | 验收证据 |
|---|---|---|---|---|---|---|
| R-001 | feature-to-feature import 复现 | home, music, all features | 高 | Cursor 为快速实现直接 import 其他 feature | ESLint 禁止；app shell slot；route key 跳转 | lint 报告、grep 结果 |
| R-002 | core-block 依赖 auth feature | linking, realtime, im | 高 | 迁移 Flutter infrastructure 依赖时照搬 auth import | `@core/domain` 定义 session contract，app 注入实现 | core-block grep 无 `@features/auth` |
| R-003 | HarmonyOS native 库缺失 | media, webview, BLE, storage | 高 | RN 社区库无 OHOS 适配 | facade + mock adapter；专项阶段验证；必要时平台降级 | Harmony smoke test 或风险记录 |
| R-004 | workspace 迁移破坏现有 RN app | apps/mobile | 高 | 移动原生目录或 Metro 配置不完整 | 分步迁移；先确保 app shell 启动 | iOS/Android/Harmony 启动日志 |
| R-005 | 路由参数不安全 | navigation, chat, video | 中 | 使用 `any` 或传 class instance | typed route params；JSON serializable | typecheck 和 route tests |
| R-006 | UI token 未统一 | all features | 中 | 页面直接写颜色/字体/间距 | design-system theme；review grep | theme usage review |
| R-007 | Redux state 放入 native service | music, video, realtime, im | 高 | 把播放器/WebSocket/IM engine 放入 slice state | service 在 core singleton/factory，Redux 只存 serializable state | Redux serializable test |
| R-008 | BFUI 资源字体加载失败 | bfui | 中 | package assets 路径迁移错误 | 统一 assets 配置，截图验收 | BFUI route 截图 |
| R-009 | Deep link 与 auth guard 顺序错误 | linking, auth, app | 高 | 未登录 deep link 直接进入受保护页面 | pending navigation + auth guard | deep link integration test |
| R-010 | Music mini player 绑定 Home | home, music, app | 中 | 继续在 Home 内渲染 mini player | app shell slot + media-player state | import boundary check |
| R-011 | WebView bridge 被放入 UI 包 | webview, ui | 中 | 照搬 `module_common_ui/kit/web` | 拆到 `@core/webview` | package file review |
| R-012 | Settings 调试页强耦合 infra | settings, linking, realtime, im, bluetooth | 中 | settings 直接 import debug screen | debug route 由 core/app 注册，settings 只 route navigate | import boundary check |
| R-013 | Supabase session 与 local session 不一致 | auth, supabase, storage | 高 | 登录成功但本地未同步，或登出未清理 | 单一 session service contract | auth integration test |
| R-014 | 短视频性能不达标 | video, media-player | 中 | FlatList/player 复用不当 | windowing、player pool facade、性能 smoke | scroll/play manual test |
| R-015 | IM mock 与真实 adapter contract 不一致 | chat, im | 中 | mock 返回字段与真实 SDK 不同 | contract tests 固定 shape | adapter contract tests |

## 风险处理流程

1. Cursor 在 Delivery Report 中新增或更新风险。
2. Codex 判断风险是否阻塞当前阶段。
3. 阻塞风险必须先解决或由用户明确降级。
4. 非阻塞风险必须写明 owner、阶段和验收证据。

