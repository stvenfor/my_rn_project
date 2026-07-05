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

/**
 * @type {import("metro-config").MetroConfig}
 */
const config = {
  watchFolders: monorepoRoots,
  resolver: {
    nodeModulesPaths: [path.resolve(projectRoot, 'node_modules')],
    resolveRequest: (context, moduleName, platform) => {
      if (platform === 'harmony') {
        if (moduleName === '@react-navigation/stack') {
          return context.resolveRequest(context, ohosStackPath, platform);
        }
        return context.resolveRequest(context, moduleName, platform);
      }

      if (
        moduleName === '@react-native-ohos/stack' &&
        (platform === 'ios' || platform === 'android')
      ) {
        return context.resolveRequest(
          context,
          '@react-navigation/stack',
          platform,
        );
      }

      return context.resolveRequest(context, moduleName, platform);
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
  createHarmonyMetroConfig({
    reactNativeHarmonyPackageName: '@react-native-oh/react-native-harmony',
  }),
  config,
);
