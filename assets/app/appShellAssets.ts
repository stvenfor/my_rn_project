/**
 * App shell native assets synced from Flutter `my_ai_project`.
 * These are platform-bundled resources (not Metro `require()` assets).
 */
export const APP_SHELL_ASSET_MANIFEST = {
  iosAppIcon1024:
    'ios/MyRnProject/Images.xcassets/AppIcon.appiconset/Icon-App-1024x1024@1x.png',
  iosLaunchImage3x:
    'ios/MyRnProject/Images.xcassets/LaunchImage.imageset/LaunchImage@3x.png',
  androidLauncherIcon:
    'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png',
  androidLaunchImage:
    'android/app/src/main/res/mipmap-xxxhdpi/launch_image.png',
  harmonyStartIcon:
    'harmony/entry/src/main/resources/base/media/startIcon.png',
  harmonyForegroundIcon:
    'harmony/entry/src/main/resources/base/media/foreground.png',
  harmonyBackground:
    'harmony/entry/src/main/resources/base/media/background.png',
} as const;

export type AppShellAssetKey = keyof typeof APP_SHELL_ASSET_MANIFEST;
