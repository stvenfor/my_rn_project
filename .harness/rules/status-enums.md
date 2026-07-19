# Rule — parity status enums

合法 `status`（仅此五态）：

`Migrated` | `Degraded` | `Placeholder` | `Deferred` | `Removed`

- 能进路由 ≠ Migrated  
- Degraded / Placeholder / Deferred **必须**有 `note`  
- 未登记 Flutter 业务页 = B10 静默消失（禁止）  

机检：`check-manifest.mjs`
