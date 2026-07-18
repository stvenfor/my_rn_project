# Harmony 三方库矩阵（RN 0.77）

| 用途 | npm 包 | 0.77 版本 | Autolink |
|---|---|---|---|
| RNOH 核心 | `@react-native-oh/react-native-harmony` | 0.77.72 | — |
| 导航栈 | `@react-native-ohos/stack` | 7.2.11 | 否 |
| 手势 | `@react-native-ohos/react-native-gesture-handler` | 2.23.4 | 否（需手动/link-harmony） |
| 原生屏 | `@react-native-ohos/react-native-screens` | 4.8.3-rc.2 | 查 usage-docs |
| 动画 | `@react-native-ohos/react-native-reanimated` | 3.18.2 | 是（screens 4.x 依赖） |
| 安全区 | `@react-native-ohos/react-native-safe-area-context` | 5.1.1 | 是 |
| KV 存储 | `@react-native-ohos/async-storage` | 2.2.1 | 是 |
| WebView | `@react-native-ohos/react-native-webview` | 13.15.2 | 否 |
| 视频 | `@react-native-ohos/react-native-video` | 6.14.1 | 否 |
| 音频 | `@react-native-ohos/react-native-track-player` | 4.2.0 | 否 |
| 选图 | `@react-native-ohos/react-native-image-picker` | 8.2.4 | 查 usage-docs |

集成步骤：`npm install` → `npm run link:harmony` → `npm run codegen` → `cd harmony && ohpm install`

参考：[CPF-RN/usage-docs](https://gitcode.com/CPF-RN/usage-docs) · [0.72→0.77 升级指导](https://gitcode.com/CPF-RN/ohos_react_native)
