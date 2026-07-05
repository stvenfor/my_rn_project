import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import type {WebViewMessageEvent} from 'react-native-webview';
import type WebView from 'react-native-webview';
import {
  buildBridgeErrorScript,
  buildBridgeResponseScript,
  buildParamsInjectionScript,
  BRIDGE_INJECTION,
} from './bridgeInjection';
import {type BridgeHandler, type BridgeMessage} from './bridgeActions';
import {getNativeWebViewComponent} from './webViewComponent';
import {
  WebPageConfigFactory,
  type WebPageConfig,
} from './webPageConfig';
import {resolveWebViewSource} from './webViewSource';

export interface RNWebViewBridgeProps {
  config?: WebPageConfig | null;
  /** @deprecated use config instead */
  url?: string;
  /** @deprecated use config.params instead */
  routeParams?: Record<string, unknown>;
  onBridge: BridgeHandler;
  style?: ViewStyle;
}

export function RNWebViewBridge({
  config,
  url,
  routeParams,
  onBridge,
  style,
}: RNWebViewBridgeProps) {
  const WebViewComponent = getNativeWebViewComponent() as typeof WebView;
  const webViewRef = useRef<WebView>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const pageConfig = useMemo(() => {
    if (config) {
      return config;
    }
    if (url) {
      return WebPageConfigFactory.url({url, params: routeParams});
    }
    return WebPageConfigFactory.testBridge({params: routeParams});
  }, [config, routeParams, url]);

  const source = useMemo(
    () => resolveWebViewSource(pageConfig),
    [pageConfig, reloadKey],
  );

  const injectedBeforeLoad = useMemo(() => {
    const paramsScript = buildParamsInjectionScript(pageConfig.params);
    if (pageConfig.bridgeScriptAssetPath) {
      return `${paramsScript}\n${BRIDGE_INJECTION}`;
    }
    return paramsScript;
  }, [pageConfig.bridgeScriptAssetPath, pageConfig.params]);

  const onMessage = useCallback(
    async (event: WebViewMessageEvent) => {
      try {
        const message = JSON.parse(event.nativeEvent.data) as BridgeMessage;
        if (!message.action || !message.callbackId) {
          return;
        }
        const result = await onBridge(message.action, message.payload);
        webViewRef.current?.injectJavaScript(
          buildBridgeResponseScript(message.callbackId, result),
        );
      } catch (bridgeError) {
        const fallback = event.nativeEvent.data;
        try {
          const message = JSON.parse(fallback) as BridgeMessage;
          if (message.callbackId) {
            webViewRef.current?.injectJavaScript(
              buildBridgeErrorScript(
                message.callbackId,
                bridgeError instanceof Error
                  ? bridgeError.message
                  : 'bridge error',
              ),
            );
          }
        } catch {
          // ignore malformed messages
        }
      }
    },
    [onBridge],
  );

  const onRetry = useCallback(() => {
    setError(null);
    setProgress(0);
    setReloadKey(key => key + 1);
  }, []);

  if (error) {
    return (
      <View style={[styles.errorWrap, style]}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>重试</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {progress > 0 && progress < 1 ? (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, {flex: progress}]} />
          <View style={{flex: 1 - progress}} />
        </View>
      ) : null}
      <WebViewComponent
        key={reloadKey}
        ref={webViewRef}
        source={source}
        injectedJavaScriptBeforeContentLoaded={injectedBeforeLoad}
        onMessage={onMessage}
        javaScriptEnabled={pageConfig.enableJavaScript}
        domStorageEnabled
        originWhitelist={['*']}
        allowFileAccess
        allowFileAccessFromFileURLs
        allowUniversalAccessFromFileURLs
        startInLoadingState
        onLoadProgress={({nativeEvent}) => {
          setProgress(nativeEvent.progress);
        }}
        onError={({nativeEvent}) => {
          setError(nativeEvent.description || '页面加载失败');
        }}
        onHttpError={({nativeEvent}) => {
          if (nativeEvent.statusCode >= 400) {
            setError(`HTTP ${nativeEvent.statusCode}`);
          }
        }}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
          </View>
        )}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  webview: {flex: 1},
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    flexDirection: 'row',
    height: 2,
    backgroundColor: '#e2e8f0',
  },
  progressFill: {
    backgroundColor: '#2563eb',
  },
  errorWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  errorText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
