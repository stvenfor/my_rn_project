# 环境与密钥

复制 `.env.example` 为 `.env`（不提交 git）：

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
USE_MOCK_AUTH=true
```

| 变量 | 说明 |
|---|---|
| `USE_MOCK_AUTH=true` | 使用 Mock Auth（默认，无需 Supabase） |
| `USE_MOCK_AUTH=false` | 连接 Supabase（需有效 URL/Key） |

环境 API（WanAndroid 演示）：

| 环境 | baseUrl |
|---|---|
| test | `https://www.wanandroid.com/` |
| staging | `https://www.wanandroid.com/` |
| production | `https://www.wanandroid.com/` |

Mock OTP 验证码：`123456`
