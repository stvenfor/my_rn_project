# 转换速查表

## Widget 到 RN

| Flutter | React Native | 备注 |
|---|---|---|
| `StatelessWidget` | `React.memo(Component)` | 纯展示组件 |
| `StatefulWidget` | function component + hooks | 局部 UI state |
| `Container` | `View` | 样式拆到 StyleSheet |
| `Column` | `View` + `flexDirection: 'column'` | 默认 column |
| `Row` | `View` + `flexDirection: 'row'` |  |
| `Text` | design-system `Text` | 禁止裸样式散落 |
| `Image` | `Image` or image component | 网络/本地路径分开 |
| `GestureDetector` | `Pressable` | 默认使用 Pressable |
| `InkWell` | `Pressable` | ripple 需 Android 专项 |
| `ListView.builder` | `FlatList` | 必须提供 stable key |
| `GridView` | `FlatList` numColumns | 复杂瀑布流用库 |
| `Scaffold` | `PageScaffold` | 来自 design-system |
| `AppBar` | `Header` | 来自 design-system |
| `BottomNavigationBar` | Bottom Tabs / custom tab bar | App shell 统一 |
| `TextField` | `TextInput` | 表单用 react-hook-form |
| `FutureBuilder` | async thunk + loading state | 避免 render 内发请求 |
| `StreamBuilder` | listener middleware / event emitter | 根据源类型选择 |

## 样式映射

| Flutter | RN |
|---|---|
| `EdgeInsets.all(16)` | `{padding: theme.spacing[4]}` |
| `EdgeInsets.symmetric(horizontal: 16)` | `{paddingHorizontal: theme.spacing[4]}` |
| `Color(0xFF123456)` | `theme.colors.*` |
| `BorderRadius.circular(8)` | `{borderRadius: theme.radius.md}` |
| `TextStyle(fontSize: 16, fontWeight: FontWeight.w600)` | `{fontSize: 16, fontWeight: '600'}` |
| `BoxShadow` | `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, `elevation` |
| `Theme.of(context)` | `useTheme()` |

## GetX 到 Redux Toolkit

| GetX | RN |
|---|---|
| `GetxController` | RTK slice + thunks |
| `Bindings.dependencies()` | feature registration + app store setup |
| `Get.put` | provider injection or service factory |
| `Get.find` | explicit import from core adapter or hook |
| `Obx` | `useSelector` |
| `.obs` | slice state |
| `Get.toNamed` | `navigation.navigate` |
| `Get.offAllNamed` | `navigation.reset` |
| `Get.arguments` | typed route params |

## 路由参数

Flutter：

```dart
Get.toNamed(RoutePath.chatDetail, arguments: conversation);
```

RN：

```ts
navigation.navigate(RouteNames.ChatDetail, {
  conversationId,
  type: 'private',
  targetId
});
```

规则：

- 不传完整 class instance。
- params 必须 JSON serializable。
- params 类型由 feature 导出，由 `@core/navigation` 聚合。

## 资源和字体

- Flutter `assets/images` -> RN `assets/images` 或 feature-local assets。
- Flutter package assets 需要在 RN 中显式配置 Metro assetExts。
- BFUI fonts `WorkSans`, `Roboto` 迁移后由 app 统一注册。
- Lottie 资源进入使用它的 feature，但播放器依赖由 app/core 管理。

## l10n

- Flutter ARB 文件迁移为 i18next resource。
- `AppLocalizations.of(context)` 改为 `useTranslation()`。
- route label 不在 feature 内硬编码最终文案；由 app shell 或 i18n key 解析。

