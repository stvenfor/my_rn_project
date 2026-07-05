import {Platform} from 'react-native';
import {
  WebBridgeAssets,
  WebPageConfigFactory,
  WebPageLoadType,
  resolveWebPageConfig,
} from '../webPageConfig';
import {resolveWebViewSource} from '../webViewSource';

describe('webPageConfig', () => {
  it('builds asset config for test bridge', () => {
    const config = WebPageConfigFactory.testBridge({
      params: {from: 'home'},
    });
    expect(config.loadType).toBe(WebPageLoadType.asset);
    expect(config.assetPath).toBe(WebBridgeAssets.testBridge);
    expect(config.params.from).toBe('home');
  });

  it('resolves legacy local.test url to asset test bridge', () => {
    const config = resolveWebPageConfig({
      url: 'https://local.test/',
      params: {feature: '销售顾问'},
    });
    expect(config?.loadType).toBe(WebPageLoadType.asset);
    expect(config?.assetPath).toBe(WebBridgeAssets.testBridge);
    expect(config?.params.feature).toBe('销售顾问');
  });

  it('resolves remote url config', () => {
    const config = resolveWebPageConfig({
      url: 'https://example.com/page',
      title: 'Example',
    });
    expect(config?.loadType).toBe(WebPageLoadType.url);
    expect(config?.url).toBe('https://example.com/page');
  });
});

describe('webViewSource', () => {
  const assetConfig = WebPageConfigFactory.testBridge();

  afterEach(() => {
    Platform.OS = 'ios';
  });

  it('uses android asset uri', () => {
    Platform.OS = 'android';
    expect(resolveWebViewSource(assetConfig)).toEqual({
      uri: 'file:///android_asset/web/test_bridge.html',
    });
  });

  it('uses harmony rawfile uri', () => {
    Platform.OS = 'harmony';
    expect(resolveWebViewSource(assetConfig)).toEqual({
      uri: 'resource://rawfile/web/test_bridge.html',
    });
  });

  it('uses inline html on ios', () => {
    Platform.OS = 'ios';
    const source = resolveWebViewSource(assetConfig);
    expect(source).toHaveProperty('html');
    expect(source).toHaveProperty('baseUrl', 'https://local.test/');
  });
});
