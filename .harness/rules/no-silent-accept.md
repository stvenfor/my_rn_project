# Rule — no silent Accept

以下任一成立 → **不得**勾 `08`、不得 Accept：

- 未跑或未过 `agent:post`  
- harness-report 中 `post.ok !== true`  
- 缺 acceptance-record / Context Card（实现类）  
- manifest 假 Migrated  

commit/push：仅当人明确指令。
