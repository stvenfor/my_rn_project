# 1:1 验收清单（权威）

> **后续验收以本文为准。**  
> 源：`my_ai_project` → 目标：`my_rn_project`  
> 配套迁移指南：[07-1to1-migration-guide.md](./07-1to1-migration-guide.md)  
> Parity 真相源：[page-resource-parity-manifest.ts](./page-resource-parity-manifest.ts)  
> UX 门控：`/Users/mac/Desktop/skills/flutter-to-rn-lego-module/references/ux-1to1-gates.md`

## 如何使用

1. 验收人按章节逐项勾选；任一 **P0** 未过 → 结论只能是 **Rework / Blocked**。  
2. 模块项以 `page-resource-parity-manifest.ts` 中该模块条目为准；标 `Migrated` 的必须满足本节「Migrated 门槛」。  
3. 自动化命令须贴真实输出摘要（或 CI 链接），不得只写「已通过」。  
4. 结论填入文末 **Acceptance Record**，并另存到 `acceptance-records/YYYY-MM-DD-<scope>.md`。

### Migrated 门槛（单页）

- [ ] 路由已注册且可从产品路径进入  
- [ ] UI 区块顺序与 Flutter 1:1（无擅自删并可见区块）  
- [ ] 关键态齐全：至少 success；Flutter 有则必须有 loading/empty/error  
- [ ] 本页实际引用资源均已复制 + registry  
- [ ] 主交互等价（刷新/分页/弹窗/提交等，以 Flutter 为准）  
- [ ] 降级点（若有）已写入 manifest `note`，且不得静默省略  

未满足 → 最多标 `Degraded` / `Placeholder`，**禁止** `Migrated`。

### 结论枚举

| Decision | 含义 |
|----------|------|
| Approved | 范围内全部 P0 通过，无阻塞遗留 |
| Approved with conditions | P0 通过；条件项列出 owner + 截止日期 |
| Rework | 有 P0 失败或证据不足 |
| Blocked | 依赖外部能力/决策，无法继续 |

---

## A. 全局门禁（P0）

### A1. 自动化

```bash
cd /Users/mac/Desktop/github/my_rn_project
npm run lint
npm run typecheck
npm run test
```

- [ ] `lint` 无 error  
- [ ] `typecheck` 无 error  
- [ ] `test` 通过（含 `pageParity` / `assetParity` / `routeRegistration`）  
- [ ] 无 feature-to-feature import  
- [ ] 无 core → feature import  
- [ ] 新增 UI 使用 `@ui/design-system` tokens（无散落硬编码色值/间距）  

### A2. Parity 完整性

- [ ] 每个 Flutter 业务页在 manifest 中有条目与 `status`  
- [ ] 每个一等公民资源在 manifest 中有条目与 `status`  
- [ ] `Deferred` / `Degraded` 条目均有 `note`（建议含 owner / targetVersion）  
- [ ] Flutter `classroom` 等 RN 未建包模块已登记为 `Deferred` 或明确 `Removed`  

### A3. 壳与导航（P0）

- [ ] 启动 → Splash → Main Tabs  
- [ ] Tab 顺序与产品约定一致（Home / Chat / Community / Mine 等）  
- [ ] 未登录访问受保护入口 → Login  
- [ ] 登录成功返回主流程；登出后再次要求登录  
- [ ] Deep link / 内部 `RoutePath` 跳转不产生 feature 互依赖  

---

## B. 模块验收（按模块勾选）

每个模块：先核 manifest，再做人工 UX。证据列：截图或录屏路径。

### B1. `@features/auth`

| 项 | P0 | 结果 | 证据 |
|----|----|------|------|
| Login / Password / OTP / Register 可进入 | P0 | ☐ | |
| 表单校验与 Flutter 文案/规则对齐 | P0 | ☐ | |
| 登录成功写入 session；登出清理 | P0 | ☐ | |
| 隐私协议勾选/链接（若 Flutter 有） | P0 | ☐ | |
| 不依赖其他 `@features/*` | P0 | ☐ | |
| auth standalone / AuthDevHome 处理为 Removed 或未暴露 | — | ☐ | |

### B2. `@features/home`

| 项 | P0 | 结果 | 证据 |
|----|----|------|------|
| HomeTab 主区块顺序 1:1 | P0 | ☐ | |
| Learning Report / Check-in Mall / All Services 可进入 | P0 | ☐ | |
| All Services 跳转仅用 RoutePath（不 import bfui/music/video） | P0 | ☐ | |
| 首页资源（all_services 等）registry 齐全 | P0 | ☐ | |
| loading / empty / error（若 Flutter 有） | P0 | ☐ | |
| Mini player 不由 home 渲染 | P0 | ☐ | |

### B3. `@features/settings`（Mine）

| 项 | P0 | 结果 | 证据 |
|----|----|------|------|
| MineTab / Settings 可进入 | P0 | ☐ | |
| Dialog Demo / Invoice Demo·Upload / HTTP Test（已 Migrated 的）可用 | P0 | ☐ | |
| 设置项列表顺序与 Flutter 对齐 | P0 | ☐ | |
| 退出登录链路正确 | P0 | ☐ | |

### B4. `@features/chat`

| 项 | P0 | 结果 | 证据 |
|----|----|------|------|
| ChatTab 会话列表 | P0 | ☐ | |
| ChatDetail 消息收发（可 mock） | P0 | ☐ | |
| ImagePreview | P0 | ☐ | |
| IM 经 `@core/im`，state 不持有 native handle | P0 | ☐ | |
| 空态 / 错误态 | P0 | ☐ | |

### B5. `@features/community`

| 项 | P0 | 结果 | 证据 |
|----|----|------|------|
| Feed + 下拉刷新 + 加载更多 | P0 | ☐ | |
| Publish | P0 | ☐ | |
| ImagePreview / VideoPlay | P0 | ☐ | |
| 点赞/评论等主交互（与 Flutter 对齐或 Degraded+note） | P0 | ☐ | |

### B6. `@features/music`

| 项 | P0 | 结果 | 证据 |
|----|----|------|------|
| MusicList → NowPlaying | P0 | ☐ | |
| 播放/暂停经 `@core/media-player` | P0 | ☐ | |
| Mini player 由 shell/slot，不依赖 home | P0 | ☐ | |
| 默认封面等资源 registry | P0 | ☐ | |

### B7. `@features/video`

| 项 | P0 | 结果 | 证据 |
|----|----|------|------|
| Video 列表 | P0 | ☐ | |
| ShortVideo / ShortVideoPlay | P0 | ☐ | |
| 播放器经 toolkit/core，不泄漏到 Redux | P0 | ☐ | |
| Lottie/横屏/弹幕等降级已 note | — | ☐ | |

### B8. `@features/bfui`

| 项 | P0 | 结果 | 证据 |
|----|----|------|------|
| 模板目录可进入各模板 | P0 | ☐ | |
| 本地 assets/fonts 可加载 | P0 | ☐ | |
| `bfuiCatalog` 状态与视觉降级有记录 | — | ☐ | |

### B9. `@features/live` / `friend` / `pay`

| 项 | P0 | 结果 | 证据 |
|----|----|------|------|
| Live / LiveRoom 路由 smoke | P0 | ☐ | |
| Friend 路由 smoke | P0 | ☐ | |
| Pay 页布局；SDK 未接则 Degraded/Deferred+note | P0 | ☐ | |
| Realtime 真连未做则 mock + Deferred note | — | ☐ | |

### B10. 未迁移 Flutter 模块

| 项 | P0 | 结果 | 证据 |
|----|----|------|------|
| `classroom` 等已在清单登记 Deferred/Removed | P0 | ☐ | |
| 无「静默消失」的 Flutter 业务页 | P0 | ☐ | |

---

## C. UX 1:1 抽检（P0）

对每个本轮声明 `Migrated` 的页面，抽检：

- [ ] 与 Flutter 对照：首屏结构一致  
- [ ] 至少一种非 success 态（empty 或 error 或 loading）有证据  
- [ ] 至少一个主交互（按钮/Tab/Sheet/刷新）有证据  
- [ ] SafeArea 正常（刘海/底栏不被遮挡）  
- [ ] 表单页键盘不遮挡主输入（若适用）  

抽检样本建议：auth Login、home HomeTab、community Feed、music NowPlaying、bfui 任一模板。

---

## D. 三端 Smoke（按发布范围）

| 平台 | 命令 | Splash→Tabs | Login | 主业务抽检 |
|------|------|-------------|-------|------------|
| iOS | `npm run ios` | ☐ | ☐ | ☐ |
| Android | `npm run android` | ☐ | ☐ | ☐ |
| HarmonyOS | `npm run harmony` | ☐ | ☐ | ☐ |

- 仅验收单端时：其余标 N/A，并在 Record 中写明范围。  
- 专项（WebView / BLE / 真支付 / 真 IM）失败不阻塞基础壳，但必须进风险台账。

---

## E. 证据与文档

- [ ] Delivery Report 已附（格式见 [04-cursor-execution-spec.md](./04-cursor-execution-spec.md)）  
- [ ] 截图/录屏路径可访问  
- [ ] 已知差距有 owner + 计划阶段  
- [ ] 本 Record 已写入 `acceptance-records/`  

---

## Acceptance Record（复制填写）

```md
## Acceptance Record

Date:
Reviewer:
Scope (modules / phases):
Commit / branch:
Skill / docs version: flutter-to-rn-lego-module + 08-acceptance-checklist

### Automated
- lint:
- typecheck:
- test:

### Checklist
- A Global: pass / fail
- B Modules (list): pass / fail / partial
- C UX spot-check: pass / fail
- D Platforms: iOS= / Android= / Harmony=

### Findings
1. [P0/P1] …

### Decision
- Approved / Approved with conditions / Rework / Blocked

### Conditions / Follow-up
| Item | Owner | Due |
|------|-------|-----|
| | | |

### Evidence paths
-
```
