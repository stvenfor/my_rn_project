---
name: acceptance-record-writer
description: >-
  Write minimal acceptance-records for a finished Slice: map findings to 08
  checklist rows, include harness-report summary, Partial/Deferred tables.
  Use when closing a Slice, filling Delivery Report evidence, or before human
  Accept review.
---

# Acceptance Record Writer

## When

Slice 收口、人审前勾 08；`agent:post` 已绿（或写明例外）。真机 smoke / 模块 B / 审计收口。

## Path

```text
docs/flutter-to-rn-lego-migration/acceptance-records/YYYY-MM-DD-<topic>.md
```

大文件：`acceptance-records/evidence/<slice-id>/`（见 `device-smoke-evidence`）。

## 最小字段

| 字段 | 必填 |
|------|------|
| Date / Slice 链接 / Scope | ✅ |
| Decision：`Accept` \| `Partial Accept` \| `Rework` \| `Blocked` | ✅ |
| Verification（机跑命令 + 结果） | ✅ |
| Checklist evidence → **08 行映射** | ✅ |
| Evidence paths（交互/视觉） | 相关时 ✅ |
| Deferred 表 | Partial / 条件 Accept ✅ |
| Harness 摘要 | ✅ |

## 08 映射与 Harness

- 表列：08 项 | 结果 | 证据。只勾本 Slice 有证的行；范围外 N/A。
- **未过 `agent:post` → 不得勾 08 / 自称 Accept。**
- 摘要一句：`Harness: agent:pre ok · agent:post ok（.cursor/agent-harness/harness-report.json）`

## 骨架

```md
# Acceptance Record — <title>
Date: / Slice: / Decision:
## Verification
## Checklist evidence
| 08 项 | 结果 | 证据 |
## Evidence paths
## Deferred
| Item | Owner | Next |
## Harness
pre ok · post ok（harness-report.json）
```

模板全文：`08-acceptance-checklist.md`；Delivery：`04-cursor-execution-spec.md`。  
样例：`acceptance-records/2026-07-19-m2-device-smoke-ios.md`。

## Don't

无证据勾 §D Interactive；Partial 不写 Deferred；粘贴 08 全文。
