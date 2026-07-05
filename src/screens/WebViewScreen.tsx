import React, {useMemo} from 'react';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {AppNavBar, AppPageScaffold} from '@ui/design-system';
import {
  RNWebViewBridge,
  resolveWebPageConfig,
  useCoreBridgeHandlers,
  type WebRouteParams,
} from '@core/webview';
import {useWebViewBridgeContext} from '@app/app/webviewBridgeSetup';

export function WebViewScreen({
  route,
  navigation,
}: RootStackScreenProps<typeof RoutePath.web>) {
  const bridgeContext = useWebViewBridgeContext();
  const handleBridge = useCoreBridgeHandlers(bridgeContext);
  const config = useMemo(
    () => resolveWebPageConfig(route.params as WebRouteParams | undefined),
    [route.params],
  );

  return (
    <AppPageScaffold
      navBar={
        config?.showAppBar !== false ? (
          <AppNavBar
            title={config?.title ?? route.params?.title ?? '网页'}
            showBackButton={config?.showBackButton !== false}
            onBack={() => navigation.goBack()}
          />
        ) : undefined
      }>
      <RNWebViewBridge config={config} onBridge={handleBridge} />
    </AppPageScaffold>
  );
}
