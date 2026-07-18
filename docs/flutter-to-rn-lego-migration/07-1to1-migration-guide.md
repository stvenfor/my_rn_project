# 1:1 迁移执行指南

> 源：`/Users/mac/Desktop/github/my_ai_project`  
> 目标：`/Users/mac/Desktop/github/my_rn_project`  
> Skill：`flutter-to-rn-lego-module`（对称于 `flutter-to-harmony-module`）  
> **验收以 [08-acceptance-checklist.md](./08-acceptance-checklist.md) 为准。**

## 1. 目标

将 Flutter/GetX 功能模块 **按 UI 树与交互 1:1 还原** 到 RN LEGO feature 包，而不是只做「能编译、能进路由」的壳迁移。

| 维度 | 要求 |
|------|------|
| 页面结构 | 自上而下区块顺序与 Flutter 一致 |
| 状态 | loading / empty / error / success / refreshing 等齐全 |
| 资源 | 实际引用的图片/字体/JSON 已复制并 registry |
| 路由 | `RoutePath` + `register*Feature` + `moduleManifest` |
| 边界 | 禁止 feature-to-feature import |
| 证据 | 截图/录屏 + 自动化命令输出 |

## 2. 路径约定（以仓库现状为准）

| 侧 | 路径 |
|----|------|
| Flutter feature | `my_ai_project/packages/features/<name>/` |
| Flutter commons | `my_ai_project/packages/commons/` |
| RN feature | `my_rn_project/packages/features/<name>/` |
| RN core | `my_rn_project/packages/core/<name>/` |
| RN UI | `my_rn_project/packages/ui/design-system/` |
| 模块注册 | `my_rn_project/src/config/moduleManifest.ts` |
| 根导航 | `my_rn_project/src/navigation/RootNavigator.tsx` |
| Parity 真相源 | `docs/flutter-to-rn-lego-migration/page-resource-parity-manifest.ts` |

> 注意：旧文档中的 `packages/feature-modules/@features/*` 为历史草案路径，**实际以 `packages/features/*` 为准**。

## 3. 模块对照表

| Flutter (`packages/features/`) | RN (`packages/features/`) | 备注 |
|--------------------------------|---------------------------|------|
| auth | auth | 登录/注册/会话 |
| home | home | 首页/报告/签到/全部服务 |
| settings | settings | 我的/设置/发票 demo |
| chat | chat | 会话列表/详情 |
| community | community | 动态/发布/预览 |
| music | music | 列表/播放 |
| video | video | 列表/短视频 |
| bfui | bfui | Best-Flutter-UI 模板画廊 |
| live | live | UI 迁完；真 realtime 可 Deferred |
| friend | friend | |
| pay | pay | UI 迁完；支付 SDK 可 Deferred |
| classroom | — | Flutter 有；RN 未建包 → 须 `Deferred` 并登记 |

## 4. 单模块执行步骤

复制此清单并跟踪：

```text
Module Progress:
- [ ] Step 0 锁定 FLUTTER_MODULE / RN_FEATURE / IS_NEW_PACKAGE
- [ ] Step 1 源码审计 + 资源列表 + 路由列表
- [ ] Step 2 UX contract（状态/交互/布局）
- [ ] Step 3 四张映射表（组件/状态/适配/模型）
- [ ] Step 4 实现 screens / components / store / services
- [ ] Step 5 复制 assets + *Assets.ts registry
- [ ] Step 6 registerFeature + moduleManifest + RoutePath
- [ ] Step 7 更新 page-resource-parity-manifest.ts
- [ ] Step 8 npm run lint && typecheck && test
- [ ] Step 9 按 08-acceptance-checklist 模块节勾选
- [ ] Step 10 提交 Cursor Delivery Report + 证据路径
```

详细映射与模板：

- Skill：`/Users/mac/Desktop/skills/flutter-to-rn-lego-module/SKILL.md`
- Mappings：同目录 `mappings/01–10`
- Template：`assets/template.md`
- UX gates：`references/ux-1to1-gates.md`

## 5. 分层归属（依赖方向）

```text
app shell (src/)
  → @features/*          # 业务，禁止互依赖
  → @core/*              # 导航/网络/存储/媒体等
  → @ui/design-system    # 主题与基础组件
  → @commons/*           # 跨端 toolkit（若有）
```

| Flutter | RN 归属 |
|---------|---------|
| `get` 路由/DI | `@core/navigation` + RTK + app shell |
| `dio` | `@core/api-client` |
| `shared_preferences` / 本地存储 | `@core/storage` |
| `supabase_flutter` | `@core/supabase` |
| WebView | `@core/webview` |
| 音视频播放 | `@core/media-player` |
| `module_*` | `@features/*` |

完整表：[appendices/dependency-mapping.md](./appendices/dependency-mapping.md)

## 6. Parity 状态判定

| Status | 何时使用 |
|--------|----------|
| `Migrated` | 1:1 完成：UI+交互+资源+可导航，UX contract 关键态通过 |
| `Degraded` | 结构在，但 mock/动效/平台能力降级（**note 必填**） |
| `Placeholder` | 仅有路由与占位 UI |
| `Deferred` | 明确推迟（**owner + targetVersion**） |
| `Removed` | Flutter standalone/dev 入口，产品不需要 |

自动化门禁：

- `src/__tests__/pageParity.test.ts`
- `src/__tests__/assetParity.test.ts`
- `src/navigation/__tests__/routeRegistration.test.ts`

## 7. 交付物

每轮必须产出：

1. 代码变更（feature / core / navigation / manifest）  
2. parity manifest 更新  
3. Cursor Delivery Report（见 [04-cursor-execution-spec.md](./04-cursor-execution-spec.md)）  
4. 关键状态证据（截图或短录屏路径）  
5. `08-acceptance-checklist.md` 对应模块勾选结果  

## 8. 相关文档

| 文档 | 用途 |
|------|------|
| [00-index.md](./00-index.md) | 文档包导航 |
| [01-flutter-analysis-report.md](./01-flutter-analysis-report.md) | Flutter 分析 |
| [02-lego-monorepo-architecture.md](./02-lego-monorepo-architecture.md) | 目标架构 |
| [03-module-migration-plan.md](./03-module-migration-plan.md) | 分阶段计划（路径以本文 §2 为准） |
| [05-acceptance-and-qa-plan.md](./05-acceptance-and-qa-plan.md) | QA 分层说明 |
| [08-acceptance-checklist.md](./08-acceptance-checklist.md) | **验收勾选权威** |
| [page-resource-parity-matrix.md](./page-resource-parity-matrix.md) | Parity 人读摘要 |
