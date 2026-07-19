# Epic Plan — B1 `@features/auth`

| 项 | 内容 |
|----|------|
| Checklist | [`08` §B1](../08-acceptance-checklist.md) |
| Flutter | `/Users/mac/Desktop/github/my_ai_project/packages/features/auth/` |
| RN | `packages/features/auth/` |
| Program | [2026-07-19-program.md](../2026-07-19-program.md) |
| 状态 | **Accept ✅**（2026-07-19） |

## Epic DoD

- [x] 08 §B1 全部 ✅  
- [x] `acceptance-records/2026-07-19-auth-b1.md`  
- [x] manifest 诚实（含 AuthDevHome Removed；真后端 Deferred note）  
- [x] jest 绿；无 `@features/*` 依赖  
- [x] Login/Password/OTP/Register 已注册  

## 08 §B1 映射

| 项 | 结果 | 证据 |
|----|------|------|
| 四路由可进入 | ✅ | `registerAuthFeature.test.ts`；Login/Register 产品路径；Password/OTP legacy stack |
| 校验文案/规则对齐 | ✅ | `authValidation` / slice 校验与 Flutter 同文案 |
| 登录写 session；登出清理 | ✅ | `loginWithPasswordThunk` + `logoutThunk` 单测 |
| 隐私勾选/链接 | ✅ | `AuthPrivacyRow`（与 Flutter 同占位文案） |
| 不依赖其他 features | ✅ | 仅 `@core/*` + design-system |
| AuthDevHome Removed | ✅ | manifest `auth-dev-home` Removed |

## 审计差距（关闭）

| ID | 处理 |
|----|------|
| AUTH-01 记住凭据 | Deferred（非 B1 门禁） |
| AUTH-02 真后端 | Deferred；manifest note：`USE_MOCK_AUTH` 下 session 契约验收 |
| AUTH-03 Password/OTP 无深链入口 | 与 Flutter 一致 legacy；路由已注册 |
| AUTH-04 session 测 | 已补 login/logout thunk 断言 |
| AUTH-05 文档/勾选 | 本 Epic + record |

## Slice backlog

| Slice | 状态 |
|-------|------|
| `auth-b1-audit` | ✅（内嵌本 Epic） |
| `auth-b1-route-smoke` | ✅ |
| `auth-b1-session-tests` | ✅ |
| `auth-b1-evidence` | ✅ |
| `auth-b1-credential-persist` | Deferred |
| `auth-b1-real-backend` | Deferred |

## Context Card

```md
## Context Card — auth-b1
- 已完成: B1 Accept；路由/session 测；08 勾选
- 未做/Deferred: 记住密码；真 UserAuthApi
- 下一 Epic: B3 settings
```
