# React Native 学习指南（基于本仓库）

面向初学者：用 **本项目真实代码** 解释常见语法、注释含义与使用场景。  
当前主分支栈：**RN 0.72.5 / React 18.2 / RTK 2.2 / React Navigation 6 / Harmony RNOH 0.72.140**。

## 你适合怎么读

| 背景 | 建议 |
|------|------|
| 会一点 Web React，第一次碰 RN | 按 01→08 顺序读，每章做「小练习」 |
| 会 Flutter，要对齐本仓 LEGO | 先扫 01 + 06，再读 [迁移索引](../flutter-to-rn-lego-migration/00-index.md) |
| 已经会跑 App，想读业务 | 直接进 [09 · 读代码路线图](./09-read-code-roadmap.md) |

原则：**少抄概念，多打开对应文件对照**。每读一段，在笔记本写三列：语法 / 含义 / 本页场景。

## 建议阅读顺序

| 顺序 | 文档 | 你将学会 |
|------|------|----------|
| 1 | [01 · 项目心智模型与入口](./01-project-mindset-and-entry.md) | App 启动、Provider 洋葱、目录与顺藤摸瓜 |
| 2 | [02 · JSX组件与样式](./02-jsx-components-and-styles.md) | View/Text/StyleSheet、脚手架、NavBar 返回 |
| 3 | [03 · TypeScript常用语法](./03-typescript-essentials.md) | type/interface、`as const`、导航类型、别名 |
| 4 | [04 · Hooks与副作用](./04-hooks-and-effects.md) | useState/useEffect/安全区/窗口尺寸 |
| 5 | [05 · Redux Toolkit](./05-redux-toolkit.md) | slice、thunk、selector、typed hooks |
| 6 | [06 · 导航与LEGO模块](./06-navigation-and-lego.md) | Stack/Tab、register\*Feature、入口从哪来 |
| 7 | [07 · 登录页完整走读](./07-auth-screen-walkthrough.md) | 把前面知识串成一条真实业务链路 |
| 8 | [08 · 日常速查表](./08-cheatsheet.md) | 别名 / Hooks / Redux / 导航 / 脚手架一页纸 |
| 9 | [09 · 读代码路线图](./09-read-code-roadmap.md) | 按已验收模块练读：chat → music → video… |

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

| 目录 | 职责 |
|------|------|
| `packages/features/*` | 业务模块（auth / home / chat / music / video…） |
| `packages/core/*` | 通用能力（API、存储、`RoutePath`、鉴权、realtime…） |
| `packages/ui/design-system` | `AppPageScaffold` / `AppNavBar` / Toast / tokens |
| `packages/commons/toolkit` | 跨业务工具（如短视频手势播放器） |
| `src/` | App 壳（Providers、根导航、全局 store、`moduleManifest`） |

## 和迁移文档的关系

| 文档集 | 偏重 |
|--------|------|
| **本指南** | 语法、怎么读代码、日常改一处 |
| [flutter-to-rn-lego-migration](../flutter-to-rn-lego-migration/00-index.md) | 怎么从 Flutter 1:1 迁过来、验收清单 |
| [09-agent-programming-playbook](../flutter-to-rn-lego-migration/09-agent-programming-playbook.md) | Agent 切片作战（人读也可当「做任务流程」） |

页/资源状态真相源：`docs/flutter-to-rn-lego-migration/page-resource-parity-manifest.ts`。  
模块是否算「迁完」以 [08-acceptance-checklist](../flutter-to-rn-lego-migration/08-acceptance-checklist.md) 为准，不要只看「路由能进」。

## 本地快速跑起来

```bash
npm install --legacy-peer-deps
npm start -- --reset-cache
# 另开终端
npm run ios   # 或 android / harmony
```

常用质量命令：

```bash
npm run typecheck
npm run lint
npm test
# 聚焦某一包
npx jest packages/features/auth --no-coverage
```

> 若刚从 `upgrade/rn-0.77` 切回 `main`，务必重新 `npm install`，否则会出现找不到 `metro-react-native-babel-preset` 一类错误。

## 学完自检（5 分钟）

能口头说清这五件事，就算入门过关：

1. 从 `index.js` 到某个 `LoginScreen` 的注册链路  
2. `navigate` / `replace` / `goBack` 各什么时候用  
3. 为什么禁止 `features/a` import `features/b`  
4. 一页里：状态从哪来、交互改谁、成功去哪  
5. `AppPageScaffold` + `AppNavBar showBackButton` 怎么搭二级页  
