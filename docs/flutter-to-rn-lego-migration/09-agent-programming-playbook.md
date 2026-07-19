# Agent 编程方法（Flutter → RN LEGO）

> 源：`/Users/mac/Desktop/github/my_ai_project`  
> 目标：`/Users/mac/Desktop/github/my_rn_project`  
> 配套：[`07-1to1-migration-guide.md`](./07-1to1-migration-guide.md) · [`08-acceptance-checklist.md`](./08-acceptance-checklist.md) · [`04-cursor-execution-spec.md`](./04-cursor-execution-spec.md) · [`06-supervision-playbook.md`](./06-supervision-playbook.md) · [`plans/README.md`](./plans/README.md)  
> Skill：`.cursor/skills/flutter-to-rn-lego-module/SKILL.md`  
> UX 门控：`/Users/mac/Desktop/skills/flutter-to-rn-lego-module/references/ux-1to1-gates.md`

本文把迁移仓库已有规范串成 **可重复的 Agent 作战闭环**：任务拆解、上下文工程、测试闭环、权限边界、失败复盘、交互验证。  
**不另起验收标准**——验收仍以 `08` 为准；页/资源状态仍以 `page-resource-parity-manifest.ts` 为准。  
**选哪一刀、Epic/Slice 队列**见 [`plans/`](./plans/README.md)（Program → Epic → Slice）。

---

## 0. 总原则

| 原则 | 含义 |
|------|------|
| 真相源唯一 | 页/资源状态只认 `page-resource-parity-manifest.ts`；验收只认 `08-acceptance-checklist.md` |
| 1:1 不是壳 | 能进路由 ≠ `Migrated`；缺态/缺资源最多 `Degraded` / `Placeholder` |
| 小步可验 | 每轮只做一个可独立验收的切片（一页 / 一条交互 / 一批资源） |
| 证据优先 | 无截图/录屏/命令摘要 → 只能 Rework，不能 Approved |
| 边界硬约束 | 禁止 feature→feature、core→feature；不切换包管理器 |

### 角色

| 角色 | 职责 |
|------|------|
| 执行 Agent（Cursor） | 审计、实现、聚焦测试、Delivery Report |
| 审查 Agent（Codex / 第二会话） | 对照 checklist 放行 / 返工 / 阻塞（见 `06`） |
| 人 | 确认范围、产品决策、真机/Harmony 专项、指令 commit/push |

---

## 1. 任务拆解

### 1.1 粒度

```text
Epic（模块）     例：settings
  └─ Slice（可交付切片）  例：个性化设置页
       ├─ T1 源码审计 + UX contract
       ├─ T2 资源同步 + registry
       ├─ T3 UI / 状态实现
       ├─ T4 路由 / 入口接线
       ├─ T5 parity + 单测
       └─ T6 交互验证 + Delivery Report
```

单模块 10 步清单见 [`07` §4](./07-1to1-migration-guide.md)；Agent 每轮只吃其中 **一个 Slice**，不要整模块一口吞。

### 1.2 Slice 完成定义（DoD）

必须同时满足：

1. 产品路径可进入（不只是深链硬跳）
2. UI 区块顺序对齐 Flutter
3. 本页引用资源已复制 + `*Assets.ts` registry
4. 主交互等价（开关 / Sheet / 刷新 / 提交等）
5. `page-resource-parity-manifest.ts` 已更新且 status 合法
6. lint / typecheck / 相关 test 通过
7. 有证据路径（截图或录屏 + 命令摘要）

### 1.3 Slice Brief 模板（每轮开场）

落盘模板与示例：[`plans/slices/_template.md`](./plans/slices/_template.md)。会话内可直接粘贴：

```md
## Slice Brief
- FLUTTER_MODULE:
- RN_FEATURE:
- Flutter 入口: packages/features/<mod>/lib/.../*.dart
- RN 目标: packages/features/<mod>/src/...
- 本轮 ONLY: [一页 / 一组资源 / 一个交互 bug]
- 不做: [明确排除项]
- 验收: 08 对应章节 + Migrated 门槛
- 文件白名单: [...]
- 验证命令: npx jest packages/features/<mod> --no-coverage
- 工具: Codegraph 定位 Flutter；Headroom 控上下文；改完跑指定 jest
```

开干前对照 [`plans/README.md`](./plans/README.md) §5 十项检查；队首 Slice 见当前 Program。

### 1.4 优先级（避免先堆壳）

1. **P0 入口断点**（假 toast / 未接线导航）
2. **资源断点**（缺 PNG / registry / `EXPECTED_ASSET_COUNT`）
3. **交互断点**（开关无效、Sheet 点不到、主题未消费）
4. **整页 stub**（Alert 占位 / 假列表）
5. **Deferred 能力**（支付 SDK、真 realtime、BLE 真机）

### 1.5 反模式

- 一次「迁完整个模块」→ 上下文爆炸、难验收
- 先改 RN 再回头对 Flutter → 容易做成「看起来像」
- 只改 UI 不改入口 / 路由 / manifest → 假完成

---

## 2. 上下文工程

### 2.1 三层上下文（按需加载）

| 层 | 内容 | 何时读 |
|----|------|--------|
| **L0 契约** | skill 入口、`07`、`08`、boundary rules、本 Slice Brief | 每轮必读 |
| **L1 源真相** | Flutter 目标页 + controller + assets；Codegraph node | 实现前 |
| **L2 目标锚点** | RN 同模块参考屏、`RoutePath`、registry、manifest 邻近条目 | 实现时 |
| **L3 噪音** | 无关模块、历史草案路径、大体积无关 diff | 默认不读 |

### 2.2 推荐检索顺序

```text
1) Codegraph：Flutter page / controller / route 注册点
2) 对拍 RN：同 feature 是否已有屏 / 假实现 / toast 占位
3) 资源：Flutter assets vs RN assets 差分
4) 接线：RoutePath → register*Feature → 产品入口
5) 契约：ux-1to1-gates + Migrated 门槛
```

路径约定以 [`07` §2](./07-1to1-migration-guide.md) 为准（`packages/features/*`，非历史草案路径）。

### 2.3 会话 / Headroom

- **一个 Slice = 一个会话主题**；换模块先开新会话或明确「上下文重置」
- 长会话每完成一个 Slice：产出 **Context Card**，下一轮只带摘要 + 关键路径
- 禁止 Agent 自行扩大范围；扩大必须人批准

**Context Card：**

```md
## Context Card
Slice:
Done:
Open:
Risks:
Key paths:
Last commit:
```

### 2.4 Prompt 配方

**A. 审计（只读）**

```text
用 Codegraph 定位 Flutter「X」页 UI/逻辑/资源；对比 RN 缺口；
列出至少 1 个真实问题；不要改代码。
```

**B. 实现（窄范围）**

```text
只修上一条缺口。先资源+registry，再屏与入口，最后更新 parity。
禁止改无关模块。完成后跑 pageParity / assetParity 与相关单测。
```

**C. 验收（审查角色）**

```text
按 08 与 UX gates 审查本 diff；输出 Approved / Rework / Blocked；
缺证据则 Rework。不改代码。
```

---

## 3. 测试闭环

```text
UX Contract → 实现 → 自动测 → 交互验证 → 更新 manifest → Delivery Report
         ↑________________ Rework _________________________|
```

### 3.1 自动化分层

| 层 | 命令 / 文件 | 作用 |
|----|-------------|------|
| 全局门禁 | `npm run lint && typecheck && test` | `08` A1 |
| Parity | `pageParity` / `assetParity` / `routeRegistration` | 防假 Migrated |
| 模块单测 | repository / slice / 关键组件 | 逻辑回归 |
| 平台冒烟 | iOS / Android / Harmony 启动进页 | 人 / 设备 |

**小 Slice 最小自动集：**

```bash
cd /Users/mac/Desktop/github/my_rn_project
npx jest src/__tests__/pageParity.test.ts \
  src/__tests__/assetParity.test.ts \
  packages/features/<mod>/src/__tests__/<related>.test.ts --no-coverage
```

大改动或模块收尾再跑全量。

### 3.2 测试编写规则

| 场景 | 要求 |
|------|------|
| 持久化 / mock repo / 状态机 | 必写单测 |
| Harmony 触控坑（Sheet/遮罩） | 组件测 + 代码注释说明 |
| 新资源 | registry + `EXPECTED_ASSET_COUNT` + assetParity |
| 新页 | PAGE 条目 + `EXPECTED_PAGE_COUNT` + 路由注册 |

### 3.3 绿测 ≠ 过验收

自动测只证明：文件在、路由在、计数对、单元逻辑对。  
**1:1 UI / 交互**仍须走第 6 节交互验证。

---

## 4. 权限边界

### 4.1 代码依赖（硬）

```text
feature ──▶ @ui / @core / @utils / @commons
app shell ──▶ 装配 features（slot / 注入）
禁止: feature ▶ feature
禁止: @core ▶ feature
禁止: utils ▶ react-native（应进 core）
```

详见 [`appendices/module-boundary-rules.md`](./appendices/module-boundary-rules.md)。

### 4.2 Agent 行为边界

| 允许 | 禁止（除非人明确指令） |
|------|------------------------|
| 改本 Slice 相关 feature / core / ui | 大重构、换依赖、换包管理器 |
| 更新 parity manifest | 静默把缺页标 `Migrated` |
| 加聚焦测试 | 删测试凑绿 |
| 提 Delivery Report | 擅自 `git push` / `--force` / 改 git config |
| 读 Flutter 源仓库 | 在 Flutter 仓写 RN 迁移业务（除非单独立项） |

### 4.3 Parity status 写入边界

| status | 何时可用 |
|--------|----------|
| `Migrated` | 过 Migrated 门槛 + 有证据 |
| `Degraded` | 有 UI 但资源/动效/SDK 降级，**note 必填** |
| `Placeholder` | 仅壳 |
| `Deferred` | 有 owner + 目标阶段 |
| `Removed` | 明确不做 |

决策树见 UX gates；**证据不足禁止写 `Migrated`**。

### 4.4 密钥与环境

- 不提交 `.env`、token、证书
- Harmony / 签名相关改动单独说明，不夹在 UI Slice 中 silently 带过

---

## 5. 失败复盘

### 5.1 Failure Retro 卡

```md
## Failure Retro
1. 现象: （用户可见 / 测试失败）
2. 根因分类:
   - [ ] 上下文不足（没读 Flutter / 读错页）
   - [ ] 范围漂移（顺手改坏）
   - [ ] 边界违规（跨 feature）
   - [ ] 资源未同步
   - [ ] 平台差异（Harmony 触控 / 主题）
   - [ ] 假完成（Placeholder 当 Migrated）
   - [ ] 测试缺口（无单测 / 无交互验）
3. 为何门禁没拦住: （缺哪条 checklist / 哪条自动测）
4. 修复: （最小 diff）
5. 防再发:
   - 规则 / skill 补一句?
   - 新单测?
   - Brief 排除项?
```

返工单格式另见 [`06-supervision-playbook.md`](./06-supervision-playbook.md)。

### 5.2 本仓库已验证失败模式

| 模式 | 例子 | 防再发 |
|------|------|--------|
| Toast 假入口 | Mine 信息按钮只 toast | 审计强制追 `Get.toNamed` / 入口 handler |
| Stub 当完成 | Dialog / 成交发票 Alert 占位 | 主交互未齐不得 `Migrated` |
| 资源漏同步 | `personalized_settings` PNG | 每 Slice 强制资源差分 |
| 主题未接线 | Switch 改 store 不改 Navigation theme | 跨层改动列「消费方」 |
| Harmony 触控 | `flex` 遮罩吃掉取消 | Sheet 用 `absoluteFill` + 测例 |
| 误覆盖 RN 资产 | 用 Flutter `test_bridge.html` 盖掉 RN 桥 | 提交前审 web/原生资产 diff |

### 5.3 审查决策树

```text
缺证据 / P0 失败     → Rework
边界违规             → Rework（立刻）
能力不可用需产品拍板 → Blocked
非核心降级有 note    → Approved with conditions
全过                 → Approved → 允许人指令 commit / push
```

---

## 6. 交互验证

### 6.1 每屏最低矩阵（对齐 UX gates）

| 维度 | 最少要做 |
|------|----------|
| 状态 | success +（empty 或 error 其一） |
| 交互 | 主路径 1 条 + 返回栈 |
| 布局 | 竖屏 + 安全区 |
| 平台 | 涉及 Sheet / Modal / 主题时，Harmony 必验或记 `Deferred` |

### 6.2 场景脚本示例（个性化设置）

```text
1. Mine → 信息图标 → 进入「个性化设置」（非 toast）
2. 装扮中心 → toast「开发中」
3. 护眼模式 → sheet → 选「跟随系统」→ 回显 → 杀进程重进仍保持
4. 各 Switch 切换 → 重进保持
5. 帮助图标 → toast 说明
6. 返回后验证设置页深色模式仍独立正常
```

其他模块按 Flutter 主路径自写脚本，贴进 Delivery Report。

### 6.3 证据规范

每条 Slice 至少：

1. Flutter 对照：源文件路径（可选截图）
2. RN：success 截图 + 一个交互录屏（Sheet / 开关 / 刷新）
3. 命令摘要：相关 jest / lint 片段（不得只写「已通过」）
4. manifest：本条 status 从何变为何

缺任一项 → 审查直接 **Rework**。

### 6.4 人机分工

| 项 | Agent | 人 |
|----|-------|-----|
| 对照 Flutter 结构 / 文案 | 主做 | 抽查 |
| 单测 / parity | 主做 | 看报告 |
| Harmony 真机手势 | 写步骤 | 执行确认 |
| 视觉像素级差异 | 列差异 | 裁定是否可 `Degraded` |

---

## 7. 标准作战节奏

### 7.1 单 Slice 流程

| 步 | 角色 | 产出 |
|----|------|------|
| 1 下达 Brief | 人 | Slice Brief |
| 2 只读审计 | 执行 Agent | 缺口列表（≥1 真问题） |
| 3 确认范围 | 人 | 「做 / 不做」 |
| 4 实现 + 测 | 执行 Agent | 代码 + 绿测 |
| 5 交互验证 | 人（或按脚本） | 证据 |
| 6 Delivery Report | 执行 Agent | 见 `04` |
| 7 Review | 审查 Agent | Decision |
| 8 Commit / Push | **仅人指令后** | git |

### 7.2 Delivery Report 最小字段

见 [`04-cursor-execution-spec.md`](./04-cursor-execution-spec.md)：

- Phase / Scope  
- Changed files  
- Architecture / dependency boundary checks  
- Verification（lint / typecheck / test / platform smoke）  
- Known gaps（owner + 阶段）

### 7.3 模块收尾

- 勾完 `07` Module Progress  
- 跑全量 `08` + 全量 test  
- 落盘 `acceptance-records/YYYY-MM-DD-<scope>.md`

---

## 8. 总控 Prompt（可复制）

### 8.1 执行 Agent

```md
你是 my_rn_project 的迁移执行 Agent。严格遵守：
- Skill: .cursor/skills/flutter-to-rn-lego-module + 主 skill mappings / UX gates
- 指南: docs/flutter-to-rn-lego-migration/07-1to1-migration-guide.md
- 方法: docs/flutter-to-rn-lego-migration/09-agent-programming-playbook.md
- 验收: docs/flutter-to-rn-lego-migration/08-acceptance-checklist.md
- 真相源: page-resource-parity-manifest.ts
- 边界: 无 feature-to-feature；不切包管理器；不擅自扩 scope
- 工具: Codegraph 查 Flutter；改动最小化；先资源再 UI 再路由再 parity

本轮 Slice Brief:
- ...

流程: 审计 → 等我确认 → 实现 → 聚焦测试 → Delivery Report（含证据清单）
未达标禁止写 Migrated。
```

### 8.2 审查 Agent

```md
你是审查 Agent。只做 Review，不改代码。
对照 08 + UX gates + module-boundary-rules + 09 playbook + git diff。
输出 Codex Review（Decision / findings / required changes），格式见 06。
缺证据或 P0 失败 → Rework。
```

---

## 9. 与现有文档映射

| 本章节 | 仓库落点 |
|--------|----------|
| 任务拆解 | `07` Module Progress Step 0–10 |
| 上下文工程 | skill 入口 + Codegraph + Context Card |
| 测试闭环 | `08` A1 + parity tests + 模块单测 |
| 权限边界 | `04` + `module-boundary-rules` + status 决策树 |
| 失败复盘 | `06` Rework Request + 本文 Retro 卡 |
| 交互验证 | UX gates + `08` 模块表证据列 |

---

## 10. 一句话口径

每个 Slice 按 **Brief → 审计 → 窄实现 → 自动测 → 交互证据 → manifest → Review → 才 commit** 走完；Agent 负责速度与对齐，门禁与 status 诚实性由审查与人守住。
