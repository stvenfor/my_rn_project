# Acceptance Record — M2 iOS 真机/模拟器交互 smoke

Date: 2026-07-19  
Slice: [`plans/slices/m2-device-smoke-ios.md`](../plans/slices/m2-device-smoke-ios.md)  
Device: **iPhone 16 Pro** 模拟器 `DCA54F0C-8624-4BF6-9E42-539C4A5E1063`（iOS 18.3，Booted）  
Bundle: `com.example.myrnproject`  
Decision: **Partial Accept** — Splash→Tabs ✅ · 主业务抽检（Home+Mine 访客）✅ · Login **成功提交未证**（仅 Chat→Login 门禁 ✅）→ **Login 格勿假勾**

## Commands

| 步骤 | 命令 / 操作 | 结果 |
|------|-------------|------|
| pre | `npm run agent:pre -- --slice .../m2-device-smoke-ios.md` | ✅ |
| Metro | 本机 node 监听 `:8081` | ✅ |
| Build/Run | `npm run ios` / 已装包 `simctl launch` | ✅ |
| verify | `npm run typecheck`（agent:post） | ✅ exit 0 |
| 交互 | Simulator 点击 + 截图 | 见矩阵 |

## 交互矩阵（诚实）

| 项 | 结果 | 证据 |
|----|------|------|
| Splash → Main Tabs | ✅ | `assets/.../03-settled.png`、`evidence/.../01-splash-to-home-tabs.png` — 四 Tab 可见 |
| 未登录 → Login 门禁 | ✅ | Chat→Login：`assets/.../13-chat-gate.png`、`evidence/.../02-chat-gate-login.png` |
| Login → 成功回主流程 | ❌ 未证 | HID / `simctl pbcopy` 写入 RN TextInput 不稳；**不勾 08 Login 成功**。手补：`13400000000`+`123456` 或 `test@test.com`+`123456` |
| 主业务抽检 | ✅ | Home 访客业务页 + Mine 访客页：`assets/.../14-mine-tap.png`（底栏「我的」高亮、未登录态） |

## Evidence paths

```text
docs/flutter-to-rn-lego-migration/acceptance-records/assets/m2-device-smoke/ios/   # 主证据集
docs/flutter-to-rn-lego-migration/acceptance-records/evidence/2026-07-19-m2-device-smoke-ios/  # 补充
```

## Known gaps

| Item | Owner | Next |
|------|-------|------|
| Mock 登录成功回主流程截图 | 人 / 下回合 | 手输凭据；或 Maestro |
| LogBox `i18next::pluralResolver` / selectCurrentMetrics | 工程债 | 另 Slice（本 Slice 不做业务改） |
| 08 §D iOS Login 列 | 发布负责人 | 仅成功回主后勾 |

## Cursor Delivery Report（摘要）

Phase: M2 device smoke iOS  
Scope: 模拟器交互证据；不改 feature UI  

Changed (whitelist): Record + assets/evidence + Slice Card + `.harness/changes` + 08 §D iOS 行（Splash/主业务；Login 不假勾）

Architecture: 无包/API/边界变更。

Harness: `agent:pre` ok · `agent:post` ok（见 `.cursor/agent-harness/harness-report.json`）
