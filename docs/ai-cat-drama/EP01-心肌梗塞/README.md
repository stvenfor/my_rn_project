# 猫猫 AI 短剧复刻指南 — EP01《心肌梗塞》

> 基于「猫猫Ai短剧」同款赛道的可执行制作包。按顺序完成 01→07 即可出片。

## 快速开始（MVP 路径）

1. 阅读 [01-script.md](./01-script.md) 确认剧本
2. 在 [03-characters.md](./03-characters.md) 按 Prompt 在即梦生成 3 张角色基准图 → 存入 `assets/characters/`
3. 在 [04-storyboard-prompts.md](./04-storyboard-prompts.md) 按镜生成 8 张分镜图 → 存入 `assets/storyboard/`
4. 按 [05-motion-guide.md](./05-motion-guide.md) **方案 A** 在剪映加轻动效
5. 按 [06-jianying-timeline.md](./06-jianying-timeline.md) 配音、字幕、BGM 合成
6. 用 [07-publish-kit.md](./07-publish-kit.md) 发布

**预计耗时**：1.5–2 小时（首次）

---

## 文件索引

| 文件 | 内容 |
|------|------|
| [01-script.md](./01-script.md) | 60s 剧本 + 台词 + 情绪曲线 |
| [02-storyboard.md](./02-storyboard.md) | 8 镜工程化分镜表 + CSV |
| [03-characters.md](./03-characters.md) | 阿狸/大橘/小白人设卡 + 即梦基准图 Prompt |
| [04-storyboard-prompts.md](./04-storyboard-prompts.md) | 逐镜生图 Prompt + 质检表 |
| [05-motion-guide.md](./05-motion-guide.md) | 方案 A 静态动效 / 方案 B 图生视频 |
| [06-jianying-timeline.md](./06-jianying-timeline.md) | 剪映时间线 + 配音 + 字幕 |
| [07-publish-kit.md](./07-publish-kit.md) | 标题标签 + 评论区话术 + 系列规划 |

---

## 目录结构

```
EP01-心肌梗塞/
├── README.md                 # 本文件
├── 01-script.md
├── 02-storyboard.md
├── 03-characters.md
├── 04-storyboard-prompts.md
├── 05-motion-guide.md
├── 06-jianying-timeline.md
├── 07-publish-kit.md
└── assets/
    ├── characters/           # 角色基准图（即梦生成后放入）
    │   ├── char_alili_front.png
    │   ├── char_daju_front.png
    │   └── char_xiaobai_front.png
    └── storyboard/           # 分镜图（即梦生成后放入）
        ├── EP01_S01_全景_饭桌_v1.png
        └── ... S02-S08
```

---

## 工具栈

| 环节 | 工具 |
|------|------|
| 剧本 | 豆包 / DeepSeek（本包已提供成品） |
| 生图 | [即梦 AI](https://jimeng.jianying.com/) |
| 生视频（可选） | 即梦 Seedance / 可灵 |
| 剪辑 | 剪映 |

---

## 参考原作

- [猫猫Ai短剧 — 心肌梗塞](https://www.douyin.com/video/7641892887051092666)
- 标签：#心肌梗塞 #咋感觉下手有点狠 #猫猫之争 #倒插门 #赘婿
