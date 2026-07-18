# 03 · TypeScript 常用语法（本项目）

本仓库几乎全是 `.ts` / `.tsx`。你不需要先精通 TS，但要能读懂这些模式。

---

## 1. `type` vs `interface`

```ts
// type：联合、别名、映射都行
export type AppEnv = 'test' | 'staging' | 'production';

// interface：对象形状，可声明合并（本项目 domain 多用 interface）
export interface User {
  id: string;
  email?: string;      // ? = 可选属性
  phone?: string;
  displayName?: string;
  avatar?: string;
}
```

| 语法 | 含义 | 使用场景 |
|------|------|----------|
| `string` / `number` / `boolean` | 基础类型 | 字段 |
| `T \| U` 联合 | 只能是其中之一 | 环境、模式 |
| `?` 可选 | 可以缺省 | API 字段不稳定时 |
| `Record<K, V>` | 键值映射对象 | 路由表、字典 |

---

## 2. `as const` 与路由常量

```ts
export const RoutePath = {
  splash: 'Splash',
  login: 'Login',
  main: 'Main',
  // ...
} as const;
```

`as const` 让对象变成 **只读字面量类型**：

- `RoutePath.login` 的类型是 `'Login'`，不是宽泛的 `string`
- 配合导航参数表，能在 `navigate('Wrong')` 时被 TS 拦住

**使用场景：** 所有路由名、枚举式常量，优先 `as const` 对象，而不是魔法字符串。

---

## 3. 导航参数表（非常重要）

```ts
export type RootStackParamList = {
  Splash: undefined;                 // 无参数
  Login: undefined;
  LoginPassword: {email: string};    // 必须带 email
  ChatDetail: {
    conversationId: string;
    title: string;
    portraitUrl?: string;            // 可选
  };
  // ...
};

// 某个屏幕的 props 类型
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;
```

屏幕里这样用：

```tsx
export function LoginScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.login>) {
  // navigation.navigate(RoutePath.loginPassword, {email})  ← 参数被检查
}
```

| 语法 | 含义 | 使用场景 |
|------|------|----------|
| `keyof T` | T 的所有键名联合 | 约束泛型只能是合法路由 |
| `T extends keyof X` | 泛型上界 | 屏幕 props 工厂 |
| `typeof RoutePath.login` | 取值的类型（`'Login'`） | 与 ParamList 键对齐 |
| `undefined` 参数 | 该路由不接受 params | Splash / Login |

---

## 4. 导入类型：`import type`

```ts
import type {User} from '@core/domain';
import type {RootStackScreenProps} from '@core/navigation';
```

`import type` **只存在于编译期**，运行时会被擦除，避免误把类型当值打包。

**使用场景：** 只使用类型、接口、类型别名时一律 `import type`。

---

## 5. 路径别名（Babel + TS 双配置）

```ts
import {createApiClient} from '@core/api-client';
import {LoginScreen} from '@features/auth';
import {colors} from '@ui/design-system';
import {store} from '@app/store';
```

对应物理路径：

| 别名 | 目录 |
|------|------|
| `@features/auth` | `packages/features/auth/src` |
| `@core/navigation` | `packages/core/navigation/src` |
| `@ui/design-system` | `packages/ui/design-system/src` |
| `@app/store` | `src/store` |

配置文件：`babel.config.js`（Metro 打包）+ `tsconfig.json`（编辑器/类型检查）。**两边要保持一致**，否则会出现「IDE 不报错但运行红屏」或反过来。

---

## 6. 断言与收窄

登录失败处理里的模式：

```ts
const message =
  error && typeof error === 'object' && 'message' in error
    ? String((error as {message: string}).message) // 断言：告诉 TS「按这个形状读」
    : '操作失败，请稍后重试';
```

| 写法 | 含义 | 何时用 |
|------|------|--------|
| `value as T` | 类型断言 | 你比编译器更清楚形状时（慎用） |
| `'x' in obj` | 属性存在收窄 | 未知 error 对象 |
| `typeof x === 'string'` | 基础类型收窄 | 联合类型分支 |

更稳妥的做法是定义 `AuthFailure` 类型 + `isXxxFailure` 类型守卫（本项目已有 `isAccountNotRegisteredFailure`）。

---

## 7. 泛型函数（读懂即可）

```ts
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

含义：把 `useSelector` 特化成「只认本项目 `RootState`」的版本，于是：

```ts
const user = useAppSelector(state => state.auth.user);
// state 自动有类型，user.user 也有补全
```

---

## 8. 小练习

1. 给一个假想路由 `InvoiceDetail: {id: string}` 补全 `RoutePath` + `RootStackParamList`。  
2. 写一个 `function isUser(x: unknown): x is User` 类型守卫。  
3. 把某文件里的 `import {User}` 改成 `import type {User}`，确认仍能通过 `npm run typecheck`。
