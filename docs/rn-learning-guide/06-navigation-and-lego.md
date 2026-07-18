# 06 · 导航与 LEGO 模块化

本项目导航分两层：

1. **根 Stack**（`RootNavigator`）：Splash、Main、登录、各业务二级页  
2. **主 Tab**（`MainTabs`）：首页 / 聊天 / 社区 / 我的

另外用 **feature 注册表** 把各业务包的路由「插」进根 Stack。

---

## 1. 路由常量与类型

见 `packages/core/navigation/src/index.ts`：

```ts
export const RoutePath = {
  splash: 'Splash',
  main: 'Main',
  login: 'Login',
  // ...
} as const;

export type RootStackParamList = {
  Login: undefined;
  LoginPassword: {email: string};
  // ...
};
```

**使用场景：** 任何 `navigate` / `replace` 都走 `RoutePath.xxx`，禁止裸字符串。

---

## 2. 根 Stack

```tsx
import {createStackNavigator} from '@react-native-ohos/stack';
// 注意：为了三端（含鸿蒙）统一，这里用 ohos stack，而不是纯 @react-navigation/stack

const Stack = createStackNavigator<RootStackParamList>();
const featureRoutes = collectFeatureRoutes();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={RoutePath.splash}>
      <Stack.Screen name={RoutePath.splash} component={SplashScreen} />
      <Stack.Screen name={RoutePath.main} component={MainScreen} />

      {featureRoutes.map(route => (
        <Stack.Screen
          key={route.name}
          name={route.name}
          component={route.component}
        />
      ))}
      {/* 另有 Settings / Web / Debug 等壳层页面 */}
    </Stack.Navigator>
  );
}
```

| API | 含义 | 场景 |
|-----|------|------|
| `navigate(name, params?)` | 压入或跳到已有路由 | 去登录、去详情 |
| `replace(name)` | 替换当前页（返回栈无上一页） | Splash → Main |
| `goBack()` | 返回 | 关闭二级页 |
| `headerShown: false` | 隐藏默认导航栏 | 自绘 NavBar / 沉浸式 |

Splash 示例：

```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    navigation.replace(RoutePath.main); // 用 replace，避免返回又进闪屏
  }, 800);
  return () => clearTimeout(timer);
}, [navigation]);
```

---

## 3. Feature 注册：`register*Feature`

```ts
// packages/features/auth/src/registerAuthFeature.ts
export function registerAuthFeature(): FeatureRegistration {
  return {
    moduleId: 'auth',
    reducer: {key: 'auth', reducer: authReducer},
    routes: [
      {name: RoutePath.login, component: LoginScreen as StackScreenComponent},
      {name: RoutePath.register, component: RegisterScreen as StackScreenComponent},
      // ...
    ],
  };
}
```

带 Tab 的 feature（如 home）还会返回：

```ts
tab: {
  name: 'HomeTab',
  label: '...',
  order: 0,
  component: HomeScreen,
  // icon...
}
```

---

## 4. 模块清单：`moduleManifest.ts`

```ts
export const enabledModules: FeatureRegistration[] = [
  registerHomeFeature(),
  registerChatFeature(),
  registerAuthFeature(),
  // 想下线某个模块：从这里拿掉即可（仍保留包代码）
];

export function collectFeatureRoutes() {
  return enabledModules.flatMap(m => m.routes ?? []);
}

export function collectMainTabs() {
  return enabledModules
    .filter(m => m.tab)
    .map(m => m.tab!)
    .sort((a, b) => a.order - b.order);
}
```

| 函数 | 作用 |
|------|------|
| `collectFeatureRoutes` | 喂给根 Stack |
| `collectMainTabs` | 喂给底部 Tab |
| `collectFeatureReducers` | 预留：动态挂 reducer |

**使用场景：** 开关实验模块、控制打包进导航的页面集合。

---

## 5. 边界规则（非常重要）

- **禁止** `features/a` import `features/b` 的内部文件。  
- 跨 feature 协作：通过 `@core/*`、App 壳、或明确的公共类型。  
- 对外只从 feature 的 `src/index.ts` 导出。

这样 LEGO 才真的「可拔插」。

---

## 6. 路径别名如何服务导航

```ts
import {registerAuthFeature} from '@features/auth';
import {RoutePath} from '@core/navigation';
import {collectFeatureRoutes} from '@app/config/moduleManifest';
```

新建 feature 时清单：

1. `packages/features/foo/` + `package.json`（workspaces）  
2. `registerFooFeature.ts` + `index.ts`  
3. `RoutePath` / `RootStackParamList` 补类型  
4. `moduleManifest` 注册  
5. `babel.config.js` / `tsconfig.json` 加 `@features/foo`（若尚未通配）

---

## 7. 深链（简化版）

`@core/linking` 维护路径映射（如 `/login` → `Login`），**不是**直接给 `NavigationContainer` 的 `linking` 配置。调试页：`DebugLinking`。

---

## 8. 小练习

1. 从 `moduleManifest` 临时去掉 `registerBfuiFeature()`，确认相关路由进不去。  
2. 从首页 `navigate` 到登录，再 `replace` 回 Main，感受返回栈差异。  
3. 给 `LoginPassword` 补一次跳转：带上 `{email}`，在目标页 `route.params.email` 读出。
