# 05 · 踩坑、清单与本仓库映射

数据源：[`data/roadmap.json`](./data/roadmap.json)

---

## 5.1 踩坑指南

| 坑 | 症状 | 解法 |
|----|------|------|
| AGENTS.md 太长 | 质量下降、规则被忽略 | 砍到 50–100 行；细节进 docs/ |
| Linter 死循环 | 修 A 触发 B，反复 | 逐条加规则试跑；FIX 给代码；冲突只留一条 |
| 工具链版本漂移 | UnsupportedClassVersionError 等 | 锁定兼容版本；Dependabot ignore 主版本 |
| 架构约束过严 | 合理模式被拦，团队绕过 | 白名单/豁免包 + 文档化例外 |
| 文档腐烂 | Agent 按过时假设写码 | CI 新鲜度 + 定期 doc-gardening + status 字段 |
| 只审代码不审环境 | CI 失败率升、规则覆盖滞后 | 每周 30 分钟「环境审查」 |

环境审查四问：

1. 近一周 CI 失败率是否上升？  
2. 规则是否覆盖新出现的坏模式？  
3. AGENTS.md / docs 是否与代码一致？  
4. 是否有人试图突破技术栈基线？  

---

## 5.2 落地清单

### 阶段 1 · 信息层

- [ ] AGENTS.md（50–100 行，含版本基线）  
- [ ] docs/ 结构化目录  
- [ ] 架构 + 编码规范文档  
- [ ] 设计文档模板（含 Status）  

### 阶段 2 · 约束层

- [ ] 工具链版本强制（enforcer 或等价）  
- [ ] 分层/边界约束（ArchUnit / ESLint / 自定义脚本）  
- [ ] Linter + **错误信息即 Prompt**  
- [ ] 覆盖率/质量门禁 + CI  
- [ ] 口头约定 → 机械规则  

### 阶段 3 · 自动化层（长期项目推荐）

- [ ] 隔离验证（Worktree / 沙箱）  
- [ ] 后台清理 Agent  
- [ ] 可观测性接入 Agent  
- [ ] 文档新鲜度 + 防误升依赖  

### 持续维护

- [ ] 每周 30 分钟环境审查  
- [ ] 每月回顾约束规则  
- [ ] 每两周 doc-gardening  

---

## 5.3 与本仓库映射

本仓库已有 Flutter→RN LEGO 迁移 Harness，与 PDF 概念对应如下：

| PDF 概念 | 本仓库对等物 |
|----------|--------------|
| AGENTS.md / 地图 | Slice Brief + playbook + Context Card |
| 约束机械化 | `npm run agent:pre` / `agent:post` + status enums + `check-manifest` |
| 思考与执行分离 | Program → Epic → Slice（禁止整模块一把梭） |
| 诚实完成态 | `Migrated \| Degraded \| Placeholder \| Deferred \| Removed` |
| 双事实源 | `08-acceptance.md` + parity-manifest |
| 人类闸门 | Brief 定范围；降级决策；显式要求才 commit/push |
| 错误信息即 Prompt | harness 失败输出应指向修复路径与文档 |

权威文档：

- [`10-agent-prompt-harness.md`](../flutter-to-rn-lego-migration/10-agent-prompt-harness.md)  
- [`11-conversion-retrospective-and-extraction.md`](../flutter-to-rn-lego-migration/11-conversion-retrospective-and-extraction.md)（复盘与 AGENTS/Skill 抽取）  
- [`.harness/rules/status-enums.md`](../../.harness/rules/status-enums.md)  
- Active slice：[`plans/slices/`](../flutter-to-rn-lego-migration/plans/slices/)  

研读 PDF 时可用的心态：

> Prompt ≠ Harness。Prompt 教方法；Harness 判通过/失败。  
> 为了更高自主性，运行时需要更严约束——护栏让你敢踩油门。

---

## 5.4 总结表

| 组件 | 解决的问题 | 代表实践 |
|------|------------|----------|
| 上下文 Context | 不知看什么、怎么找 | AGENTS.md 活文档、按需检索 |
| 架构 Constraints | 复制放大坏模式 | 分层依赖、Linter、CI 阻断 |
| 反馈 Feedback | 不知道自己做错了 | Agent-to-Agent Review、自动测试 |
| 熵 Entropy | 债务与文档腐烂 | Doc-gardening、持续垃圾回收 |

工程师价值迁移：**执行者 → 赋能者 / 系统思考者** —— 从构建产品，转向构建能构建产品的工厂。

返回：[00-index.md](./00-index.md)
