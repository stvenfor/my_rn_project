# Skill — unit-test-write

## When

实现改动了逻辑 / 导航门禁 / repository；或 Brief 验证命令指向的测缺失。

## Do

1. 在白名单 feature 包内补/改 jest（与现有 `**/__tests__/**` 风格一致）  
2. 断言对齐 Flutter 行为或已声明 Degraded  
3. 把命令写进 Slice「验证命令」（若尚未写）  

## Don't

- 为过测而削弱生产断言  
- 跨 feature 引用测试 helper（除非已在 `@core`）
