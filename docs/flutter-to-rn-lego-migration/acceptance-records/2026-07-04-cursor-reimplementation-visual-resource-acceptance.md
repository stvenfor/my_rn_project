# Cursor 重新实现版验收报告（页面与资源同步专项）

Date: 2026-07-04  
Reviewer: Codex  
Scope: Flutter → React Native LEGO 迁移复验；本轮按用户要求不验收 Android 原生构建。  
Flutter source: `/Users/mac/Desktop/github/my_ai_project`  
RN target: `/Users/mac/Desktop/github/my_rn_project`  

## 1. 验收结论

**Decision: Rework Required（不予放行）**

Cursor 第二版在静态质量和模块边界上明显改善：`lint`、`typecheck`、`jest`、iOS Metro bundle 均通过；`packages` 内未发现 feature-to-feature、feature-to-app、core-to-ui 的直接 import 违规。

但是，从“Flutter 项目转换效果”验收口径看，当前 RN 实现仍不满足放行标准，核心原因是：

1. **页面迁移不同步**：Flutter 源项目存在 52 个页面/屏幕类文件，RN 当前只有 10 个 screen 相关文件；多个源页面被合并、占位或降级，未达到可对照验收状态。
2. **资源迁移不同步**：Flutter first-party 业务图片/字体资源为 75 个，RN `packages/` 与 `src/` 下 first-party 图片/字体资源为 0；iOS bundle 只复制了 4 个依赖/框架资产，未包含 home、music、bfui 的业务资源。
3. **业务还原度不足**：Home、Community、Video、Live、Pay、Friend 等仍存在占位/Mock；BFUI 虽标注大量 `migrated`，但原始图片和字体未迁移，视觉等价性无法成立。
4. **测试覆盖与验收目标不匹配**：现有 14 个 Jest tests 主要覆盖 slice/registry/mock audio，缺少页面渲染、路由注册完整性、资源存在性、Flutter 页面映射一致性测试。

本轮验收结论：**基础工程质量可作为继续返工的基线，但迁移效果不可接受。**

## 2. 本轮未覆盖范围

按用户要求，本轮不验收：

- Android `assembleDebug`
- Android 启动 smoke test
- Android 资源、图标、权限、manifest 兼容性

本轮覆盖：

- RN 静态质量：lint/typecheck/test
- iOS Metro bundle
- Monorepo 模块边界
- Flutter 页面清单与 RN 页面清单对照
- Flutter first-party 资源与 RN first-party 资源对照
- 重点模块迁移还原度抽查

## 3. 命令证据

### 3.1 RTK 状态

AGENTS.md 要求 shell 命令前缀 `rtk`，但当前环境中 `rtk` 不可用：

```text
zsh:1: command not found: rtk
```

因此本轮使用原生命令执行验收。

### 3.2 自动化检查

| 检查项 | 命令 | 结果 | 结论 |
|---|---|---:|---|
| TypeScript | `npm run typecheck` | exit 0 | 通过 |
| Jest | `npm run test -- --runInBand` | exit 0；8 suites / 14 tests passed | 通过，但覆盖不足 |
| ESLint | `npm run lint` | exit 0 | 通过 |
| iOS Metro bundle | `npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output /tmp/my_rn_project.ios.acceptance.bundle --assets-dest /tmp/my_rn_project.ios.acceptance.assets` | exit 0；Copying 4 asset files | JS bundle 通过，但业务资源缺失 |
| Android | 未执行 | N/A | 本轮跳过 |

Jest 额外输出：

```text
Jest did not exit one second after the test run has completed.
```

该提示不阻断本轮通过判定，但说明测试环境仍可能存在未关闭的异步句柄，后续应使用 `--detectOpenHandles` 定位。

## 4. 页面同步验收

### 4.1 数量对照

通过文件扫描得到：

| 来源 | 页面/屏幕识别规则 | 数量 |
|---|---|---:|
| Flutter | `*_page.dart`, `*_screen.dart` in `lib/`, `packages/features/`, `packages/infrastructure/` | 52 |
| RN | `*Screen.tsx`, `*Screens.tsx` in `packages/`, `src/` | 10 |

Flutter 页面分布：

| 模块 | Flutter 页面数 |
|---|---:|
| bfui | 12 |
| settings | 6 |
| app/lib | 5 |
| auth | 5 |
| community | 4 |
| home | 4 |
| chat | 3 |
| video | 3 |
| live | 2 |
| music | 2 |
| friend | 1 |
| pay | 1 |
| bluetooth debug | 1 |
| linking debug | 1 |
| realtime debug | 1 |
| rongcloud_im debug | 1 |

RN screen 文件：

```text
packages/features/auth/src/screens/AuthScreens.tsx
packages/features/bfui/src/screens/BfuiScreens.tsx
packages/features/bfui/src/templates/templateScreens.tsx
packages/features/chat/src/screens/ChatScreens.tsx
packages/features/community/src/screens/CommunityScreens.tsx
packages/features/home/src/screens/HomeScreens.tsx
packages/features/music/src/screens/MusicScreens.tsx
packages/features/settings/src/screens/SettingsScreens.tsx
src/components/PlaceholderScreen.tsx
src/screens/WebViewScreen.tsx
```

### 4.2 页面验收结论

| 模块 | Flutter 源页面 | RN 当前实现 | 验收结论 |
|---|---|---|---|
| app shell | `main_page.dart`, `splash_page.dart`, route container 等 | `RootNavigator`, `MainTabs`, Splash inline | 部分通过 |
| auth | 登录、密码登录、OTP、注册、dev home | 登录/密码/OTP/注册存在 | 部分通过；dev home 未体现 |
| home | 首页、学习报告、签到商城、全部服务 | 首页存在；学习报告/签到商城是占位文案 | 不通过 |
| chat | 会话列表、详情、图片预览 | 列表/详情 mock；图片预览缺失 | 不通过 |
| community | Feed、发布、图片预览、视频播放 | Feed mock；发布占位；预览/播放缺失 | 不通过 |
| settings | 我的、设置、HTTP test、dialog demo、invoice demo/upload | 我的/设置/HTTP test 部分存在；dialog/invoice 缺失 | 不通过 |
| music | 列表、播放页、mini player | 列表/播放页/mini player 存在；资源未迁移 | 部分通过 |
| video | video、short video、play | 三个入口存在；播放器为占位 | 不通过 |
| live | live、room | Mock room；未接 realtime core | 不通过 |
| bfui | 12 个页面 + 多个子组件/动效 | 17 个 template id；若干 degraded/shell；无原资源 | 不通过 |
| friend/pay | 各 1 页 | 占位/Mock | 不通过 |
| infrastructure debug | BLE/linking/realtime/im debug | 未找到对应 RN debug screen | 不通过 |

## 5. 资源同步验收

### 5.1 数量对照

| 来源 | 资源范围 | 数量 |
|---|---|---:|
| Flutter | first-party package 图片/字体，不含 Android/iOS 壳资源 | 75 |
| RN | `packages/` 与 `src/` 下 first-party 图片/字体 | 0 |

Flutter first-party 资源分布：

| 模块 | 资源数量 | 资源类型 |
|---|---:|---|
| bfui | 54 | design_course、fitness_app、hotel、system images、introduction_animation、Roboto/WorkSans fonts |
| home | 19 | all_services 图标 |
| music | 2 | `lady.jpeg`, `music_record.jpeg` |
| commons/toolkit | 1 | `video_mock_sources.json` |

RN 当前 first-party media 资源：

```text
find packages src -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.gif' -o -iname '*.webp' -o -iname '*.svg' -o -iname '*.ttf' -o -iname '*.otf' \)
=> 0
```

### 5.2 资源缺口

必须迁移但当前缺失：

- `packages/features/home/assets/all_services/*.png`：全部服务页面 19 个图标未迁移。
- `packages/features/music/assets/defaults/lady.jpeg`、`music_record.jpeg`：播放页默认封面/唱片资源未迁移。
- `packages/features/bfui/assets/**`：BFUI 所有图片、酒店图、课程图、fitness 图、系统图、引导页图未迁移。
- `packages/features/bfui/assets/fonts/*.ttf`：Roboto/WorkSans 字体未迁移。
- `packages/commons/toolkit/assets/data/video_mock_sources.json`：短视频 mock 数据未迁移。

### 5.3 Bundle 证据

iOS Metro bundle 输出：

```text
info Copying 4 asset files
```

结合 RN `packages/` / `src/` first-party media 资源为 0，可判断这 4 个资产不是 Flutter 业务资源迁移结果，不能作为资源同步通过证据。

## 6. 重点问题清单

### P0-01 页面同步未建立可验收映射

证据：

- Flutter 页面文件数 52，RN screen 相关文件数 10。
- RN 多个 screen 文件承载多个页面，缺少逐页面映射表、路由映射和验收用例。
- `src/navigation/RootNavigator.tsx` 仍手写导入大量 feature screen，未基于 `FeatureRegistration.routes` 自动装配。

影响：

- 无法判断每个 Flutter 页面是否已迁移、占位、降级或废弃。
- Cursor 后续可能继续“看起来有入口”，但缺失真实页面行为。

验收要求：

- 新增 `docs/flutter-to-rn-lego-migration/page-resource-parity-matrix.md`。
- 每个 Flutter 页面必须标注：`Migrated` / `Degraded` / `Placeholder` / `Deferred` / `Removed with reason`。
- 每个 `Placeholder` / `Deferred` 必须有负责人、目标版本、验收证据。

### P0-02 first-party 业务资源完全未迁移到 RN packages/src

证据：

```text
Flutter first-party package image/font assets: 75
RN packages/src first-party image/font assets: 0
```

影响：

- Home 全部服务入口无法视觉对齐。
- Music 播放页默认封面/唱片视觉无法对齐。
- BFUI 视觉模板不可能达到 Flutter 示例项目的视觉等价。
- 字体缺失会导致 BFUI 排版、间距、视觉密度偏差。

验收要求：

- 在对应 feature 内建立 `src/assets` 或 `assets`，迁移原资源。
- 建立 typed asset registry，例如 `homeAssets.ts`, `musicAssets.ts`, `bfuiAssets.ts`。
- 页面中使用本地 `ImageSourcePropType` 或 asset registry，不允许仅靠远程 URI/mock 色块代替。
- Metro/iOS bundle 输出中必须能看到对应 first-party asset 被复制。

### P0-03 Home 核心页面仍是占位

证据：

- `/Users/mac/Desktop/github/my_rn_project/packages/features/home/src/screens/HomeScreens.tsx:83`
- `/Users/mac/Desktop/github/my_rn_project/packages/features/home/src/screens/HomeScreens.tsx:95`

当前实现：

```text
学习报告占位页（对齐 Flutter home_learning_report_page）
签到商城占位页
```

影响：

- `home_learning_report_page.dart` 和 `check_in_mall_page.dart` 未完成迁移。
- `all_services_page.dart` 的 19 个原始图标未迁移，当前是纯 `ListRow`。

验收要求：

- 迁移 Flutter Home dashboard/report/check-in/all-services 的真实布局、数据模型、图标资源。
- 保留 all services 的服务分类、icon、跳转意图。
- 为 Home 三个二级页面补充 render test 或 snapshot/smoke test。

### P0-04 Community/Video/Live/Pay/Friend 仍以 Mock/占位为主

证据：

- `/Users/mac/Desktop/github/my_rn_project/packages/features/community/src/screens/CommunityScreens.tsx:42`
- `/Users/mac/Desktop/github/my_rn_project/packages/features/video/src/index.tsx:13`
- `/Users/mac/Desktop/github/my_rn_project/packages/features/video/src/index.tsx:60`
- `/Users/mac/Desktop/github/my_rn_project/packages/features/live/src/index.tsx`
- `/Users/mac/Desktop/github/my_rn_project/packages/features/pay/src/index.tsx`
- `/Users/mac/Desktop/github/my_rn_project/packages/features/friend/src/index.tsx`

影响：

- Flutter 的图片预览、视频播放、短视频 feed、直播房、支付页、好友页没有达到业务迁移验收。

验收要求：

- Community 补齐 publish/image preview/video play。
- Video 接入迁移后的 mock source JSON 与播放器 facade，不允许仅显示播放符号。
- Live 需要明确 realtime core 的 RN 替代策略；如果延期，必须在 parity matrix 中标注 Deferred。
- Pay/Friend 若只做 Phase 2 占位，不能标为迁移完成。

### P1-01 BFUI 标注 `migrated` 与资源事实冲突

证据：

- `/Users/mac/Desktop/github/my_rn_project/packages/features/bfui/src/bfuiCatalog.ts:9`
- `/Users/mac/Desktop/github/my_rn_project/packages/features/bfui/src/bfuiCatalog.ts:94`
- RN `packages` 下 BFUI 图片/字体资源为 0。

当前 BFUI catalog 中多个模板标注 `status: 'migrated'`，同时又有 `degraded` / `shell`。

影响：

- 审核者会误以为 BFUI 页面已迁移完成。
- 没有原始图片/字体时，`hotel_booking`、`design_course`、`fitness_app`、`introduction_animation` 不可能视觉等价。

验收要求：

- `status` 必须改成可审计定义：
  - `migrated`: 布局、交互、资源、字体、动效均已对齐并有截图证据。
  - `visual-degraded`: 可接受视觉降级，有差异说明。
  - `shell`: 仅入口/结构。
  - `placeholder`: 非迁移实现。
- 对每个 BFUI 模板生成截图对照记录。

### P1-02 测试覆盖没有覆盖页面/资源同步

现有 package 测试：

```text
packages/core/media-player/src/__tests__/mockAudioPlayer.test.ts
packages/core/webview/src/__tests__/bridgeRegistry.test.ts
packages/features/auth/src/__tests__/authSlice.test.ts
packages/features/chat/src/__tests__/chatSlice.test.ts
packages/features/community/src/__tests__/communitySlice.test.ts
packages/features/home/src/__tests__/homeSlice.test.ts
```

缺口：

- 没有 route registry 完整性测试：每个 parity matrix 页面必须有 route 或明确 deferred。
- 没有 asset registry 测试：每个 Flutter first-party asset 必须映射到 RN asset 或明确废弃。
- 没有关键页面 render test。
- 没有 i18n key 完整性测试。

验收要求：

- 新增 `pageParity.test.ts`：校验 Flutter 页面映射状态。
- 新增 `assetParity.test.ts`：校验业务资源映射。
- 新增每个 feature 的 screen render smoke。

### P2-01 测试进程存在未关闭异步句柄提示

证据：

```text
Jest did not exit one second after the test run has completed.
```

验收要求：

- 使用 `npm run test -- --runInBand --detectOpenHandles` 定位。
- 优先检查 media-player、i18n、store side effects、timer。

## 7. 已通过项

以下内容本轮可以认可为正向进展：

- `npm run lint` 通过。
- `npm run typecheck` 通过。
- `npm run test -- --runInBand` 通过，当前为 8 suites / 14 tests。
- iOS Metro bundle 通过。
- `packages` 内未发现 feature-to-feature import。
- `packages` 内未发现 `@app/*` import。
- `packages/core` 内未发现 `@ui/*` import。
- Redux slice 从 app 层下沉到 feature 包，较上一轮有改善。
- `FeatureRegistration` 类型已增加 `routes` 与 `reducer` 字段。

## 8. 与 Cursor 自验报告的差异

Cursor 自验文件：

`/Users/mac/Desktop/github/my_rn_project/docs/flutter-to-rn-lego-migration/acceptance-records/2026-07-04-rework-verification.md`

该报告结论是 `Approved with conditions`，主要依据是 lint/typecheck/test、边界规则和原生构建记录。

本报告不同意该放行结论，原因：

- Cursor 自验没有验证 Flutter 页面清单与 RN 页面清单的逐项同步。
- Cursor 自验没有验证 Flutter first-party 业务资源是否迁移。
- Cursor 自验没有识别占位/Mock 页面与真实迁移页面之间的验收差异。
- Cursor 自验包含 Android 构建结论，但本轮用户明确要求先不用验收 Android，因此本报告不采信 Android 作为本轮放行依据。

## 9. 下一轮返工要求

### Phase A：建立同步基线

必须交付：

- `docs/flutter-to-rn-lego-migration/page-resource-parity-matrix.md`
- Flutter 页面 → RN route/component/status 映射表。
- Flutter first-party asset → RN asset registry/status 映射表。
- 所有 `status: migrated` 必须有代码路径、资源路径、测试或截图证据。

通过标准：

- 52 个 Flutter 页面都有明确状态。
- 75 个 Flutter first-party image/font assets 都有明确状态。
- `Placeholder`、`Deferred` 不得计入迁移完成率。

### Phase B：资源迁移

必须交付：

- Home all services 19 个 icon 迁移。
- Music 2 个默认资源迁移。
- BFUI 54 个图片/字体资源迁移。
- Video mock source JSON 迁移。
- 对应 asset registry 与单元测试。

通过标准：

- `find packages src -type f \( image/font extensions \)` 不再为 0。
- iOS bundle asset copy 数量包含 first-party 资源。
- 关键页面实际引用本地资源。

### Phase C：核心页面补齐

优先级：

1. Home：学习报告、签到商城、全部服务。
2. Settings：dialog demo、invoice demo/upload。
3. Community：发布、图片预览、视频播放。
4. Video：短视频列表和播放页接入 mock source/player facade。
5. Music：本地默认资源、now playing 视觉对齐。
6. BFUI：按模板逐个对照迁移，不能用无资源模板冒充 migrated。

通过标准：

- 每个核心页面有 route、render test、截图或手工验收记录。
- 页面中不再出现“占位”“placeholder”“待接入”等文案，除非 parity matrix 明确标记 Deferred。

### Phase D：测试补强

必须交付：

- page parity test。
- asset parity test。
- route registration test。
- feature screen render smoke test。
- `--detectOpenHandles` 清理结果。

## 10. 放行门槛

下一轮验收必须同时满足：

- `npm run lint` exit 0。
- `npm run typecheck` exit 0。
- `npm run test -- --runInBand` exit 0，且无 open handles 提示。
- iOS Metro bundle exit 0。
- 页面 parity matrix 覆盖率 100%。
- first-party asset parity matrix 覆盖率 100%。
- `Migrated` 状态页面不得引用占位文案。
- `packages` 内 feature-to-feature import 为 0。
- `packages` 内 `@app/*` import 为 0。
- `packages/core` → `@ui/*` import 为 0。
- 本轮仍不要求 Android 通过；Android 可在后续专项验收。

## 11. 最终判定

当前 Cursor 第二版：**不通过迁移效果验收**。

可以保留的成果：

- LEGO monorepo package 骨架。
- TypeScript/Jest/ESLint 基础质量修复。
- 模块边界修复。
- iOS Metro bundle 能力。

必须返工的部分：

- 页面与 Flutter 源项目逐项同步。
- first-party 资源迁移。
- 占位/Mock 页面降级标注与真实迁移补齐。
- 页面/资源 parity 自动化测试。
