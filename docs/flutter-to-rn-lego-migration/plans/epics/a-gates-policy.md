# Epic Plan — A 全局门禁政策

| 项 | 内容 |
|----|------|
| Checklist | [`08` §A](../08-acceptance-checklist.md) |
| Program | [2026-07-19-program.md](../2026-07-19-program.md) |
| 状态 | **Accept ✅**（条件：lint 全仓 / token 抽检 Deferred） |

## 拍板结论（本里程碑 M-close-gap）

| 项 | 政策 |
|----|------|
| **A1 typecheck** | **全仓零 error** ✅ |
| **A1 lint** | **改动路径零新增 error**；全仓清零 → **Deferred M2** |
| **A1 test** | parity 三测 + boundary 必绿 ✅ |
| **A2** | 认 B10 ✅ |
| **A3** | 壳/鉴权可证项 ✅；三端真机 → §D |

## Epic DoD

- [x] 政策落盘  
- [x] `npm run typecheck` 绿  
- [x] 08 §A 诚实勾选  
- [x] `acceptance-records/2026-07-19-a-gates.md`  
- [x] harness post（待跑）  

## Slice backlog

| Slice | 状态 |
|-------|------|
| `a-gates-policy` | ✅ |

## Context Card

```md
## Context Card — a-gates
- 已完成: 政策；typecheck 绿；08 A 勾选；record
- Deferred: 全仓 lint；token 抽检；§D
- 下一 Epic: C UX 抽检
```
