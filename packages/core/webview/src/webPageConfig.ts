export enum WebPageLoadType {
  asset = 'asset',
  url = 'url',
}

export const WebBridgeAssets = {
  testBridge: 'assets/web/test_bridge.html',
  icsAppInjection: 'assets/web/ICSAPPInjection.js',
} as const;

export interface WebPageConfig {
  loadType: WebPageLoadType;
  assetPath?: string;
  url?: string;
  title?: string;
  params: Record<string, unknown>;
  bridgeScriptAssetPath?: string | null;
  enableJavaScript: boolean;
  showAppBar: boolean;
  showBackButton: boolean;
}

export const WEB_LOCAL_BASE_URL = 'https://local.test/';

function createConfig(
  partial: Partial<WebPageConfig> & Pick<WebPageConfig, 'loadType'>,
): WebPageConfig {
  return {
    loadType: partial.loadType,
    assetPath: partial.assetPath,
    url: partial.url,
    title: partial.title,
    params: partial.params ?? {},
    bridgeScriptAssetPath:
      partial.bridgeScriptAssetPath ?? WebBridgeAssets.icsAppInjection,
    enableJavaScript: partial.enableJavaScript ?? true,
    showAppBar: partial.showAppBar ?? true,
    showBackButton: partial.showBackButton ?? true,
  };
}

export const WebPageConfigFactory = {
  asset(options: {
    assetPath: string;
    title?: string;
    params?: Record<string, unknown>;
    bridgeScriptAssetPath?: string | null;
    enableJavaScript?: boolean;
    showAppBar?: boolean;
    showBackButton?: boolean;
  }): WebPageConfig {
    return createConfig({
      loadType: WebPageLoadType.asset,
      assetPath: options.assetPath,
      title: options.title,
      params: options.params,
      bridgeScriptAssetPath:
        options.bridgeScriptAssetPath === undefined
          ? WebBridgeAssets.icsAppInjection
          : options.bridgeScriptAssetPath,
      enableJavaScript: options.enableJavaScript ?? true,
      showAppBar: options.showAppBar ?? true,
      showBackButton: options.showBackButton ?? true,
    });
  },

  url(options: {
    url: string;
    title?: string;
    params?: Record<string, unknown>;
    bridgeScriptAssetPath?: string | null;
    enableJavaScript?: boolean;
    showAppBar?: boolean;
    showBackButton?: boolean;
  }): WebPageConfig {
    return createConfig({
      loadType: WebPageLoadType.url,
      url: options.url,
      title: options.title,
      params: options.params,
      bridgeScriptAssetPath:
        options.bridgeScriptAssetPath === undefined
          ? WebBridgeAssets.icsAppInjection
          : options.bridgeScriptAssetPath,
      enableJavaScript: options.enableJavaScript ?? true,
      showAppBar: options.showAppBar ?? true,
      showBackButton: options.showBackButton ?? true,
    });
  },

  testBridge(options?: {
    title?: string;
    params?: Record<string, unknown>;
  }): WebPageConfig {
    return WebPageConfigFactory.asset({
      assetPath: WebBridgeAssets.testBridge,
      title: options?.title ?? 'Web 桥接测试',
      params: options?.params,
    });
  },
};

export type WebRouteParams = {
  title?: string;
  url?: string;
  params?: Record<string, unknown>;
  loadType?: WebPageLoadType;
  assetPath?: string;
  bridgeScriptAssetPath?: string | null;
  enableJavaScript?: boolean;
  showAppBar?: boolean;
  showBackButton?: boolean;
};

export function resolveWebPageConfig(
  routeParams?: WebRouteParams | null,
): WebPageConfig | null {
  if (!routeParams) {
    return WebPageConfigFactory.testBridge();
  }

  if (
    routeParams.loadType === WebPageLoadType.asset ||
    routeParams.assetPath
  ) {
    return WebPageConfigFactory.asset({
      assetPath: routeParams.assetPath ?? WebBridgeAssets.testBridge,
      title: routeParams.title,
      params: routeParams.params,
      bridgeScriptAssetPath: routeParams.bridgeScriptAssetPath,
      enableJavaScript: routeParams.enableJavaScript,
      showAppBar: routeParams.showAppBar,
      showBackButton: routeParams.showBackButton,
    });
  }

  if (routeParams.url && routeParams.url !== WEB_LOCAL_BASE_URL) {
    return WebPageConfigFactory.url({
      url: routeParams.url,
      title: routeParams.title,
      params: routeParams.params,
      bridgeScriptAssetPath: routeParams.bridgeScriptAssetPath,
      enableJavaScript: routeParams.enableJavaScript,
      showAppBar: routeParams.showAppBar,
      showBackButton: routeParams.showBackButton,
    });
  }

  if (routeParams.url === WEB_LOCAL_BASE_URL || routeParams.params) {
    return WebPageConfigFactory.testBridge({
      title: routeParams.title,
      params: routeParams.params,
    });
  }

  return WebPageConfigFactory.testBridge({
    title: routeParams.title,
    params: routeParams.params,
  });
}
