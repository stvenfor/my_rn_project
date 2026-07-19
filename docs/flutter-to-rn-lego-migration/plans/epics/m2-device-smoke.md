# Epic Plan — M2 真机 §D 交互补录

| 项 | 内容 |
|----|------|
| Checklist | [`08` §D 交互格](../08-acceptance-checklist.md) |
| Program | [2026-07-19-m2-program.md](../2026-07-19-m2-program.md) |
| 状态 | **In progress** |
| 发布范围 | **iOS + Android + Harmony（全端）** |
| 风险 | R-016；Harmony 另见 R-003 |

## 目标

三端均在真机/模拟器跑通：

1. Splash → Main Tabs  
2. Login（未登录受保护入口 → 登录 → 回主流程）  
3. 主业务抽检（至少一条：Home / Chat / Community / Mine）

Packaging（Metro / `npm run dev`）已在 M-close-gap 绿，**不重复当交互证据**。  
**无 N/A**：三端都要勾实或诚实记失败/风险（Harmony native 缺口可条件 Accept，须写清）。

## Epic DoD

- [ ] iOS / Android / Harmony：交互三格各有日志摘要或录屏路径（或失败+风险）  
- [ ] 08 §D 三端交互格更新与 Record 一致  
- [ ] 分端 Record + 可选汇总 `acceptance-records/YYYY-MM-DD-m2-device-smoke.md`  
- [ ] 三端 Slice 均 `agent:post` 绿  

## Gap / 范围

| ID | 项 | 严重度 | Slice |
|----|-----|--------|-------|
| G1 | iOS 交互 | P0 | [`m2-device-smoke-ios`](../slices/m2-device-smoke-ios.md) |
| G2 | Android 交互 | P0 | [`m2-device-smoke-android`](../slices/m2-device-smoke-android.md) |
| G3 | Harmony 交互 | P0 | [`m2-device-smoke-harmony`](../slices/m2-device-smoke-harmony.md) |

## Slice backlog

| 序 | Slice | 状态 |
|----|-------|------|
| 1 | `m2-device-smoke-ios` | Done (partial) — Login 成功未证 |
| 2 | `m2-device-smoke-android` | Ready（队首） |
| 3 | `m2-device-smoke-harmony` | Ready |

## 不做

- 假勾无设备证据的交互格  
- 专项真支付 / 真 IM / BLE（另 Epic）  
- 单端 N/A 逃逸（本 Epic 已锁定全端）  

## Context Card

```md
## Context Card — m2-device-smoke
- 已完成: 范围锁定三端；三 Slice Brief 落盘
- Deferred: 各端执行
- 下一: 执行 m2-device-smoke-ios
```
