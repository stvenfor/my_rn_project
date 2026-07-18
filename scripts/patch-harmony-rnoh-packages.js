const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const IMAGE_PICKER_INDEX = `import { ImagePickerViewPackage } from './src/main/ets/ImagePickerPackage';
export { ImagePickerViewPackage };
export default ImagePickerViewPackage;
`;

const IMAGE_PICKER_PACKAGE = `import { TurboModulesFactory } from '@rnoh/react-native-openharmony/ts';
import type { TurboModule, TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { RNOHPackage } from '@rnoh/react-native-openharmony';
import { ImagePickerTurboModule } from './ImagePickerTurboModule';

class ImagePickerTurboModulesFactory extends TurboModulesFactory {
  createTurboModule(name: string): TurboModule | null {
    if (name === 'ImagePicker') {
      return new ImagePickerTurboModule(this.ctx);
    }
    return null;
  }

  hasTurboModule(name: string): boolean {
    return name === 'ImagePicker';
  }
}

export class ImagePickerViewPackage extends RNOHPackage {
  createTurboModulesFactory(ctx: TurboModuleContext): TurboModulesFactory {
    return new ImagePickerTurboModulesFactory(ctx);
  }
}
`;

const VIDEO_INDEX = `import { RNCVideoPackage } from './src/main/ets/RNCVideoPackage';
export * from './src/main/ets/RNCVideo';
export { RNCVideoPackage };
export default RNCVideoPackage;
`;

const VIDEO_PACKAGE = `import { TurboModulesFactory } from '@rnoh/react-native-openharmony/ts';
import type { TurboModule, TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { RNOHPackage } from '@rnoh/react-native-openharmony';
import { RNCVideoTurboModule } from './RNCVideoTurboModule';
import { VideoManagerTurboModule } from './VideoManagerTurboModule';
import { VideoDecoderInfoTurboModule } from './VideoDecoderInfoTurboModule';
import type {
  DescriptorWrapperFactoryByDescriptorTypeCtx,
  DescriptorWrapperFactoryByDescriptorType,
} from '@rnoh/react-native-openharmony/ts';
import { RNC } from './generated/ts';

class RNCVideoTurboModulesFactory extends TurboModulesFactory {
  createTurboModule(name: string): TurboModule | null {
    if (name === 'RNCVideoTurboModule') {
      return new RNCVideoTurboModule(this.ctx);
    } else if (name === 'VideoManager') {
      return new VideoManagerTurboModule(this.ctx);
    } else if (name === 'VideoDecoderInfoModule') {
      return new VideoDecoderInfoTurboModule(this.ctx);
    }
    return null;
  }

  hasTurboModule(name: string): boolean {
    return name === 'RNCVideoTurboModule'
      || name === 'VideoManager'
      || name === 'VideoDecoderInfoModule';
  }
}

export class RNCVideoPackage extends RNOHPackage {
  createTurboModulesFactory(ctx: TurboModuleContext): TurboModulesFactory {
    globalThis.myContext = ctx.uiAbilityContext;
    return new RNCVideoTurboModulesFactory(ctx);
  }

  createDescriptorWrapperFactoryByDescriptorType(
    ctx: DescriptorWrapperFactoryByDescriptorTypeCtx
  ): DescriptorWrapperFactoryByDescriptorType {
    return {
      'RNCVideo': (ctx) => new RNC.RNCVideo.DescriptorWrapper(ctx.descriptor),
    };
  }
}
`;

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const next = content.endsWith('\n') ? content : `${content}\n`;
  fs.writeFileSync(filePath, next);
}

function removeIfExists(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

function setMain(packageRoot, mainFile) {
  const pkgPath = path.join(packageRoot, 'oh-package.json5');
  if (!fs.existsSync(pkgPath)) {
    return;
  }
  const text = fs.readFileSync(pkgPath, 'utf8');
  const next = text.replace(/"main"\s*:\s*"[^"]+"/, `"main": "${mainFile}"`);
  fs.writeFileSync(pkgPath, next);
}

function ensureProjectUsesHarDeps() {
  const ohPackagePath = path.join(ROOT, 'harmony/oh-package.json5');
  if (!fs.existsSync(ohPackagePath)) {
    return;
  }
  let text = fs.readFileSync(ohPackagePath, 'utf8');
  const next = text
    .replace(
      /@react-native-ohos\/react-native-image-picker":\s*"file:\.\.\/node_modules\/@react-native-ohos\/react-native-image-picker\/harmony\/image_picker(?!\.har)/g,
      '@react-native-ohos/react-native-image-picker": "file:../node_modules/@react-native-ohos/react-native-image-picker/harmony/image_picker.har',
    )
    .replace(
      /@react-native-ohos\/react-native-video":\s*"file:\.\.\/node_modules\/@react-native-ohos\/react-native-video\/harmony\/rn_video(?!\.har)/g,
      '@react-native-ohos/react-native-video": "file:../node_modules/@react-native-ohos/react-native-video/harmony/rn_video.har',
    )
    .replace(/image_picker\.har\.har/g, 'image_picker.har')
    .replace(/rn_video\.har\.har/g, 'rn_video.har');
  if (next !== text) {
    fs.writeFileSync(ohPackagePath, next);
  }
}

function patchAutolinkingMeta(packageJsonPath, autolinking, alias) {
  if (!fs.existsSync(packageJsonPath)) {
    return;
  }
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const harmony = pkg.harmony ?? {};
  if (harmony.autolinking?.etsPackageClassName === autolinking.etsPackageClassName) {
    return;
  }
  pkg.harmony = {
    ...harmony,
    alias: harmony.alias ?? alias,
    autolinking,
  };
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

function patchImagePickerSource(packageRoot) {
  if (!fs.existsSync(packageRoot)) {
    return false;
  }
  writeFile(path.join(packageRoot, 'index.ets'), IMAGE_PICKER_INDEX);
  writeFile(
    path.join(packageRoot, 'src/main/ets/ImagePickerPackage.ets'),
    IMAGE_PICKER_PACKAGE,
  );
  removeIfExists(path.join(packageRoot, 'src/main/ets/ImagePickerPackage.ts'));
  // Entry must be .ets (OhmUrl). Keep ts.ts only as a harmless stub; main is index.ets.
  writeFile(
    path.join(packageRoot, 'ts.ts'),
    `// Deprecated entry. Use index.ets (see oh-package.json5 "main").
export {};
`,
  );
  setMain(packageRoot, 'index.ets');
  return true;
}

function patchVideoSource(packageRoot) {
  if (!fs.existsSync(packageRoot)) {
    return false;
  }
  writeFile(path.join(packageRoot, 'index.ets'), VIDEO_INDEX);
  writeFile(path.join(packageRoot, 'src/main/ets/RNCVideoPackage.ets'), VIDEO_PACKAGE);
  removeIfExists(path.join(packageRoot, 'src/main/ets/RNCVideoPackage.ts'));
  setMain(packageRoot, 'index.ets');
  return true;
}

function listFilesRecursive(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name === 'oh_modules'
      || entry.name === 'node_modules'
      || entry.name === '.git'
      || entry.name === '.DS_Store'
      || entry.name.startsWith('._')
    ) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listFilesRecursive(full));
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function rebuildHar(packageRoot, harPath) {
  const tmpTar = `${harPath}.tmp.tar`;
  const parent = path.dirname(packageRoot);
  const stagingParent = path.join(parent, `.har-staging-${process.pid}`);
  const stagingPkg = path.join(stagingParent, 'package');
  fs.rmSync(stagingParent, { recursive: true, force: true });
  fs.mkdirSync(stagingPkg, { recursive: true });

  // Copy only real source files (skip macOS AppleDouble junk).
  for (const abs of listFilesRecursive(packageRoot)) {
    const rel = path.relative(packageRoot, abs);
    const dest = path.join(stagingPkg, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(abs, dest);
  }

  execFileSync('tar', ['-cf', tmpTar, '-C', stagingParent, 'package'], {
    env: { ...process.env, COPYFILE_DISABLE: '1' },
  });
  const tarBuf = fs.readFileSync(tmpTar);
  const gz = zlib.gzipSync(tarBuf, { level: 9 });
  fs.writeFileSync(harPath, gz);
  fs.rmSync(tmpTar, { force: true });
  fs.rmSync(stagingParent, { recursive: true, force: true });
  return listFilesRecursive(packageRoot).length;
}

function findOhpmPackageRoots(marker) {
  const ohpmRoot = path.join(ROOT, 'harmony/oh_modules/.ohpm');
  if (!fs.existsSync(ohpmRoot)) {
    return [];
  }
  const roots = [];
  for (const entry of fs.readdirSync(ohpmRoot)) {
    if (!entry.includes(marker)) {
      continue;
    }
    const candidate = path.join(
      ohpmRoot,
      entry,
      'oh_modules/@react-native-ohos',
      marker,
    );
    if (fs.existsSync(candidate)) {
      roots.push(candidate);
    }
  }
  return roots;
}

function main() {
  const imageSrc = path.join(
    ROOT,
    'node_modules/@react-native-ohos/react-native-image-picker/harmony/image_picker',
  );
  const videoSrc = path.join(
    ROOT,
    'node_modules/@react-native-ohos/react-native-video/harmony/rn_video',
  );
  const imageHar = path.join(
    ROOT,
    'node_modules/@react-native-ohos/react-native-image-picker/harmony/image_picker.har',
  );
  const videoHar = path.join(
    ROOT,
    'node_modules/@react-native-ohos/react-native-video/harmony/rn_video.har',
  );

  if (!fs.existsSync(imageSrc) || !fs.existsSync(videoSrc)) {
    console.log('[harmony-patch] skip: packages not installed');
    return;
  }

  patchAutolinkingMeta(
    path.join(ROOT, 'node_modules/@react-native-ohos/react-native-image-picker/package.json'),
    {
      etsPackageClassName: 'ImagePickerViewPackage',
      cppPackageClassName: 'RNImagePickerPackage',
      cmakeLibraryTargetName: 'rnoh_image_picker',
      ohPackageName: '@react-native-ohos/react-native-image-picker',
    },
    'react-native-image-picker',
  );
  patchAutolinkingMeta(
    path.join(ROOT, 'node_modules/@react-native-ohos/react-native-video/package.json'),
    {
      etsPackageClassName: 'RNCVideoPackage',
      cppPackageClassName: 'RNCVideoPackage',
      cmakeLibraryTargetName: 'rnoh_video',
      ohPackageName: '@react-native-ohos/react-native-video',
    },
    'react-native-video',
  );

  patchImagePickerSource(imageSrc);
  patchVideoSource(videoSrc);

  for (const root of findOhpmPackageRoots('react-native-image-picker')) {
    patchImagePickerSource(root);
  }
  for (const root of findOhpmPackageRoots('react-native-video')) {
    patchVideoSource(root);
  }

  const imageCount = rebuildHar(imageSrc, imageHar);
  const videoCount = rebuildHar(videoSrc, videoHar);
  ensureProjectUsesHarDeps();

  console.log(
    `[harmony-patch] rebuilt image_picker.har (${imageCount} files), rn_video.har (${videoCount} files)`,
  );
}

main();
