#!/usr/bin/env node
/**
 * Sync app icon / launch splash from Flutter my_ai_project to RN native dirs.
 * Usage: node scripts/sync-app-shell-assets.js
 */
const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

const root = path.join(__dirname, '..');
const flutter = path.join(root, '../my_ai_project');

if (!fs.existsSync(flutter)) {
  console.error('[sync-app-shell-assets] Flutter project not found:', flutter);
  process.exit(1);
}

function cp(src, dest) {
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  fs.copyFileSync(src, dest);
}

// iOS
const iosIcon = path.join(
  flutter,
  'ios/Runner/Assets.xcassets/AppIcon.appiconset',
);
const rnIosIcon = path.join(
  root,
  'ios/MyRnProject/Images.xcassets/AppIcon.appiconset',
);
for (const file of fs.readdirSync(iosIcon)) {
  cp(path.join(iosIcon, file), path.join(rnIosIcon, file));
}

const iosLaunch = path.join(
  flutter,
  'ios/Runner/Assets.xcassets/LaunchImage.imageset',
);
const rnIosLaunch = path.join(
  root,
  'ios/MyRnProject/Images.xcassets/LaunchImage.imageset',
);
fs.mkdirSync(rnIosLaunch, {recursive: true});
for (const file of fs.readdirSync(iosLaunch)) {
  cp(path.join(iosLaunch, file), path.join(rnIosLaunch, file));
}

// Android
for (const density of ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi']) {
  const srcDir = path.join(flutter, `android/app/src/main/res/mipmap-${density}`);
  const destDir = path.join(root, `android/app/src/main/res/mipmap-${density}`);
  fs.mkdirSync(destDir, {recursive: true});
  cp(path.join(srcDir, 'ic_launcher.png'), path.join(destDir, 'ic_launcher.png'));
  cp(
    path.join(srcDir, 'ic_launcher.png'),
    path.join(destDir, 'ic_launcher_round.png'),
  );
  cp(
    path.join(srcDir, 'launch_image.png'),
    path.join(destDir, 'launch_image.png'),
  );
}

for (const [srcRel, destRel] of [
  ['android/app/src/main/res/drawable/launch_background.xml', 'android/app/src/main/res/drawable/launch_background.xml'],
  [
    'android/app/src/main/res/drawable-v21/launch_background.xml',
    'android/app/src/main/res/drawable-v21/launch_background.xml',
  ],
]) {
  cp(path.join(flutter, srcRel), path.join(root, destRel));
}

// Harmony
const harmonyMedia = path.join(
  root,
  'harmony/entry/src/main/resources/base/media',
);
const flutterOhosIcon = path.join(
  flutter,
  'ohos/entry/src/main/resources/base/media/icon.png',
);
cp(flutterOhosIcon, path.join(harmonyMedia, 'startIcon.png'));
cp(flutterOhosIcon, path.join(harmonyMedia, 'foreground.png'));
execSync(
  `sips -z 144 144 "${path.join(harmonyMedia, 'startIcon.png')}" --out "${path.join(harmonyMedia, 'startIcon.png')}"`,
  {stdio: 'ignore'},
);
execSync(
  `sips -z 288 288 "${path.join(harmonyMedia, 'foreground.png')}" --out "${path.join(harmonyMedia, 'foreground.png')}"`,
  {stdio: 'ignore'},
);

console.log('[sync-app-shell-assets] App icon and launch assets synced from Flutter.');
