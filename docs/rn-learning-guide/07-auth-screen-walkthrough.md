# 07 · 登录页完整走读（串知识）

目标：读懂 `packages/features/auth/src/screens/LoginScreen.tsx` 里每一类语法在干什么。

建议对照打开源文件阅读。

---

## 1. 导入区在说什么？

```tsx
import React, {useMemo} from 'react';
import {Alert, Keyboard, ..., Platform, ...} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppPageScaffold, AppToast} from '@ui/design-system';
import {loginWithPasswordThunk, updateEmail, ...} from '../authSlice';
```

| 来源 | 用途 |
|------|------|
| `react-native` | 原生基础组件 / API |
| `react-redux` | 读写全局 auth 状态 |
| `@core/navigation` | 路由名 + 屏幕 props 类型 |
| `@ui/design-system` | 页面脚手架、Toast |
| `../authSlice` | 本 feature 的状态与异步登录 |

---

## 2. 组件签名

```tsx
export function LoginScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.login>) {
```

- 这是 **Stack 屏幕组件**，导航库注入 `navigation` / `route`。  
- 类型保证：此屏路由是 `Login`，无 params。  
- 之后可写 `navigation.navigate(RoutePath.register)` 且享受补全。

---

## 3. Hooks 订阅状态

```tsx
const dispatch = useDispatch<AuthDispatch>();
const insets = useSafeAreaInsets();
const credentialMode = useSelector(selectCredentialMode); // 'email' | 'phone'
const email = useSelector(selectAuthEmail);
const isLoading = useSelector(selectAuthLoading);
const greeting = useMemo(() => buildAuthGreeting(), []);
```

**数据流：** 输入框改的是 Redux → selector 取出 → 再喂回 `value={email}`（受控）。

---

## 4. 主按钮：异步 thunk + 结果匹配

```tsx
const onPrimaryPress = async () => {
  if (credentialMode === 'email') {
    const validationError = canLoginWithEmailPassword(authState);
    if (validationError) {
      AppToast.show(validationError); // 本地校验失败：不发请求
      return;
    }

    const result = await dispatch(loginWithPasswordThunk({email, password}));

    if (loginWithPasswordThunk.fulfilled.match(result)) {
      navigateAfterAuth(navigation); // 成功：进主页（或待跳转页）
      return;
    }
    if (loginWithPasswordThunk.rejected.match(result)) {
      showLoginFailure(result.payload); // 失败：Toast / 引导注册
    }
  }
  // phone 分支类似：verifyPhoneOtpThunk
};
```

对应后端编排在 `authSlice` 的 thunk 里（调 `@core/supabase`）。

---

## 5. UI 结构（由外到内）

```tsx
return (
  <AppPageScaffold layout="edgeToEdge" backgroundColor={authTheme.background}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{paddingTop: insets.top + 32, ...}}>
        <Text>{greeting}</Text>
        <AuthSegmentedControl
          value={credentialMode}
          onChange={mode => dispatch(switchCredentialMode(mode as 'email' | 'phone'))}
        />
        {credentialMode === 'email' ? (
          <View>{/* 邮箱 + 密码输入 */}</View>
        ) : (
          <PhoneOtpFormSection />
        )}
        <AuthPrivacyRow />
        <AuthPrimaryButton enabled={enabled} onPress={onPrimaryPress} />
        <LoginFooterLinks />
      </ScrollView>
    </KeyboardAvoidingView>
  </AppPageScaffold>
);
```

读 UI 时问三句话：

1. **状态从哪来？**（selector / props）  
2. **交互改谁？**（dispatch 哪个 action/thunk）  
3. **成功去哪？**（navigation 哪个 RoutePath）

---

## 6. 这条链路的「注册」一侧

```text
registerAuthFeature()
  → routes 含 Login
  → moduleManifest.enabledModules
  → collectFeatureRoutes()
  → RootNavigator <Stack.Screen name="Login" />
```

没有注册，就永远 `navigate` 不到。

---

## 7. 你改一处试试（学习用）

| 改动 | 预期现象 |
|------|----------|
| 问候语改成固定 `"你好"` | 打开登录页立刻变 |
| `enabled` 恒为 `true` | 未填完整也能点（可观察校验被绕过） |
| Toast 文案加前缀 `[AUTH]` | 失败提示变化 |
| `navigateAfterAuth` 改成总是去 Settings | 登录成功落点变化 |

改完用模拟器验证，**学习分支勿强推 main**。

---

## 8. 延伸阅读路径

学完登录后，按同样「三问」方法读（完整路线见 [09](./09-read-code-roadmap.md)）：

1. `packages/features/chat/...`（列表 → 详情 `params`，主题在 `chatTheme`）  
2. `packages/features/home/...`（全部服务 + `homeAssets` registry）  
3. `packages/features/music/...`（跨层播放器；对照 `AppBootstrap`）  
4. `src/navigation/MainTabs.tsx`（Tab 图标与切换）

每读一个文件，在笔记本写三列：**语法 / 含义 / 场景**。

---

## 9. 术语速查

| 中文 | 英文/符号 | 一句话 |
|------|-----------|--------|
| 组件 | Component | 返回 UI 的函数 |
| 属性 | props | 父 → 子的输入 |
| 状态 | state | 会随时间变、变则重渲染 |
| 副作用 | effect | 渲染之外的事（请求、定时器） |
| 派发 | dispatch | 告诉 Redux「发生了某事」|
| 缩减器 | reducer | 根据事件算新 state |
| 异步动作 | thunk | 可写 async 的 action 创建器 |
| 选择器 | selector | 从 state 取/派生数据 |
| 导航栈 | stack | 页面叠放与返回 |
| 安全区 | safe area | 避开刘海与系统条 |
| 别名 | alias | `@features/auth` 这种短路径 |
