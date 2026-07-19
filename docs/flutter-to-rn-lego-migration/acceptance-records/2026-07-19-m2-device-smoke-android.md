# Acceptance Record — M2 Android 真机交互 Smoke

Date: 2026-07-19  
Device: **Pixel_7_Pro** AVD → `emulator-5556`（已 `sys.boot_completed=1`）  
Command: `npm run android` / `./gradlew :app:assembleDebug`  
Decision: **Partial / Blocked on interactive**（Packaging 仍认 M-close-gap Metro ✅；**交互三格不勾**）

## Accept 模式

**Partial**

## Deferred / 未证

| Item | 原因 | Owner | Phase |
|------|------|-------|-------|
| Splash→Tabs | `assembleDebug` 未成功，无法安装启动 | Agent | M2 续：Android toolchain Epic |
| Login gate / 成功 | 同上 | Agent | 同上 |
| 主业务抽检 | 同上 | Agent | 同上 |

## Environment

| 项 | 值 |
|----|-----|
| Emulator | Pixel_7_Pro booted ✅ |
| Metro | :8081 已占用（既有） |
| JDK | 17（Homebrew / JBR） |
| Packaging（既有） | Metro android bundle 182 assets（`2026-07-19-d-smoke.md`） |

## Build attempts

### 1) Baseline `compileSdk 33`

`checkDebugAarMetadata FAILED` — `androidx.core` 1.13+ metadata 要求 compileSdk **34**。

### 2) Bump `compileSdk/targetSdk 34`

`mergeExtDexDebug FAILED` — D8 dexing `okio-jvm-3.6.0` / `kotlin-stdlib-1.9.10`（`ERROR:D8: com.android.tools.r8.kotlin.H`）。

### 3) Revert 33 + force `androidx.core{,-ktx}:1.12.0`

仍报 `checkDebugAarMetadata`（core-ktx 1.12.0 亦被判定需 34 — 需独立 toolchain Epic，非本 Slice 范围）。

本 Slice 白名单内保留 `android/build.gradle` 的 core 钉版尝试，供续跑参考。

## §D Android 矩阵（诚实）

| Packaging | Splash→Tabs | Login | 主业务 |
|-----------|-------------|-------|--------|
| ✅ Metro（既有） | ☐ Deferred | ☐ Deferred | ☐ Deferred |

## 08 勾选意图

- **不勾** Android 交互三格，直至 assemble+启动有截图。  
- Packaging 列保持既有 ✅。

## Next

1. 新 Epic/Slice：`m2-android-toolchain`（AGP/compileSdk/D8 或强制依赖矩阵）  
2. 本队列继续：`m2-device-smoke-harmony`（可 packaging/条件）  
