# Slice Brief 模板

复制为 `slices/<slice-id>.md` 后开干。  
**合同字段会被 `npm run agent:pre` 机检** — 见 [`../../10-agent-prompt-harness.md`](../../10-agent-prompt-harness.md)。

配套：[../README.md](../README.md) · [../../09-agent-programming-playbook.md](../../09-agent-programming-playbook.md)

---

```md
## Slice Brief
- FLUTTER_MODULE: <mod>
- RN_FEATURE: @features/<mod>
- Flutter 入口: packages/features/<mod>/lib/.../*.dart
- RN 目标: packages/features/<mod>/src/...
- 本轮 ONLY: [一页 / 一组资源 / 一个交互 / 一次入口接线 / 只读审计]
- 不做: [明确排除；含 Deferred；勿碰的模块]
- 验收: 08 §Bx 第 N 行 + Migrated 门槛（或 Epic 差距表非空）
- 文件白名单:
  - packages/features/<mod>/
  - docs/flutter-to-rn-lego-migration/
- 文件黑名单:
  - packages/features/music/
- 验证命令:
  - npx jest packages/features/<mod> --no-coverage
  - npx jest src/__tests__/pageParity.test.ts
- 证据: docs/flutter-to-rn-lego-migration/acceptance-records/YYYY-MM-DD-<id>.md
- 工具: .cursor/skills/flutter-to-rn-lego-module ；先 Flutter 再 RN
```

### 人发给 Agent 的一行（推荐）

```text
执行 docs/flutter-to-rn-lego-migration/plans/slices/<slice-id>.md
先 npm run agent:pre -- --slice docs/flutter-to-rn-lego-migration/plans/slices/<slice-id>.md
结束 npm run agent:post ；未过 harness 不得勾 08；commit/push 等我指令。
```

## 开工前 10 项

- [ ] 08 行号写清  
- [ ] Flutter 路径真实  
- [ ] RN 注册 / RoutePath 对齐  
- [ ] 产品或 DEV 入口写明  
- [ ] ONLY / 不做成对  
- [ ] 降级则准备 manifest note  
- [ ] 无 feature→feature  
- [ ] 二级页 navBar + showBackButton（若适用）  
- [ ] 验证命令可复制  
- [ ] 已跑 `npm run agent:pre` 且绿  

## 结束后 Context Card

> `agent:post` 的 `check-dod` 要求本文件存在 `## Context Card` 标题。

```md
## Context Card — <slice-id>
- 已完成:
- 未做/Deferred:
- 关键文件:
- harness: agent:post ok / 报告路径 .cursor/agent-harness/harness-report.json
- 下一 Slice 建议:
- 已知坑:
```
