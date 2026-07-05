const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(
  __dirname,
  '../node_modules/@react-native-ohos/react-native-image-picker/package.json',
);

if (!fs.existsSync(packageJsonPath)) {
  process.exit(0);
}

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const harmony = pkg.harmony ?? {};

if (harmony.autolinking?.etsPackageClassName === 'ImagePickerViewPackage') {
  process.exit(0);
}

pkg.harmony = {
  ...harmony,
  alias: harmony.alias ?? 'react-native-image-picker',
  autolinking: {
    etsPackageClassName: 'ImagePickerViewPackage',
    cppPackageClassName: 'RNImagePickerPackage',
    cmakeLibraryTargetName: 'rnoh_image_picker',
    ohPackageName: '@react-native-ohos/react-native-image-picker',
  },
};

fs.writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);
