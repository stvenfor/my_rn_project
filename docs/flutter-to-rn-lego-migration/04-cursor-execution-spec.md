# Cursor 执行规范

## 基本原则

Cursor 每轮实现必须遵守：

- 只实现当前阶段范围。
- 不引入 feature-to-feature 依赖。
- 不在 feature 中硬编码全局颜色、字体、间距。
- 不把 Flutter GetX 结构机械翻译成全局 singleton。
- 不把 infrastructure 继续依赖 auth feature。
- 不切换包管理器；继续使用 npm 和 `package-lock.json`。

## 每轮交付格式

Cursor 每轮提交给 Codex 审查时必须附带：

```md
## Cursor Delivery Report

Phase:
Scope:

Changed files:
- path

Architecture notes:
- New packages:
- New public APIs:
- Dependency boundary checks:

Verification:
- npm run lint: pass/fail with output summary
- npm run test: pass/fail with output summary
- npm run typecheck: pass/fail with output summary
- platform smoke test: pass/fail/not applicable

Known gaps:
- item with owner and planned phase
```

## 根 package.json workspace 草案

```json
{
  "name": "my-rn-lego-monorepo",
  "private": true,
  "workspaces": [
    "packages/apps/*",
    "packages/feature-modules/@features/*",
    "packages/core-blocks/@core/*",
    "packages/ui-blocks/@ui/*",
    "packages/utils/@utils/*"
  ],
  "scripts": {
    "start": "npm --workspace @apps/mobile run start",
    "ios": "npm --workspace @apps/mobile run ios",
    "android": "npm --workspace @apps/mobile run android",
    "harmony": "npm --workspace @apps/mobile run harmony",
    "lint": "eslint .",
    "test": "jest",
    "typecheck": "tsc --noEmit"
  }
}
```

## 包模板

```json
{
  "name": "@features/auth",
  "version": "0.0.1",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "peerDependencies": {
    "react": "18.2.0",
    "react-native": "0.72.5"
  }
}
```

Core 包示例：

```json
{
  "name": "@core/navigation",
  "version": "0.0.1",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts"
}
```

## `src/index.ts` 模板

Feature：

```ts
export {registerAuthFeature} from './registerAuthFeature';
export type {AuthRouteParams} from './navigation/types';
export {authReducer} from './store/authSlice';
export * from './store/selectors';
```

Core：

```ts
export * from './types';
export * from './createApiClient';
export * from './errors';
```

UI：

```ts
export * from './theme';
export * from './components';
export * from './layout';
export * from './feedback';
```

## Feature registration 规范

```ts
import type {FeatureRegistration} from '@core/navigation';

export function registerAuthFeature(): FeatureRegistration {
  return {
    id: 'auth',
    routes: [
      {name: 'Login', component: LoginScreen},
      {name: 'LoginPassword', component: LoginPasswordScreen},
      {name: 'LoginOtp', component: LoginOtpScreen},
      {name: 'Register', component: RegisterScreen}
    ],
    reducers: {
      auth: authReducer
    }
  };
}
```

要求：

- route name 使用 `@core/navigation` 中的常量或 typed enum。
- route params 类型必须导出。
- registration 不执行网络请求。
- registration 不读取 storage。

## Redux Toolkit 规范

每个复杂 feature 至少包含：

```text
src/store/
├── slice.ts
├── thunks.ts
├── selectors.ts
└── __tests__/
```

规则：

- 异步请求使用 `createAsyncThunk` 或 RTK listener middleware。
- slice state 必须可序列化。
- native service instance 不得放入 Redux state。
- 错误统一映射为 `{code, message, recoverable}`。
- 页面只通过 selector 读取 state。

## React Navigation 规范

- 根 navigator 位于 `apps/mobile`。
- feature 只提供 route registration，不创建根 `NavigationContainer`。
- 跨模块跳转使用 route key，不 import 目标 screen。
- route params 必须有 TypeScript 类型。
- Flutter `Get.arguments` 迁移为 typed route params。

## ESLint 边界要求

必须配置：

- `@features/*` 不能 import `@features/*`。
- `@core/*` 不能 import `@features/*`。
- `@utils/*` 不能 import `@core/*`、`@ui/*`、`@features/*`、`react-native`。
- `@ui/design-system` 不能 import `@features/*`。

详细草案见 `appendices/module-boundary-rules.md`。

## 阶段执行输出

每个阶段必须留下：

- 实现代码。
- 单元测试。
- 验证命令输出摘要。
- 未实现项清单。
- 下一阶段依赖项。

Codex 不接受只说“已完成”的交付。

