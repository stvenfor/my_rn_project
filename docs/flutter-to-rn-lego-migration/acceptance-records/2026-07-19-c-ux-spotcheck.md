# Acceptance Record — C UX 1:1 抽检

Date: 2026-07-19  
Scope: 08 §C；样本 auth Login / home HomeTab / community Feed / music NowPlaying / bfui gallery  
Decision: **Accept**（真机截图/录屏路径入库 Deferred → §E / 发布前）

## Evidence policy

本轮以 **已 Accept 模块 Interaction script + 代码辅证** 为 P0 证据；不新拍入库截图。发布前补截图时挂本 record。

## Sample matrix

| 样本 | 首屏结构 | 非 success 态 | 主交互 | SafeArea | 键盘 |
|------|----------|---------------|--------|----------|------|
| **auth Login** | B1 record + Flutter Auth 对照 Accept | toast/校验失败路径（B1 script） | 登录/OTP/注册（B1 script） | `LoginScreen` `useSafeAreaInsets` | `KeyboardAvoidingView`（Login/Password/OTP） |
| **home HomeTab** | B2：区块顺序 1:1 | refresh rejected → error（B2 G6 + script） | Club→社区、全部服务、配音入口（B2 script） | `HomeScreen` insets | n/a |
| **community Feed** | B5/community-ios record：大标题/筛选/卡片 | loading / error+重试 / empty 图标（CommunityScreen） | 刷新、加载更多、赞评分享、预览（script） | `CommunityScreen` insets | n/a |
| **music NowPlaying** | music-controls record：EN 标题/chrome/seek | player fail 不挡 UI（slice note） | play/seek/mute/上下曲（record + 单测） | `AppPageScaffold`+`AppNavBar` | n/a |
| **bfui gallery** | B8：目录分类 + 模板顶栏返回 | Degraded 模板占位文案（script） | 进模板/返回（B8 script） | `AppPageScaffold`/`AppNavBar` on templates | n/a |

## §C checklist mapping

| 项 | 结果 | 证据锚点 |
|----|------|----------|
| 首屏结构一致 | ✅ | 上表 + 各模块 B 章 Accept |
| 非 success 态有证据 | ✅ | home error；community load/error/empty；auth 校验 toast；bfui Degraded 占位 |
| 主交互有证据 | ✅ | 各 record Interaction script |
| SafeArea | ✅ | auth/home/community insets；music/bfui scaffold+nav |
| 表单键盘不挡输入 | ✅ | auth `KeyboardAvoidingView`（适用样本） |

## Verification

```text
npm run agent:pre -- --slice docs/flutter-to-rn-lego-migration/plans/slices/c-ux-spotcheck.md
npx jest packages/features/auth/src/__tests__/LoginScreen.test.tsx packages/features/home/src/__tests__/HomeScreens.test.tsx --no-coverage
npm run agent:post
```

## Deferred

- 真机截图/录屏文件路径写入 §E（发布或 D 章时补）  
- design-token 全仓抽检（A 已 Deferred）  
