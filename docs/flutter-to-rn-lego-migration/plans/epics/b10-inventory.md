# Epic Plan — B10 未迁移 / 静默页清点

| 项 | 内容 |
|----|------|
| Checklist | [`08` §B10](../08-acceptance-checklist.md) |
| Flutter | `/Users/mac/Desktop/github/my_ai_project/packages/features/` |
| RN | `page-resource-parity-manifest.ts` + `packages/features/` |
| Program | [2026-07-19-program.md](../2026-07-19-program.md) |
| 状态 | **Accept ✅**（2026-07-19） |

## Epic DoD

- [x] Flutter `*_page.dart` 全量对账（51/51 有 manifest）  
- [x] 08 §B10 全部 ✅  
- [x] `acceptance-records/2026-07-19-b10-inventory.md`  
- [x] `classroom` 已登记（Migrated×7 + Degraded×1）  
- [x] 无「静默消失」的 Flutter `*_page.dart` 业务页  
- [x] G1 08 文案已澄清；G2 bfui-gallery note 已补  

## 08 §B10 映射

| 项 | 结果 | 证据 |
|----|------|------|
| 业务页均已登记且 status 合法 | ✅ | record + classroom 8/8 |
| 无静默消失的 Flutter 业务页 | ✅ | 51/51；bfui home_screen note |

## 差距表（关闭）

| ID | 处理 |
|----|------|
| G1 | 08 文案改为「登记且 status 合法」 |
| G2 | `bfui-gallery` note 覆盖 `home_screen.dart` |
| G3 | Info；无需 Slice |

## Slice backlog

| Slice | 状态 |
|-------|------|
| `b10-inventory-audit` | ✅ |
| `b10-evidence` | ✅ |
| `b10-register-bfui-home` | Cancelled（G2 note 已够） |

## Context Card

```md
## Context Card — b10
- 已完成: B10 Accept；零静默；08 勾选；record
- 下一 Epic: A 全局门禁政策（或 C 抽检）
```
