# Agent Harness scripts

Machine checks for Slice Brief contracts. Full spec:

**[docs/flutter-to-rn-lego-migration/10-agent-prompt-harness.md](../../docs/flutter-to-rn-lego-migration/10-agent-prompt-harness.md)**

```bash
npm run agent:pre -- --slice docs/flutter-to-rn-lego-migration/plans/slices/<id>.md
npm run agent:post
```

Nested Brief list items (白名单 / 验证命令) **must be indented** under their label, e.g.:

```md
- 验证命令:
  - npx jest packages/features/settings --no-coverage
```
