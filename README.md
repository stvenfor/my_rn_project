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
| TypeScript | 5.3.3 |

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
| 底部 Tab | @react-navigation/bottom-tabs | 6.5.20 |
| 状态管理 | @reduxjs/toolkit + react-redux | 2.2.7 / 9.1.2 |
| 持久化 | @react-native-async-storage/async-storage | 1.21.0 |
| 持久化 (Harmony) | @react-native-ohos/async-storage | 1.21.1 |
| WebView | react-native-webview | 13.10.5 |
| WebView (Harmony) | @react-native-ohos/react-native-webview | 13.10.5 |

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

Flutter → RN 模块化迁移（LEGO monorepo），详见 `docs/rn-migration/`。

```
MyRnProject/
├── App.tsx                    # 入口，挂载 AppProviders
├── src/
│   ├── app/AppProviders.tsx   # Redux / i18n / Navigation / Loading
│   ├── config/moduleManifest.ts
│   ├── navigation/            # RootNavigator + MainTabs
│   └── store/                 # auth / env / app slices
├── packages/
│   ├── core/                  # domain, config, api-client, storage, supabase, i18n, navigation, webview
│   ├── ui/design-system/      # theme, ScreenContainer, PrimaryButton…
│   └── features/              # home, chat, community, settings, auth, music, bfui, …
├── android/
├── ios/
├── harmony/
├── metro.config.js            # monorepo watchFolders + Harmony Metro
└── docs/rn-migration/         # 迁移计划与验收清单
```

### 当前迁移进度

| 模块 | 状态 |
|------|------|
| home / chat / community / settings | Phase 1 MVP（Mock + WanAndroid API） |
| auth | Mock OTP（默认 `USE_MOCK_AUTH=true`，验证码 `123456`） |
| friend / live / pay / video | 占位页 |
| music / bfui | 入口壳页 |
| WebView | 已集成（ICSJavascriptBridge + Core handlers） |
| 音频播放 | `react-native-track-player` + `@react-native-ohos/react-native-track-player` 4.1.x |

### 环境变量

复制 `.env.example` 并按需修改（Mock 模式无需 Supabase 密钥）：

```bash
cp .env.example .env
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
| `npm run typecheck` | TypeScript 类型检查 |
| `npm test` | Jest 单元测试 |

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
- **统一包名 / Bundle ID**: `com.example.myrnproject`
  - Android `applicationId` / `namespace`（见 `android/app/build.gradle`）
  - iOS `PRODUCT_BUNDLE_IDENTIFIER`（见 `ios/MyRnProject.xcodeproj/project.pbxproj`）
  - Harmony `bundleName`（见 `harmony/AppScope/app.json5`）
- **Harmony appKey**: `MyRnProject`（见 `harmony/entry/src/main/ets/pages/Index.ets`）
- 以上名称必须保持一致，否则各端会出现白屏或启动失败

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

RN 0.72 常见 boost 校验和问题。项目已内置 `scripts/patch-boost-podspec.js`，`npm install` 后会自动将 jfrog 源切换为 `archives.boost.io`。

```bash
npm run pod:install
```

### iOS pod install 失败 (SwiftAudioEx / GitHub 超时)

`react-native-track-player` 依赖 `SwiftAudioEx`，CocoaPods 默认从 GitHub 拉取 git 源，国内网络易超时。Podfile 已支持镜像覆盖：

```bash
npm run pod:install
# 或指定镜像
SWIFT_AUDIO_EX_GIT=https://ghproxy.net/https://github.com/DoubleSymmetry/SwiftAudioEx.git npm run pod:install
```

或参考 [React Native 0.72 iOS 环境文档](https://reactnative.cn/docs/environment-setup) 排查 CocoaPods 配置。

## 参考链接

- [React Native 中文网](https://reactnative.cn/)
- [CPF-RN 组织仓库](https://gitcode.com/org/CPF-RN/repos)
- [RNOH 核心仓库](https://gitcode.com/CPF-RN/ohos_react_native)
- [三方库 usage-docs](https://gitcode.com/CPF-RN/usage-docs)
- [rnt 验收用例集](https://gitcode.com/CPF-RN/rnt)（参考集成方式，非脚手架）
