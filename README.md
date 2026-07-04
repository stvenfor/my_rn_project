# MyRnProject

三端 React Native 项目，同时支持 **iOS**、**Android**、**HarmonyOS (OpenHarmony / RNOH)**。

基于 [React Native 0.72.5](https://reactnative.cn/) 与 [CPF-RN / RNOH 生态](https://gitcode.com/org/CPF-RN/repos) 搭建，集成 Stack 导航常用栈。

## 技术栈

| 组件 | 版本 |
|------|------|
| React Native | 0.72.5 |
| @react-native-oh/react-native-harmony | 0.72.140 |
| @react-native-oh/react-native-harmony-cli | 0.72.140 |
| @rnoh/react-native-openharmony (ohpm) | 0.72.140 |
| TypeScript | 4.8.4 |

## 已安装三方库

| 用途 | npm 包 | 版本 |
|------|--------|------|
| 导航容器 | @react-navigation/native | 6.1.17 |
| 栈导航 (Harmony 适配) | @react-native-ohos/stack | 6.4.1-1.rc.1 |
| 手势 (Harmony 适配) | @react-native-ohos/react-native-gesture-handler | 2.14.18 |
| 原生屏 (Harmony 适配) | @react-native-ohos/react-native-screens | 3.34.1 |
| 安全区 (Harmony 适配) | @react-native-ohos/react-native-safe-area-context | 4.7.5 |
| iOS/Android 手势 | react-native-gesture-handler | 2.14.1 |
| iOS/Android 原生屏 | react-native-screens | 3.34.0 |
| iOS/Android 安全区 | react-native-safe-area-context | 4.7.4 |

Harmony 端原生库通过 `react-native link-harmony` 自动链接（Autolinking）。

## 环境要求

- **Node.js** >= 18（推荐 20+）
- **iOS**: Xcode + CocoaPods
- **Android**: Android Studio + SDK + JDK
- **HarmonyOS**:
  - DevEco Studio 5.0.3+
  - HarmonyOS SDK API 12+
  - `ohpm` 与 `hdc` 在 PATH 中
  - 华为开发者账号（签名）
  - macOS 建议设置：`export HDC_SERVER_PORT=7035`
  - 必须设置：`export RNOH_C_API_ARCH=1`

## 项目结构

```
MyRnProject/
├── android/              # Android Gradle 工程
├── ios/                  # iOS Xcode 工程
├── harmony/              # DevEco OpenHarmony 工程
│   ├── AppScope/
│   └── entry/
│       ├── oh-package.json5
│       └── src/main/
│           ├── cpp/              # PackageProvider, autolinking.cmake
│           ├── ets/              # EntryAbility, Index.ets
│           └── resources/rawfile/  # bundle.harmony.js
├── App.tsx               # 导航示例 (Home / Detail)
├── metro.config.js       # 含 Harmony Metro 配置
└── package.json
```

## 快速开始

### 1. 安装依赖

```bash
npm install --registry=https://registry.npmmirror.com
```

### 2. 启动 Metro

```bash
npm start
```

### 3. iOS

```bash
cd ios && pod install && cd ..
npm run ios
```

### 4. Android

```bash
npm run android
```

### 5. HarmonyOS

```bash
export RNOH_C_API_ARCH=1
export HDC_SERVER_PORT=7035   # macOS

# 生成 JS bundle（Release 或首次调试）
npm run dev

# 构建并部署到设备/模拟器
npm run harmony
```

或在 DevEco Studio 中打开 `harmony/` 目录，Sync 后 Run。

## 常用脚本

| 命令 | 说明 |
|------|------|
| `npm start` | 启动 Metro |
| `npm run ios` | 运行 iOS |
| `npm run android` | 运行 Android |
| `npm run dev` | 生成 Harmony JS bundle |
| `npm run harmony` | 构建并运行 Harmony |
| `npm run codegen` | 运行 Harmony codegen |
| `npm run link:harmony` | 重新链接 Harmony 原生库 |

## 新增 Harmony 三方库

1. 在 [CPF-RN/usage-docs](https://gitcode.com/CPF-RN/usage-docs) 查找库名与版本
2. 安装 **鸿蒙适配包**（禁止安装未适配的原版原生库）
3. 执行：

```bash
npm run link:harmony
npm run codegen
cd harmony && ohpm install
```

4. 在 DevEco Studio 中 Sync 两次

## 关键配置说明

- **AppRegistry 名称**: `MyRnProject`（见 `app.json`）
- **Harmony appKey**: `MyRnProject`（见 `harmony/entry/src/main/ets/pages/Index.ets`）
- **Harmony bundleName**: `com.example.myrnproject`（见 `harmony/AppScope/app.json5`）
- 三者必须保持一致，否则 Harmony 端会出现白屏

## 常见问题

### 白屏（Harmony）

- 检查 `appKey` 是否与 `AppRegistry.registerComponent` 名称一致
- 确认 `bundle.harmony.js` 已生成在 `harmony/entry/src/main/resources/rawfile/`
- 运行 `npm run dev` 重新打包

### codegen 缺失

报错 `cannot find module '@rnoh/react-native-openharmony/generated/ts'` 时：

```bash
npm run codegen
cd harmony && ohpm install
```

### 版本不匹配

RN、RNOH npm、RNOH ohpm 三者版本必须对齐（当前均为 0.72.x 线）。禁止单独升级 RN patch 版本。

### npm 安装缓慢

国内环境建议使用镜像：

```bash
npm install --registry=https://registry.npmmirror.com
```

### iOS pod install 失败 (boost checksum)

RN 0.72 常见 boost 校验和问题，可尝试：

```bash
cd ios
pod cache clean boost --all
pod install --repo-update
```

或参考 [React Native 0.72 iOS 环境文档](https://reactnative.cn/docs/environment-setup) 排查 CocoaPods 配置。


- [React Native 中文网](https://reactnative.cn/)
- [CPF-RN 组织仓库](https://gitcode.com/org/CPF-RN/repos)
- [RNOH 核心仓库](https://gitcode.com/CPF-RN/ohos_react_native)
- [三方库 usage-docs](https://gitcode.com/CPF-RN/usage-docs)
- [rnt 验收用例集](https://gitcode.com/CPF-RN/rnt)（参考集成方式，非脚手架）
