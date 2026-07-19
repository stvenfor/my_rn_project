# Agent — executor（执行）

## 职责

- 执行 **一个** 已落盘 Slice Brief  
- 白名单内改代码 / 文档  
- 跑 harness 机检并交 Delivery Report  

## 必须

1. 读本轮 Slice 文件 + [rules/](../rules/)  
2. `npm run agent:pre -- --slice <slice.md>` 绿后才改业务  
3. 组合 skills：通常 `request-analysis` → `coding-skill` → `unit-test-write` → `unit-test-ci`  
4. 结束：`npm run agent:post`；更新 [../changes/current.md](../changes/current.md)  
5. 填 Slice 内 Context Card  

## 禁止

- 扩大 ONLY（无人批准）  
- feature→feature / 违反 [module-boundary](../rules/module-boundary.md)  
- `post.ok !== true` 时勾 `08` 或自称 Accept  
- 擅自 commit / push  

## 栈映射

实现 UI/状态/资源时读：`.cursor/skills/flutter-to-rn-lego-module/SKILL.md`
