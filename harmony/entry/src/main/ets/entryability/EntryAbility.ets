/**
 * Copyright (c) 2025 Huawei Technologies Co., Ltd.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


import {RNAbility} from '@rnoh/react-native-openharmony';
import window from '@ohos.window';

export default class EntryAbility extends RNAbility {
  override getPagePath() {
    return 'pages/Index';
  }

  /**
   * Keep full-screen layout (required by RNOH SafeArea) and make system bars
   * transparent so page backgrounds paint under the status bar.
   */
  protected async onWindowSetup(mainWindow: window.Window) {
    await mainWindow.setWindowLayoutFullScreen(true);
    await mainWindow.setWindowSystemBarProperties({
      statusBarColor: '#00000000',
      navigationBarColor: '#00000000',
      statusBarContentColor: '#000000',
    });
  }
}
