---
name: device-smoke-evidence
description: >-
  Collect three-platform (iOS/Android/Harmony) device smoke evidence for
  Splash→Tabs, Login, and main-business paths; store screenshots under
  acceptance-records/evidence; Partial Accept rules. Use when running §D
  interactive smoke, M2 m2-device-smoke-* slices, or claiming device Accept.
---

# Device Smoke Evidence

## When

- 08 §D **Interactive** 格（Splash→Tabs / Login / 主业务抽检）
- M2 slices：`plans/slices/m2-device-smoke-ios|android|harmony.md`
- 需要截图 / 设备矩阵 / Partial Accept 时

**不要**用本 skill 替代 `agent:pre` / `agent:post` 机跑门禁。

## Hard rule — Packaging ≠ Interactive

| 列 | 算什么 | 不算什么 |
|----|--------|----------|
| **Packaging** | Metro / `react-native bundle` / Harmony `npm run dev` 成功 | 真机交互 |
| **Interactive** | 设备上 Splash→Tabs、Login、主业务可点可证 | 仅 bundle 绿 |

**禁止**用 Metro / `npm run dev` / packaging ✅ **冒充** Splash→Tabs、Login、主业务。无截图或日志路径 → **不得勾** 交互格。

## Evidence path（统一约定）

```text
docs/flutter-to-rn-lego-migration/acceptance-records/evidence/<slice-id>/
```

例：`evidence/2026-07-19-m2-device-smoke-ios/01-splash-to-home-tabs.png`

- Record 正文写绝对相对路径（相对仓库根或相对 `acceptance-records/`）。
- 旧目录 `acceptance-records/assets/` 仅历史；**新证据只写入 `evidence/<slice-id>/`**。
- 每格至少一张可读截图（或录屏路径 + 时间戳说明）。

## 设备矩阵（最少三格）

| 项 | 通过标准 | 证据示例 |
|----|----------|----------|
| Splash → Main Tabs | 四 Tab 可见 | `01-splash-to-home-tabs.png` |
| Login | **成功回主流程**（门禁 alone ≠ 成功） | gate + post-login 帧 |
| 主业务抽检 | Home/Chat/Community/Mine 任选可进 | `0N-<flow>.png` |

Record 必填：平台、设备名/UDID、命令、结果、证据路径。

## Partial Accept

允许 **Partial Accept**，当且仅当：

1. Record `Decision` 写明 **Partial Accept**；
2. 矩阵每格诚实标 ✅ / ❌ / 未证；
3. **Deferred 表**列出未证项 + owner + 下一步；
4. **不得**因 gate 可证或单测绿而勾满 Login 成功格。

参考样例：`acceptance-records/2026-07-19-m2-device-smoke-ios.md`（gate ✅、登录成功未证 → Partial）。

## Brief 分栏

| 栏 | 进 `agent:post`？ |
|----|-------------------|
| 机跑验证（如 `typecheck`） | ✅ |
| 人证清单（截图路径、设备） | ❌ 人审；勿塞进必跑 verify |

## 流程（短）

1. `agent:pre` → 机跑 Brief 验证命令 → `agent:post`。
2. 启设备：`npm run ios` / `android` / Harmony 等价；**交互手点或脚本**。
3. 截图入库 `evidence/<slice-id>/`；写 acceptance-record。
4. 按矩阵勾 08 §D；未证格留空或 Partial + Deferred。
5. 可选静态辅助：`scripts/smoke-checklist.sh`（**不等于**交互绿）。

## Refs

| 资源 | 路径 |
|------|------|
| 08 §D | `docs/flutter-to-rn-lego-migration/08-acceptance-checklist.md` |
| Epic | `docs/flutter-to-rn-lego-migration/plans/epics/m2-device-smoke.md` |
| Slices | `plans/slices/m2-device-smoke-*.md` |
| Record writer | `.cursor/skills/acceptance-record-writer/SKILL.md` |
| Harness 指针 | `.harness/skills/deploy-verify/SKILL.md` |
