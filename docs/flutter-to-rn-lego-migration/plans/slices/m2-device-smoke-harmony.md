# Slice — m2-device-smoke-harmony

> Epic：[../epics/m2-device-smoke.md](../epics/m2-device-smoke.md)  
> Program：[../2026-07-19-m2-program.md](../2026-07-19-m2-program.md)  
> 状态：**Done (partial)** — Splash/主业务 ✅；Login 门禁未复测

```md
## Slice Brief
- FLUTTER_MODULE: n/a
- RN_FEATURE: app shell / Harmony device smoke
- 本轮 ONLY: Harmony packaging 复核 + run-harmony/hdc 交互；写 evidence；诚实勾 08 §D Harmony
- 不做: iOS/Android；假勾无设备证据；改业务 feature UI；真支付/真 IM/BLE；清 lint
- 验收: record 诚实；agent:post 绿；交互格仅有截图/日志才勾
- Accept 模式: Partial
- Partial 时未证项:
  - 未登录 → Login 门禁（本轮会话已登录，未清 session）
- 文件白名单:
  - docs/flutter-to-rn-lego-migration/
  - .harness/changes/
- 机跑验证:
  - npm run typecheck
  - npm run dev
- 人证清单:
  - hdc list targets / run-harmony 结果摘要
  - evidence/m2-device-smoke-harmony/
- 验证命令:
  - npm run typecheck
  - npm run dev
- 证据: docs/flutter-to-rn-lego-migration/acceptance-records/2026-07-19-m2-device-smoke-harmony.md
```

## 交互脚本（必跑）

1. 先 `npm run dev` 再 `npx react-native run-harmony --no-packager`  
2. Splash → Main Tabs  
3. Chat / Mine 抽检  
4. 证据写入 Record  

## Context Card — m2-device-smoke-harmony

```md
## Context Card — m2-device-smoke-harmony
- 已完成: npm run dev；run-harmony 安装启动；Home/Chat/Mine 截图；Partial record
- 未做/Deferred: 未登录→Login 门禁复测；LogBox 警告清债
- 关键文件: acceptance-records/2026-07-19-m2-device-smoke-harmony.md ; evidence/m2-device-smoke-harmony/* ; 08 §D Harmony ; slice
- harness: agent:post ok / 报告路径 .cursor/agent-harness/harness-report.json
- 下一 Slice 建议: Epic 汇总 或 m2-android-toolchain / m2-ux-screenshots
- 已知坑: run-harmony 遇 8081 占用须 --no-packager；snapshot 后缀须 .jpeg
```
