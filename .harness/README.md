# `.harness` — 本仓 Agent 编排层

> **引擎仍是** `npm run agent:pre` / `agent:post`（`scripts/agent-harness/`）。  
> **真相源仍是** `docs/flutter-to-rn-lego-migration/08-acceptance-checklist.md` + `page-resource-parity-manifest.ts`。  
> 本目录只做：角色 / 规则 / skill 编排 / 当前变更指针 / wiki 索引。  
> 详解：[docs/flutter-to-rn-lego-migration/10-agent-prompt-harness.md](../docs/flutter-to-rn-lego-migration/10-agent-prompt-harness.md) §12

```text
.harness/
  agents/     角色合同（conductor / planner / executor / reviewer）
  rules/      硬规则（边界、状态枚举、Slice 合同、Babel 别名…）
  skills/     可组合能力（指向 docs / .cursor/skills，不双份长文）
  changes/    本轮活动指针 + Handoff 模板（非 Slice 真相源）
  wiki/       文档索引
```

## 角色一览

| 角色 | 合同 | 可写 | 主责 |
|------|------|------|------|
| **conductor** 统筹 | [agents/conductor.md](./agents/conductor.md) | 仅 `changes/` 指针 | 新任务路由、Handoff、并行锁、更新 `current.md` |
| **planner** 架构师 | [agents/planner.md](./agents/planner.md) | 仅 plans / 架构文档 | Program→Epic→Slice 裁切、依赖与 DEFER 裁决、Brief 草案 |
| **executor** 执行 | [agents/executor.md](./agents/executor.md) | Brief 白名单 | `pre`→实现→`post`、Context Card |
| **reviewer** 审查 | [agents/reviewer.md](./agents/reviewer.md) | 否 | Approved / Rework / Blocked |
| **人** | — | 全权 | 批 Brief、产品降级、commit/push |

索引：[agents/README.md](./agents/README.md)

## 开一轮（标准化）

1. **conductor** 收任务 → 路由表决策 → 写 Handoff + `changes/current.md`  
2. 若需 Brief：**planner** 落盘 → **人批**  
3. **executor** → `npm run agent:pre -- --slice <path>` → 实现 → `agent:post`  
4. **reviewer** → 人 commit/push（**仅人指令**）  
5. Rework / Blocked → 回 **conductor** 再派（实现问题→executor；越界→planner）

Skill：`.harness/skills/conductor-handoff/SKILL.md`
