#!/usr/bin/env node
/**
 * iOS pod install 辅助：patch boost + 提示 SwiftAudioEx 镜像。
 * 用法：npm run pod:install
 */
const {execSync} = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');

try {
  execSync('node scripts/patch-boost-podspec.js', {cwd: root, stdio: 'inherit'});
} catch (e) {
  process.exit(1);
}

const mirror =
  process.env.SWIFT_AUDIO_EX_GIT ||
  'https://ghproxy.net/https://github.com/DoubleSymmetry/SwiftAudioEx.git';

console.log(`[pod:install] SwiftAudioEx mirror: ${mirror}`);

try {
  execSync('pod install', {
    cwd: path.join(root, 'ios'),
    stdio: 'inherit',
    env: {
      ...process.env,
      SWIFT_AUDIO_EX_GIT: mirror,
    },
  });
} catch (e) {
  console.error(`
[pod:install] 失败。若 SwiftAudioEx 仍无法下载，可尝试：
  SWIFT_AUDIO_EX_GIT=https://mirror.ghproxy.com/https://github.com/DoubleSymmetry/SwiftAudioEx.git npm run pod:install
或配置 git / 系统代理后重试：cd ios && pod install
`);
  process.exit(1);
}
