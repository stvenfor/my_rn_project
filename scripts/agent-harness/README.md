# Agent Harness scripts

Machine checks for Slice Brief contracts. Full spec:

**[docs/flutter-to-rn-lego-migration/10-agent-prompt-harness.md](../../docs/flutter-to-rn-lego-migration/10-agent-prompt-harness.md)**

```bash
npm run agent:pre -- --slice docs/flutter-to-rn-lego-migration/plans/slices/<id>.md
npm run agent:post
```

Nested Brief list items (白名单 / 机跑验证) **must be indented** under their label, e.g.:

```md
- 机跑验证:
  - npx jest packages/features/settings --no-coverage
- 人证清单:
  - acceptance-records/assets/<id>/shot.png
- Accept 模式: Full
```

- **`run-verify`** runs only **机跑验证** (fallback: legacy **验证命令**). It never runs **人证清单**.
- **`check-dod`**: if **Accept 模式=Partial**, the evidence Record must contain a Deferred / 未证 / Partial heading or table.
- Template: `docs/flutter-to-rn-lego-migration/plans/slices/_template.md`

Self-check for Brief parsing:

```bash
node scripts/agent-harness/lib/parse-brief.selfcheck.mjs
```
