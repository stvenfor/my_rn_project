# 02 · JSX、组件与样式

React Native **没有 HTML/CSS DOM**。你写的是「原生组件映射」：

| Web | React Native |
|-----|--------------|
| `<div>` | `<View>` |
| `<span>` / `<p>` | `<Text>`（文字必须包在 Text 里） |
| `<img>` | `<Image>` |
| `<input>` | `<TextInput>` |
| CSS 文件 | `StyleSheet.create` 或内联 `style` 对象 |

---

## 1. 函数组件（本项目主流）

```tsx
// 命名导出：方便按名字 import，也利于 tree-shaking / 测试
export function LoginScreen({navigation}: RootStackScreenProps<...>) {
  return (
    <View>
      <Text>登录</Text>
    </View>
  );
}
```

| 语法 | 含义 | 使用场景 |
|------|------|----------|
| `export function X()` | 命名导出组件 | 页面、可复用组件 |
| `export default` | 默认导出 | 入口文件偶尔用；本项目 feature 多用命名导出 |
| props 解构 `{navigation}` | 只取需要的字段 | 屏幕组件从导航拿到 props |

---

## 2. JSX 表达式与条件渲染

来自登录页的真实模式：

```tsx
{/* 三元：email 模式显示邮箱表单，否则显示手机验证码区 */}
{credentialMode === 'email' ? (
  <View>
    <AuthFilledInput value={email} onChangeText={v => dispatch(updateEmail(v))} />
  </View>
) : (
  <PhoneOtpFormSection />
)}

{/* &&：条件为真才渲染；注意不要用 0 && <X/>（会渲染出 0） */}
{isLoading && <ActivityIndicator />}
```

| 写法 | 何时用 | 注意 |
|------|--------|------|
| `a ? <A/> : <B/>` | 二选一 UI | 分支多时抽子组件 |
| `cond && <X/>` | 可选块 | `cond` 必须是 boolean |
| `array.map(...)` | 列表 | 必须有稳定 `key` |

本项目根导航里的列表注册：

```tsx
{featureRoutes.map(route => (
  <Stack.Screen
    key={route.name}           // key：列表项身份，帮助 React 复用
    name={route.name}
    component={route.component}
  />
))}
```

---

## 3. 事件与受控输入

```tsx
<AuthFilledInput
  value={email}                              // 受控：值来自 Redux
  onChangeText={value => dispatch(updateEmail(value))} // 每次敲字更新 store
  keyboardType="email-address"               // 弹出邮箱键盘
  autoCapitalize="none"                      // 不要自动大写
  secureTextEntry                            // 密码框打点（布尔 prop 简写 = true）
  placeholder="邮箱"
/>
```

| 概念 | 解释 | 使用场景 |
|------|------|----------|
| 受控组件 | 显示值由 state 决定 | 表单、搜索框 |
| `onChangeText` | RN 文本变化回调（不是 Web 的 onChange） | TextInput |
| 布尔 prop 简写 | `secureTextEntry` ≡ `secureTextEntry={true}` | 开关类属性 |

---

## 4. StyleSheet：本项目标准样式写法

```tsx
import {StyleSheet, View, Text} from 'react-native';
import {colors, spacing} from '@ui/design-system';

function Demo() {
  return (
    <View style={[styles.card, {marginTop: spacing.md}]}>
      {/* 数组样式：后面覆盖前面，常用于「基础 + 动态」 */}
      <Text style={styles.title}>标题</Text>
    </View>
  );
}

// StyleSheet.create：校验键名，并做一次内部优化/标识
const styles = StyleSheet.create({
  card: {
    flex: 1,                 // 在父级主轴上吃掉剩余空间（类似 flex-grow）
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',       // RN 里字重常用字符串
    color: colors.text,
  },
});
```

设计系统主题（`packages/ui/design-system/src/theme.ts`）：

```ts
export const colors = { primary: '#53D65B', text: '#1A1A1A', /* ... */ };
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
```

**使用场景：** 颜色/间距不要在业务里写魔法数字；先查 `colors` / `spacing`，feature 专属色再放 `features/*/theme`。

### 布局常用属性速查

| 属性 | 含义 | 场景 |
|------|------|------|
| `flex: 1` | 撑满剩余空间 | 根容器、列表外层 |
| `flexDirection: 'row'` | 横排（默认 column） | 工具栏、Tab |
| `justifyContent` | 主轴对齐 | 两端对齐、居中 |
| `alignItems` | 交叉轴对齐 | 垂直居中一行图标 |
| `padding` / `margin` | 内边距 / 外边距 | 留白 |
| `position: 'absolute'` | 绝对定位 | 悬浮按钮、角标 |

---

## 5. 页面脚手架：`AppPageScaffold`

业务页很少直接从裸 `View` 起步，而是：

```tsx
<AppPageScaffold layout="edgeToEdge" backgroundColor={authTheme.background}>
  {/* 页面内容 */}
</AppPageScaffold>
```

| `layout` | 含义 | 场景 |
|----------|------|------|
| `standard` | 常规带安全处理 | 设置页等 |
| `edgeToEdge` | 内容可延伸到边缘 | 登录沉浸式 |
| `mainTabRoot` | 主 Tab 根页 | 首页 Tab |
| `fullBleed` | 全出血媒体 | 视频/大图 |

**使用场景：** 统一状态栏/背景/安全区策略，避免每页复制一套。

---

## 6. 键盘与滚动（登录页）

```tsx
<KeyboardAvoidingView
  style={styles.flex}
  // iOS 用 padding 顶起；Android 常靠 windowSoftInputMode，behavior 可省略
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
  <ScrollView
    keyboardShouldPersistTaps="handled" // 点按钮时不要先收起键盘导致点不中
    keyboardDismissMode="on-drag"       // 拖动列表收起键盘
    onScrollBeginDrag={Keyboard.dismiss}
    contentContainerStyle={[
      styles.scrollContent,
      {paddingTop: insets.top + 32, paddingBottom: 24 + insets.bottom},
    ]}>
    ...
  </ScrollView>
</KeyboardAvoidingView>
```

---

## 7. 小练习

1. 新建一个 `DemoScreen`：标题 + 按钮，用 `StyleSheet` + `colors.primary`。  
2. 用三元切换「白天/夜晚」背景色（本地 `useState` 即可）。  
3. 对比 `style={styles.a}` 与 `style={[styles.a, styles.b]}` 的覆盖效果。
