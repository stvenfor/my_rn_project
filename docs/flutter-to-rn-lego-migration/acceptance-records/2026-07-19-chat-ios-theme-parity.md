# Acceptance Record — `@features/chat` iOS / iMessage 1:1

Date: 2026-07-19  
Scope: Chat list / detail / image preview + `@core/im` mock seed alignment  
Decision: **Accept** (ImagePreview pinch vs InteractiveViewer noted Degraded in manifest note)

## Gaps fixed (from audit)

| Area | Before | After |
|------|--------|-------|
| Theme | WeChat green `#07C160` / `#95EC69` | Flutter `ChatTheme` `#007AFF` / `#F2F2F7` / asymmetric bubbles |
| ChatTab chrome | AppNavBar「微信」 | Large title「消息」+ accent search/compose icons |
| List | Flat list + hairline | Grouped white card + 72 inset dividers |
| Detail header | Gray WeChat bar | White `_ChatDetailHeader` + blue back/more + green online |
| Bubbles | r6 green/white + pill time | r18/4 blue/gray + plain time caption |
| Input | Green「发送」+ emoji glyphs | Gray fill r20 + circular blue ↑ + Cupertino-style icons |
| Voice | pressIn/Out; no 60s | long-press; auto-stop 60s; wave bars |
| Mock seed | + group chat | 3 private peers only (Flutter-aligned titles) |

## Verification

```text
npx jest packages/features/chat packages/core/im/src/__tests__/contract.test.ts src/__tests__/pageParity.test.ts
# 5 suites / 14 tests passed
eslint packages/features/chat — 0 errors
```

## Interaction script (manual)

1. ChatTab → 大标题「消息」+ 分组列表  
2. 进入会话 → 蓝气泡 / 灰气泡 / 在线绿色  
3. 发文本 → 圆形蓝 ↑；emoji/更多面板；键盘弹起收起面板  
4. 按住说话 → 松开发送；满 60s 自动发送  
5. 相册 / 拍摄 → mock picker；长按消息 → 复制/撤回/删除  
6. 返回列表 → unread 刷新（focus refetch）

## Known gaps

- ImagePreview：RN ScrollView pinch；Flutter InteractiveViewer（manifest note）
- ChatNavigator.openPrivate deep-link helper 未单独抽（路由 params 已够用）
- 真 IM SDK：仍走 `@core/im` mock（与 Flutter Phase0 一致）
