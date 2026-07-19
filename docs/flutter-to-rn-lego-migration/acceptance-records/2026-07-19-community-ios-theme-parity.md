# Acceptance Record — `@features/community` iOS theme 1:1

Date: 2026-07-19  
Scope: Community feed chrome / PostCard / LikeBar / preview gallery / theme tokens  
Decision: **Accept** (VideoPlay controls Degraded)

## Gaps fixed

| Area | Before | After |
|------|--------|-------|
| Theme | `#F5F5F5` / green primary | Flutter `#F2F2F7` / `#007AFF` / `#FF3B30` |
| Feed chrome | AppNavBar only | Large title「社区」+ blue + / search / 最新·热门·关注 |
| PostCard | Flat list rows | Grouped card + border radius 12 |
| LikeBar | Like+comment emoji | Heart/comment/share icons; share toast |
| Empty/Error | Emoji + 「点击重试」 | Chat bubbles icon + subtitle; 「重试」 filled accent |
| ImagePreview | Single URI | Horizontal gallery + `{n}/{total}` |
| TS dispatch | Untyped thunk unwrap | Typed `CommunityDispatch` |

## Verification

```text
npx jest packages/features/community src/__tests__/pageParity.test.ts packages/features/chat/src/__tests__/ChatScreens.test.tsx
eslint packages/features/community packages/features/chat/src/screens/ImagePreviewScreen.tsx
```

## Interaction script

1. CommunityTab → 大标题 / 搜索条 / 筛选 tab 下划线  
2. 下拉刷新 / 滑到底加载更多  
3. 全文展开；点赞动画；评论 sheet 发送；分享 toast  
4. 多图 → ImagePreview 左右滑 + 标题计数  
5. 视频封面 → VideoPlay（可播/暂停；无进度条 = Degraded）  
6. ⊕ → 发布占位页  

## Known gaps

- `CommunityVideoPlayScreen`：WebView，无 Flutter `AppVideoControlsBar`  
- Comment sheet：非 DraggableScrollable（高度约 40–92%）  
- Publish：仍为占位（与 Flutter 一致）
