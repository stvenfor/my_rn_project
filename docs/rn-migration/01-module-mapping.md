| moduleId | Flutter 源 | RN 包 | Phase | 成熟度 |
|---|---|---|---|---|
| auth | `packages/features/auth` | `@features/auth` | 1 | 完整 |
| home | `packages/features/home` | `@features/home` | 1 | 完整（含资源+子页） |
| chat | `packages/features/chat` | `@features/chat` | 1 | 完整（@core/im adapter） |
| community | `packages/features/community` | `@features/community` | 1 | 完整（PostModel 对齐 feed + 发布/预览/播放） |
| settings | `packages/features/settings` | `@features/settings` | 1 | 完整（含 dialog/invoice） |
| friend | `packages/features/friend` | `@features/friend` | 2 | UI 已迁移 |
| live | `packages/features/live` | `@features/live` | 2 | 完整（@core/realtime adapter） |
| pay | `packages/features/pay` | `@features/pay` | 2 | UI 已迁移；SDK Deferred |
| video | `packages/features/video` | `@features/video` | 2 | 完整（mock JSON + player facade） |
| music | `packages/features/music` | `@features/music` | 3 | 完整（含本地默认资源） |
| bfui | `packages/features/bfui` | `@features/bfui` | 3 | 17 模板 + 53 资源 |
| toolkit | `packages/commons/toolkit` | `@commons/toolkit` | 1 | video mock JSON |

路由常量对照 Flutter `packages/route/lib/route/route_path.dart`。  
页面/资源 parity 详见 [page-resource-parity-matrix.md](../flutter-to-rn-lego-migration/page-resource-parity-matrix.md)。
