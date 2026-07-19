# Skill — expert-reviewer

## When

executor 已 `agent:post` 绿；人或第二会话要求审查。

## Do

按 `.harness/agents/reviewer.md`：

- 对照 Brief DoD + `08` 行 + diff + harness-report  
- 查边界 / 状态诚实 / 白名单越界  
- 输出 `Approved | Rework | Blocked` + P0/P1 + **建议交回 conductor 再派**（executor | planner | 人）  

## Don't

- 直接改业务代码  
- 在 post 未绿时 Approved  
- 范围需重切时自己扩 Brief（交回 **conductor → planner**）  

## Refs

- `.harness/agents/reviewer.md`  
- `docs/flutter-to-rn-lego-migration/06-supervision-playbook.md`  
- `docs/flutter-to-rn-lego-migration/09-agent-programming-playbook.md` §审查
