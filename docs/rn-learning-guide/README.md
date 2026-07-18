# React Native 学习指南（基于本仓库）

面向初学者：用 **本项目真实代码** 解释常见语法、注释含义与使用场景。  
当前主分支栈：**RN 0.72.5 / React 18.2 / RTK 2.2 / React Navigation 6 / Harmony RNOH 0.72.140**。

## 建议阅读顺序

| 顺序 | 文档 | 你将学会 |
|------|------|----------|
| 1 | [01-项目心智模型与入口](./01-project-mindset-and-entry.md) | App 怎么启动、Provider 洋葱层、目录怎么读 |
| 2 | [02-JSX组件与样式](./02-jsx-components-and-styles.md) | `View`/`Text`/`StyleSheet`、条件渲染、列表心智 |
| 3 | [03-TypeScript常用语法](./03-typescript-essentials.md) | `type`/`interface`、`as const`、导航类型、别名导入 |
| 4 | [04-Hooks与副作用](./04-hooks-and-effects.md) | `useState`/`useEffect`/`useMemo`、安全区、窗口尺寸 |
| 5 | [05-Redux-Toolkit](./05-redux-toolkit.md) | slice、thunk、selector、typed hooks |
| 6 | [06-导航与LEGO模块](./06-navigation-and-lego.md) | Stack/Tab、`register*Feature`、`moduleManifest` |
| 7 | [07-登录页完整走读](./07-auth-screen-walkthrough.md) | 把前面知识串成一条真实业务链路 |
| 8 | [08-日常速查表](./08-cheatsheet.md) | 别名 / Hooks / Redux / 导航一页纸 |

## 一张图记住本项目

```text
index.js
  └─ App.tsx
       └─ AppProviders（手势 → Redux → SafeArea → 导航容器）
            └─ RootNavigator
                 ├─ Splash → Main（底部 Tab）
                 └─ collectFeatureRoutes()  ← 各 feature 注册的页面
```

业务代码主要落在：

- `packages/features/*`：业务模块（登录、首页、聊天…）
- `packages/core/*`：通用能力（API、存储、路由常量、鉴权…）
- `packages/ui/design-system`：通用 UI / 主题
- `src/`：App 壳（Providers、根导航、全局 store）

## 和迁移文档的关系

- 架构细节：[`docs/flutter-to-rn-lego-migration/02-lego-monorepo-architecture.md`](../flutter-to-rn-lego-migration/02-lego-monorepo-architecture.md)
- 本指南偏 **语法与阅读代码**；迁移文档偏 **怎么从 Flutter 迁过来**。

## 本地快速跑起来

```bash
npm install --legacy-peer-deps
npm start -- --reset-cache
# 另开终端
npm run ios   # 或 android / harmony
```

> 若刚从 `upgrade/rn-0.77` 切回 `main`，务必重新 `npm install`，否则会出现找不到 `metro-react-native-babel-preset` 一类错误。
