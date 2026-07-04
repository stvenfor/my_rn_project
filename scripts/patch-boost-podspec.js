#!/usr/bin/env node
/**
 * RN 0.72 boost.podspec 默认 jfrog 源经常 403/返回错误页，导致 pod install checksum 失败。
 * 安装依赖后自动切换为 archives.boost.io 镜像。
 */
const fs = require('fs');
const path = require('path');

const podspecPath = path.join(
  __dirname,
  '../node_modules/react-native/third-party-podspecs/boost.podspec',
);

if (!fs.existsSync(podspecPath)) {
  process.exit(0);
}

const BROKEN_URL =
  'https://boostorg.jfrog.io/artifactory/main/release/1.76.0/source/boost_1_76_0.tar.bz2';
const FIXED_URL =
  'https://archives.boost.io/release/1.76.0/source/boost_1_76_0.tar.bz2';

let content = fs.readFileSync(podspecPath, 'utf8');
if (content.includes(BROKEN_URL)) {
  content = content.replace(BROKEN_URL, FIXED_URL);
  fs.writeFileSync(podspecPath, content);
  console.log('[patch-boost] boost.podspec → archives.boost.io');
}
