# Epic Plan — M2 Design-token 抽检

| 项 | 内容 |
|----|------|
| Checklist | [`08` §A1 design-system tokens](../08-acceptance-checklist.md) |
| Program | [2026-07-19-m2-program.md](../2026-07-19-m2-program.md) |
| 状态 | **Ready** |
| 依赖 | 可与 lint 并行；改色值时注意与 UX 截图顺序 |

## 目标

对新增/主路径 UI 做 **design-token 抽检**：无散落硬编码色值/间距（允许清单内例外 + note）。

抽检建议范围（与 C 样本对齐即可）：

- auth Login、home HomeTab、community Feed、settings Mine、music NowPlaying  

## Epic DoD

- [ ] 抽检表：文件 → 违规/合规 → 处理（改 token / Deferred note）  
- [ ] 08 §A1 token 行诚实勾选  
- [ ] `acceptance-records/YYYY-MM-DD-m2-design-tokens.md`  
- [ ] 末 Slice `agent:post` 绿  

## Slice backlog

| Slice | 状态 |
|-------|------|
| `m2-design-tokens-audit`（只读审计） | 待建 |
| `m2-design-tokens-fix`（按白名单修） | 待建 |

## 不做

- 一次性替换全仓历史硬编码（可分 M2.x）  
- 引入第二套主题系统  

## Context Card

```md
## Context Card — m2-design-tokens
- 已完成: Epic 落盘
- 下一: 审计 Slice → 修复 Slice
```
