# 模块边界规则

## 允许的 import

Feature 可以：

```ts
import {Button} from '@ui/design-system';
import {RouteNames} from '@core/navigation';
import type {User} from '@core/domain';
import {formatDate} from '@utils/helpers';
```

Core 可以：

```ts
import {safeJsonParse} from '@utils/helpers';
```

UI 可以：

```ts
import {formatNumber} from '@utils/helpers';
import type {AppThemeMode} from '@core/domain';
```

## 禁止的 import

Feature 互相依赖：

```ts
import {MusicMiniPlayerBar} from '@features/music';
```

替代：由 app shell import slot，或通过 `@core/media-player` 暴露状态。

Core 依赖 feature：

```ts
import {AuthSession} from '@features/auth';
```

替代：`@core/domain` 定义 `AuthSessionProvider`，app 注入 auth 实现。

Utils 依赖 RN：

```ts
import {Platform} from 'react-native';
```

替代：放入 core-block，例如 `@core/device`。

## ESLint 草案

```js
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@features/*'],
            message: 'Feature modules must not import other feature modules. Use @core/navigation, @core/domain, or app shell injection.'
          }
        ]
      }
    ]
  },
  overrides: [
    {
      files: ['packages/core-blocks/@core/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@features/*', '@ui/*'],
                message: 'Core blocks must not depend on feature modules or UI blocks.'
              }
            ]
          }
        ]
      }
    },
    {
      files: ['packages/utils/@utils/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@features/*', '@core/*', '@ui/*', 'react-native'],
                message: 'Utils must stay framework-independent and side-effect free.'
              }
            ]
          }
        ]
      }
    }
  ]
};
```

## 跨模块通信替代方案

| 需求 | 禁止方式 | 推荐方式 |
|---|---|---|
| Home 跳转 Music | `import '@features/music'` | route key + navigation |
| Linking 读取登录态 | import auth feature | `@core/domain` AuthSessionProvider |
| Settings 打开 IM debug | import debug page | app/core route registration |
| Home 显示 mini player | import MusicMiniPlayerBar | app shell slot |
| Chat 获取用户资料 | import settings/auth | `@core/domain` user service contract |

## Review 检查点

- `grep -R "@features/" packages/feature-modules` 不应出现跨 feature import。
- `grep -R "@features/" packages/core-blocks` 应为空。
- `grep -R "react-native" packages/utils` 应为空。
- `grep -R "Color(0x" packages` 不适用于 RN，但应检查硬编码 hex color 是否在 theme 外出现。

