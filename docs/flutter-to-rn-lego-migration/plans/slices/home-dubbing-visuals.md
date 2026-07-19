# Slice — home-dubbing-visuals

> Epic：[../epics/home-b2.md](../epics/home-b2.md)  
> 状态：**Done**（2026-07-19）

```md
## Slice Brief
- FLUTTER_MODULE: home
- RN_FEATURE: @features/home
- Flutter 入口: packages/features/home/lib/home/view/dubbing_home_page.dart ; hot_rank_detail_page.dart（及相关 widget）
- RN 目标: packages/features/home/src/screens/HomeDubbingFeedScreen.tsx ; HomeHotRankDetailScreen.tsx ; 相关 components ; src/assets/homeAssets.ts
- 本轮 ONLY: 将 Flutter 实际用到的配音/热榜装饰图接到 RN UI；缺 key 则补 registry
- 不做: All Services 目录变更；music mini-player；勾 08；扩大到 auth/settings
- 验收: 关键装饰位与 Flutter 同资源可见；若无法 1:1 列出 Degrade 点交 evidence
- 文件白名单:
  - packages/features/home/src/screens/HomeDubbingFeedScreen.tsx
  - packages/features/home/src/screens/HomeHotRankDetailScreen.tsx
  - packages/features/home/src/components/**（仅配音/热榜相关）
  - packages/features/home/src/assets/homeAssets.ts
  - packages/features/home/src/__tests__/**
- 文件黑名单: packages/features/music、video、bfui；allServicesData.ts
- 验证命令:
  - npx eslint packages/features/home --ext .ts,.tsx
  - npx jest packages/features/home --no-coverage
- 证据: 交互脚本 + 可选截图路径；Degrade 列表（若有）
- 工具: flutter-to-rn-lego-module；先对 Flutter Image.asset 清单再改 RN
```

## 开工前 10 项

- [x] 08 映射：资源/视觉诚实（支撑 B2 registry + manifest）  
- [x] Flutter 装饰 Image.asset 清单（开干时列）  
- [x] RN 目标屏  
- [x] 入口：配音首页 / 热榜（既有）  
- [x] ONLY / 不做成对  
- [x] 无法 1:1 则准备 Degrade note 给 evidence  
- [x] 无 feature→feature  
- [x] 不改二级页 chrome 契约  
- [x] 验证命令已写  
- [x] 证据形态约定  

## Context Card（完成后填）

```md
## Context Card — home-dubbing-visuals
- 已完成: 配音首页/热榜详情装饰图接入（wheat、rank badge、play badge、chevron、swap、notification、badge_top20、thumb_default）；新增 DubbingCoverImage / SectionHeader / HotRankCard / SidebarItem 组件；dubbingVisuals.test.tsx
- 未做/Deferred: 头部 history Material 图标；Flutter 区块文案与 2 列 grid 布局 1:1
- 关键文件: homeAssets.ts（已有 registry）、HomeDubbingFeedScreen.tsx、HomeHotRankDetailScreen.tsx、components/Dubbing*.tsx、HotRankSidebarItem.tsx、DEGRADE-home-dubbing-visuals.md
- 下一 Slice 建议: home-b2 交互/导航 parity 或 dubbing video detail visuals
- 已知坑: RN Image tint 麦穗金色与 Flutter colorBlendMode 观感可能略有差异
```
