# Rule — Metro / Babel module-resolver 别名

## 硬性

1. **禁止**把包别名写成目录：`'@ui/design-system': './packages/ui/design-system/src'`  
2. **必须**用正则精确匹配到 `index.*`，并单独映射深路径：
   ```js
   '^@ui/design-system$': './packages/ui/design-system/src/index.tsx',
   '^@ui/design-system/(.+)$': './packages/ui/design-system/src/\\1',
   ```
3. 新增 monorepo 包时，在 `babel.config.js` **成对**加上述两条（根 + 深路径）。  
4. 改 `babel.config.js` 后必须 `npx react-native start --reset-cache`（含 Harmony packager）。

## 症状 → 动作

| 症状 | 动作 |
|------|------|
| `Cannot read property 'X' of undefined`（`X` 为命名导出，如 `AppPageScaffold`） | 先查 Babel 发出的 `require` 是否为裸目录 `.../src`；再查 barrel 循环依赖 |
| 从 `@ui/design-system` 崩、直连 `@ui/design-system/AppPageScaffold` 正常 | 深路径直连布局组件；slice/service 勿从带 JSX 的大 barrel 拉轻量 API |

## 自检

```bash
node -e "
const babel = require('@babel/core');
const conf = require('./babel.config.js');
const r = babel.transformSync(
  \"import {AppPageScaffold} from '@ui/design-system'; export const x = AppPageScaffold;\",
  { filename: 'src/x.tsx', babelrc: false, configFile: false, presets: conf.presets, plugins: conf.plugins }
);
console.log(r.code.match(/require\\([^)]+\\)/)[0]);
"
```

期望：`.../index.tsx`，**不是**裸 `.../src`。

权威说明：`docs/flutter-to-rn-lego-migration/appendices/metro-babel-module-resolver.md`
