# 08 · 日常速查表（贴显示器旁）

## 导入别名

```ts
@features/auth          → packages/features/auth/src
@core/navigation        → packages/core/navigation/src
@ui/design-system       → packages/ui/design-system/src
@commons/toolkit        → packages/commons/toolkit/src
@app/store              → src/store
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

## 新 Feature 最小清单

1. `packages/features/<name>/`  
2. `registerXxxFeature()`  
3. `RoutePath` + `RootStackParamList`  
4. `moduleManifest` 加入  
5. `index.ts` 导出  
6. （如需）store 挂 reducer  

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
npm run ios | android | harmony
```
