/**
 * Ensure React Native platform-split modules resolve on Harmony.
 * Copies missing `*.harmony.js` stubs from `*.ios.js` under react-native.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const RN_ROOT = path.join(ROOT, 'node_modules/react-native');

const CRITICAL_STUBS = [
  'Libraries/Components/DrawerAndroid/DrawerLayoutAndroid',
  'Libraries/Components/ProgressBarAndroid/ProgressBarAndroid',
  'Libraries/Components/ToastAndroid/ToastAndroid',
  'Libraries/Components/Clipboard/Clipboard',
  'Libraries/ActionSheetIOS/ActionSheetIOS',
  'Libraries/PushNotificationIOS/PushNotificationIOS',
  'Libraries/Settings/Settings',
  'Libraries/PermissionsAndroid/PermissionsAndroid',
];

function copyIfNeeded(from, to) {
  if (!fs.existsSync(from)) {
    return false;
  }
  if (fs.existsSync(to)) {
    return false;
  }
  fs.copyFileSync(from, to);
  return true;
}

function main() {
  if (!fs.existsSync(RN_ROOT)) {
    return;
  }

  let created = 0;
  for (const rel of CRITICAL_STUBS) {
    const base = path.join(RN_ROOT, rel);
    const iosJs = `${base}.ios.js`;
    const harmonyJs = `${base}.harmony.js`;
    const plainJs = `${base}.js`;
    if (copyIfNeeded(iosJs, harmonyJs)) {
      created += 1;
    }
    // Also provide extensionless .js for resolvers that ignore platform exts.
    if (copyIfNeeded(iosJs, plainJs)) {
      created += 1;
    }
  }

  if (created > 0) {
    console.log(`[patch-rn-harmony-stubs] created ${created} stub file(s)`);
  }
}

main();
