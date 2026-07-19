# 结构化数据附录
> 机器可读源文件：core.json / cases.json / roadmap.json

## core.json

```json
{
  "meta": {
    "source": "285.Harness Engineering 从入门到精通实战.pdf",
    "term_coined": "2026-02-05",
    "coined_by": "Mitchell Hashimoto (HashiCorp)",
    "philosophy": "Human Steer, Agent Execute",
    "one_liner": "不优化模型本身，而优化模型运行的环境。Agent 每次失败都是环境设计不完善的信号。"
  },
  "definition": {
    "zh": "围绕 AI 智能体设计和构建约束机制、反馈回路、工作流控制和持续改进循环的系统工程实践。",
    "hashimoto": "anytime you find an agent makes a mistake, you take the time to engineer a solution such that the agent will not make that mistake again in the future."
  },
  "analogy": {
    "prompt_engineering": "对马喊话的技巧",
    "context_engineering": "给马看的地图",
    "harness_engineering": "给马造高速公路：护栏、限速牌、加油站"
  },
  "paradigm_shifts": [
    {
      "id": "prompt",
      "name": "提示词工程",
      "core_question": "怎么把话说清楚",
      "optimize": "Prompt 的措辞、格式、示例",
      "interaction": "一问一答"
    },
    {
      "id": "context",
      "name": "上下文工程",
      "core_question": "怎么给 AI 喂信息",
      "optimize": "文档、代码片段、历史对话",
      "interaction": "信息注入 → 生成"
    },
    {
      "id": "harness",
      "name": "驾驭工程",
      "core_question": "怎么让 Agent 可靠工作",
      "optimize": "约束、反馈回路、控制系统",
      "interaction": "人类掌舵，Agent 执行"
    }
  ],
  "vs_framework": {
    "position": "位于 SDK/脚手架/Agent 框架之上的一层",
    "framework_solves": "如何构建 AI 智能体",
    "harness_solves": "智能体如何可靠地运行",
    "model_absorbs_framework_pct": 80,
    "harness_owns_remainder": [
      "持久化",
      "确定性重放",
      "成本控制",
      "可观测性",
      "错误恢复"
    ]
  },
  "failure_modes": [
    {
      "id": "one_shotting",
      "name": "试图一步到位",
      "desc": "一个会话里做完所有功能 → 上下文耗尽 → 半成品无文档 → 下会话只能猜测",
      "mitigation": "功能列表 JSON + 每次只选一个最高优先级功能"
    },
    {
      "id": "premature_project_done",
      "name": "过早宣布胜利",
      "desc": "看到部分进展就宣布项目完成，忽略大量未实现功能",
      "mitigation": "结构化 feature list；会话开始时强制读取并选单功能"
    },
    {
      "id": "premature_feature_done",
      "name": "过早标记功能完成",
      "desc": "写完代码就标完成，无端到端测试；单测/curl 通过 ≠ 功能可用",
      "mitigation": "自我验证 + 端到端测试后才标 passing"
    },
    {
      "id": "pattern_amplification",
      "name": "坏模式放大",
      "desc": "Agent 擅长模式复制，会忠实复制并放大坏模式与架构漂移",
      "mitigation": "架构约束机械化（Linter/CI）+ 熵管理"
    }
  ],
  "components": [
    {
      "id": "context",
      "name": "上下文工程",
      "alias": "新员工手册",
      "principle": "恰好获得当前任务所需上下文——不多不少",
      "key_practices": [
        "分层上下文 + 渐进式披露",
        "AGENTS.md 作为活反馈循环（每行对应历史失败）",
        "地图模式：写导航不写百科全书（50–100 行）"
      ],
      "tiers": [
        {
          "tier": 1,
          "name": "会话常驻",
          "when": "每次会话自动加载",
          "examples": "AGENTS.md / CLAUDE.md，项目结构概览",
          "cost": "最小"
        },
        {
          "tier": 2,
          "name": "按需加载",
          "when": "特定子 Agent 或技能被调用时",
          "examples": "专业化 Agent 上下文、领域知识",
          "cost": "中等"
        },
        {
          "tier": 3,
          "name": "持久化知识库",
          "when": "Agent 主动查询时",
          "examples": "研究文档、规格说明、历史会话",
          "cost": "按需"
        }
      ]
    },
    {
      "id": "specialization",
      "name": "Agent 专业化",
      "principle": "领域受限工具的专家 Agent 优于全权限通用 Agent",
      "roles": [
        {
          "role": "研究 Agent",
          "scope": "探索代码库、分析实现",
          "tools": "只读 Read/Grep/Glob"
        },
        {
          "role": "规划 Agent",
          "scope": "需求分解为结构化任务",
          "tools": "只读，无写入"
        },
        {
          "role": "执行 Agent",
          "scope": "实现单个具体任务",
          "tools": "限定范围读写"
        },
        {
          "role": "审查 Agent",
          "scope": "审计完成工作、标记问题",
          "tools": "只读 + 标记"
        },
        {
          "role": "调试 Agent",
          "scope": "修复审查发现问题",
          "tools": "限定范围修复"
        },
        {
          "role": "清理 Agent",
          "scope": "对抗熵、清理低质量代码",
          "tools": "读写"
        }
      ]
    },
    {
      "id": "persistent_memory",
      "name": "持久化记忆",
      "principle": "进度持久化在文件系统上，而非上下文窗口中",
      "anthropic_pattern": {
        "init_agent": "init.sh + claude-progress.txt + 初始 git 提交",
        "coding_agent_boot": [
          "pwd",
          "读 git log + 进度文件",
          "读 feature list，选最高优先级未完成功能",
          "启动开发服务器，跑基础 E2E",
          "确认基本功能后开始新功能"
        ],
        "insight": "JSON 追踪 feature 状态比 Markdown 更有效（不易被不当覆盖）"
      }
    },
    {
      "id": "structured_execution",
      "name": "结构化执行",
      "principle": "思考与执行分离",
      "sequence": [
        "理解",
        "规划",
        "执行",
        "验证"
      ],
      "checkpoint_value": "审查计划远比审查代码快；规格错可在 500 行代码生成前纠正"
    },
    {
      "id": "architecture_constraints",
      "name": "架构约束",
      "alias": "缰绳",
      "principle": "文档记录不够；不能机械化强制执行，Agent 就会偏离",
      "openai_layers": [
        "Types",
        "Config",
        "Repo",
        "Service",
        "Runtime",
        "UI"
      ],
      "linter_as_prompt": "错误信息三要素：❌ 什么错了 / ✅ FIX 怎么改（含代码片段）/ 📖 See 文档"
    },
    {
      "id": "feedback_loop",
      "name": "反馈循环",
      "alias": "智能体审智能体",
      "practices": [
        "Agent-to-Agent Review 直到通过",
        "失败测试带错误信息回流模型",
        "AI 写的测试通过带 Bug 代码 → 判定测试无效，强制重思边界"
      ]
    },
    {
      "id": "entropy_management",
      "name": "熵管理",
      "alias": "垃圾回收",
      "principle": "技术债务像高息贷款；持续小额偿还，不攒到集中处理",
      "practices": [
        "后台扫描偏差、更新质量等级、针对性重构 PR",
        "Doc-gardening Agent：文档与代码不一致时自动提 PR"
      ]
    }
  ],
  "industry_consensus": [
    {
      "id": 1,
      "title": "瓶颈在基础设施，不在模型智能",
      "detail": "仅改 Harness，LangChain Terminal Bench 排名 30→5；得分 52.8%→66.5%"
    },
    {
      "id": 2,
      "title": "文档必须是活的反馈循环",
      "detail": "静态文档是坟场；后台 Agent 定期清理过时文档并提交 PR"
    },
    {
      "id": 3,
      "title": "思考与执行分离",
      "detail": "Orchestrator + Worker；状态持久化到外部存储"
    },
    {
      "id": 4,
      "title": "上下文不是越多越好",
      "detail": "按需检索、动态注入；巨大指令文件会挤掉任务空间"
    },
    {
      "id": 5,
      "title": "约束必须自动化",
      "detail": "护栏编码为 Linter、CI、类型系统；机器执行而非人"
    },
    {
      "id": 6,
      "title": "工程师角色在转变",
      "detail": "从代码编写者变成环境建筑师；设计让 Agent 可靠工作的控制系统"
    }
  ],
  "closed_loop": [
    "约束",
    "告知",
    "验证",
    "纠正"
  ]
}
```

## cases.json

```json
{
  "cases": [
    {
      "id": "openai-million-loc",
      "org": "OpenAI",
      "title": "百万行代码的零手写实验",
      "metrics": {
        "team_size": 3,
        "duration": "5 个月（2025.8 起）",
        "loc": "~1,000,000",
        "handwritten_loc": 0,
        "merged_prs": "~1,500",
        "prs_per_person_per_day": 3.5,
        "efficiency_gain": "~10x"
      },
      "principles": [
        {
          "id": 1,
          "title": "设计环境，而非编写代码",
          "detail": "卡住时诊断「缺少什么能力」，让 Agent 自己构建该能力"
        },
        {
          "id": 2,
          "title": "机械化执行架构约束",
          "detail": "Types→Config→Repo→Service→Runtime→UI；自定义 Linter + 结构测试"
        },
        {
          "id": 3,
          "title": "仓库作为唯一事实源",
          "detail": "Slack/Google Docs 知识对 Agent 等于不存在"
        },
        {
          "id": 4,
          "title": "可观测性连接到 Agent",
          "detail": "Chrome DevTools / 日志指标 → 「启动时间 <800ms」可度量"
        },
        {
          "id": 5,
          "title": "对抗熵",
          "detail": "周五 20% 清 AI Slop → 自动化为后台 Codex；清理吞吐与生成吞吐同比扩展"
        }
      ]
    },
    {
      "id": "anthropic-c-compiler",
      "org": "Anthropic / Carlini",
      "title": "16 个 Agent 构建 C 编译器",
      "metrics": {
        "duration": "~2 周",
        "parallel_agents": 16,
        "claude_code_sessions": "~2,000",
        "rust_loc": 100000,
        "gcc_torture_pass_rate": "99%",
        "real_projects_compilable": "150+ (PostgreSQL, Redis, FFmpeg, CPython, Linux 6.9…)",
        "api_cost_usd": 20000
      },
      "harness_designs": [
        {
          "title": "上下文窗口污染缓解",
          "detail": "日志写文件；grep 友好 ERROR: [reason] 单行；预计算聚合统计"
        },
        {
          "title": "Agent 时间盲区",
          "detail": "确定性测试子采样：单 Agent 随机 1–10%，跨 VM 随机 → 集体覆盖全套件"
        },
        {
          "title": "专业化而非通用化",
          "detail": "编译器核心 / 去重 / 性能 / 代码质量与文档"
        },
        {
          "title": "CI 作为 Harness",
          "detail": "用更严 CI 应对「实现新功能破坏旧功能」"
        }
      ],
      "quote": "我必须不断提醒自己，我是在为 Claude 写这个测试框架，不是为自己写。"
    },
    {
      "id": "anthropic-long-running",
      "org": "Anthropic",
      "title": "长时间运行 Agent 的有效 Harness",
      "pain": "跨会话失忆：像轮班工程师，上岗时对之前进展一脸懵",
      "two_phase": {
        "init_agent": "专用 prompt 建 init.sh、claude-progress.txt、初始 git",
        "coding_agent": "每次增量进展 + 留下结构化更新"
      },
      "failure_matrix": [
        {
          "problem": "过早宣布项目完成",
          "init": "建结构化 JSON 功能列表",
          "coding": "会话开始读列表，选单个功能"
        },
        {
          "problem": "环境遗留 bug / 未文档化进度",
          "init": "初始 git + 进度记录文件",
          "coding": "开始读进度+git；结束提交+更新进度"
        },
        {
          "problem": "过早标记功能完成",
          "init": "建功能列表文件",
          "coding": "仔细测试后才标 passing"
        },
        {
          "problem": "不知如何运行应用",
          "init": "可启动开发服务器的 init.sh",
          "coding": "会话开始读 init.sh"
        }
      ],
      "extra": "浏览器自动化（Puppeteer MCP）可修代码层看不见的 bug"
    },
    {
      "id": "stripe-minions",
      "org": "Stripe",
      "title": "千级 PR 的 Minions 系统",
      "flow": "Slack 发任务 → Agent 写代码→跑 CI→提 PR → 人只审最后环节",
      "elements": [
        "Toolshed MCP：近 500 工具，覆盖内部系统与 SaaS",
        "隔离预热 Devbox：与人类同环境，与生产/互联网隔离",
        "Agent 与人类工程师同等上下文与工具——一等公民，非事后集成"
      ]
    },
    {
      "id": "langchain-terminal-bench",
      "org": "LangChain",
      "title": "仅改 Harness 的排名跃升",
      "metrics": {
        "model_changed": false,
        "score_before": "52.8%",
        "score_after": "66.5%",
        "rank_before": 30,
        "rank_after": 5,
        "bench": "Terminal Bench 2.0"
      },
      "lesson": "底层模型一个参数都没动；优化文档结构、验证回路、追踪系统即可跃升"
    },
    {
      "id": "hashimoto-ghostty",
      "org": "HashiCorp / Hashimoto",
      "title": "Ghostty AGENTS.md 活反馈",
      "practices": [
        "AGENTS.md 每一行对应一次历史 Agent 失败",
        "每天最后 30 分钟启动 Agent，非工作时间暖启动",
        "约 10–20% 工作日有后台 Agent 运行"
      ]
    },
    {
      "id": "huntley-ralph-loop",
      "org": "Huntley",
      "title": "Ralph Wiggum Loop",
      "loop": "while :; do cat PROMPT.md | claude-code; done",
      "core": "核心不是循环，而是反压（Backpressure）",
      "upstream": "确定性设置、一致上下文、现有代码模式引导首选实现",
      "downstream": "测试、类型检查、Lint、构建、安全扫描、自定义验证器拒绝无效工作",
      "extreme_setup": "NixOS 裸金属；直推 master；无人审；30 秒部署；出错反馈进活跃会话自修复"
    }
  ]
}
```

## roadmap.json

```json
{
  "tech_stack_java8_example": {
    "note": "PDF 示例栈；本仓库 RN 迁移可对照「信息层/约束层/自动化层」思想，不必照搬 Java 工具",
    "components": [
      {
        "name": "JDK",
        "version": "1.8",
        "note": "禁止 record/var/text blocks 等 Java 9+"
      },
      {
        "name": "Spring Boot",
        "version": "2.7.x (2.7.18)",
        "note": "最后支持 Java 8 的 LTS 主版本"
      },
      {
        "name": "Maven",
        "version": "3.6.3",
        "note": "enforcer 强制"
      },
      {
        "name": "ArchUnit",
        "version": "1.3.0",
        "note": "分层依赖测试"
      },
      {
        "name": "Checkstyle",
        "version": "9.3",
        "note": "10.x 起要 Java 11"
      },
      {
        "name": "SpotBugs",
        "version": "4.7.x",
        "note": "兼容 Java 8"
      },
      {
        "name": "JaCoCo",
        "version": "0.8.11",
        "note": "行覆盖率 ≥80%"
      },
      {
        "name": "MyBatis-Plus",
        "version": "3.5.3.2",
        "note": "替代 JPA"
      },
      {
        "name": "MySQL",
        "version": "5.7",
        "note": "utf8mb4；URL 带 serverTimezone & useSSL=false"
      },
      {
        "name": "Flyway",
        "version": "8.5.x",
        "note": "含 flyway-mysql"
      }
    ]
  },
  "phases": [
    {
      "id": 1,
      "name": "信息层",
      "goal": "让 Agent「看得懂」项目",
      "duration": "1–2 天",
      "fit": "所有项目",
      "benefit": "Agent 输出一致性 ↑",
      "deliverables": [
        "AGENTS.md 地图模式（50–100 行）",
        "docs/ 结构化知识库",
        "编码规范文档化",
        "设计文档模板（含 Status）"
      ],
      "agents_md_rules": [
        "控制在 50–100 行；超过则拆到 docs/ 只留链接",
        "「你想做什么 → 去哪里看」优于「这是什么」",
        "硬性规则单独列出（CI 会验证）",
        "文档头加 last_updated / status / owner 供 doc-gardening"
      ],
      "docs_tree": [
        "docs/architecture/{overview,boundaries,data-flow}.md",
        "docs/conventions/{README,naming,error-handling,testing,logging}.md",
        "docs/design/feature-*.md",
        "docs/plans/{current-sprint,backlog}.md",
        "docs/reference/{api-spec.yaml,error-codes.md}"
      ]
    },
    {
      "id": 2,
      "name": "约束层",
      "goal": "让 Agent「不能犯错」",
      "duration": "3–5 天",
      "fit": "中期项目",
      "benefit": "代码质量可控（质变点）",
      "deliverables": [
        "分层架构 + Linter（错误信息含修复指令）",
        "CI 约束检查",
        "把主观品味翻译成机械规则"
      ],
      "rule_of_thumb": "Code Review 提过 3 次以上的约定 → 写成 Linter 规则",
      "taste_to_rules": [
        {
          "oral": "方法要短",
          "rule": "单方法 ≤50 行",
          "impl": "Checkstyle MethodLength"
        },
        {
          "oral": "文件要短",
          "rule": "单文件 ≤300 行",
          "impl": "Checkstyle FileLength"
        },
        {
          "oral": "日志要规范",
          "rule": "禁 System.out / printStackTrace",
          "impl": "Checkstyle 正则"
        },
        {
          "oral": "HTTP 调用要统一",
          "rule": "禁裸 RestTemplate/HttpURLConnection",
          "impl": "ArchUnit"
        },
        {
          "oral": "Controller 要纯",
          "rule": "Controller 不得直接调 Mapper",
          "impl": "ArchUnit 分层"
        },
        {
          "oral": "依赖要构造器注入",
          "rule": "禁字段级 @Autowired",
          "impl": "ArchUnit"
        },
        {
          "oral": "测试要充分",
          "rule": "行覆盖率 ≥80%",
          "impl": "JaCoCo"
        },
        {
          "oral": "锁定构建工具版本",
          "rule": "Maven≥3.6.3，JDK=1.8",
          "impl": "maven-enforcer"
        }
      ],
      "linter_prompt_formula": "❌ [什么错了]\n✅ FIX: [怎么改，给出代码片段]\n📖 See: [哪个文档]"
    },
    {
      "id": 3,
      "name": "自动化层",
      "goal": "让 Agent 自我验证和自我修复",
      "duration": "1–2 周",
      "fit": "长期维护项目",
      "benefit": "人工审查量 ↓↓↓",
      "deliverables": [
        "Git Worktree 隔离验证（含健康检查）",
        "后台清理 Agent 定时任务",
        "可观测性（Actuator + Loki + Prometheus）",
        "文档新鲜度自动检查"
      ]
    }
  ],
  "pitfalls": [
    {
      "id": "agents_md_too_long",
      "symptom": "输出质量下降，经常忽略部分规则",
      "cause": "上下文被指令占满",
      "fix": "砍到 50–100 行；细节进 docs/ 只留链接"
    },
    {
      "id": "linter_death_loop",
      "symptom": "修一条触发另一条，反复循环",
      "cause": "规则过多或互相冲突；FIX 信息不具体",
      "fix": [
        "逐条加规则并试跑",
        "FIX 给具体代码片段",
        "冲突规则只留一条"
      ]
    },
    {
      "id": "java8_version_drift",
      "symptom": "UnsupportedClassVersionError",
      "cause": "工具最新版不再支持 Java 8",
      "fix": [
        "pom 显式锁定兼容版本",
        "Dependabot ignore 主版本升级"
      ]
    },
    {
      "id": "arch_too_strict",
      "symptom": "合理模式被拦截，团队绕过规则",
      "cause": "无豁免机制",
      "fix": "白名单包（如 controller.legacy）"
    },
    {
      "id": "stale_docs",
      "symptom": "Agent 按过时文档写出错误假设代码",
      "cause": "doc-gardening 无人管",
      "fix": [
        "CI 文档新鲜度",
        "每两周 doc-gardening",
        "status 字段"
      ]
    },
    {
      "id": "forget_env_review",
      "symptom": "过度依赖 Agent，环境腐化",
      "cause": "只审代码不审环境",
      "fix": "每周 30 分钟环境审查（CI 失败率、规则覆盖、文档一致性、版本漂移）"
    }
  ],
  "checklist": {
    "phase1": [
      "AGENTS.md（50–100 行，含版本基线）",
      "docs/ 结构化目录",
      "架构 + 编码规范文档",
      "设计文档模板（含 Status）"
    ],
    "phase2": [
      "enforcer 锁定工具链版本",
      "ArchUnit / 等价分层约束",
      "Checkstyle/ESLint 等 + 错误信息即 Prompt",
      "覆盖率门禁 + CI verify",
      "口头约定 → 机械规则"
    ],
    "phase3": [
      "Worktree/隔离验证脚本",
      "后台清理 Agent",
      "可观测性接入 Agent",
      "文档新鲜度 + Dependabot 防误升"
    ],
    "ongoing": [
      "每周 30 分钟环境审查",
      "每月回顾约束规则",
      "每两周 doc-gardening"
    ]
  },
  "tools": [
    {
      "name": "Aider",
      "stars": "30k+",
      "type": "CLI 结对",
      "best_for": "个人快速体验",
      "harness": 5
    },
    {
      "name": "Cline",
      "stars": "40k+",
      "type": "VS Code Agent",
      "best_for": "小团队 Plan/Act",
      "harness": 4
    },
    {
      "name": "Claude Code",
      "stars": "-",
      "type": "CLI Agent",
      "best_for": "深度自主（6h+）",
      "harness": 5
    },
    {
      "name": "OpenHands",
      "stars": "50k+",
      "type": "平台",
      "best_for": "沙箱隔离团队部署",
      "harness": 5
    },
    {
      "name": "SWE-agent",
      "stars": "15k+",
      "type": "CLI Agent",
      "best_for": "自动修 GitHub Issue",
      "harness": 3
    },
    {
      "name": "Superpowers",
      "stars": "127k",
      "type": "技能框架",
      "best_for": "强制 TDD + 子 Agent",
      "harness": 5
    },
    {
      "name": "Cursor / Codex",
      "stars": "-",
      "type": "IDE/Agent",
      "best_for": "生产开发日常",
      "harness": 5
    }
  ],
  "resources": [
    {
      "name": "Mitchell Hashimoto — My AI Adoption Journey",
      "url": "https://mitchellh.com/writing/my-ai-adoption-journey"
    },
    {
      "name": "OpenAI — Harness engineering",
      "url": "https://openai.com/index/harness-engineering/"
    },
    {
      "name": "Anthropic — Effective harnesses for long-running agents",
      "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
    },
    {
      "name": "Anthropic — Harness design for long-running apps",
      "url": "https://www.anthropic.com/engineering/harness-design-long-running-apps"
    },
    {
      "name": "LangChain — Anatomy of an Agent Harness",
      "url": "https://www.langchain.com/blog/the-anatomy-of-an-agent-harness"
    },
    {
      "name": "Martin Fowler — Harness Engineering memo",
      "url": "https://martinfowler.com/articles/exploring-gen-ai/harness-engineering-memo.html"
    },
    {
      "name": "Martin Fowler — for coding agent users",
      "url": "https://martinfowler.com/articles/harness-engineering.html"
    },
    {
      "name": "deusyu/harness-engineering",
      "url": "https://github.com/deusyu/harness-engineering"
    },
    {
      "name": "harness-engineering.ai 知识图谱",
      "url": "https://harness-engineering.ai"
    }
  ],
  "map_to_this_repo": {
    "note": "本仓库 Flutter→RN LEGO 迁移已落地的对等物",
    "items": [
      {
        "pdf_concept": "AGENTS.md / 地图",
        "repo": "Slice Brief + 09 playbook + Context Card"
      },
      {
        "pdf_concept": "约束机械化",
        "repo": "agent:pre / agent:post + status enums + check-manifest"
      },
      {
        "pdf_concept": "思考与执行分离",
        "repo": "Program → Epic → Slice；禁止整模块一把梭"
      },
      {
        "pdf_concept": "诚实完成态",
        "repo": "Migrated|Degraded|Placeholder|Deferred|Removed"
      },
      {
        "pdf_concept": "双事实源",
        "repo": "08-acceptance.md + parity-manifest"
      },
      {
        "pdf_concept": "人类闸门",
        "repo": "Brief 定范围；降级决策；显式要求才 commit/push"
      }
    ]
  }
}
```
