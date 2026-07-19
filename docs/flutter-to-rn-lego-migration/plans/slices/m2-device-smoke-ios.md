# Slice — m2-device-smoke-ios

> Epic：[../epics/m2-device-smoke.md](../epics/m2-device-smoke.md)  
> Program：[../2026-07-19-m2-program.md](../2026-07-19-m2-program.md)  
> 状态：**Done (partial)** — Splash/主业务 ✅；Login 成功子步未证

```md
## Slice Brief
- FLUTTER_MODULE: n/a
- RN_FEATURE: app shell / iOS device smoke
- 本轮 ONLY: iOS 模拟器或真机跑通 Splash→Tabs、Login、主业务抽检；写 evidence；勾 08 §D iOS 交互三格（有日志/录屏才勾）
- 不做: Android/Harmony；假勾无设备证据；改业务 feature UI；真支付/真 IM/BLE；清 lint
- 验收: 08 §D iOS 行 Splash→Tabs / Login / 主业务抽检 可证；record 含命令、设备、结果摘要
- 文件白名单:
  - docs/flutter-to-rn-lego-migration/
  - .harness/changes/
- 验证命令:
  - npm run typecheck
- 证据: docs/flutter-to-rn-lego-migration/acceptance-records/2026-07-19-m2-device-smoke-ios.md
```

## 交互脚本（必跑）

1. `npm run ios`（或 Xcode Run 等价）  
2. Splash → Main Tabs（Home / Chat / Community / Mine 可见）  
3. 未登录进受保护入口 → Login → 登录成功回主流程  
4. 主业务抽检任选一：Home 二级 / Chat 会话 / Community Feed / Mine→Settings  
5. 证据：终端摘要或录屏路径写入 Record  

## Context Card — m2-device-smoke-ios

```md
## Context Card — m2-device-smoke-ios
- 已完成: Sim 启动；Splash→Tabs；Chat→Login 门禁；Home+Mine 访客抽检；Record+证据；08 Splash/主业务
- 未做/Deferred: Mock 登录成功回主流程（TextInput 自动化不稳）；Login 列不假勾
- 关键文件:
  - acceptance-records/2026-07-19-m2-device-smoke-ios.md
  - acceptance-records/assets/m2-device-smoke/ios/*
  - acceptance-records/evidence/2026-07-19-m2-device-smoke-ios/*
  - 08 §D iOS 行；.harness/changes/current.md
- harness: agent:post ok / .cursor/agent-harness/harness-report.json
- 下一 Slice 建议: m2-device-smoke-android
- 已知坑: CGEvent 点 Tab 需 activate；RN TextInput 难注入；LogBox 可挡底栏
```
