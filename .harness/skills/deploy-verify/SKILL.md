# Skill — deploy-verify

## When

`08` §D 三端 smoke 或发布前抽检；**非**每个 Slice 必跑。

## Do

按发布范围执行（人确认平台）：

| 平台 | 命令 |
|------|------|
| iOS | `npm run ios` |
| Android | `npm run android` |
| Harmony | `npm run harmony` |

记录：Splash→Tabs、Login、主业务一条路径；写入 acceptance-record。

## Don't

- 用 smoke 替代 `agent:post` 单测门禁  
- 在 Slice「不做」含 Harmony 时强行扩大范围  

## Refs

- `docs/flutter-to-rn-lego-migration/08-acceptance-checklist.md` §D
