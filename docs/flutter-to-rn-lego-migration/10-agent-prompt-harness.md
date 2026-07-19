# 10 — Agent 提示词工程 + Harness（A+B）

> 配套：[`09-agent-programming-playbook.md`](./09-agent-programming-playbook.md) · [`plans/README.md`](./plans/README.md) · [`08-acceptance-checklist.md`](./08-acceptance-checklist.md)  
> 真相源仍只认 `08` + `page-resource-parity-manifest.ts`。Harness **不另起验收标准**，只强制「合同齐全 + 机检绿」。

本文把迁移工作从「聊天约定」升级为：

| 层 | 名称 | 作用 |
|----|------|------|
| **A** | 合同驱动 Harness | Slice 落盘 → `agent:pre` / `agent:post` 机检 |
| **B** | Cursor Hooks | 会话注入、提交前提醒、改 feature 提醒、结束未 post 追问 |

---

## 1. 为什么要做

| 痛点 | 没有 harness | 有 harness |
|------|----------------|------------|
| 口头 Brief 漂移 | ONLY/不做事后改口 | 开跑前 `check-brief` 拦下 |
| 假 Accept | 口头「测过了」 | `run-verify` 跑 Brief 里的命令 |
| feature→feature | review 才发现 | `check-boundary` 直接 fail |
| 白名单外改文件 | 难察觉 | `check-whitelist` |
| 长会话忘收尾 | 未写 Card / 未跑测 | `stop` hook 追问 + `check-dod` |

**原则：** Prompt 决定怎么想；Harness 决定能不能算过。未过 `agent:post` → 不得勾 `08`、不得自称 Accept。

---

## 2. 目录与命令

```text
scripts/agent-harness/
  pre.mjs / post.mjs          ← npm 入口
  check-brief.mjs             ← Brief 合同
  check-boundary.mjs          ← 禁止 feature→feature / core→feature
  check-manifest.mjs          ← manifest status + Degraded note
  check-whitelist.mjs         ← 改动 ⊆ Brief 白名单
  run-verify.mjs              ← 执行 Brief「验证命令」
  check-dod.mjs               ← post 门禁信号（非替代 08）
  lib/common.mjs

.cursor/
  hooks.json                  ← B：事件挂载
  hooks/*.mjs
  agent-harness/              ← 运行时（gitignore 报告）
    active-slice.txt
    harness-report.json

docs/.../plans/slices/<id>.md ← 唯一开场合同
```

| npm | 含义 |
|-----|------|
| `npm run agent:pre -- --slice <path>` | 开工前 |
| `npm run agent:post` | 收工（读 active-slice） |
| `npm run agent:post -- --slice <path>` | 显式指定 |
| `npm run agent:post -- --skip-verify` | 紧急跳过验证（须在 Delivery 写明） |

环境变量：`AGENT_SLICE`、`AGENT_SKIP_VERIFY=1`、`AGENT_DIFF_BASE`（默认 `HEAD`）。

---

## 3. 标准人机流程（复制即用）

### 3.1 人：开 Slice

1. 从 [`plans/slices/_template.md`](./plans/slices/_template.md) 复制为 `plans/slices/<slice-id>.md`  
2. 填满 ONLY / 不做 / 验收 / 白名单 / 验证命令 / 证据  
3. 对 Agent 只发：

```text
执行 docs/flutter-to-rn-lego-migration/plans/slices/<slice-id>.md
先跑：npm run agent:pre -- --slice docs/flutter-to-rn-lego-migration/plans/slices/<slice-id>.md
结束后跑：npm run agent:post
按 09 Delivery Report 交卷；未过 harness 不得勾 08；commit/push 等我指令。
```

### 3.2 Agent：执行

```text
agent:pre 绿
  → 只读审计（若 Brief 要求）或白名单内实现
  → 更新 manifest / 测 / Context Card
agent:post 绿
  → Delivery Report（附 harness-report.json 摘要）
  → 等人审查 / commit
```

### 3.3 审查 Agent（可选）

只读输入：

- Slice Brief + Context Card  
- `.cursor/agent-harness/harness-report.json`（`pre/post/verify` 均为 ok）  
- `git diff`  
- 对应 `08` 行  

输出：`Approved` / `Rework` / `Blocked`。缺 harness 绿报告 → 默认 Rework。

---

## 3.4 证据目录约定（截图 / 真机日志）

| 用途 | 路径 |
|------|------|
| **Canonical（新 Slice 一律用）** | `docs/flutter-to-rn-lego-migration/acceptance-records/evidence/<slice-id>/` |
| Legacy alias（已有资产，勿删勿迁） | `docs/flutter-to-rn-lego-migration/acceptance-records/assets/m2-device-smoke/` |

- Brief「证据」字段应写 canonical 路径（或相对 `evidence/<slice-id>/` 的文件名）。
- Packaging / Metro / `npm run dev` 成功 **不算** 真机交互证据；须有截图或设备日志落在上述目录。
- 本约定只统一文档与新入库位置；**不要求**把 legacy `assets/m2-device-smoke/` 迁并（避免大图 churn）。索引说明见 [`acceptance-records/evidence/README.md`](./acceptance-records/evidence/README.md)。

---

## 4. Brief 合同字段（机检）

`check-brief` 解析 `## Slice Brief` 列表项（中英标签均可）：

| 字段 | 实现类 | 审计类（ONLY 含 audit/只读/不改代码/差距表） |
|------|--------|-----------------------------------------------|
| 本轮 ONLY | 必填 | 必填 |
| 不做 | 必填 | 必填 |
| 验收 | 必填 | 必填 |
| 文件白名单 | **必填** | 可选 |
| 验证命令 | **必填** | 可空（建议写「无 / 只读」） |
| 证据 | 建议 | 建议 |
| FLUTTER_MODULE / RN_FEATURE | 建议 | 建议 |

**白名单写法：** 路径前缀，例如：

```text
- 文件白名单:
  - packages/features/settings/
  - docs/flutter-to-rn-lego-migration/
  - src/screens/SettingsWrappers.tsx
```

`docs/flutter-to-rn-lego-migration/` 与 `.cursor/agent-harness/` 默认允许，不必重复。

**验证命令写法：**

```text
- 验证命令:
  - npx jest packages/features/settings --no-coverage
  - npx jest src/__tests__/pageParity.test.ts
```

子项必须**缩进**（两个空格 + `-`）。顶格的下一行 `- 证据:` 会被视为新字段，不会吞进列表。

---

## 5. 各检查器语义

| 检查 | 时机 | 失败含义 |
|------|------|----------|
| `check-brief` | pre | 合同不全，禁止开工 |
| `check-boundary` | pre+post | 工作区 TS 出现跨 feature / core→feature |
| `check-manifest` | pre+post* | 改了 manifest 且 status 非法或缺 note |
| `check-whitelist` | post | 改动逃出白名单 |
| `run-verify` | post | Brief 命令非零退出 |
| `check-dod` | post | 无成功 pre、无 Context Card、实现类无 verify |

\* manifest 未改则 skip。

报告写入 `.cursor/agent-harness/harness-report.json`（不入库）。结构示例：

```json
{
  "slice": "docs/.../plans/slices/foo.md",
  "pre": { "ok": true },
  "boundary": { "ok": true },
  "manifest": { "ok": true },
  "verify": { "ok": true, "commands": [{ "cmd": "...", "code": 0 }] },
  "post": { "ok": true },
  "updatedAt": "..."
}
```

---

## 6. Cursor Hooks（方案 B）

配置：[`.cursor/hooks.json`](../../.cursor/hooks.json)

| 事件 | 脚本 | 行为 |
|------|------|------|
| `sessionStart` | `session-start.mjs` | 注入 harness 用法 + active slice |
| `beforeSubmitPrompt` | `before-submit-prompt.mjs` | 像迁移任务但未提 harness → **提醒不拦截** |
| `afterFileEdit` | `after-file-edit.mjs` | 改 `packages/features/*` → 边界提醒 |
| `stop` | `stop.mjs` | 有 active slice 且 post 未绿 → **一条 follow-up**（`loop_limit: 1`） |

Hooks 全部 **fail-open**（脚本异常不拦操作）。真正门禁是 `agent:pre` / `agent:post` 退出码。

启用后可在 Cursor **Hooks** 面板确认已加载；改 `hooks.json` 后一般自动热更，异常则重启 Cursor。

---

## 7. Prompt 配方（与 harness 对齐）

### 7.1 总控（执行）

```md
你是 my_rn_project 迁移执行 Agent。
L0：skill flutter-to-rn-lego-module · 07 · 08 · 09 · 10-agent-prompt-harness · 本 Slice 文件
流程：agent:pre → 白名单内改动 → agent:post → Delivery Report
禁止：扩大 ONLY；feature→feature；未过 post 勾 08；擅自 commit/push
```

### 7.2 审计-only

```md
只读。Brief 路径：...
npm run agent:pre -- --slice ...
列出 ≥1 真实缺口；更新 Epic 差距表；填 Context Card；npm run agent:post
不要改业务代码。
```

### 7.3 审查

```md
只读审查。输入：Brief、harness-report.json、diff、08 对应行。
输出 Approved / Rework / Blocked。post.ok≠true → Rework。不改代码。
```

---

## 8. 故障排查

| 现象 | 处理 |
|------|------|
| `缺少「本轮 ONLY」` | Brief 必须用 `- 本轮 ONLY:` 列表形式（见模板） |
| whitelist fail | 收窄改动或把路径写入白名单并说明理由 |
| boundary fail | 删跨 feature import；改走 `@core/*` 或 app shell |
| verify fail | 修测试；不要默认 `--skip-verify` |
| stop 一直追问 | 跑通 `agent:post`，或删除 `active-slice.txt`（确认放弃本轮） |
| hooks 不触发 | 查 Hooks 面板路径是否相对仓库根；脚本用 `node .cursor/hooks/...` |

---

## 9. 与 Planning OS 的关系

```text
Program（队首 Epic）
  → Epic Plan（差距表 + Slice backlog）
    → Slice 文件（合同）── agent:pre/post ──→ Record + 勾 08
         ↑                        ↓
         └──── Context Card ←─────┘
```

短口头 Brief **不再推荐**。若极短热修：仍须落盘 Slice（可很短），否则 hooks/harness 无法锚定。

---

## 10. 不做（本 Harness 范围外）

- 不替代真机 / Harmony smoke  
- 不自动勾选 `08`  
- 不自动 commit/push  
- 不做 prompt A/B eval 平台（方案 C，另文）  
- 不用 SDK 批量跑（方案 E，另文）  

---

## 11. 变更记录

| 日期 | 变更 |
|------|------|
| 2026-07-19 | 初版：A 脚本 + B hooks + npm `agent:pre`/`agent:post` |
| 2026-07-19 | 增加 `.harness/` 编排层（agents/rules/skills/changes/wiki） |
| 2026-07-19 | §3.4 证据目录约定：canonical `evidence/<slice-id>/`；`assets/m2-device-smoke/` 为 legacy |
| 2026-07-19 | 增加 `planner` 架构师；细化 planner/executor/reviewer 职责 |
| 2026-07-19 | 增加 `conductor` 统筹：新任务路由、Handoff、`current.md` 主写 |

## 12. `.harness/` 编排层（与图示目录对齐）

仓库根目录 [`.harness/`](../../.harness/README.md) 是 **Agent 编排合同**，不是第二套验收标准。

| 目录 | 作用 | 本仓要点 |
|------|------|----------|
| `agents/` | 角色 | `conductor`（路由）；`planner`（Brief）；`executor`（实现）；`reviewer`（裁决） |
| `rules/` | 硬规则 | dual-truth、slice-contract、boundary、status-enums、no-silent-accept、metro-babel-aliases |
| `skills/` | 可组合能力 | conductor-handoff → request-analysis → coding → unit-test-* → expert-reviewer |
| `changes/` | 本轮指针 | `current.md`（conductor 主写 Role/Next）+ `handoff-template.md`；**Slice 仍是合同源** |
| `wiki/` | 索引 | 链到 `docs/flutter-to-rn-lego-migration/*`，不搬长文 |

```text
新任务 → .harness/agents/conductor + skills/conductor-handoff
  → （若需）planner 落盘 Brief → 人批
  → executor + skills/* + agent:pre/post     ← 硬门禁
  → changes/current.md
  → reviewer + expert-reviewer
  → 人 commit/push
  （Rework/Blocked → 回 conductor）
```

conductor **不替代** harness 引擎，只标准化「开谁、何时并行、指针写哪」。

**禁止双份维护：** skill 正文只写何时用/输入输出；实现细节继续指 `.cursor/skills/*` 与 `docs/`。

## 跨项目复用

个人 Skill（语言无关 OS，可带到其它语言仓库）：

`~/.cursor/skills/migration-os-harness/`（`SKILL.md` + `prompts.md` + `templates.md` + `parallel-agents.md`）

在 Cursor 中 `@migration-os-harness` 或描述「迁移 OS / harness / 多开 Agent」时使用；栈映射仍用本仓 `.cursor/skills/flutter-to-rn-lego-module`。  
新语言项目：复制 `.harness/` 骨架 + 换 `coding-skill` 指向即可。
