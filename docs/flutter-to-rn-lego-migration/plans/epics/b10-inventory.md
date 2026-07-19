# Epic Plan — B10 未迁移 / 静默页清点

| 项 | 内容 |
|----|------|
| Checklist | [`08` §B10](../08-acceptance-checklist.md) |
| Flutter | `/Users/mac/Desktop/github/my_ai_project/packages/features/` |
| RN | `page-resource-parity-manifest.ts` + `packages/features/` |
| Program | [2026-07-19-program.md](../2026-07-19-program.md) |
| 状态 | **Audit done** — 待 `b10-evidence` 勾 08 |

## Epic DoD

- [x] Flutter `*_page.dart` 全量对账（51/51 有 manifest）  
- [ ] 08 §B10 全部 ✅（待 evidence Slice）  
- [ ] `acceptance-records/*-b10*.md`  
- [x] `classroom` 已登记（Migrated×7 + Degraded×1，非 Deferred/Removed）  
- [x] 无「静默消失」的 Flutter `*_page.dart` 业务页  

## 08 §B10 映射（审计快照）

| 项 | 审计结论 | 证据 |
|----|----------|------|
| classroom 等已登记 Deferred/Removed | **措辞滞后**：实际为 Migrated/Degraded 已登记 | 下表 classroom；建议 evidence 时改 08 文案或加 note |
| 无静默消失的 Flutter 业务页 | **Pass** | 51/51 `flutterPath` 精确匹配 |

## 差距表

| ID | Gap | Severity | Slice |
|----|-----|----------|-------|
| G1 | 08 §B10 第一行仍写「Deferred/Removed」，与 classroom 现状不符 | P1 文档 | `b10-evidence` |
| G2 | `bfui/lib/home_screen.dart` 未单独登记（被 gallery/nav 覆盖） | Low | optional `b10-register-bfui-home` |
| G3 | Placeholder/Deferred **status** 计数为 0；Deferred 仅出现在 note | Info | 无需 Slice |

## 库存摘要

| Scope | Count |
|-------|------:|
| Flutter `*_page.dart` | 51 |
| 精确匹配 manifest | 51 |
| 静默缺口（`*_page.dart`） | **0** |
| Manifest 页条目（全） | 78（Migrated 69 / Degraded 8 / Removed 1） |
| classroom | 8/8 已登记 |

### Classroom

| id | status |
|----|--------|
| classroom-my-class-list … claim-gift-card（除 video-detail） | Migrated |
| classroom-video-detail | Degraded（player placeholder） |

## Slice backlog

| Slice | 状态 |
|-------|------|
| `b10-inventory-audit` | ✅ |
| `b10-evidence` | **下一刀** — record + 澄清 08 文案 + 勾 §B10 |
| `b10-register-bfui-home` | Optional |

## Context Card

```md
## Context Card — b10
- 已完成: 全量 *_page.dart 对账；零静默；Epic 差距表 G1–G3
- 未做: 勾 08；acceptance-record；可选 bfui-home
- 下一 Slice: b10-evidence
```
