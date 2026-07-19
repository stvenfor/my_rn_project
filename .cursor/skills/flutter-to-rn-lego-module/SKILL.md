---
name: flutter-to-rn-lego-module
description: >-
  Convert Flutter/GetX modules to React Native LEGO feature packages in
  my_rn_project (RN 0.72.5, RTK, React Navigation 6, Harmony 0.72.140) with
  1:1 UI/UX parity. UI mappings (mappings/01–07), Dart→TS types (08),
  responsive (09), assets→require registries (10), registerFeature routing,
  UX 1:1 gates, parity tests. Use when migrating Flutter to RN, porting
  feature modules, syncing pages/assets with my_ai_project, or accepting
  against docs/flutter-to-rn-lego-migration/08-acceptance-checklist.md.
---

# Flutter To RN LEGO Module (Project Entry)

本文件为 **my_rn_project 仓库内精简入口**。完整 skill（mappings/01–10、template、UX gates、validate）见：

**`/Users/mac/Desktop/skills/flutter-to-rn-lego-module/SKILL.md`**

| | Path |
|--|------|
| 源 Flutter | `/Users/mac/Desktop/github/my_ai_project` |
| 目标 RN | 本仓库（`my_rn_project`） |
| 对称参考 | `/Users/mac/Desktop/skills/flutter-to-harmony-module` |

## 执行前必读

| 文档 | 用途 |
|------|------|
| [07-1to1-migration-guide.md](../../docs/flutter-to-rn-lego-migration/07-1to1-migration-guide.md) | **迁移执行指南** |
| [08-acceptance-checklist.md](../../docs/flutter-to-rn-lego-migration/08-acceptance-checklist.md) | **验收权威清单**（按此验收） |
| [09-agent-programming-playbook.md](../../docs/flutter-to-rn-lego-migration/09-agent-programming-playbook.md) | **Agent 编程方法**（拆解/上下文/测试闭环/边界/复盘/交互验证） |
| [page-resource-parity-manifest.ts](../../docs/flutter-to-rn-lego-migration/page-resource-parity-manifest.ts) | 页面 + 资源 parity 真相源 |
| [moduleManifest.ts](../../src/config/moduleManifest.ts) | feature 聚合与路由收集 |
| [04-cursor-execution-spec.md](../../docs/flutter-to-rn-lego-migration/04-cursor-execution-spec.md) | 交付格式与边界规则 |
| [module-boundary-rules.md](../../docs/flutter-to-rn-lego-migration/appendices/module-boundary-rules.md) | 禁止 feature-to-feature import |

## 本仓库锚点

| concern | Location |
|---------|----------|
| 模块聚合 | `src/config/moduleManifest.ts` |
| 根导航 | `src/navigation/RootNavigator.tsx` |
| 路由常量/类型 | `packages/core/navigation/src/index.ts` |
| 设计系统 | `packages/ui/design-system/src/` |
| Babel alias | `babel.config.js` |
| 字体链接 | `react-native.config.js` |
| 参考 feature | `packages/features/home`, `chat`, `bfui`, `settings` |

## 快速工作流

1. 锁定 `FLUTTER_MODULE` + `RN_FEATURE`（见主 skill Required inputs）。
2. 读主 skill `mappings/README.md`，顺序：**09 → 08 → 10 → 01–07**。
3. 产出 UX contract（主 skill `references/ux-1to1-gates.md`）。
4. 实现 `packages/features/<name>/`（screens / store / assets registry）。
5. 接线：`register*Feature` → `moduleManifest` → `RoutePath`。
6. 更新 `page-resource-parity-manifest.ts`（每页/每资源必须有 status）。
7. 验证 + 按 `08-acceptance-checklist.md` 自检。

```bash
npm run lint && npm run typecheck && npm run test
```

Parity 测试：

- `src/__tests__/pageParity.test.ts`
- `src/__tests__/assetParity.test.ts`
- `src/navigation/__tests__/routeRegistration.test.ts`

## Parity status（必填）

`Migrated | Degraded | Placeholder | Deferred | Removed`

仅占位 / 缺资源 / 未注册路由 → **不得标 Migrated**。未更新 manifest → **视为未完成**。

## Stack（版本锁定）

- RN **0.72.5** / React **18.2.0**
- RTK **2.2.7** / React Navigation **6.x**
- Harmony **@react-native-oh/react-native-harmony 0.72.140**
- npm workspaces（不切换包管理器）

## 输出格式

分析摘要 → 四张映射表 + UX contract → 文件列表 → 路由变更 → 验证结果 → 验收自检 → 遗留项。

每轮附带 **Cursor Delivery Report**（见 `04-cursor-execution-spec.md`）。

## 完整资源

| 资源 | 路径 |
|------|------|
| 主 SKILL | `/Users/mac/Desktop/skills/flutter-to-rn-lego-module/SKILL.md` |
| UX 1:1 gates | `/Users/mac/Desktop/skills/flutter-to-rn-lego-module/references/ux-1to1-gates.md` |
| 迁移模板 | `/Users/mac/Desktop/skills/flutter-to-rn-lego-module/assets/template.md` |
| UI/状态/资源映射 | `/Users/mac/Desktop/skills/flutter-to-rn-lego-module/mappings/` |
| 校验脚本 | `/Users/mac/Desktop/skills/flutter-to-rn-lego-module/scripts/validate.sh` |
