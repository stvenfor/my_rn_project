# Slice — d-smoke-close

> Epic：[../epics/d-smoke.md](../epics/d-smoke.md)  
> 状态：**Done**（2026-07-19）

```md
## Slice Brief
- FLUTTER_MODULE: n/a
- RN_FEATURE: app shell / platform smoke / docs
- 本轮 ONLY: 跑三端 JS bundle 冒烟；诚实勾 08 §D；写 §E Delivery Report + acceptance-record；关闭或条件关闭 M-close-gap
- 不做: 假勾真机 Splash→Tabs/Login（无日志/截图不勾）；清全仓 lint；改业务 feature UI；真支付/真 IM/BLE 专项
- 验收: iOS/Android Metro bundle + Harmony `npm run dev` 有结果；08 §D/§E 与 record 一致；agent:post 绿
- 文件白名单:
  - docs/flutter-to-rn-lego-migration/
  - .harness/changes/
  - scripts/smoke-checklist.sh
- 验证命令:
  - npm run typecheck
  - npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output /tmp/my_rn_d_smoke.ios.jsbundle --assets-dest /tmp/my_rn_d_smoke_ios_assets
  - npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output /tmp/my_rn_d_smoke.android.jsbundle --assets-dest /tmp/my_rn_d_smoke_android_assets
  - npm run dev
- 证据: docs/flutter-to-rn-lego-migration/acceptance-records/2026-07-19-d-smoke.md
```

## Context Card — d-smoke-close

```md
## Context Card — d-smoke-close
- 已完成: iOS/Android/Harmony packaging smoke；§D 诚实矩阵；§E Delivery；M-close-gap 条件关闭
- 未做/Deferred: 真机 Splash→Tabs/Login/主业务；截图入库
- 关键文件: 08 ; program ; d-smoke*.md ; acceptance-records/2026-07-19-d-smoke.md ; .harness/changes
- harness: agent:post ok / 报告路径 .cursor/agent-harness/harness-report.json
- 下一 Slice 建议: 停（开 M2 Program）或真机补录 Slice
- 已知坑: 勿把 Metro/bundle 成功当成真机交互勾选
```
