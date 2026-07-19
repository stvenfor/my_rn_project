# Migration Planning（本仓规划操作系统）

> 不另起验收标准。验收认 [`08-acceptance-checklist.md`](../08-acceptance-checklist.md)；页/资源状态认 [`page-resource-parity-manifest.ts`](../page-resource-parity-manifest.ts)；Agent 方法认 [`09-agent-programming-playbook.md`](../09-agent-programming-playbook.md)。

本文定义 **怎么选下一刀、怎么写合同、怎么多角色协作**。实现细节仍跟 skill + `07`。

---

## 1. 三层规划

```text
L1  Program Plan（项目级，周/里程碑）   → plans/YYYY-MM-DD-program.md
L2  Epic Plan（模块级，对齐 08 B/C/D） → plans/epics/<id>.md
L3  Slice Plan（一轮可交付）           → plans/slices/<id>.md 或开场直接贴 Brief
```

| 层 | 谁批准 | 多久更新 | 产出 |
|----|--------|----------|------|
| Program | 人 | 每周或每 2–3 个 Epic | 有序 Epic 队列 + 不做 + 风险 |
| Epic | 人（Agent 可起草） | 取出模块时 | 审计差距表 + Slice backlog + 文件锁 |
| Slice | 人确认 Brief | 每轮开干前 | ONLY / 不做 / 命令 / 证据 |

**唯一执行单位是 Slice。** 禁止把「整个模块做完」当成一个 Slice。

---

## 2. 目录约定

```text
plans/
  README.md                 ← 本说明
  YYYY-MM-DD-program.md     ← 当前/历史 Program
  epics/
    home-b2.md
    auth-b1.md
    ...
  slices/
    _template.md            ← Brief 模板
    <slice-id>.md           ← 可选落盘；短 Slice 可只在会话里贴 Brief
```

完成证据仍写到 [`acceptance-records/`](../acceptance-records/)，并勾选 `08`。

---

## 3. 标准节奏

```text
每周: 更新 Program（对照 08 勾选）
  → 取队首 Epic → 先 Audit 再写 Epic Plan
  → 取队首 Slice → Brief（人批）→ T1–T6 执行
  → Record + 勾 08 + Context Card
  → Epic 清空则 Accept → 回 Program
```

单 Slice 内步骤（与 `09` 一致）：

1. Brief 确认  
2. 只读审计（可附在 Brief 后）  
3. 白名单内实现  
4. Brief 指定命令验证  
5. 证据 / Delivery Report  
6. 审查（对照 DoD）→ 人指令才 commit/push  

---

## 4. 优先级（切 Slice 时）

1. P0 入口断点（假 toast / 未接线）  
2. 资源断点（缺 PNG / registry / 计数）  
3. 交互 / 主题断点  
4. 整页 stub / 假 Migrated  
5. Deferred 能力（SDK、真 WS…）— 默认进「不做」，只写 note  

---

## 5. Slice 开工前 10 项（不通过不开干）

1. 对应 `08` 哪一行写清  
2. Flutter 源路径真实  
3. RN 目标与 `register*Feature` / `RoutePath` 对齐  
4. 产品或 DEV 入口写明  
5. ONLY / 不做成对  
6. 降级则准备 manifest `note`  
7. 无 feature→feature  
8. 二级页考虑 `navBar` + `showBackButton`  
9. 验证命令可复制  
10. 证据形态约定  

模板：[slices/_template.md](./slices/_template.md)

---

## 6. 多 Agent 规则

| 角色 | 输入 | 输出 |
|------|------|------|
| 人 | Program / 产品降级决策 | 批 Brief、commit/push |
| 执行 Agent | L0 契约 + Brief + Flutter/RN 锚点 | diff + 测试摘要 + Delivery |
| 审查 Agent | 08 行 + Brief DoD + diff | Approve / Rework / Blocked |

- 仅文件白名单不相交才可并行  
- `08`、manifest、`EXPECTED_*_COUNT`：**单写者**，末棒合并  
- Slice 结束写 **Context Card**（见模板），下轮只带 Card + Brief  

---

## 7. 当前入口

- 最新 Program：[`2026-07-19-program.md`](./2026-07-19-program.md)  
- 队首 Epic：[`epics/home-b2.md`](./epics/home-b2.md)  

已 Accept 且默认不再排期：B4 chat · B5 community · B6 music · B7 video · B8 bfui · B9 live/friend/pay（除非回归或升档 Degraded）。
