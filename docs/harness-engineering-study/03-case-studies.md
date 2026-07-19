# 03 · 业界案例

数据源：[`data/cases.json`](./data/cases.json)

---

## 3.1 OpenAI：百万行 · 零手写

| 指标 | 值 |
|------|-----|
| 团队 | 3 名工程师 |
| 时长 | 5 个月 |
| 规模 | ~100 万行 |
| 手写 | **0 行** |
| PR | ~1,500；人均日 3.5 |
| 效率 | ~10× |

五大原则：

1. **设计环境，而非写代码** — 卡住时问「缺什么能力」  
2. **机械化架构约束** — Linter + 结构测试，非仅文档  
3. **仓库唯一事实源** — Slack/Docs 对 Agent 等于不存在  
4. **可观测性接 Agent** — 日志/指标/截图变成可度量目标  
5. **对抗熵** — 后台清理与生成吞吐同比扩展  

---

## 3.2 Anthropic / Carlini：16 Agent 建 C 编译器

| 指标 | 值 |
|------|-----|
| 时长 | ~2 周 |
| 并行 | 16× Claude Opus |
| 会话 | ~2,000 |
| 产出 | 10 万行 Rust |
| GCC torture | 99% |
| 真实项目 | 150+（含 Linux 6.9） |
| API 成本 | ~$20,000 |

Harness 设计要点：

| 问题 | 做法 |
|------|------|
| 上下文污染 | 日志落盘；`ERROR: [reason]` 单行；聚合统计 |
| 时间盲区 | 确定性测试子采样（单 Agent 1–10%，跨 VM 随机） |
| 能力膨胀 | 专业化角色（含去重） |
| 新功能破坏旧功能 | 更严 CI（Harness 层解决模型层问题） |

> 我是在为 Claude 写这个测试框架，不是为自己写。 —— Carlini

---

## 3.3 Anthropic：长时运行 Agent

**痛点**：跨会话失忆（轮班工程师综合征）。

| 问题 | 初始化 Agent | 编码 Agent |
|------|--------------|------------|
| 过早宣布项目完成 | 建 JSON 功能列表 | 读列表，只选一个功能 |
| 遗留 bug / 未文档进度 | 初始 git + 进度文件 | 读进度与 git；结束时更新 |
| 过早标功能完成 | 建功能列表 | 测过后才 `passing` |
| 不知如何跑应用 | 写 `init.sh` | 会话开始读 `init.sh` |

加分项：浏览器自动化（如 Puppeteer MCP）修「代码层看不见」的 bug。

---

## 3.4 Stripe Minions

流程：`Slack 任务 → 写代码 → CI → PR → 人只审最后一环`

- Toolshed MCP：~500 工具  
- 隔离预热 Devbox（与人同环境，与生产隔离）  
- **Agent 与人类同等工具与上下文 = 一等公民**

---

## 3.5 LangChain：只改 Harness

| | Before | After |
|--|--------|-------|
| Terminal Bench 得分 | 52.8% | 66.5% |
| 全球排名 | 30 | **5** |
| 模型参数 | 未改 | 未改 |

优化对象：文档结构、验证回路、追踪系统。

---

## 3.6 Hashimoto Ghostty & Huntley Ralph Loop

**Ghostty**

- AGENTS.md 每行 = 一次历史失败的永久预防  
- 下班前 30 分钟启 Agent → 次日暖启动  

**Ralph Loop**

```bash
while :; do cat PROMPT.md | claude-code; done
```

核心不是 `while`，是**反压**：

- **上游**：确定性设置、一致上下文、模式引导  
- **下游**：测试 / Lint / 构建 / 扫描拒绝无效工作  

---

下一章：[04-landing-playbook.md](./04-landing-playbook.md)
