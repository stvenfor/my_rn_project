# Acceptance Record — M2 Harmony 真机交互 Smoke

Date: 2026-07-19  
Device: hdc target **`127.0.0.1:5555`**（TCP Connected；模拟器/远程设备）  
Bundle: `com.example.myrnproject`  
Decision: **Partial Accept**（Splash→Tabs ✅ · 主业务 ✅ · Login 门禁未复测 / 已登录态可证）

## Accept 模式

**Partial**

## Deferred / 未证

| Item | 原因 | Owner | Phase |
|------|------|-------|-------|
| 未登录 → Login 门禁 | 本轮会话已登录（Mine 显示销售经理）；未先清 session 复测 gate | Agent | 可选补测 |
| LogBox `selectCurrentMetrics` / i18next plural | Dev 浮层可见，不阻塞壳 smoke | 质量债 | M2 lint / 专项 |

## Commands

```text
npm run agent:pre -- --slice docs/.../m2-device-smoke-harmony.md
npm run dev                          # ✅ 183 assets → bundle.harmony.js
npx react-native run-harmony --no-packager --port 8081
  # BUILD SUCCESSFUL ~31s
  # install bundle successfully
  # start ability successfully
hdc uitest screenCap / uiInput click
```

## §D Harmony 矩阵

| Packaging | Splash→Tabs | Login | 主业务抽检 |
|-----------|-------------|-------|------------|
| ✅ `npm run dev` 183 assets | ✅ Home + 底栏（`01`/`03`） | ☐* 门禁未复测；✅ 已登录 Chat/Mine | ✅ Chat 会话列表 + Mine 壳（`04`/`05`） |

\*08 Login 列：本轮 **不假勾「未登录门禁」**；记录已登录主路径证据。

## Evidence

`docs/flutter-to-rn-lego-migration/acceptance-records/evidence/m2-device-smoke-harmony/`

| 文件 | 说明 |
|------|------|
| `01-after-launch.jpeg` / `03-home-uitest.jpeg` | Home 仪表盘 + 底栏 |
| `04-after-chat-tap.jpeg` | 聊天 Tab · Mock 会话列表 |
| `05-mine.jpeg` | 我的 · 销售经理已登录态 |

WindowManager：`myrnproject0` 前台；`ps` 见 `com.example.myrnproject`。

## 08 勾选意图

- Splash→Tabs：**勾**  
- Login：**不勾门禁**（Deferred 清 session 复测）  
- 主业务：**勾**  

## Next

Epic 汇总三端；可选 `m2-android-toolchain`；M2 UX 截图可复用本目录证据。
