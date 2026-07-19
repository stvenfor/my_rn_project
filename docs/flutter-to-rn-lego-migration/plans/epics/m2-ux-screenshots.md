# Epic Plan — M2 UX 截图入库

| 项 | 内容 |
|----|------|
| Checklist | [`08` §C](../08-acceptance-checklist.md) + §E 截图格 |
| Program | [2026-07-19-m2-program.md](../2026-07-19-m2-program.md) |
| 状态 | **Ready** |
| 依赖 | 建议在真机补录后或并行（同端可复用会话） |

## 目标

为 C 抽检五样本（或发布子集）提供**可访问**截图/录屏路径，勾实 §E「截图/录屏路径可访问」。

建议样本（与 C record 对齐）：

1. auth Login  
2. home HomeTab  
3. community Feed  
4. music NowPlaying  
5. bfui gallery / 任一模板  

## Epic DoD

- [ ] 截图落在约定目录（建议 `docs/flutter-to-rn-lego-migration/acceptance-records/assets/m2-ux/` 或团队对象存储，路径写进 Record）  
- [ ] §C 样本与路径映射表  
- [ ] §E 截图格 ✅  
- [ ] `acceptance-records/YYYY-MM-DD-m2-ux-screenshots.md`  
- [ ] 末 Slice `agent:post` 绿  

## Slice backlog

| Slice | 状态 |
|-------|------|
| `m2-ux-screenshots`（待建 Brief） | — |

## 不做

- 重做整模块 UI 1:1（仅证据入库）  
- 无设备时用占位图假充  

## Context Card

```md
## Context Card — m2-ux-screenshots
- 已完成: Epic 落盘
- 下一: 设备可用后拍五样本
```
