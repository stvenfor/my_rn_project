# 11 — 迁移转换复盘与可抽取资产（Skill / Prompt / Harness / AGENTS / 架构）

> **状态：** Draft（2026-07-19）  
> **范围：** Flutter → RN LEGO（`my_ai_project` → `my_rn_project`）全过程方法与工程环境，非单模块代码清单。  
> **配套：** [`00-index.md`](./00-index.md) · [`10-agent-prompt-harness.md`](./10-agent-prompt-harness.md) · [`plans/README.md`](./plans/README.md) · [`../harness-engineering-study/00-index.md`](../harness-engineering-study/00-index.md)  
> **原则引用：** 不优化模型，优化环境；约束 → 告知 → 验证 → 纠正。

本文把「这次迁移怎么做成的」压成可复用结论，并明确：**哪些进 Skill、哪些改提示词、哪些加 Harness、AGENTS.md 写什么、架构怎么收。**

---

## 1. 转换过程总览（发生了什么）

### 1.1 业务目标

| 项 | 内容 |
|----|------|
| 源 | Flutter/GetX 单体式业务（`my_ai_project`） |
| 目标 | RN 0.72.5 LEGO Monorepo + Harmony 0.72.140 |
| 验收 | **1:1 UI/UX 诚实 parity**（非「能跑就算 Migrated」） |
| 协作 | 人定范围与 commit；执行 Agent 写码；审查/门禁靠清单 + 机检 |

### 1.2 实际演进阶段（方法层，非 Phase 0–4 历史编号）

```text
① 文档先行
   01 分析 → 02 架构 → 03 计划 → 04 执行规范 → 05/06 QA 与监督
   → 07 1:1 指南 → 08 验收权威 → parity manifest

② 模块迁移浪潮
   feature 包 + registerFeature + RoutePath + app shell 接线
   → 测 / snapshot / Delivery Report（早期易假绿）

③ Planning OS
   Program / Epic / Slice；唯一执行单位 = Slice
   → Context Card 缩短下轮上下文

④ Prompt + Harness（A+B）
   Slice Brief 合同 → agent:pre / agent:post
   → Cursor Hooks；.harness 编排层
   → 跨仓 meta skill：migration-os-harness

⑤ 收口与质量债
   M-close-gap：B1–B10 · A/C · D packaging · E Delivery（条件关闭）
   M2：真机交互 · 截图 · lint 全仓 · design-token
   → iOS device smoke Partial（gate 可证，登录成功自动化未稳）
```

### 1.3 双事实源（全程不变）

| 源 | 角色 |
|----|------|
| `08-acceptance-checklist.md` | 人读权威：勾什么算 Accept |
| `page-resource-parity-manifest.ts` | 机读权威：页/资源 status + note |

Harness **不另起第三套验收标准**，只强制：合同齐全 + 机检绿。

### 1.4 本仓已验证的「有效闭环」

```text
人批 Slice Brief
  → agent:pre（brief / boundary / manifest）
  → 白名单内实现 + 诚实 status
  → agent:post（boundary / whitelist / verify / dod）
  → Delivery / acceptance-record
  → 人审查 → 显式 commit/push
```

失败模式若未进 harness，会在真机 smoke、假 Migrated、白名单外改动上复发（见 §5）。

---

## 2. 已沉淀资产地图（避免重复发明）

| 层 | 路径 | 成熟度 | 说明 |
|----|------|--------|------|
| 迁移方法 | `docs/flutter-to-rn-lego-migration/07–10` + `plans/` | 高 | 本仓作战手册 |
| 栈映射 Skill | `.cursor/skills/flutter-to-rn-lego-module` + `~/Desktop/skills/...` | 中高 | UI/类型/资源/UX gates |
| Meta OS Skill | `~/.cursor/skills/migration-os-harness` | 中 | 语言无关：Program/Slice/harness |
| 机检引擎 | `scripts/agent-harness/*` | 中 | pre/post 六件套 |
| 编排层 | `.harness/{agents,rules,skills,changes,wiki}` | 低–中 | 指针与短规则；长文勿复制 |
| Hooks | `.cursor/hooks.json` + `hooks/*.mjs` | 中 | 软提醒为主 |
| 研读对照 | `docs/harness-engineering-study/` | 参考 | 业界术语 ↔ 本仓映射 |
| **AGENTS.md** | （根目录尚无） | **缺** | 信息层缺口，见 §7 |

---

## 3. 可整理并抽取成 Skill 的清单

### 3.1 分层原则

| Skill 类型 | 放什么 | 不放什么 |
|------------|--------|----------|
| **Meta（跨仓）** | Program/Epic/Slice、双事实源、status 枚举、pre/post 合同、并行 Agent 规则 | 具体 Widget→组件映射 |
| **栈映射（本仓/本栈）** | Flutter→RN 路径、RTK、Navigation、assets require、Harmony 注意点 | 某次 Epic 的临时差距表 |
| **专项（可选）** | 真机 smoke 证据采集、parity audit、Delivery Report 模板 | 把 08 全文塞进 skill |

**已有：** `migration-os-harness`（meta）+ `flutter-to-rn-lego-module`（栈）。  
**建议增量抽取（按优先级）：**

### 3.2 P0 — 建议新建或从本仓拆出

| 候选 Skill ID | 触发场景 | 从何处拆 | 产出物 |
|---------------|----------|----------|--------|
| `device-smoke-evidence` | 三端 Splash/Login/主业务；截图入库 | M2 `m2-device-smoke-*` + `scripts/smoke-checklist.sh` | 设备矩阵模板、证据目录约定、**禁止 packaging 冒充交互** |
| `parity-manifest-hygiene` | 改页/资源必更新 manifest | `check-manifest` + B10 审计经验 | status 决策树；silent-missing 扫描命令 |
| `rn-lego-boundary-guard` | 写 feature/core 时 | `check-boundary` + `module-boundary-rules` | 合法通信：RoutePath / app slot / LoginRedirect |
| `acceptance-record-writer` | Slice 结束写 record | `acceptance-records/*` 样例 | 最小字段表；与 08 行映射 |

### 3.3 P1 — 强化现有 Skill，而非新开

| 现有 Skill | 应补章节 |
|------------|----------|
| `flutter-to-rn-lego-module` | 「开干必须先 Slice + agent:pre」已有；补：**Partial Accept 规则**（gate≠成功）；**真机证据路径约定** |
| `migration-os-harness` | 补：从本仓 bootstrap 检查清单（有/无 AGENTS.md、hooks、`.harness`）；**verify 命令设计指南**（勿把不可机跑的真机步骤写进必跑 verify） |
| `.harness/skills/*` | 保持「短指针」；长文链到 docs，避免与 `10` 双份腐烂 |

### 3.4 P2 — 可选垂直 Skill（有重复痛点再抽）

- `auth-mock-session-contract`（USE_MOCK_AUTH / OTP / LoginRedirect）  
- `design-token-spotcheck`（A1 token 抽检）  
- `harmony-bundle-facade`（`npm run dev`、R-003 native 缺口记账）  

### 3.5 抽取时的「切割测试」

某个流程适合进 Skill，当且仅当：

1. 在 **第二个仓库** 也能原样复用 70%+；或  
2. 在本仓 **≥3 个 Slice** 重复出现同一检查表；且  
3. 失败成本高（假 Migrated / 边界破坏 / 无证据 Accept）。

一次性脚本、一次性差距表 → 留在 `plans/` 或 `acceptance-records/`，**不要**进 Skill。

---

## 4. 提示词可优化点

### 4.1 已验证有效的「一行开场」（保留）

```text
执行 docs/.../plans/slices/<id>.md
先 npm run agent:pre -- --slice <path>
结束 npm run agent:post；未过 harness 不得勾 08；commit/push 等我指令。
```

### 4.2 问题与改法

| 现象 | 根因 | 优化后的提示词要素 |
|------|------|-------------------|
| Agent 把 Metro/`npm run dev` 当 §D 交互绿 | 提示未区分 packaging vs interactive | 显式：`Packaging ≠ Splash→Tabs；无截图/日志不得勾交互格` |
| 真机 Slice 的 verify 只有 `typecheck` | Brief 把不可机跑步骤塞进「验收」却未写清人工门 | Brief 分两栏：`机跑验证` / `人证（截图路径）`；post 只强制机跑 |
| 「继续」语义过载 | 无当前 Slice 指针或指针过期 | 要求 Agent 先读 `.harness/changes/current.md`；idle 时禁止空跑 post |
| Login 自动化失败仍想勾满 | Partial 未写入合同 | 合同允许 `Partial Accept` + 必填 Deferred 表；禁止用 B1 单测替代真机成功帧 |
| 文档爆炸挤占上下文 | 开场贴 00–10 全文 | 开场只贴：Brief + Card + 08 相关行 + skill 入口；其余「按需 Read」 |
| 审查与执行混在一轮 | 角色未切换 | 人指定：`角色=executor` 或 `角色=reviewer（只读）` |
| commit 过于主动 | 用户规则与提示不一致 | 固定句：`未经我明确说 commit/push 不得提交` |

### 4.3 推荐 Prompt 配方（可并入 `migration-os-harness/prompts.md`）

**A. 开 Slice（人）** — 见 §4.1。  

**B. 审计-only Slice**

```text
本 Slice 只读审计，禁止改 packages/features 业务代码。
输出：差距表（ID/严重度/建议 Slice）写入 Epic；agent:post 验证命令仅 grep/jest 审计测。
```

**C. 真机 Smoke Slice**

```text
机跑：typecheck（及可选 bundle）。
人证：设备 UDID、命令、三格各至少一张截图路径。
禁止：用 bundle 成功勾 Splash→Tabs/Login/主业务。
允许 Partial：写明哪一格未证、下一步。
```

**D. 收口 / Program 切换**

```text
只更新 Program/Epic/08/record/current.md；不改业务 UI。
队首与 Deferred 必须可追踪到具体 Epic 文件。
```

**E. 停止钩子已覆盖的场景** — 提示词不必重复长篇；失败时让 harness 输出带「下一步命令」。

### 4.4 Brief 模板字段建议增补

在 `plans/slices/_template.md` 增加（向后兼容）：

```md
- 机跑验证:   # agent:post 执行
- 人证清单:   # 截图/日志路径；不进入 run-verify
- Accept 模式: Full | Partial
- Partial 时未证项:
```

---

## 5. 结合 Harness 的可做提升

对照研读笔记「信息层 → 约束层 → 自动化层」与本仓现状：

| 阶段 | 本仓现状 | 缺口 / 提升 |
|------|----------|-------------|
| 信息层 | docs 丰富；**无根 AGENTS.md** | 补 AGENTS.md（§7）；`00-index` 链到 M2 Program |
| 约束层 | pre/post + ESLint 边界 + status 枚举 | lint 全仓仍 Deferred；token 抽检未机检；错误信息可更「即 Prompt」 |
| 自动化层 | Hooks 软提醒；无 worktree 隔离验 | 可选：CI 跑 `agent:check-*`；真机证据 schema 校验 |

### 5.1 引擎（`scripts/agent-harness`）短期改进

| ID | 改进 | 价值 |
|----|------|------|
| H1 | `check-dod`：若 Accept 模式=Partial，要求 Record 含 Deferred 表 | 防假满勾 |
| H2 | `check-evidence-shots`：可选——证据路径下存在 Brief 声明的 png/日志 | 真机 Slice 机检加强 |
| H3 | `run-verify` 超时与失败输出附「打开哪份 docs」 | 错误信息即 Prompt |
| H4 | Brief 解析：区分 `机跑验证` / `人证清单` | 避免把「npm run ios」塞进必跑导致 post 挂死 |
| H5 | `gitDiffNames` 对 `acceptance-records/assets/**` 体积告警（不 fail） | 大图 PR 可感知 |
| H6 | pre 时同步写 `.harness/changes/current.md` 机读字段 | 减少手改漂移 |

### 5.2 Hooks 改进

| ID | 改进 |
|----|------|
| K1 | `stop`：若 post 未绿且 Slice 状态≠idle → 强制摘要「缺什么」（已有雏形，可结构化 JSON） |
| K2 | `beforeSubmitPrompt`：检测到「勾 08」「Accept」且无近期 post.ok → 硬提示 |
| K3 | `afterFileEdit`：改 `packages/features/*` 且无 active-slice → 警告 |

### 5.3 `.harness` 编排层

| ID | 改进 |
|----|------|
| O1 | `skills/*` 与 `.cursor/skills` **单一真相**：编排层只保留 20 行指针 |
| O2 | `reviewer` 角色增加「必须打开 harness-report.json」检查表 |
| O3 | `deploy-verify` 与真机 smoke Skill 对齐，避免空技能 |

### 5.4 CI 建议（M2 后）

```text
PR:
  - npm run typecheck
  - npm run agent:check-boundary（基于 diff）
  - npm run agent:check-manifest（若改 manifest）
  - 可选：jest parity 三测
不强制：真机交互（保留人证）
```

### 5.5 与「Harness Engineering」共识的对齐度

| 共识 | 本仓 | 下一步 |
|------|------|--------|
| 瓶颈在环境 | 已建 pre/post | 补 AGENTS + CI |
| 文档要活 | Program/08 有更新 | doc 新鲜度：Program 日期门禁（软） |
| 思考/执行分离 | Program≠Slice | 保持；禁「整个 M2 一把梭」 |
| 上下文克制 | Card + Brief | AGENTS 导航表，禁百科 |
| 约束自动化 | 边界/manifest | lint 清债；token 抽检脚本 |
| 人掌舵 | commit 人指令 | 保持 |

---

## 6. 当前项目约束：哪些该硬、哪些该松

### 6.1 应保持硬约束（已证明防事故）

| 约束 | 理由 |
|------|------|
| 禁止 feature→feature / core→feature | 架构腐烂主因 |
| status 五态 + Degraded 必 note | 防假 Migrated |
| Slice 白名单 | 防范围膨胀 |
| 未 post 绿不得勾 08 / 自称 Accept | 防口头完成 |
| commit/push 仅人指令 | 防误推 |
| 双事实源唯一 | 防第三套清单 |

### 6.2 应变「政策化」而非永久假绿

| 约束 | 现状 | 优化 |
|------|------|------|
| `lint` 全仓零 error | M-close-gap 改为路径政策 | M2 `m2-lint-debt`：清零或 **冻结清单+owner**（书面，禁止 silent） |
| design-token 无硬编码 | 勾选 Deferred | 抽检脚本 + 样本矩阵；例外进 note |
| §D 三端交互 | packaging 已绿；交互 M2 | **分列 Packaging / Interactive**（08 已部分做到）；禁止混勾 |
| 真机 Login 成功 | iOS Partial | 允许 Partial；补「人肉一帧」或 E2E 工具后再满勾 |
| URL Scheme `myapp://` | Info.plist 未注册，deep link smoke 失败 | 单 Slice 补注册（壳层），或从 smoke 脚本删除该依赖 |

### 6.3 应收紧的「软约定」

| 约定 | 问题 | 建议 |
|------|------|------|
| 「继续」 | 歧义 | Program 队首 + current.md；Agent 复述下一刀再干 |
| 证据目录 | `assets/` 与 `evidence/` 双份 | **统一**为 `acceptance-records/evidence/<slice-id>/`；旧 assets 迁并 |
| Delivery Report | 格式多处重复 | 只保留 04 模板 + record 必填「harness-report 摘要」 |
| 文档数量 | 01–11 + study 易淹没 | AGENTS 导航；历史 Phase 文档标 `Status: historical` |

### 6.4 技术栈基线（写入 AGENTS，禁止擅自升级）

```text
RN 0.72.5 · React Navigation 6 · RTK · npm/lockfile
Harmony @react-native-oh/react-native-harmony 0.72.140
Node/Jest/Metro：以 package.json 与 CI 为准
```

擅自升主版本 = 阻塞项（除非独立 Epic）。

---

## 7. AGENTS.md 应如何描述

> 根目录目前 **没有** `AGENTS.md`。按研读笔记：地图 50–100 行，细节进 docs。

### 7.1 设计原则

1. **地图，不是百科** — 任务 → 路径。  
2. **硬规则单列** — 与 CI/harness 一致。  
3. **基线锁版本** — 见 §6.4。  
4. **迁移与日常开发分流** — 迁移走 `docs/flutter-to-rn-lego-migration/`；改壳/基建另指架构文。  
5. **禁止** 粘贴 08 全文、mappings 全文、历史验收长文。

### 7.2 推荐结构（草稿目录）

```text
# AGENTS.md
1. 一句话：本仓是什么
2. 技术栈基线（禁止擅自升级）
3. 快速导航表（想做什么 → 读哪里）
4. 硬性规则（CI / harness 会验）
5. 迁移专用最短路径（Slice → pre → post）
6. 提交与人闸门
7. 不要做的事
```

### 7.3 正文草稿（可直接落盘为仓库根 `AGENTS.md`）

以下约 80 行量级，落盘时应保持同级简洁；细节用链接。

```markdown
# AGENTS.md — my_rn_project

RN LEGO monorepo（含 Harmony）。主线工作曾是 Flutter→RN 1:1 迁移；日常改动仍须遵守模块边界与诚实完成态。

## 技术栈基线（禁止擅自升级主版本）

- React Native 0.72.5 · React Navigation 6 · Redux Toolkit · npm + package-lock.json
- Harmony：@react-native-oh/react-native-harmony 0.72.140
- 包路径：`packages/features/*`、`packages/core/*`、`packages/ui/*`（以仓库实际为准）

## 快速导航

| 你想… | 去读 |
|-------|------|
| 迁移怎么验收 | `docs/flutter-to-rn-lego-migration/08-acceptance-checklist.md` |
| 页/资源是否 Migrated | `docs/flutter-to-rn-lego-migration/page-resource-parity-manifest.ts` |
| 下一刀做什么 | `docs/flutter-to-rn-lego-migration/plans/README.md` → 当前 `*-program.md` |
| 开一轮怎么跑 | `docs/flutter-to-rn-lego-migration/10-agent-prompt-harness.md` |
| Flutter↔RN 怎么写 | `.cursor/skills/flutter-to-rn-lego-module/SKILL.md` |
| 架构与依赖方向 | `docs/flutter-to-rn-lego-migration/02-lego-monorepo-architecture.md` |
| 本轮 Slice 指针 | `.harness/changes/current.md` |
| Harness 编排角色 | `.harness/README.md` |

## 硬性规则（违反 = Rework）

1. **禁止** feature→feature、core→feature 直接 import；跨模块用 RoutePath / app shell 注入 / LoginRedirect。
2. Parity status 仅：`Migrated | Degraded | Placeholder | Deferred | Removed`；非 Migrated 须有 `note`。
3. 迁移执行单位只能是 **Slice Brief 落盘文件**；先 `npm run agent:pre`，后 `npm run agent:post`。
4. `agent:post` 未绿 → **不得**勾 08、不得自称 Accept。
5. **不得**用 Metro/Harmony bundle 成功冒充真机 Splash→Tabs / Login / 主业务。
6. commit / push / `--force` / 改 git config：**仅当用户明确要求**。

## 迁移最短路径

1. 确认 Program 队首 Epic / Slice。
2. 复制 `plans/slices/_template.md` → 填 ONLY / 不做 / 白名单 / 机跑验证 / 证据。
3. `npm run agent:pre -- --slice <path>`
4. 白名单内改动；更新 manifest；写 Context Card。
5. `npm run agent:post`；写 `acceptance-records/`。
6. 等人审查与 commit 指令。

## 验证常用命令

- `npm run typecheck`
- `npm run agent:check-boundary`
- `npx jest src/__tests__/pageParity.test.ts src/__tests__/assetParity.test.ts --no-coverage`
- 平台 packaging：`react-native bundle` / `npm run dev`（≠ 真机交互）

## 不要做

- 整模块「一把梭」无 Slice
- 假 Migrated / 无截图勾真机交互
- 关闭 ESLint 边界规则装绿
- 把长文规范整份贴进对话（用导航表按需 Read）
```

### 7.4 落盘后维护

- Program 切换时：只改 AGENTS 导航表里「当前 program」一行（或只改 `plans/README`，AGENTS 永远指 README）。  
- 每周环境审查四问（见 `harness-engineering-study/05`）把 AGENTS 列入检查。

---

## 8. 项目架构是否可优化

### 8.1 已选架构的正确性（建议保留）

| 决策 | 评价 |
|------|------|
| Feature / Core / UI 分层 | 与迁移目标一致；边界 harness 可机检 |
| `register*Feature` + `moduleManifest` 聚合 | 可扩展；避免 apps 写死所有屏 |
| app shell 注入（settings logout、webview） | 正确消化「feature 不能依赖 app store」 |
| `LoginRedirect` / RoutePath-only 跨模块 | 已在 Mine/used_car 验证 |
| design-system tokens | 方向对；执行欠债（M2 token Epic） |

### 8.2 文档架构 vs 代码架构漂移

| 文档（02）曾写 | 仓库实际 | 建议 |
|----------------|----------|------|
| `feature-modules/@features` | `packages/features/*` | **改文档对齐代码**，或加「路径别名说明」 |
| `apps/mobile` 为唯一 app | 根目录即 app + `src/` | 在 AGENTS/02 写清「历史目标 vs 现状」 |
| 严格 packages/apps | 大量壳代码在 `src/` | 中期：壳代码归属文档化；长期可选迁入 `packages/apps/mobile` |

### 8.3 可做的架构优化（按性价比）

| 优先级 | 项 | 动机 | 风险 |
|--------|----|------|------|
| P0 | 统一证据目录；08 §D Packaging/Interactive 列稳定 | 降低验收歧义 | 低 |
| P0 | Info.plist URL Scheme（若仍要 deep link smoke） | 补齐 linking 证据链 | 低 |
| P1 | `src/navigation` / `src/screens` 与 feature 边界说明书 | 新人/Agent 少踩坑 | 低 |
| P1 | lint 分 package 脚本（`lint:features` 等） | M2 清债可切 Slice | 低 |
| P2 | 根 app → `packages/apps/mobile` 物理迁入 | 与 02 设计一致 | **高**（Metro/原生路径） |
| P2 | core 包进一步「无 UI」审计 | webview 屏已上移是好例子 | 中 |
| P3 | E2E（Maestro/Detox）替代 HID 点按 | iOS Login 成功自动化 | 中高投入 |
| P3 | 设计 token 静态扫描（禁裸十六进制） | A1 机检 | 中（误报需白名单） |

### 8.4 不建议现在做的大手术

- 为「干净」重写导航到另一库（成本 > M2 收益）  
- 合并 features 为少数巨包（破坏 LEGO 与并行 Slice）  
- 在 Agent 默认流程中引入强制升 RN 0.77（已有独立 branch，勿混进迁移 Accept）

### 8.5 架构健康度判据（可每里程碑自检）

1. `agent:check-boundary` 对主分支 diff 为零违规。  
2. manifest 业务页无 silent-missing（B10 类审计）。  
3. 新功能能否在 **单 feature 白名单 Slice** 内完成（不改三五个无关包）。  
4. Harmony 缺口是否只出现在 facade/note，而非 feature 直接依赖缺失 native。

---

## 9. 综合优先级路线图（建议执行序）

```text
立即（信息层收口）
  1. 落盘根 AGENTS.md（§7.3）
  2. 00-index 增加本文链接；plans/README 指 AGENTS
  3. 证据目录统一约定（写进 10 或 device-smoke skill）

短线（约束层）
  4. Brief 模板增补：机跑 / 人证 / Partial
  5. H1–H4 harness 小改
  6. M2：Android/Harmony smoke；Login 成功人证或 E2E
  7. m2-lint-debt / m2-design-tokens

中线（可抽取）
  8. 发布 device-smoke-evidence + parity-manifest-hygiene skills
  9. CI：boundary + manifest + typecheck
  10. migration-os-harness 吸收本仓 bootstrap 清单

长线（架构）
  11. 评估 apps/mobile 物理迁入
  12. Maestro/Detox 真机门禁（可选）
```

---

## 10. 成功与失败模式备忘（给下一仓）

### 10.1 值得原样带走

- 双事实源 + 诚实 status  
- Slice 合同 + pre/post  
- Context Card  
- 人闸门：Brief / 降级 / commit  
- LEGO 边界 + LoginRedirect 模式  
- Program 队列防「随机下一刀」

### 10.2 本仓交过的学费

| 学费 | 以后默认怎么防 |
|------|----------------|
| 假 Migrated / 占位当完成 | manifest 机检 + 审查看 note |
| packaging 冒充真机 | 08 分列 + smoke skill |
| Brief 列表解析把「证据」当命令 | 模板字段拆分 + 解析测 |
| 真机 Login HID 不稳 | Partial 合法化；E2E 或人证 |
| 文档与目录名漂移 | AGENTS + 02 对齐实际路径 |
| 证据双目录 | 开工前约定单一路径 |

---

## 11. 本文不覆盖 / 后续文档

- 各 feature 的具体 1:1 差距表 → 仍在 `plans/epics/*` 与 acceptance-records  
- Flutter 映射表细节 → `flutter-to-rn-lego-module` mappings  
- PDF 研读原文概念 → `docs/harness-engineering-study/`  

**建议的下一篇文档（可选）：**  
`12-agents-md-and-bootstrap-checklist.md`（若希望 AGENTS 与 bootstrap 再拆短文）；或直接落盘根 `AGENTS.md` 后删除草稿重复段。

---

## 变更记录

| 日期 | 变更 |
|------|------|
| 2026-07-19 | 初稿：转换复盘 + Skill/Prompt/Harness/约束/AGENTS/架构优化 |
