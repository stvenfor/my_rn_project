# 05 · Redux Toolkit（本项目状态层）

本项目用 **Redux Toolkit (RTK)** 管理跨页面状态：登录用户、环境、首页仪表盘、聊天列表、音乐会话等。

心智模型：

```text
UI 事件 → dispatch(action 或 thunk)
       → reducer 算出新 state（不可变更新由 Immer 代劳）
       → 订阅了该数据的组件自动重渲染
```

---

## 1. Store 组装

```ts
// src/store/index.ts
export const store = configureStore({
  reducer: {
    auth: authReducer,
    env: envReducer,
    app: appReducer,
    home: homeReducer,
    chat: chatReducer,
    music: musicReducer,
    // ...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

| 概念 | 含义 | 场景 |
|------|------|------|
| `configureStore` | 创建 store，自带好用默认中间件 | App 唯一 store |
| `reducer` 映射 | 每个 key 是 state 上的一棵子树 | `state.auth` / `state.home` |
| `RootState` | 整个 state 的 TS 类型 | selector / hooks |
| `AppDispatch` | 可 dispatch 同步 action 与 thunk | typed dispatch |

---

## 2. Slice：状态 + 同步更新

```ts
const authSlice = createSlice({
  name: 'auth',                 // action type 前缀：auth/xxx
  initialState,
  reducers: {
    updateEmail(state, action: PayloadAction<string>) {
      // 看起来在「直接改 state」，实际 Immer 会生成新不可变对象
      state.email = action.payload;
    },
    switchCredentialMode(state, action: PayloadAction<'email' | 'phone'>) {
      state.credentialMode = action.payload;
    },
    togglePrivacy(state) {
      state.agreedPrivacy = !state.agreedPrivacy;
    },
  },
  // extraReducers：响应异步 thunk 的 pending/fulfilled/rejected
});

export const {updateEmail, switchCredentialMode, togglePrivacy} = authSlice.actions;
export const authReducer = authSlice.reducer;
```

| 语法 | 含义 | 使用场景 |
|------|------|----------|
| `createSlice` | 一次定义 reducer + action creators | 绝大多数业务状态 |
| `PayloadAction<T>` | 带载荷的 action 类型 | `dispatch(updateEmail('a@b.c'))` |
| `state.xxx =` | Immer 草稿写法 | 避免手写展开拷贝 |

**使用场景：** 表单字段、UI 开关、列表本地过滤条件等同步更新。

---

## 3. `createAsyncThunk`：异步流程

```ts
export const loginWithPasswordThunk = createAsyncThunk(
  'auth/loginWithPassword', // type 前缀
  async (params: {email: string; password: string}, {rejectWithValue}) => {
    try {
      const user = await getAuthService().signInWithPassword(
        params.email.trim(),
        params.password,
      );
      await getAuthSessionService().setUser(user);
      return user; // → fulfilled 的 payload
    } catch (error) {
      return rejectWithValue(mapAuthError(error)); // → rejected 的 payload
    }
  },
);
```

在组件里：

```tsx
const result = await dispatch(loginWithPasswordThunk({email, password}));

if (loginWithPasswordThunk.fulfilled.match(result)) {
  navigateAfterAuth(navigation);
}
if (loginWithPasswordThunk.rejected.match(result)) {
  showLoginFailure(result.payload);
}
```

| 阶段 | action | 常见处理 |
|------|--------|----------|
| `pending` | 请求中 | `isLoading = true` |
| `fulfilled` | 成功 | 写入 `user`，关 loading |
| `rejected` | 失败 | Toast / Alert，关 loading |

这些阶段在 `extraReducers` 里用 `builder.addCase(...)` 接。

**使用场景：** 登录、拉首页、发消息、恢复会话等所有异步。

---

## 4. Selector：从 state 取数据

```ts
export const selectAuthEmail = (state: {auth: AuthState}) => state.auth.email;
export const selectAuthLoading = (state: {auth: AuthState}) => state.auth.isLoading;

// 派生数据：根据 tab 选不同指标（homeSlice）
export const selectCurrentMetrics = (state: {home: HomeState}): HomeMetric[] => {
  const data = state.home.dashboard;
  if (!data) return [];
  switch (state.home.selectedMetricTab) {
    case 1: return data.metricsYesterday;
    case 2: return data.metricsMonth;
    default: return data.metricsToday;
  }
};
```

```tsx
const email = useSelector(selectAuthEmail);
```

**注释：** 当前主分支多数是 **普通函数 selector**（未强制 `createSelector`）。若派生很重且导致多余渲染，再引入 `createSelector` 做记忆化。

---

## 5. Feature 如何挂上 Store

两种常见方式（本项目并存）：

1. **直接在 `src/store/index.ts` 写死** `auth: authReducer`（现状主流）。  
2. Feature 的 `register*Feature()` 声明 `reducer: {key, reducer}`，再由壳聚合（`collectFeatureReducers` 已提供，可演进为动态注入）。

注册声明示例：

```ts
export function registerAuthFeature(): FeatureRegistration {
  return {
    moduleId: 'auth',
    reducer: {key: 'auth', reducer: authReducer},
    routes: [ /* ... */ ],
  };
}
```

---

## 6. 和「服务层」的分工

| 层 | 放什么 | 例子 |
|----|--------|------|
| `packages/core/supabase` | 真正调 API / 读写存储 | `signInWithPassword` |
| `authSlice` thunk | 编排调用 + 映射错误 + 写 state | `loginWithPasswordThunk` |
| Screen | 展示 + 触发 dispatch + 导航 | `LoginScreen` |

**不要**在 Screen 里直接 `axios.get` 散落各处；优先走 core service + thunk。

---

## 7. 小练习

1. 给 `authSlice` 增加一个同步 action `clearPassword`。  
2. 写一个假 thunk：`delayEchoThunk`，1 秒后返回字符串，并在某页按钮触发。  
3. 画一张纸：从点击「登录」到 `state.auth.user` 变化的完整箭头图。
