const fs = require('fs');
const path = require('path');

const videoPkgJsonPath = path.join(
  __dirname,
  '../node_modules/@react-native-ohos/react-native-video/package.json',
);
const videoIndexEtsPath = path.join(
  __dirname,
  '../node_modules/@react-native-ohos/react-native-video/harmony/rn_video/index.ets',
);

if (!fs.existsSync(videoPkgJsonPath)) {
  process.exit(0);
}

const pkg = JSON.parse(fs.readFileSync(videoPkgJsonPath, 'utf8'));
const harmony = pkg.harmony ?? {};

if (harmony.autolinking?.etsPackageClassName !== 'RNCVideoPackage') {
  pkg.harmony = {
    ...harmony,
    alias: harmony.alias ?? 'react-native-video',
    autolinking: {
      etsPackageClassName: 'RNCVideoPackage',
      cppPackageClassName: 'RNCVideoPackage',
      cmakeLibraryTargetName: 'rnoh_video',
      ohPackageName: '@react-native-ohos/react-native-video',
    },
  };
  fs.writeFileSync(videoPkgJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

if (fs.existsSync(videoIndexEtsPath)) {
  const patched = `export * from './src/main/ets/RNCVideo';
import { RNCVideoPackage } from './src/main/ets/RNCVideoPackage';
export { RNCVideoPackage };
export default RNCVideoPackage;
`;
  fs.writeFileSync(videoIndexEtsPath, patched);
}
