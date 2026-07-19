# 08 · 日常速查表（贴显示器旁）

## 导入别名

```ts
@features/auth          → packages/features/auth/src
@core/navigation        → packages/core/navigation/src
@ui/design-system       → packages/ui/design-system/src
@commons/toolkit        → packages/commons/toolkit/src
@app/store              → src/store
@app/config/...         → src/config/...
```

## 组件 / 样式

```tsx
<View style={styles.box} />
<Text style={styles.title}>必须包在 Text 里</Text>
style={[styles.base, cond && styles.active, {marginTop: 8}]}

const styles = StyleSheet.create({
  box: {flex: 1, padding: 16},
});
```

优先：`colors` / `spacing` / `typography`（`@ui/design-system`）；feature 专属色放 `features/*/theme`。

## 二级页脚手架

```tsx
<AppPageScaffold
  navBar={
    <AppNavBar
      title="标题"
      showBackButton
      onBack={() => navigation.goBack()}
    />
  }>
  {children}
</AppPageScaffold>
```

沉浸式：`layout="edgeToEdge"`；登录等同理。

## Hooks

```tsx
const [x, setX] = useState(0);
useEffect(() => { /* mount */ return () => { /* cleanup */ }; }, []);
const y = useMemo(() => compute(), [deps]);
const insets = useSafeAreaInsets();
const {width} = useWindowDimensions();
```

## Redux

```tsx
const dispatch = useAppDispatch();
const v = useAppSelector(s => s.auth.user);
dispatch(updateEmail('a@b.c'));                 // 同步
const r = await dispatch(someThunk(arg));       // 异步
if (someThunk.fulfilled.match(r)) { /* ok */ }
```

## 导航

```tsx
navigation.navigate(RoutePath.login);
navigation.navigate(RoutePath.loginPassword, {email});
navigation.replace(RoutePath.main);
navigation.goBack();
```

禁止裸字符串路由名；跨 feature **只** `RoutePath`，不 import 对方 Screen。

## 本地图片

```ts
// *Assets.ts
cover: require('../../assets/cover.png'),
// Screen
<Image source={images.cover} />
```

## 新 Feature 最小清单

1. `packages/features/<name>/`  
2. `registerXxxFeature()`  
3. `RoutePath` + `RootStackParamList`  
4. `moduleManifest` 加入  
5. `index.ts` 导出  
6. （如需）`src/store` 挂 reducer  
7. **产品或 DEV 入口**（Tab / 全部服务 / Settings `__DEV__`）  
8. 二级页：`navBar` + `showBackButton`

## 平台

```tsx
Platform.OS === 'ios'
Platform.OS === 'android'
(Platform.OS as string) === 'harmony'
```

## 常用命令

```bash
npm start -- --reset-cache
npm run typecheck
npm run lint
npm test
npx jest packages/features/<name> --no-coverage
npm run ios | android | harmony
```

## 读页三问

状态从哪来？交互改谁？成功去哪？

下一步练读：[09 · 读代码路线图](./09-read-code-roadmap.md)
