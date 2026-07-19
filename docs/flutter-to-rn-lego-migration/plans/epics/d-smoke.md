# Epic Plan — D 三端 Smoke

| 项 | 内容 |
|----|------|
| Checklist | [`08` §D](../08-acceptance-checklist.md) + §E |
| Program | [2026-07-19-program.md](../2026-07-19-program.md) |
| 状态 | **Accept ✅***（packaging；真机交互 Deferred M2） |

## 本里程碑范围（M-close-gap）

| 平台 | Packaging | 真机交互 Splash→Tabs / Login / 主业务 |
|------|-----------|----------------------------------------|
| iOS | ✅ Metro 180 assets | Deferred M2 |
| Android | ✅ Metro 182 assets | Deferred M2 |
| HarmonyOS | ✅ `npm run dev` 183 assets | Deferred M2 |

专项（WebView / BLE / 真支付 / 真 IM）失败不阻塞壳；记入风险台账。

## Epic DoD

- [x] 三端 JS bundle 通过证据  
- [x] 08 §D 诚实勾选（交互格不假勾）  
- [x] §E Delivery Report + 差距 owner  
- [x] `acceptance-records/2026-07-19-d-smoke.md`  
- [x] Program 条件关闭 M-close-gap  
- [x] agent:post（待跑）  

## Slice backlog

| Slice | 状态 |
|-------|------|
| `d-smoke-close` | ✅ |

## Context Card

```md
## Context Card — d-smoke
- 已完成: 三端 packaging；§D/§E；M-close-gap 条件关闭
- Deferred: 真机交互；截图入库
- 下一: M2
```
