# Harmony 三方库矩阵（RN 0.72）

| 用途 | npm 包 | 0.72 版本 | Autolink |
|---|---|---|---|
| RNOH 核心 | `@react-native-oh/react-native-harmony` | 0.72.140 | — |
| 导航栈 | `@react-native-ohos/stack` | 6.4.1-1.rc.1 | 否 |
| 手势 | `@react-native-ohos/react-native-gesture-handler` | 2.14.18 | 是 |
| 原生屏 | `@react-native-ohos/react-native-screens` | 3.34.1 | 是 |
| 安全区 | `@react-native-ohos/react-native-safe-area-context` | 4.7.5 | 是 |
| KV 存储 | `@react-native-ohos/async-storage` | 查 usage-docs | 是 |
| WebView | `@react-native-ohos/react-native-webview` | 13.10.5 | 否 |
| 音频 | `@react-native-ohos/react-native-track-player` | 4.1.3 | 否 |
| NetInfo | `@react-native-ohos/netinfo` | 查 usage-docs | 是 |

集成步骤：`npm install` → `npm run link:harmony` → `npm run codegen` → `cd harmony && ohpm install`

参考：[CPF-RN/usage-docs](https://gitcode.com/CPF-RN/usage-docs)
