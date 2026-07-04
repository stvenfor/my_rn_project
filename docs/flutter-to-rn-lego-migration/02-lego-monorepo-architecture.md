# LEGO Monorepo 架构设计

## 目标目录结构

```text
packages/
├── apps/
│   └── mobile/
├── feature-modules/
│   ├── @features/auth/
│   ├── @features/home/
│   ├── @features/chat/
│   ├── @features/community/
│   ├── @features/settings/
│   ├── @features/music/
│   ├── @features/video/
│   ├── @features/bfui/
│   ├── @features/live/
│   ├── @features/friend/
│   └── @features/pay/
├── core-blocks/
│   ├── @core/domain/
│   ├── @core/navigation/
│   ├── @core/api-client/
│   ├── @core/storage/
│   ├── @core/config/
│   ├── @core/supabase/
│   ├── @core/linking/
│   ├── @core/realtime/
│   ├── @core/im/
│   ├── @core/media-player/
│   ├── @core/media-picker/
│   ├── @core/permissions/
│   ├── @core/webview/
│   ├── @core/network-status/
│   └── @core/bluetooth/
├── ui-blocks/
│   └── @ui/design-system/
└── utils/
    └── @utils/helpers/
```

## 依赖方向

```text
apps/mobile
  -> feature-modules/@features/*
  -> core-blocks/@core/*
  -> ui-blocks/@ui/design-system

feature-modules/@features/*
  -> core-blocks/@core/*
  -> ui-blocks/@ui/design-system
  -> utils/@utils/helpers

core-blocks/@core/*
  -> utils/@utils/helpers

ui-blocks/@ui/design-system
  -> utils/@utils/helpers
  -> limited @core/domain and @core/config only

utils/@utils/helpers
  -> no internal app packages
```

## Mermaid 依赖图

```mermaid
graph TD
  App[apps/mobile] --> Auth[@features/auth]
  App --> Home[@features/home]
  App --> Chat[@features/chat]
  App --> Community[@features/community]
  App --> Settings[@features/settings]
  App --> Music[@features/music]
  App --> Video[@features/video]
  App --> Bfui[@features/bfui]
  App --> Live[@features/live]
  App --> Friend[@features/friend]
  App --> Pay[@features/pay]

  App --> Nav[@core/navigation]
  App --> UI[@ui/design-system]

  Auth --> Domain[@core/domain]
  Auth --> Supabase[@core/supabase]
  Auth --> Storage[@core/storage]

  Home --> Api[@core/api-client]
  Home --> Webview[@core/webview]

  Chat --> IM[@core/im]
  Chat --> Domain

  Community --> Picker[@core/media-picker]
  Community --> Webview

  Settings --> Linking[@core/linking]
  Settings --> Realtime[@core/realtime]
  Settings --> IM
  Settings --> Bluetooth[@core/bluetooth]

  Music --> Player[@core/media-player]
  Video --> Player
  Live --> Realtime

  Supabase --> Domain
  Linking --> Domain
  Realtime --> Domain
  IM --> Domain
  Api --> Config[@core/config]
  Storage --> Utils[@utils/helpers]
  UI --> Utils
```

## 应用层：`apps/mobile`

职责：

- 保留当前 RN 原生工程能力：iOS、Android、HarmonyOS。
- 承载 `NavigationContainer`、Redux store、全局 providers。
- 聚合 feature registrations。
- 注册 tab、stack route、deep link route。
- 控制全局浮层：loading、toast、push banner、realtime banner、music mini player slot。

不得包含：

- 业务页面内部逻辑。
- HTTP 细节。
- Supabase、IM、Realtime 的业务实现细节。

## Feature Module 接口

每个 feature 暴露统一入口：

```ts
export interface FeatureRegistration {
  id: string;
  routes: RouteRegistration[];
  tabs?: TabRegistration[];
  reducers?: Record<string, Reducer>;
  listeners?: ListenerRegistration[];
  providers?: React.ComponentType<PropsWithChildren>[];
}
```

每个 feature 的 `src/index.ts` 只导出：

- `registerXFeature`
- route params 类型
- reducer 或 selectors 中对外必要部分
- 对 app shell 必须可见的 UI slot，例如 music mini player

Feature 内部目录建议：

```text
src/
├── index.ts
├── registerFeature.ts
├── navigation/
├── screens/
├── store/
├── services/
├── models/
├── components/
└── __tests__/
```

## Core Block 划分

| Core block | Flutter 来源 | RN 职责 |
|---|---|---|
| `@core/domain` | `commons/core/model`, service contracts | 共享类型、AuthSession contract、User、IM、Realtime、WebBridge 类型 |
| `@core/navigation` | `packages/route` | typed route keys、feature registry、tab registry、auth guard、navigation ref |
| `@core/api-client` | `commons/network` | axios、拦截器、重试、环境 header、错误标准化 |
| `@core/storage` | `commons/storage`, `sp_utils` | AsyncStorage、SQLite adapter、本地设置 |
| `@core/config` | `commons/core/env` | env config、Supabase config、runtime flags |
| `@core/supabase` | `infrastructure/supabase` | Supabase auth/profile adapter |
| `@core/linking` | `infrastructure/linking` | deep link、push intent、pending navigation、privacy consent |
| `@core/realtime` | `infrastructure/realtime` | WebSocket、heartbeat、reconnect、queue、notify banner state |
| `@core/im` | `infrastructure/rongcloud_im` | IM session、profile cache、mock/real adapter |
| `@core/media-player` | `toolkit/player`, `music/audio_player_service` | audio/video player facade、playback state |
| `@core/webview` | `commons/ui/kit/web`, core web bridge | RN WebView page、bridge handlers、web navigation |
| `@core/bluetooth` | `infrastructure/bluetooth` | BLE permission、connection controller、debug adapter |

## UI Block：`@ui/design-system`

包含：

- theme tokens：colors、typography、spacing、radius、shadows。
- layout：PageScaffold、Header、SafeInsets、ResponsiveLayout。
- feedback：Dialog、ConfirmDialog、Toast、Loading、RefreshView。
- primitives：Button、TextField、Card、Badge、Avatar、IconButton。

不包含：

- WebView 容器。
- 业务组件。
- IM、音乐、视频、发票等领域 UI。

## Utils：`@utils/helpers`

只包含纯函数：

- date formatter
- string helpers
- html text helpers without RN WebView dependency
- logger facade without native side effects
- number helpers
- validation helpers

不得依赖 React、React Native、core、ui、feature。

## 强制边界规则

- `@features/*` 之间禁止互相 import。
- `@core/*` 禁止 import `@features/*`。
- `@core/*` 禁止 import `@ui/*`，除非是明确的 debug screen 包装层；默认不允许。
- `@ui/design-system` 不得 import `@features/*`。
- `@utils/*` 不得 import workspace 内其他包。
- 跨模块跳转只能通过 `@core/navigation` 的 route key 和 typed params。
- 跨模块共享状态只能通过 core contract 或 app shell 注入。

