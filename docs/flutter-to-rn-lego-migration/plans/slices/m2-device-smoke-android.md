# Slice — m2-device-smoke-android

> Epic：[../epics/m2-device-smoke.md](../epics/m2-device-smoke.md)  
> Program：[../2026-07-19-m2-program.md](../2026-07-19-m2-program.md)  
> 状态：**Done (partial / blocked interactive)**

```md
## Slice Brief
- FLUTTER_MODULE: n/a
- RN_FEATURE: app shell / Android device smoke
- 本轮 ONLY: Android 模拟器跑通 Splash→Tabs、Login gate、主业务抽检；尝试解锁 assemble（androidx.core 钉版）；写 evidence；诚实勾 08
- 不做: iOS/Harmony；假勾无设备证据；改业务 feature UI；真支付/真 IM/BLE；清 lint；升 AGP 主版本
- 验收: record 诚实记录构建/交互结果；agent:post 绿；无证据不勾 08 交互格
- Accept 模式: Partial
- Partial 时未证项:
  - Splash→Tabs / Login / 主业务（assembleDebug 未过则全 Deferred）
  - Mock 登录成功
- 文件白名单:
  - docs/flutter-to-rn-lego-migration/
  - .harness/changes/
  - android/build.gradle
- 机跑验证:
  - npm run typecheck
- 人证清单:
  - Pixel_7_Pro 启动日志
  - assembleDebug 失败摘要（或成功则 evidence 截图）
- 验证命令:
  - npm run typecheck
- 证据: docs/flutter-to-rn-lego-migration/acceptance-records/2026-07-19-m2-device-smoke-android.md
```

## 交互脚本（必跑）

1. `npm run android`（或 Studio Run 等价；注意 JVM 代理清空若构建失败）  
2. Splash → Main Tabs  
3. 未登录 → Login → 回主流程  
4. 主业务抽检一条  
5. 证据写入 Record  

## Context Card — m2-device-smoke-android

```md
## Context Card — m2-device-smoke-android
- 已完成: Pixel_7_Pro 启动；三次 assemble 尝试；Partial record；androidx.core 钉版尝试留在 android/build.gradle
- 未做/Deferred: Splash→Tabs/Login/主业务（native build Blocked）；Login 成功
- 关键文件: android/build.gradle ; acceptance-records/2026-07-19-m2-device-smoke-android.md ; evidence/m2-device-smoke-android/ ; slice brief
- harness: agent:post ok / 报告路径 .cursor/agent-harness/harness-report.json
- 下一 Slice 建议: m2-android-toolchain（构建）或 m2-device-smoke-harmony
- 已知坑: compileSdk 33 vs androidx 34；compileSdk 34 触发 D8 kotlin.H
```
