# `.harness` — 本仓 Agent 编排层

> **引擎仍是** `npm run agent:pre` / `agent:post`（`scripts/agent-harness/`）。  
> **真相源仍是** `docs/flutter-to-rn-lego-migration/08-acceptance-checklist.md` + `page-resource-parity-manifest.ts`。  
> 本目录只做：角色 / 规则 / skill 编排 / 当前变更指针 / wiki 索引。  
> 详解：[docs/flutter-to-rn-lego-migration/10-agent-prompt-harness.md](../docs/flutter-to-rn-lego-migration/10-agent-prompt-harness.md) §12

```text
.harness/
  agents/     角色合同（可写代码？读什么？）
  rules/      硬规则（边界、状态枚举、Slice 合同）
  skills/     可组合能力（指向 docs / .cursor/skills，不双份长文）
  changes/    本轮活动指针（非 Slice 真相源）
  wiki/       文档索引
```

## 开一轮（人 → Agent）

1. 确认 Program 队首 → 落盘 `docs/.../plans/slices/<id>.md`  
2. 指定角色：`.harness/agents/executor.md`（或 reviewer）  
3. `npm run agent:pre -- --slice <path>`  
4. 按需组合 `skills/*`  
5. `npm run agent:post` → 更新 `changes/current.md`  
6. commit/push **仅人指令**
