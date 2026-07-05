import type {WebViewSource} from 'react-native-webview/lib/WebViewTypes';
import {getWebAssetHtml} from './webAssetContent';
import {isAndroidOS, isHarmonyOS} from './platform';
import {
  WEB_LOCAL_BASE_URL,
  WebBridgeAssets,
  WebPageLoadType,
  type WebPageConfig,
} from './webPageConfig';

function normalizeAssetFileName(assetPath: string): string {
  return assetPath.replace(/^assets\//, '').replace(/^web\//, '');
}

export function resolveWebViewSource(config: WebPageConfig): WebViewSource {
  if (config.loadType === WebPageLoadType.url && config.url) {
    return {uri: config.url};
  }

  const assetPath = config.assetPath ?? WebBridgeAssets.testBridge;
  const fileName = normalizeAssetFileName(assetPath);

  if (isAndroidOS()) {
    return {uri: `file:///android_asset/web/${fileName}`};
  }

  if (isHarmonyOS()) {
    return {uri: `resource://rawfile/web/${fileName}`};
  }

  return {
    html: getWebAssetHtml(assetPath),
    baseUrl: WEB_LOCAL_BASE_URL,
  };
}
