# Rule — module boundary

- 禁止 `@features/A` → `@features/B`  
- 禁止 `packages/core` → `@features/*`  
- 跨模块经 `@core/*`、app shell、或 LoginRedirect 等共享原语  

权威说明：`docs/flutter-to-rn-lego-migration/appendices/module-boundary-rules.md`  
机检：`npm run agent:check-boundary` / `agent:post`
