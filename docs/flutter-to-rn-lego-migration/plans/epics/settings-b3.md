# Epic Plan — B3 `@features/settings`

| 项 | 内容 |
|----|------|
| Checklist | [`08` §B3](../08-acceptance-checklist.md) |
| Flutter | `/Users/mac/Desktop/github/my_ai_project/packages/features/settings/` |
| RN | `packages/features/settings/` |
| Program | [2026-07-19-program.md](../2026-07-19-program.md) |
| 状态 | **Accept ✅**（2026-07-19） |

## Epic DoD

- [x] 08 §B3 全部 ✅  
- [x] `acceptance-records/2026-07-19-settings-b3.md`  
- [x] manifest `settings-mine` / `settings-settings` 诚实 note  
- [x] Mine shell = Header + QuickServices + FunctionSection + MenuList  
- [x] Settings `__DEV__` 顺序：Dialog→Linking→Realtime→IM（+ B9 smoke 追加）  
- [x] 退出登录 `navigation.reset` → Login  
- [x] 无 `@features/*` 依赖  

## 08 §B3 映射

| 项 | 结果 | 证据 |
|----|------|------|
| MineTab / Settings 可进入 | ✅ | `registerSettingsFeature`；MineTab + Settings 路由 |
| Dialog / Invoice / HTTP Test 可用 | ✅ | 既有 Migrated 路由；Settings 列表入口 |
| 设置项列表顺序与 Flutter 对齐 | ✅ | Flutter 四项 DEV 顺序恢复；Live/Friend/Pay 标为 RN 追加 |
| 退出登录链路正确 | ✅ | `logoutThunk` + `navigation.reset`→Login（`SettingsWrappers`） |

## 审计差距（关闭）

| ID | 处理 |
|----|------|
| S1 DEV 顺序 | IM 前移；B9 smoke 追加在 IM 后 |
| S2 QuickServices / MenuList | 已补组件 + MineScreen 接线 |
| S3 manifest 过标 | note 更新为当前契约 |
| S4 logout reset | `SettingsWrappers` reset stack |
| S5 used_car | `openMineGatedRoute` + LoginRedirect（不 import home） |
| S6 short_video LoginRedirect | 同上 |
| S7 单测 | `mineGatedNavigation.test.ts` + MineScreen snapshot |

## Slice backlog

| Slice | 状态 |
|-------|------|
| `settings-b3-audit` | ✅ |
| `settings-b3-dev-order` | ✅ |
| `settings-b3-mine-shell` | ✅ |
| `settings-b3-logout-reset` | ✅ |
| `settings-b3-evidence` | ✅ |

## Context Card

```md
## Context Card — settings-b3
- 已完成: B3 Accept；Mine shell；DEV 顺序；logout reset；gated nav
- 下一 Epic: B10 静默页清点
```
