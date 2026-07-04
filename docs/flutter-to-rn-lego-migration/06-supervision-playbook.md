# Codex 监督手册

## 监督目标

Codex 负责保证 Cursor 的迁移实现符合：

- Flutter 源项目真实业务边界。
- RN LEGO 架构依赖方向。
- 可验证、可回归、可分阶段交付。
- 三端 RN 项目现状，尤其是 HarmonyOS 支持。

## 每轮审查流程

1. 读取 Cursor Delivery Report。
2. 查看 git diff。
3. 对照本轮阶段 checklist。
4. 检查依赖边界。
5. 运行或要求补充验证命令。
6. 输出审查结论：放行、条件放行、返工、阻塞。

## 必查命令

```bash
git status --short
git diff --stat
git diff --name-only
npm run lint
npm run typecheck
npm run test -- --runInBand
```

对移动端 smoke test，Codex 应要求 Cursor 提供平台、设备、命令、结果截图或日志摘要。

## Review 模板

```md
## Codex Review

Decision:

Scope check:
- Expected:
- Actual:

Architecture findings:
1.

Functional findings:
1.

Test and verification:
- lint:
- typecheck:
- test:
- platform smoke:

Required changes:
1.

Follow-up risks:
1.
```

## 放行标准

可以放行：

- 阶段目标全部完成。
- 自动化检查通过。
- 没有架构边界违规。
- 未完成项属于后续阶段，且已记录。
- 风险有 owner 和验收证据要求。

条件放行：

- 非核心平台专项能力未完成，如 BLE 真机验证。
- 视觉差异不影响主流程。
- 有明确后续阶段和风险登记。

返工：

- 出现 feature-to-feature import。
- core 依赖 feature。
- 页面绕过 design-system token。
- route params 使用 `any` 导致跨模块不安全。
- 测试缺失且该模块已有业务逻辑。
- Cursor 交付没有验证证据。

阻塞：

- RN/Harmony 原生依赖不可用，且没有替代方案。
- 当前阶段核心启动路径无法运行。
- 包管理或 workspace 结构破坏现有项目。
- 用户需要做产品决策，例如舍弃某个 Flutter 功能。

## 返工单模板

```md
## Rework Request

Blocking issue:

Evidence:
- file:
- command output:

Required correction:

Acceptance after correction:
- command:
- expected result:
```

## 验收记录存放建议

后续每个阶段可新增：

```text
docs/flutter-to-rn-lego-migration/acceptance-records/
├── phase-0-foundation.md
├── phase-1-core-features.md
├── phase-2-social-media.md
├── phase-3-infra.md
└── phase-4-bfui-long-tail.md
```

这些记录由 Cursor 提供证据，Codex 审查后更新结论。

