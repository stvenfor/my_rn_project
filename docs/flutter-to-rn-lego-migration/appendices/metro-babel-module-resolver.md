# Appendix — Metro / Babel module-resolver（防 `undefined.AppPageScaffold`）

> **Harness 规则：** [`.harness/rules/metro-babel-aliases.md`](../../../.harness/rules/metro-babel-aliases.md)  
> **配置真相源：** 仓库根 `babel.config.js`  
> **背景案例：** 2026-07-19 沉浸式布局后，`HomeUsedCarDetailScreen` 报  
> `TypeError: Cannot read property 'AppPageScaffold' of undefined`

---

## 1. 根因（简）

| 环节 | 错误做法 | 后果 |
|------|----------|------|
| `babel-plugin-module-resolver` | 别名指向**目录** `.../src` | 编译成 `require('.../ui/design-system/src')` |
| Metro `inlineRequires: true` + 循环 init | 目录 `require` 尚未就绪 | 整模块为 `undefined` |
| 业务代码 | `_src.AppPageScaffold` | `Cannot read property 'AppPageScaffold' of undefined` |

与「`AppPageScaffold` 未导出」不同：后者通常是 `Element type is invalid` / `X is not a function`。  
**本坑是整个 `require` 结果为 `undefined`。**

别名若写成 `'@pkg': '.../src/index'`（无扩展名），plugin 仍会**剥掉 index**，发出目录 require，等同踩坑。

---

## 2. 正确别名模板

新增 `@scope/name` 包时，在 `babel.config.js` **成对**添加：

```js
'^@scope/name$': './packages/.../src/index.ts',   // 或 .tsx，与真实入口一致
'^@scope/name/(.+)$': './packages/.../src/\\1',
```

- **精确根路径** → 带扩展名的 `index.*`（避免目录 require）  
- **深路径** → 子文件（保留 `@core/webview/platform` 等）  
- 深路径别名必须能匹配；若用非正则前缀别名且根指向 `index.tsx`，会误生成 `index.tsx/platform`

`tsconfig.json` `paths` 可继续用目录形式（`packages/.../src` + `/*`）；**运行时以 Babel 为准。**

---

## 3. 编码习惯（降低循环面）

1. **布局组件**（`AppPageScaffold` / `AppNavBar`）优先深路径：
   ```ts
   import {AppPageScaffold} from '@ui/design-system/AppPageScaffold';
   import {AppNavBar} from '@ui/design-system/AppNavBar';
   ```
2. **slice / service** 不要从带大量 JSX 的 design-system barrel 拉轻量 API；长期应将 `AppToast` 等抽到独立模块。  
3. feature `index.ts` 避免无必要地再导出全部 Screen；路由用 `register*Feature` 即可。  
4. 改 `babel.config.js` 后：
   ```bash
   npx react-native start --reset-cache
   ```
   Harmony packager 同样需要清缓存重启。

---

## 4. 排查清单

1. 复现栈是否在 `SharedElementSceneView` / 某 Screen 首次渲染？  
2. Babel 自检（见下）→ require 是否为裸 `.../src`？  
3. 深路径直连 `AppPageScaffold` 是否立刻恢复？→ 确认是 barrel/别名问题  
4. 是否刚改过 `babel.config.js` 却未 `--reset-cache`？  
5. 是否新增包只加了目录别名、漏了 `^...$` / 深路径对？

### Babel 自检命令

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

| 输出 | 含义 |
|------|------|
| `require(".../index.tsx")` | 正常 |
| `require(".../design-system/src")` | **异常**，按 §2 改别名 |
| `require(".../index.tsx/AppNavBar")` | 深路径被根别名误拼接，补 `^@ui/design-system/(.+)$` |

---

## 5. Agent / Harness 挂钩

| 角色 | 动作 |
|------|------|
| coding-skill | 改 monorepo 包 / Babel 别名时读本 appendix + `.harness/rules/metro-babel-aliases.md` |
| reviewer | 看到目录形式别名或「undefined 命名导出」→ Rework |
| 新人 onboarding | 与 module-boundary 一并扫一眼 |

---

## 变更记录

| 日期 | 变更 |
|------|------|
| 2026-07-19 | 初版：目录别名 + inlineRequires 踩坑与正则模板 |
