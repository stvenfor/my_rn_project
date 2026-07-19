# Acceptance Record — `@features/video` dubbing detail parity

Date: 2026-07-19  
Scope: Dubbing list nav + video/work detail rebuild + PlayableVideoHeader  
Decision: **Accept** (WebView scrubber Degraded)

## Gaps fixed

| Area | Before | After |
|------|--------|-------|
| Mock data | List-only fields | subtitle/album/latest/leaderboard |
| Video detail | Cover stub | Header + title/tags/desc/uploader/album/works/榜 + bottom bar |
| Work detail | Cover stub | Header + 简介/评论 tabs + more works + bottom bar |
| List nav | AppNavBar as child, no back | `navBar` + `showBackButton` |
| Short play | Status bar visible | Immersive hide/restore |

## Verification

```text
npx jest packages/features/video src/__tests__/pageParity.test.ts
eslint packages/features/video
```

## Interaction script

1. DubbingVideoList → 返回可见 → 进详情  
2. 详情：播放区返回 / 字幕 / 专辑 Part 选中 / 收藏·分享·开启配音 toast  
3. DubbingWorkList → 作品详情 → 简介/评论切换 → Ta的更多作品  
4. ShortVideoPlay：进页隐藏 StatusBar，返回恢复  

## Known gaps

- PlayableVideoHeader：WebView；进度条无真实 seek（Degraded）  
- Lottie empty / landscape / danmaku：仍 deferred（manifest short-video notes）
