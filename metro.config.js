/**
 * Copyright (c) 2025 Huawei Technologies Co., Ltd.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const {mergeConfig, getDefaultConfig} = require('@react-native/metro-config');
const {
  createHarmonyMetroConfig,
} = require('@react-native-oh/react-native-harmony/metro.config');

const projectRoot = __dirname;
const monorepoRoots = [path.resolve(projectRoot, 'packages')];
const ohosStackPath = path.resolve(
  projectRoot,
  'node_modules/@react-native-ohos/stack',
);

const harmonyConfig = createHarmonyMetroConfig({
  reactNativeHarmonyPackageName: '@react-native-oh/react-native-harmony',
});
const harmonyResolveRequest = harmonyConfig.resolver?.resolveRequest;

function resolveOrThrow(context, moduleName, platform) {
  return context.resolveRequest(context, moduleName, platform);
}

/**
 * Harmony often lacks `.harmony.*` platform files. When resolution fails,
 * fall back to the iOS implementation (same strategy RNOH uses for RN core).
 */
function resolveWithHarmonyIosFallback(context, moduleName, platform) {
  if (platform !== 'harmony') {
    if (typeof harmonyResolveRequest === 'function') {
      return harmonyResolveRequest(context, moduleName, platform);
    }
    return resolveOrThrow(context, moduleName, platform);
  }

  try {
    if (typeof harmonyResolveRequest === 'function') {
      return harmonyResolveRequest(context, moduleName, platform);
    }
    return resolveOrThrow(context, moduleName, platform);
  } catch (harmonyError) {
    try {
      return resolveOrThrow(context, moduleName, 'ios');
    } catch (_iosError) {
      throw harmonyError;
    }
  }
}

/**
 * @type {import("metro-config").MetroConfig}
 */
const config = {
  watchFolders: monorepoRoots,
  resolver: {
    nodeModulesPaths: [path.resolve(projectRoot, 'node_modules')],
    resolveRequest: (context, moduleName, platform) => {
      if (platform === 'harmony' && moduleName === '@react-navigation/stack') {
        return resolveWithHarmonyIosFallback(context, ohosStackPath, platform);
      }

      if (
        moduleName === '@react-native-ohos/stack' &&
        (platform === 'ios' || platform === 'android')
      ) {
        return resolveOrThrow(context, '@react-navigation/stack', platform);
      }

      return resolveWithHarmonyIosFallback(context, moduleName, platform);
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(
  getDefaultConfig(projectRoot),
  harmonyConfig,
  config,
);
