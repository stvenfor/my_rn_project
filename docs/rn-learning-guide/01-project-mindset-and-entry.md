# 01 · 项目心智模型与入口

## 1. 为什么不是「一个文件夹塞所有页面」？

本仓库是 **LEGO monorepo**：把 App 拆成可插拔积木。

| 目录 | 职责 | 类比 |
|------|------|------|
| `src/` | App 壳：启动、全局 Provider、根导航、全局 store | 手机外壳 + 主板 |
| `packages/features/*` | 业务功能（auth / home / chat…） | 可插拔业务卡 |
| `packages/core/*` | 跨业务能力（API、存储、路由常量） | 公共电源与总线 |
| `packages/ui/design-system` | 主题色、脚手架组件、Toast | UI 零件库 |
| `packages/commons/toolkit` | 通用工具（如短视频手势） | 工具箱 |

**使用场景：** 新做一个「发票」功能 → 新建 `packages/features/invoice`，不要往 `App.tsx` 里堆页面。

---

## 2. 进程入口：`index.js`

```js
// 必须最先导入：手势库要劫持触摸系统，晚导入会导致手势失效
import 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import {name as appName} from './app.json';

// 注册后台播放服务（音乐模块需要）
TrackPlayer.registerPlaybackService(() => require('./playbackService'));

// 把 React 根组件挂到原生容器上；appName 来自 app.json
AppRegistry.registerComponent(appName, () => App);
```

| 语法 | 含义 | 使用场景 |
|------|------|----------|
| `import 'xxx'`（无绑定） | 只执行模块副作用 | 初始化原生侧能力 |
| `import {name as appName}` | 重命名解构 | 字段名太通用时起清晰名字 |
| `() => require('./x')` | 懒加载 | 推迟加载，避免启动期循环依赖 |

---

## 3. 根组件：`App.tsx`

```tsx
import React from 'react';
import {AppProviders} from '@app/app/AppProviders';

function App() {
  // 根组件尽量「薄」：只挂 Provider，不写业务
  return <AppProviders />;
}

export default App;
```

**注释习惯：** 根组件不做网络请求、不写复杂 UI，方便测试与替换壳。

`@app/...` 是 **路径别名**（见 Babel / tsconfig），等价于 `./src/...`，避免 `../../../`。

---

## 4. Provider 洋葱：`AppProviders.tsx`

React Native 里很多能力靠「上下文（Context）」往下传。本项目从外到内：

```tsx
export function AppProviders() {
  return (
    // 1) 全屏手势根节点（Navigation / 滑动手势依赖）
    <GestureHandlerRootView style={styles.root}>
      {/* 2) Redux：全局状态 */}
      <Provider store={store}>
        {/* 3) 安全区：刘海 / Home Indicator */}
        <SafeAreaProvider>
          <AppBootstrap>
            {/* 4) 全局 Loading / Toast 挂载点 */}
            <LoadingPortal />
            <ToastPortal />
            {/* 5) 导航容器：必须包住所有 Screen */}
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </AppBootstrap>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
```

### `AppBootstrap`：启动时初始化

```tsx
function AppBootstrap({children}: {children: React.ReactNode}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 只在「挂载一次」时跑：依赖 [dispatch]
    initI18n();                       // 国际化
    configureAuthService();           // 鉴权服务
    configureLinkingService();        // 自定义深链映射
    bootstrapMediaPickerService();    // 选图
    createApiClient(ENV_CONFIGS.test.baseUrl); // Axios 单例
    registerHomeWebHandlers(store.dispatch);
    dispatch(loadEnv());              // 读环境 test/staging/production
    dispatch(loadAuthSession());      // 恢复登录态
    dispatch(initMusicPlayer());      // 播放器
  }, [dispatch]);

  return <>{children}</>; // <>...</> = Fragment，不额外生成原生 View
}
```

| 概念 | 解释 | 使用场景 |
|------|------|----------|
| Provider | 把「全局服务」注入子树 | Redux、主题、安全区 |
| `children` | 父组件传入的子节点 | 包装层组件 |
| `<>...</>` Fragment | 多子节点但不增加布局节点 | Bootstrap 只做副作用 |
| `useEffect(..., [deps])` | 依赖变化后执行副作用 | 启动初始化、订阅、定时器 |

---

## 5. 读代码时怎么「顺藤摸瓜」

想搞清「登录页从哪来」：

1. `RootNavigator` → `collectFeatureRoutes()`
2. `src/config/moduleManifest.ts` → `registerAuthFeature()`
3. `packages/features/auth/src/registerAuthFeature.ts` → `LoginScreen`
4. `packages/features/auth/src/screens/LoginScreen.tsx` → UI + dispatch thunk

想搞清「用户信息存在哪」：

1. `authSlice` 的 `state.user`
2. `store` 里 `auth: authReducer`
3. 屏幕里 `useSelector(select...)`

想搞清「全部服务某一格点到哪」：

1. `packages/features/home/src/data/allServicesData.ts`（`routePath` / `templateId`）
2. `HomeAllServicesScreen.openService`
3. 目标 feature 的 `register*Feature` + Screen

想搞清「开发调试里的 Live / Pay 从哪进」：

1. `SettingsScreen` 的 `__DEV__` 区块
2. `navigation.navigate(RoutePath.live | friend | pay)`
3. 对应 `packages/features/{live,friend,pay}`

当前业务包一览（不必一次读完，按 [09 路线图](./09-read-code-roadmap.md) 练）：

`auth` · `home` · `chat` · `community` · `settings` · `music` · `video` · `bfui` · `classroom` · `live` · `friend` · `pay`

---

## 6. 小练习

1. 打开 `AppProviders.tsx`，用一句话写出每一层 Provider 的职责。  
2. 把 `createApiClient` 的 `baseUrl` 改成读 `ENV_CONFIGS` 里另一个环境（先别提交），观察请求域名变化。  
3. 在 `SplashScreen` 里把 `800` 改成 `2000`，体会 `navigation.replace` 与 `navigate` 的差别（见导航篇）。  
4. 从 `moduleManifest.ts` 数出当前 `enabledModules` 有几个，对照上面业务包一览。
