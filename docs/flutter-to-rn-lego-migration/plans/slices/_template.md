# Slice Brief 模板

复制本文件为 `slices/<slice-id>.md`，或直接粘贴到 Agent 开场。  
配套说明：[../README.md](../README.md) · 方法：[../../09-agent-programming-playbook.md](../../09-agent-programming-playbook.md)

---

```md
## Slice Brief
- FLUTTER_MODULE:
- RN_FEATURE:
- Flutter 入口: packages/features/<mod>/lib/.../*.dart
- RN 目标: packages/features/<mod>/src/...
- 本轮 ONLY: [一页 / 一组资源 / 一个交互 / 一次入口接线]
- 不做: [明确排除；含 Deferred]
- 验收: 08 §Bx 第 N 行 + Migrated 门槛（见 08）
- 文件白名单:
  -
- 文件黑名单:
  -
- 验证命令:
  - npx eslint <paths> --ext .ts,.tsx
  - npx jest packages/features/<mod> --no-coverage
  - npx jest src/__tests__/pageParity.test.ts   # 若改 manifest
- 证据: acceptance-records/... 或命令摘要 + 交互脚本
- 工具: .cursor/skills/flutter-to-rn-lego-module ；先 Flutter 再 RN
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
- [ ] 证据形态约定  

## 结束后 Context Card

```md
## Context Card — <slice-id>
- 已完成:
- 未做/Deferred:
- 关键文件:
- 下一 Slice 建议:
- 已知坑:
```
