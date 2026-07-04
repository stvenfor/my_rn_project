# 验收与 QA 方案

## 总体验收门槛

任一阶段放行前必须满足：

- 变更范围与阶段目标一致。
- `npm run lint` 无错误。
- `npm run typecheck` 无错误。
- `npm run test` 通过，或明确列出失败测试与非本阶段原因。
- 无 feature-to-feature import。
- 无 core-to-feature import。
- 新增 UI 使用 `@ui/design-system/theme`。
- 新增公共 API 有导出和最小测试。

## 四层验收

### 1. 静态验收

命令：

```bash
npm run lint
npm run typecheck
npm run test -- --runInBand
```

检查项：

- ESLint 模块边界违规为零。
- TypeScript route params 不使用 `any`。
- Redux state 不包含 service instance、Promise、native handle。
- feature 内不得 import 其他 feature。
- core-block 不得 import feature。

### 2. 单元验收

每个 feature：

- `registerFeature()` 返回正确 id。
- route names 完整。
- reducers 可组合。
- selectors 对空 state 有稳定返回值。
- async thunk 成功和失败路径均有测试。

每个 core-block：

- adapter mock 测试。
- error mapping 测试。
- storage/api/realtime/im 的 contract 测试。

每个 utils：

- 纯函数输入输出测试。
- 不依赖 RN runtime。

### 3. 集成验收

基础壳：

- App 启动进入 splash。
- splash 后进入 main tab。
- Home、Chat、Community、Mine tab 顺序正确。
- 未登录点击 Chat/Community 跳转 Login。
- 登录成功返回 main。
- 登出后受保护 tab 再次要求登录。

路由：

- 首页进入学习报告。
- 首页进入签到商城。
- 首页进入全部服务。
- 全部服务 route key 可跳转 BFUI/Music/Video 目标页，不产生 feature import。
- Mine 进入 Settings。
- Settings 进入 Dialog Demo。

媒体：

- Music list 进入 Now Playing。
- Mini player 只由 app shell 或 music slot 渲染。
- Video list 进入 ShortVideoPlay。

基础设施：

- Deep link 可解析为 route intent。
- Realtime mock 可连接、断开、重连。
- IM mock 可返回 conversation list。
- WebView bridge handler 可注册和触发。

### 4. 三端 Smoke Test

基础 smoke test：

| 平台 | 命令 | 验收 |
|---|---|---|
| iOS | `npm run ios` | 启动、splash、main tab、login |
| Android | `npm run android` | 启动、splash、main tab、login |
| HarmonyOS | `npm run harmony` | 启动、splash、main tab、login |

专项 smoke test：

- WebView：加载本地测试页并触发 bridge。
- Music：播放 mock 音频，切换播放/暂停。
- Video：播放 mock 视频，进入/退出全屏。
- Realtime：mock WebSocket 重连。
- IM：mock 会话进入聊天详情。
- BLE：权限提示和 mock device list。

专项失败不阻塞 P0/P1 基础壳放行，但必须记录在风险台账。

## 阶段验收

### P0 Foundation

放行条件：

- workspace 安装成功。
- app package scripts 可被 root 转发。
- 所有空包可被 TypeScript resolve。
- ESLint 边界规则对故意违规样例能报错。

### P1 Core Features

放行条件：

- auth/home/settings 主路径可运行。
- 登录态和受保护 tab 生效。
- api-client/storage/config 有 mock tests。
- UI tokens 已被页面使用。

### P2 Social/Media

放行条件：

- chat/community/music/video route 可用。
- media-player facade 不泄露 native player 到 feature state。
- music mini player 不依赖 home。
- IM mock 和 media mock 测试通过。

### P3 Infra

放行条件：

- linking/realtime/im/bluetooth 不依赖 auth feature。
- auth session 通过 `@core/domain` contract 注入。
- debug routes 由 app 或 core-block 注册。

### P4 BFUI/Long-tail

放行条件：

- bfui route 列表完整。
- 资源和字体加载路径稳定。
- 动效差异有记录。
- live/friend/pay 至少完成 route smoke test。

## 人工验收记录模板

```md
## Acceptance Record

Date:
Reviewer:
Phase:
Commit/branch:

Automated checks:
- lint:
- typecheck:
- test:

Manual checks:
- iOS:
- Android:
- HarmonyOS:
- Navigation:
- Auth:
- Media:
- Realtime/IM:

Findings:
1.

Decision:
- Approved / Approved with conditions / Rework / Blocked

Required follow-up:
-
```

