import React from 'react';
import {StyleSheet} from 'react-native';
import {ScreenContainer} from '@ui/design-system';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {RNWebViewBridge, useCoreBridgeHandlers} from '@core/webview';
import {useWebViewBridgeContext} from '@app/app/webviewBridgeSetup';

export function WebViewScreen({
  route,
}: RootStackScreenProps<typeof RoutePath.web>) {
  const bridgeContext = useWebViewBridgeContext();
  const handleBridge = useCoreBridgeHandlers(bridgeContext);

  return (
    <ScreenContainer style={styles.container}>
      <RNWebViewBridge
        url={route.params?.url}
        routeParams={route.params?.params}
        onBridge={handleBridge}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {padding: 0},
});
