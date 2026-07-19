# Slice — m2-design-tokens-audit

> Epic：[../epics/m2-design-tokens.md](../epics/m2-design-tokens.md)  
> Program：[../2026-07-19-m2-program.md](../2026-07-19-m2-program.md)  
> 状态：**Ready**（只读审计）

```md
## Slice Brief
- FLUTTER_MODULE: n/a
- RN_FEATURE: 主路径 UI 抽检（auth/home/community/settings/music）
- 本轮 ONLY: 只读扫描 packages/features 硬编码色值/间距；产出抽检表；可选跑 design-token-spotcheck.mjs；不改业务色值
- 不做: 全仓一次性换 token；引入第二套主题；改 UI 行为；假勾 08 §A1 token 行
- 验收: 抽检表文件→违规/合规→处理建议；Record 落盘；08 token 行诚实（勾或 Deferred note）
- Accept 模式: Partial
- Partial 时未证项:
  - 违规项实际改 token（属 m2-design-tokens-fix）
  - 全仓历史硬编码清零
- 文件白名单:
  - docs/flutter-to-rn-lego-migration/
  - scripts/design-token-spotcheck.mjs
  - .harness/changes/
- 机跑验证:
  - npm run typecheck
  - node scripts/design-token-spotcheck.mjs
- 人证清单:
  - acceptance-records 内抽检表（路径在证据 Record）
- 证据: docs/flutter-to-rn-lego-migration/acceptance-records/YYYY-MM-DD-m2-design-tokens-audit.md
```

## 建议抽检范围（与 Epic 对齐）

- auth Login  
- home HomeTab  
- community Feed  
- settings Mine  
- music NowPlaying  

## 工具

可选：`node scripts/design-token-spotcheck.mjs`（grep `packages/features` 内 `#RGB` / `#RRGGBB` 等）。

## Context Card — m2-design-tokens-audit

```md
## Context Card — m2-design-tokens-audit
- 已完成: Ready Brief；spotcheck 脚本可选落盘
- 未做/Deferred: 修色值 Slice；08 token 全勾
- 关键文件: plans/slices/m2-design-tokens-audit.md ; scripts/design-token-spotcheck.mjs
- harness: 执行时 agent:pre/post
- 下一 Slice 建议: m2-design-tokens-fix（按白名单）
- 已知坑: 品牌色/渐变可能需白名单例外 + note
```
