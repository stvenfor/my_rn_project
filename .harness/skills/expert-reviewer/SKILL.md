# Skill — expert-reviewer

## When

executor 已 `agent:post` 绿；人或第二会话要求审查。

## Do

按 `.harness/agents/reviewer.md`：

- 对照 Brief DoD + `08` 行 + diff + harness-report  
- 输出 `Approved | Rework | Blocked` + P0/P1 findings  

## Don't

- 直接改业务代码  
- 在 post 未绿时 Approved  

## Refs

- `docs/flutter-to-rn-lego-migration/06-supervision-playbook.md`  
- `docs/flutter-to-rn-lego-migration/09-agent-programming-playbook.md` §审查
