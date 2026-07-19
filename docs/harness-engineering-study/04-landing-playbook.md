# 04 · 落地路线图（三步走）

数据源：[`data/roadmap.json`](./data/roadmap.json)

> 不要一把梭。阶段 1 已有显著收益；阶段 2 是**质变点**；阶段 3 锦上添花。

```text
阶段1 信息层 (1–2天)     阶段2 约束层 (3–5天)      阶段3 自动化层 (1–2周)
AGENTS.md 地图模式    →   分层 + Linter + CI    →   自验证闭环 + 清理 Agent
docs/ 结构化知识库         错误信息含修复指令         Worktree / 可观测性
适合：所有项目             适合：中期项目             适合：长期维护
收益：输出一致性 ↑         收益：质量可控             收益：人工审查 ↓↓↓
```

PDF 示例技术栈：Spring Boot 2.7 + Java 1.8 + Maven 3.6.3（详见 `data/roadmap.json` → `tech_stack_java8_example`）。  
**思想可迁移到任意栈**；本仓库请用 ESLint / Jest / agent:pre|post 等对等物。

---

## 阶段 1：信息层 — 让 Agent「看得懂」

### AGENTS.md：写地图，不写百科

反面：把技术栈、命名、ORM、500 行规范全塞进一个文件 → 挤占上下文、难维护、难定位。

正面结构：

1. 一句话项目简介  
2. **技术栈基线**（禁止擅自升级）  
3. **快速导航表**：你想做什么 → 去哪里看  
4. **硬性规则**（CI 会验）  
5. 提交规范  

原则：50–100 行；硬性规则单列；面向任务导航。

### docs/ 结构化知识库

```text
docs/
├── architecture/   overview, boundaries, data-flow
├── conventions/    naming, testing, logging…
├── design/         feature-*.md
├── plans/          current-sprint, backlog
└── reference/      api-spec, error-codes
```

文档头元信息（供 doc-gardening）：

```yaml
---
last_updated: 2026-03-28
status: active   # active | deprecated | draft
owner: @name
---
```

### 设计文档模板（先意图后代码）

必含：Status / 目标 / **非目标**（防扩 scope）/ 技术方案 / 验收标准 / 依赖。  
审批通过后再写代码 = 「明确意图」的工程化。

---

## 阶段 2：约束层 — 让 Agent「不能犯错」

### 核心杠杆：错误信息即 Prompt

```text
❌ [什么错了]
✅ FIX: [怎么改，给出代码片段]
📖 See: [文档路径]
```

Agent 读到报错即可自修，无需人类再解释。

### 口头品味 → 机械规则

经验法则：**Code Review 提过 3 次以上 → 写成 Linter 规则。**

| 口头约定 | 机械规则 | 示例实现（Java PDF） |
|----------|----------|----------------------|
| 方法要短 | ≤50 行 | Checkstyle MethodLength |
| 文件要短 | ≤300 行 | Checkstyle FileLength |
| 日志规范 | 禁 println / printStackTrace | 正则规则 |
| HTTP 统一 | 禁裸 RestTemplate… | ArchUnit |
| Controller 纯 | 不得直调 Mapper | ArchUnit 分层 |
| 构造器注入 | 禁字段 @Autowired | ArchUnit |
| 测试充分 | 覆盖率 ≥80% | JaCoCo |
| 锁工具链 | JDK/Maven 版本 | enforcer |

### CI 作为护栏

一次 `verify`：编译 + 单测 + 风格 + 架构 + 覆盖率 + 工具链版本。  
版本漂移是第零道防线（尤其旧 JDK 栈）。

---

## 阶段 3：自动化层 — 自我验证与修复

| 能力 | 作用 |
|------|------|
| 后台清理 Agent | 超长文件、缺测、TODO、重复代码、过时 Draft… 各出独立 PR |
| Git Worktree 脚本 | 隔离分支上跑全量校验 + 健康检查 |
| 可观测性接 Agent | Loki/日志/指标 → Agent 能「看现场」排错 |
| 文档新鲜度 | CI 警告久未更新的 design 文档 |

清理 Agent 约束示例：每 PR 独立；`verify` 必须过；不确定则跳过并标注。

---

## 从零搭建（PDF 五步，约 30 分钟量级）

| Step | 内容 | 量级 |
|------|------|------|
| 1 | 初始化项目结构 + AGENTS.md | ~5 min |
| 2 | 写架构文档 | ~5 min |
| 3 | 配置约束（enforcer/linter/arch） | ~10 min |
| 4 | 配置 CI | ~8 min |
| 5 | 给 Agent 简单任务验证护栏是否生效 | ~2 min |

验证任务应同时覆盖：正向路径（正确分层/测试）与负向路径（违规应被 CI 拦住）。

---

## 工具选型速览

| 场景 | 建议 |
|------|------|
| 个人快速体验 | Aider（`--test-cmd` 作反馈回路） |
| 小团队要 Plan/Act | Cline + Superpowers（强制 TDD） |
| 需完全沙箱 | OpenHands |
| 深度长时任务 | Claude Code / Codex / Cursor |

**Superpowers** 杀手特性：检测到「先写实现再写测试」→ 删实现，强制 RED→GREEN→REFACTOR。

下一章：[05-pitfalls-checklist.md](./05-pitfalls-checklist.md)
