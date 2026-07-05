import type {ComponentType} from 'react';
import type {WebViewProps} from 'react-native-webview';
import {isHarmonyOS} from './platform';

type WebViewComponent = ComponentType<WebViewProps>;

export function getNativeWebViewComponent(): WebViewComponent {
  if (isHarmonyOS()) {
    return require('@react-native-ohos/react-native-webview')
      .default as WebViewComponent;
  }
  return require('react-native-webview').default as WebViewComponent;
}
