# Slice — m2-device-smoke-harmony

> Epic：[../epics/m2-device-smoke.md](../epics/m2-device-smoke.md)  
> Program：[../2026-07-19-m2-program.md](../2026-07-19-m2-program.md)  
> 状态：**Ready**（三端全验收 · 第 3）

```md
## Slice Brief
- FLUTTER_MODULE: n/a
- RN_FEATURE: app shell / Harmony device smoke
- 本轮 ONLY: Harmony 模拟器或真机跑通 Splash→Tabs、Login、主业务抽检；写 evidence；勾 08 §D Harmony 交互三格（有日志/录屏才勾）
- 不做: iOS/Android；假勾无设备证据；改业务 feature UI；真支付/真 IM/BLE；清 lint
- 验收: 08 §D Harmony 行 Splash→Tabs / Login / 主业务抽检 可证；record 含命令、设备、结果摘要；native 缺口记 R-003 不阻塞他端
- 文件白名单:
  - docs/flutter-to-rn-lego-migration/
  - .harness/changes/
- 验证命令:
  - npm run typecheck
- 证据: docs/flutter-to-rn-lego-migration/acceptance-records/2026-07-19-m2-device-smoke-harmony.md
```

## 交互脚本（必跑）

1. 先 `npm run dev`（若 rawfile 过期）再 `npm run harmony`（或 DevEco / hdc 等价）  
2. Splash → Main Tabs  
3. 未登录 → Login → 回主流程  
4. 主业务抽检一条  
5. 失败属 native 能力缺口 → Record + 风险台账，**不**假勾  

## Context Card — m2-device-smoke-harmony

```md
## Context Card — m2-device-smoke-harmony
- 已完成: Brief 落盘
- 未做/Deferred: 真机/模拟器执行
- harness: pending
- 下一 Slice 建议: Epic 汇总 Record → m2-ux-screenshots
- 已知坑: R-003 Harmony native；bundle 成功 ≠ 交互通过
```
