# Harness Engineering 研读笔记

> 源材料：[285.Harness Engineering 从入门到精通实战.pdf](file:///Users/mac/Downloads/285.Harness+Engineering+从入门到精通实战.pdf)  
> 结构化数据：[`data/`](./data/)（`core.json` / `cases.json` / `roadmap.json`）  
> 可视化总览：旁路 Canvas（聊天旁打开）

## 一句话

**不优化模型，优化环境。** 哲学：人类掌舵，智能体执行（Human Steer, Agent Execute）。  
Agent 每次失败 → 工程化环境，使同类错误不再发生（Mitchell Hashimoto, 2026-02-05）。

## 闭环（记住这个就够）

```text
约束 → 告知 → 验证 → 纠正
```

从 `AGENTS.md` + 一条可机械化规则开始，比什么都不做强一百倍。

## 目录（建议研读顺序）

| 顺序 | 文档 | 内容 |
|------|------|------|
| 1 | [01-concepts.md](./01-concepts.md) | 定义、三次范式跃迁、为何需要、失败模式 |
| 2 | [02-core-components.md](./02-core-components.md) | 七大核心组件（上下文→熵管理） |
| 3 | [03-case-studies.md](./03-case-studies.md) | OpenAI / Anthropic / Stripe / LangChain 等 |
| 4 | [04-landing-playbook.md](./04-landing-playbook.md) | 三步落地：信息层 → 约束层 → 自动化层 |
| 5 | [05-pitfalls-checklist.md](./05-pitfalls-checklist.md) | 踩坑、落地清单、与本仓库映射 |
| — | [data/*.json](./data/) | 机器可读结构化数据（检索/二次加工用） |

## 与本仓库的关系

PDF 示例栈是 **Java 8 + Spring Boot 2.7**；本仓库是 **Flutter→RN LEGO 迁移**。  
思想同构，工具不同——对照见 [05-pitfalls-checklist.md#与本仓库映射](./05-pitfalls-checklist.md)。

权威实现说明：[`docs/flutter-to-rn-lego-migration/10-agent-prompt-harness.md`](../flutter-to-rn-lego-migration/10-agent-prompt-harness.md)

## 业界六条共识（速记）

1. 瓶颈在基础设施，不在模型智能  
2. 文档必须是活的反馈循环  
3. 思考与执行分离  
4. 上下文不是越多越好  
5. 约束必须自动化  
6. 工程师角色：环境建筑师  

## 原文入口

| 来源 | 链接 |
|------|------|
| Hashimoto | https://mitchellh.com/writing/my-ai-adoption-journey |
| OpenAI | https://openai.com/index/harness-engineering/ |
| Anthropic（长时运行） | https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents |
| Anthropic（应用开发） | https://www.anthropic.com/engineering/harness-design-long-running-apps |
| LangChain | https://www.langchain.com/blog/the-anatomy-of-an-agent-harness |
| Martin Fowler | https://martinfowler.com/articles/harness-engineering.html |
