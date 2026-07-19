# Acceptance Record — B9 Live / Friend / Pay

Date: 2026-07-19  
Scope: Smoke entries + Deferred notes for realtime / pay SDK  
Decision: **Accept**

## Gaps fixed

| Area | Before | After |
|------|--------|-------|
| Live / Friend / Pay entry | Routes only | Settings `__DEV__` smoke rows |
| DebugRealtime → room | Missing | 「进入 Mock 直播房」→ LiveRoom |
| Manifest notes | Thin | Friend stub / mock WS / Pay SDK Deferred explicit |
| Tests | None | Package smoke renders |

## Verification

```text
npx jest packages/features/live packages/features/friend packages/features/pay src/__tests__/pageParity.test.ts src/__tests__/routeRegistration.test.ts
```

## Interaction script

1. 设置 → 开发调试 → 直播列表 → 进房 → 发信令 → 返回  
2. Realtime 调试 → 进入 Mock 直播房  
3. 好友模块 smoke → 见占位文案 → 返回  
4. 支付页 smoke → Mock 支付成功 toast；微信/支付宝 Deferred toast  
5. 全部服务 → 会员续费（既有产品路径）

## Known gaps (Deferred)

- 生产 WebSocket / 直播推流  
- 微信 / 支付宝原生支付 SDK（v0.2）  
- Friend 社交产品能力（Flutter 同为 stub）
