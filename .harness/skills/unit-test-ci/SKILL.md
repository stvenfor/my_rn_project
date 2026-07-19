# Skill — unit-test-ci

## When

实现或补测结束后、宣称可审查前。

## Do

```bash
npm run agent:post
# 或显式：
npm run agent:post -- --slice docs/flutter-to-rn-lego-migration/plans/slices/<id>.md
```

确认 `.cursor/agent-harness/harness-report.json` 中 `post.ok === true`、`verify.ok === true`（或审计 skip）。

## Don't

- 默认 `--skip-verify`  
- post 红仍勾验收  

## Also

聚焦命令可先手动：`npx jest <path> --no-coverage`（须与 Brief 一致）。
