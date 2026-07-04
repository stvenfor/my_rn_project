import React, {useCallback, useMemo, useRef} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import {WebView, type WebViewMessageEvent} from 'react-native-webview';
import {
  BRIDGE_INJECTION,
  buildBridgeErrorScript,
  buildBridgeResponseScript,
} from './bridgeInjection';
import {type BridgeHandler, type BridgeMessage} from './bridgeActions';
import {WEB_BRIDGE_TEST_BASE_URL, WEB_BRIDGE_TEST_HTML} from './testBridgeHtml';

export interface RNWebViewBridgeProps {
  url?: string;
  routeParams?: Record<string, unknown>;
  onBridge: BridgeHandler;
  style?: ViewStyle;
}

export function RNWebViewBridge({
  url,
  routeParams,
  onBridge,
  style,
}: RNWebViewBridgeProps) {
  const webViewRef = useRef<WebView>(null);

  const source = useMemo(() => {
    if (url && url !== 'about:blank') {
      return {uri: url};
    }
    return {html: WEB_BRIDGE_TEST_HTML, baseUrl: WEB_BRIDGE_TEST_BASE_URL};
  }, [url]);

  const injectedBeforeLoad = useMemo(() => {
    const paramsScript = `window.__RN_PARAMS__ = ${JSON.stringify(
      routeParams ?? {},
    )};`;
    return `${paramsScript}\n${BRIDGE_INJECTION}`;
  }, [routeParams]);

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
      } catch (error) {
        const fallback = event.nativeEvent.data;
        try {
          const message = JSON.parse(fallback) as BridgeMessage;
          if (message.callbackId) {
            webViewRef.current?.injectJavaScript(
              buildBridgeErrorScript(
                message.callbackId,
                error instanceof Error ? error.message : 'bridge error',
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

  return (
    <WebView
      ref={webViewRef}
      source={source}
      injectedJavaScriptBeforeContentLoaded={injectedBeforeLoad}
      onMessage={onMessage}
      javaScriptEnabled
      domStorageEnabled
      startInLoadingState
      renderLoading={() => (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )}
      style={[styles.webview, style]}
    />
  );
}

const styles = StyleSheet.create({
  webview: {flex: 1},
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
