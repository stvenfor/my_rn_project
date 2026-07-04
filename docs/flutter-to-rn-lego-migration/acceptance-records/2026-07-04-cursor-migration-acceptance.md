# Cursor 迁移验收报告

验收日期：2026-07-04  
验收人：Codex  
仓库：`/Users/mac/Desktop/github/my_rn_project`  
验收对象：Cursor 完成的 Flutter -> RN LEGO 迁移实现  
结论：**返工，不予放行**

## 1. 总体结论

Cursor 已经完成了一个可打包的 React Native monorepo 雏形：

- 新增 `packages/core/*`、`packages/features/*`、`packages/ui/design-system`。
- Android/iOS Metro bundle 均可生成。
- TypeScript 编译通过。
- Jest 当前唯一 smoke test 通过。

但当前实现没有达到迁移计划的验收标准，主要问题是：

1. ESLint 验证失败，限定范围 ESLint 有 191 个问题，其中 182 个 error。
2. `.eslintrc.js` 没有配置模块边界规则，无法防止 feature/core/app 反向依赖。
3. 多个 package 违反 LEGO 边界：core 依赖 app/ui，feature 依赖 app store。
4. 测试覆盖极低，只有 1 个 App render mock，未覆盖 route registration、reducers、core adapters。
5. 大量页面使用 `any` route/navigation，未满足 typed route params 规范。
6. 多个 feature 硬编码颜色和样式，未统一使用 design-system token。
7. Android Gradle assemble 在验收窗口内未完成，被中断，缺少原生构建通过证据。
8. 功能迁移多为 mock/shell，占位和降级较多，尚不能称为完整业务迁移。

因此本轮只能判定为：**JS 可打包的迁移原型已形成，但架构合规性、工程质量和验收证据不足，需要返工后复验。**

## 2. 验收命令证据

### 2.1 TypeScript

命令：

```bash
npm run typecheck
```

结果：通过。

输出摘要：

```text
> my-rn-lego-monorepo@0.0.1 typecheck
> tsc --noEmit
```

### 2.2 Jest

命令：

```bash
npm run test -- --runInBand
```

结果：通过，但覆盖不足。

输出摘要：

```text
PASS __tests__/App.test.tsx
  ✓ renders app shell (11 ms)

Test Suites: 1 passed, 1 total
Tests: 1 passed, 1 total
```

验收评价：该测试 mock 了 `@app/app/AppProviders`，只能证明 `App.tsx` 能渲染空壳，不能证明导航、store、feature、core-block 或业务迁移正确。

### 2.3 ESLint

命令：

```bash
npm run lint
```

结果：未完成。命令超过 90 秒无结果，被中断。

补充命令：

```bash
npx eslint App.tsx src packages --ext .ts,.tsx
```

结果：失败。

输出摘要：

```text
✖ 191 problems (182 errors, 9 warnings)
173 errors and 0 warnings potentially fixable with the --fix option.
```

主要类型：

- Prettier 格式错误。
- 未使用变量。
- `react-native/no-inline-styles` warning。
- 无模块边界违规拦截规则。

### 2.4 Metro Bundle

Android bundle 命令：

```bash
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output /tmp/my_rn_project.android.bundle --assets-dest /tmp/my_rn_project.assets
```

结果：通过。

输出摘要：

```text
info Writing bundle output to:, /tmp/my_rn_project.android.bundle
info Done writing bundle output
info Copying 6 asset files
info Done copying assets
```

iOS bundle 命令：

```bash
npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output /tmp/my_rn_project.ios.bundle --assets-dest /tmp/my_rn_project.ios.assets
```

结果：通过。

输出摘要：

```text
info Writing bundle output to:, /tmp/my_rn_project.ios.bundle
info Done writing bundle output
info Copying 4 asset files
info Done copying assets
```

### 2.5 Android Native Build

命令：

```bash
cd android
./gradlew :app:assembleDebug -x lint
```

结果：未完成。命令运行超过两分钟无新输出，被中断。

最后输出：

```text
> Task :gradle-plugin:compileKotlin UP-TO-DATE
> Task :gradle-plugin:compileJava NO-SOURCE
> Task :gradle-plugin:pluginDescriptors UP-TO-DATE
...
```

验收评价：缺少 Android 原生构建通过证据。Cursor 需要提供完整 `assembleDebug` 结果，或修复构建卡住/耗时异常。

## 3. 架构验收

### 3.1 Monorepo 结构

已实现：

```text
packages/
├── core/
│   ├── api-client
│   ├── config
│   ├── domain
│   ├── i18n
│   ├── media-player
│   ├── navigation
│   ├── storage
│   ├── supabase
│   └── webview
├── features/
│   ├── auth bfui chat community friend home live music pay settings video
└── ui/
    └── design-system
```

与原计划差异：

- 原计划路径是 `packages/core-blocks/@core/*`、`packages/feature-modules/@features/*`、`packages/ui-blocks/@ui/design-system`。
- Cursor 使用了简化路径 `packages/core/*`、`packages/features/*`、`packages/ui/*`。

评价：路径偏离原计划，但 package names 和 alias 仍保持 `@core/*`、`@features/*`、`@ui/design-system`。该差异可接受，但必须在文档中补充为实施变更说明。

### 3.2 模块边界规则

不通过。

`.eslintrc.js` 当前只有默认配置：

```js
module.exports = {
  root: true,
  extends: '@react-native',
};
```

缺失计划要求：

- 禁止 feature-to-feature import。
- 禁止 core import feature。
- 禁止 core import ui，除白名单外。
- 禁止 feature import app。
- 禁止 utils import RN/core/ui/feature。

### 3.3 已发现的边界违规

#### P0: core 反向依赖 app store

文件：`packages/core/webview/src/useCoreBridgeHandlers.ts`

证据：

```ts
import {selectUser} from '@app/store/authSlice';
import {selectCurrentEnv, setEnv} from '@app/store/envSlice';
```

问题：

- `@core/webview` 依赖 `@app/store/*`，违反 `apps -> core` 单向依赖。
- 这会让 core-block 无法独立测试、独立替换，也无法复用于其他宿主。

要求：

- `@core/webview` 只定义 bridge action、registry、handler contract。
- App 层或 feature 层注册 `getEnvironment`、`switchEnvironment`、`getUserInfo` handler。
- core 不直接 import app store。

#### P0: core 依赖 UI

文件：`packages/core/webview/src/WebViewScreen.tsx`、`packages/core/webview/src/useCoreBridgeHandlers.ts`

证据：

```ts
import {ScreenContainer} from '@ui/design-system';
import {AppToast} from '@ui/design-system';
```

问题：

- 计划中 core-block 默认不能依赖 UI。
- WebView screen 如果是 UI 容器，应拆成 feature/app screen；core 只提供 WebView engine/bridge primitives。

#### P1: feature 依赖 app store

文件：

- `packages/features/auth/src/screens/AuthScreens.tsx`
- `packages/features/settings/src/screens/SettingsScreens.tsx`

证据：

```ts
import {setUser} from '@app/store/authSlice';
import {setLocale, setThemeMode} from '@app/store/appSlice';
import {logout, selectIsLoggedIn, selectUser} from '@app/store/authSlice';
import {setEnv, selectCurrentEnv, selectEnvLabel} from '@app/store/envSlice';
```

问题：

- feature module 不能依赖 app implementation。
- feature 应导出自己的 reducer/thunks/selectors，或依赖 core contract。

要求：

- `auth` 自己拥有 auth slice，app store 组合 feature reducer。
- `settings` 不直接读写 app slice；环境、主题、语言应通过 core/app-level contract 或 feature registration 注入。

#### P1: feature registration 未落地

文件：`packages/core/navigation/src/index.ts`

当前 `FeatureRegistration` 只有：

```ts
export interface FeatureRegistration {
  moduleId: string;
  tab?: TabRegistration;
}
```

问题：

- 没有 routes、reducers、listeners、providers。
- `src/config/moduleManifest.ts` 只是静态 tab 清单，未聚合 feature 注册。
- `RootNavigator.tsx` 仍直接 import 每个 feature screen。

评价：

- 当前实现是“手写 app 壳引用所有 screen”，不是计划中的 LEGO module registry。
- App 层直接 import feature 是允许的，但缺少 feature registration 机制会降低后续可插拔性。

## 4. 功能验收

### 4.1 App Shell

部分通过。

已实现：

- `App.tsx` 接入 `AppProviders`。
- `NavigationContainer`、Redux store、i18n、loading/toast portal 已接入。
- `Splash -> Main` 有基础流程。

问题：

- `AppProviders.tsx` 在模块顶层执行副作用：

```ts
initI18n();
configureAuthService();
createApiClient(ENV_CONFIGS.test.baseUrl);
registerHomeWebHandlers(store.dispatch);
store.dispatch(initMusicPlayer() as any);
```

这会让 import AppProviders 时立即初始化服务和 dispatch thunk，不利于测试、热更新和按阶段注入。

建议：

- 将初始化移动到 `AppBootstrap.useEffect`。
- 用 typed `AppDispatch`，移除 `as any`。

### 4.2 Auth

未通过完整验收。

已实现：

- Login、Password、OTP、Register 基础页面。
- Mock Supabase auth service。
- 登录后写入 Redux user。

问题：

- route/navigation 使用 `any`。
- feature 依赖 `@app/store/authSlice`。
- 没有 auth reducer/thunk 测试。
- 登录错误没有 UI handling，Promise reject 会导致未捕获错误。
- 没有 session 持久化。

### 4.3 Home

部分通过。

已实现：

- 首页、学习报告、签到商城、全部服务页面。
- WanAndroid banner 请求。
- Web bridge handler 注册。

问题：

- 使用 `useSelector((s: any) => s.home)`。
- `homeSlice` 依赖 `AppLoading`，feature 业务 store 触发 UI portal，有耦合。
- 缺少 route 和 reducer 测试。

### 4.4 Settings

未通过完整验收。

已实现：

- Mine、Settings、HTTP test。
- 环境切换、语言切换、登出。

问题：

- 直接依赖 app store。
- 原 Flutter 的发票 demo、dialog demo、linking/realtime/im/bluetooth debug 入口未完整迁移。
- 主题切换写入 app slice，但实际 `NavigationContainer`/design-system theme 未使用该 state。

### 4.5 Chat/Community

部分通过。

已实现：

- 基础 screen 和 slice。
- tab 受登录保护。

问题：

- 大量 mock，未接入 `@core/im`。
- 没有 message detail 完整数据模型。
- `ChatDetailScreen` route 使用 `any`。
- 没有 rich text/image/video preview 真实能力。

### 4.6 Music/Video

部分通过。

已实现：

- `@core/media-player` facade。
- `react-native-track-player` / mock fallback。
- Music list、Now Playing、Mini player。
- Video/ShortVideo shell。

问题：

- `MusicMiniPlayerBar` 由 app shell import，避免了 home -> music，这是好的。
- 但很多 dispatch 使用 `as any`。
- video 仍是播放器占位，没有真实 `react-native-video` 或 media-player video facade。
- 大量硬编码深色样式。

### 4.7 BFUI/Long-tail

部分通过。

已实现：

- BFUI gallery 和 template shells。
- 多个模板有 RN 近似 UI。

问题：

- 多个页面标注 degraded/shell。
- 与 Flutter BFUI 55 文件相比，当前是模板化简化迁移，不是完整视觉迁移。
- 缺少截图验收。

## 5. 测试覆盖验收

不通过。

当前测试文件：

```text
__tests__/App.test.tsx
```

缺失：

- 每个 feature 的 route registration 测试。
- 每个 slice 的 reducer/thunk 测试。
- `@core/api-client` error/interceptor 测试。
- `@core/storage` AsyncStorage fallback 测试。
- `@core/supabase` auth success/failure 测试。
- `@core/webview` bridge registry/action 测试。
- `@core/media-player` mock player 测试。
- navigation auth guard 测试。

## 6. 设计系统与样式验收

不通过。

虽然有 `@ui/design-system/src/theme.ts`，但 feature 内仍大量硬编码颜色。

示例：

- `packages/features/auth/src/screens/AuthScreens.tsx`: `borderColor: '#ddd'`, `color: '#888'`
- `packages/features/music/src/MusicMiniPlayerBar.tsx`: `'#1A1A1A'`, `'#333'`, `'#4DD0C8'`
- `packages/features/video/src/index.tsx`: `'#111'`, `'#fff'`, `'#aaa'`
- `packages/features/live/src/index.tsx`: `'#666'`, `'#eee'`, `'#999'`

要求：

- 业务页面使用 `@ui/design-system/theme` token。
- BFUI 可保留 template-local token，但应集中在 `bfuiTheme.ts`，不要散落在组件内。

## 7. Type Safety 验收

不通过。

大量 `any`：

- `navigation: any`
- `route: any`
- `useSelector((s: any) => ...)`
- `dispatch(thunk() as any)`

要求：

- 定义 `RootStackScreenProps`、`MainTabScreenProps`。
- 定义 `useAppDispatch`、`useAppSelector`。
- 移除业务代码中的 `as any`。

## 8. 原生工程验收

部分通过。

已观察：

- app name 从 `HelloWorld` 调整为 `MyRnProject`。
- Android namespace/applicationId 为 `com.example.myrnproject`。
- Android MainActivity 返回 `MyRnProject`。
- iOS target 调整为 `MyRnProject`。
- Metro Android/iOS bundle 均成功。

未通过：

- Android `assembleDebug` 未完成。
- iOS 未执行 `pod install` 或 Xcode build。
- Harmony 未执行 `npm run harmony`。

要求 Cursor 补充：

- Android 完整 `./gradlew :app:assembleDebug -x lint` 结果。
- iOS `pod install` 和至少一次 simulator build 结果。
- Harmony `npm run harmony` 或 bundle-harmony 结果。

## 9. 返工清单

### 必须返工 P0

1. 修复 ESLint。
   - `npx eslint App.tsx src packages --ext .ts,.tsx` 必须 0 error。
   - `npm run lint` 必须可在合理时间内完成。

2. 增加模块边界 ESLint 规则。
   - 禁止 `packages/core/**` import `@app/*`、`@features/*`。
   - 禁止 `packages/features/**` import `@app/*` 和其他 `@features/*`。
   - 禁止 `packages/ui/**` import `@features/*`。

3. 移除 core -> app 反向依赖。
   - 重构 `@core/webview`，把 store selectors/dispatch 注入到 app 层或 feature handler。

4. 移除 feature -> app store 依赖。
   - auth/settings 等 feature 需要自己的 slice 或通过 core/app contract 注入。

5. 提供 Android/iOS/Harmony 原生构建证据。

### 必须返工 P1

1. 增加 typed hooks。
   - `useAppDispatch`
   - `useAppSelector`
   - typed navigation props

2. 移除核心路径中的 `any` 和 `as any`。

3. 增加单元测试。
   - auth slice/service
   - home slice
   - chat/community reducers
   - media-player mock service
   - webview bridge registry
   - navigation auth guard

4. 设计系统 token 化。
   - 将散落颜色迁移到 theme。
   - BFUI 独立 token 集中管理。

### 后续阶段 P2

1. 完成 settings 发票 demo、dialog demo、debug routes。
2. 完成 IM/realtime/linking core-block，而不是 mock 文案。
3. 完成 video 真实播放 adapter。
4. 对 BFUI 做截图对比验收。

## 10. 复验步骤

Cursor 返工后，Codex 复验应执行：

```bash
git status --short
npm run lint
npm run typecheck
npm run test -- --runInBand
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output /tmp/my_rn_project.android.bundle --assets-dest /tmp/my_rn_project.assets
npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output /tmp/my_rn_project.ios.bundle --assets-dest /tmp/my_rn_project.ios.assets
cd android && ./gradlew :app:assembleDebug -x lint
```

并补充静态扫描：

```bash
grep -RIn "from ['\"]@app/" packages || true
grep -RIn "from ['\"]@features/" packages/core packages/features || true
grep -RIn "as any\\|: any" packages src App.tsx || true
grep -RIn "#[0-9A-Fa-f]\\{3,8\\}\\|rgba(" packages/features src || true
```

验收通过标准：

- 上述命令无失败。
- 边界扫描无违规。
- `any` 只允许出现在隔离的第三方 adapter 边界，并有注释说明。
- 硬编码颜色只允许在 design-system 或 feature-local theme 文件中。
- 测试数量覆盖核心 feature/core-block，不再只有 App render smoke test。

## 11. 最终判定

本轮判定：**Rework Required**

允许保留的成果：

- 当前 monorepo 包结构雏形。
- RN alias/Metro/Jest/TypeScript 基础配置。
- Android/iOS Metro bundle 可生成的 JS 迁移基础。
- music mini player 未绑定 home 的方向。

不允许放行的原因：

- ESLint 失败。
- 模块边界未落实且已有违规。
- 测试覆盖不足。
- typed route 和 Redux 类型规范不足。
- 原生三端构建证据不足。
- 多模块仍处于 mock/shell 阶段。

