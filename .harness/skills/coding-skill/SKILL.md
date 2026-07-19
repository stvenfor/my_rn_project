# Skill — coding-skill

## When

**executor** 主用；`agent:pre` 已绿；Brief 为实现类（非只读审计）。  
范围不清 → 停，交回 `.harness/agents/planner.md`。

## Do

1. 严格文件白名单（角色合同：`.harness/agents/executor.md`）  
2. 先 Flutter 源再 RN；资源 → registry → UI → 路由 → manifest  
3. 遵守 `.harness/rules/module-boundary.md`、status enums、`.harness/rules/metro-babel-aliases.md`  
4. 栈细节：`.cursor/skills/flutter-to-rn-lego-module/SKILL.md` + docs `07`  
5. 改页/资源 → `.harness/skills/parity-manifest-hygiene/SKILL.md`  
6. 新增 monorepo 包 / 改 `babel.config.js` → 读 `docs/.../appendices/metro-babel-module-resolver.md`，改完 `--reset-cache`  

## Don't

- 一口吞整模块  
- 假 Migrated  
- 改 Brief「不做」中的模块  
- 无人批准扩大 ONLY  

## Out

可跑测的 diff；准备交给 `unit-test-write` / `unit-test-ci`；收口用 `acceptance-record-writer`。
