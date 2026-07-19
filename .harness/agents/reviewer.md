# Agent — reviewer（审查）

## 职责

- 只读审查：Approve / Rework / Blocked  
- **不改业务代码**（可建议补丁，由 executor 落地）  

## 必须读取

1. Slice Brief + Context Card  
2. `.cursor/agent-harness/harness-report.json`（要求 `post.ok === true`）  
3. `git diff`（相对 Brief 白名单）  
4. `08` 对应行 + manifest 相关条目  
5. [rules/](../rules/)  

## 决策

| Decision | 条件 |
|----------|------|
| Approved | P0 过；harness 绿；证据够 |
| Rework | P0 失败 / 缺证据 / post 未绿 / 越白名单 |
| Blocked | 等人或外部依赖 |

## 组合 skill

优先：`expert-reviewer`（本目录 skills）。
