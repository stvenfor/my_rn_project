# 04 · Hooks 与副作用

Hooks 是函数组件里「用状态 / 用生命周期 / 用上下文」的 API。规则：

1. 只在函数组件或自定义 Hook **顶层**调用（不要放进 `if` / 循环）。  
2. 自定义 Hook 必须以 `use` 开头。

---

## 1. `useState`：组件本地状态

本项目很多表单状态在 **Redux**，但本地 UI 仍常用 `useState`（开关、临时输入、动画）。

```tsx
const [open, setOpen] = useState(false);
// open: 当前值
// setOpen: 更新函数 → 触发重渲染

setOpen(true);
setOpen(prev => !prev); // 函数式更新：基于旧值，避免闭包过期
```

| 场景 | 放 useState | 放 Redux |
|------|-------------|----------|
| 仅本页弹窗开关 | ✅ | ❌ |
| 登录用户 / 环境 / 跨页共享 | ❌ | ✅ |
| 输入框若多页共享校验 | 可本地，也可进 slice（auth 选择了 slice） |

---

## 2. `useEffect`：副作用

```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    navigation.replace(RoutePath.main);
  }, 800);

  // 清理函数：组件卸载或依赖变化前执行
  return () => clearTimeout(timer);
}, [navigation]); // 依赖数组：这些值变化会重跑 effect
```

| 依赖写法 | 含义 | 场景 |
|----------|------|------|
| `[]` | 只挂载时跑一次 | 启动初始化、订阅 |
| `[a, b]` | a/b 变就重跑 | 跟随 props/state |
| 省略依赖 | 每次渲染都跑 | **几乎不要这样写** |

**使用场景：** 请求、定时器、加监听、与原生模块同步。  
**不要：** 在 effect 里无条件 `setState` 造成死循环。

`AppBootstrap` 里的启动逻辑就是典型 `useEffect(..., [dispatch])`。

---

## 3. `useMemo`：缓存计算结果

```tsx
const greeting = useMemo(() => buildAuthGreeting(), []);
// 依赖不变时复用上次结果，避免每次渲染重新算
```

| 何时用 | 何时别用 |
|--------|----------|
| 计算贵（大列表派生、复杂格式化） | 简单字符串拼接 |
| 要保持引用稳定传给子组件 | 过早优化 |

本项目登录页问候语用了 `useMemo`；多数简单派生直接算即可。

---

## 4. `useCallback`（了解）

缓存「函数引用」。本项目未大规模强制使用；若子组件包了 `React.memo` 且依赖回调，再考虑。

---

## 5. Redux Hooks（本项目封装）

```ts
// src/store/hooks.ts
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

屏幕中：

```tsx
const dispatch = useAppDispatch();
const user = useAppSelector(state => state.auth.user);
```

auth 包内有时用「窄类型」的 `useDispatch` / `useSelector`（只认 `{auth: AuthState}`），方便 feature 自测；App 壳优先 `useApp*`。

---

## 6. 安全区：`useSafeAreaInsets`

```tsx
const insets = useSafeAreaInsets();
// insets.top / bottom / left / right

contentContainerStyle={{
  paddingTop: insets.top + 32,
  paddingBottom: 24 + insets.bottom,
}}
```

**使用场景：** 刘海屏、底部横条；`edgeToEdge` 布局尤其需要。  
前提：外层已有 `SafeAreaProvider`（见 `AppProviders`）。

---

## 7. 窗口尺寸：`useWindowDimensions`

```tsx
const {width} = useWindowDimensions();
const cellWidth = (width - 16) / 5; // 首页宫格按屏宽均分
```

**使用场景：** 响应式网格；旋转屏幕会自动更新。  
对比：`Dimensions.get('window')` 是一次性取值，不自动订阅旋转（旧代码仍可见）。

---

## 8. 自定义 Hook 示例

```ts
// packages/features/home/src/hooks/useHomeMiniPlayerInset.ts
export function useHomeMiniPlayerInset(): number {
  const hasSession = useSelector(selectHasActiveSession);
  if (!hasSession) {
    return 0;
  }
  return MUSIC_MINI_PLAYER_BAR_HEIGHT + MAIN_TAB_BAR_HEIGHT;
}
```

**含义：** 把「首页底部要给迷你播放器留多少空」封成钩子，页面只消费数字。  
**使用场景：** 多处重复的「状态 → UI 间距」推导。

---

## 9. 平台分支（常与 Hooks 同屏出现）

```tsx
behavior={Platform.OS === 'ios' ? 'padding' : undefined}

// Harmony 判断（本项目封装）
import {isHarmonyOS} from '...'; // Platform.OS === 'harmony'
```

| 平台字符串 | 含义 |
|------------|------|
| `ios` / `android` | 常规双端 |
| `harmony` | 鸿蒙 RNOH（三端之一） |

---

## 10. 进房/离房清理（直播 smoke）

`LiveRoomScreen` 一类页面常在 `useEffect` 里 `connect`，**必须在 cleanup 里 `disconnect`**，否则返回列表仍占着 mock 连接：

```tsx
useEffect(() => {
  const adapter = getRealtimeAdapter();
  adapter.connect(roomId);
  return () => {
    adapter.disconnect();
  };
}, [roomId]);
```

短视频页隐藏 StatusBar 同理：进页 `setHidden(true)`，cleanup 恢复。

---

## 11. 小练习

1. 写一个 `useToggle(initial=false)` 自定义 Hook。  
2. 用 `useEffect` 做 3 秒倒计时，注意清理 `setInterval`。  
3. 在首页用 `useWindowDimensions` 打印当前宽度（调试完删掉）。  
4. 打开 `packages/features/live/src/index.tsx`，标出 connect / disconnect 各在哪一行。
