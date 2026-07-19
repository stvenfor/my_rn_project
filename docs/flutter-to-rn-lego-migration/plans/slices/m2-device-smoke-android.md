# Slice — m2-device-smoke-android

> Epic：[../epics/m2-device-smoke.md](../epics/m2-device-smoke.md)  
> Program：[../2026-07-19-m2-program.md](../2026-07-19-m2-program.md)  
> 状态：**Ready**（三端全验收 · 第 2）

```md
## Slice Brief
- FLUTTER_MODULE: n/a
- RN_FEATURE: app shell / Android device smoke
- 本轮 ONLY: Android 模拟器或真机跑通 Splash→Tabs、Login、主业务抽检；写 evidence；勾 08 §D Android 交互三格（有日志/录屏才勾）
- 不做: iOS/Harmony；假勾无设备证据；改业务 feature UI；真支付/真 IM/BLE；清 lint
- 验收: 08 §D Android 行 Splash→Tabs / Login / 主业务抽检 可证；record 含命令、设备、结果摘要
- 文件白名单:
  - docs/flutter-to-rn-lego-migration/
  - .harness/changes/
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
- 已完成: Brief 落盘
- 未做/Deferred: 真机/模拟器执行
- harness: pending
- 下一 Slice 建议: m2-device-smoke-harmony
- 已知坑: assembleDebug 代理问题见历史 rework record
```
