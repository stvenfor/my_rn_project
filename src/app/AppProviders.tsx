import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {initI18n} from '@core/i18n';
import {configureAuthService} from '@core/supabase';
import {configureLinkingService} from '@core/linking';
import {createApiClient} from '@core/api-client';
import {ENV_CONFIGS} from '@core/config';
import {LoadingPortal, ToastPortal} from '@ui/design-system';
import {registerHomeWebHandlers} from '@features/home';
import {initMusicPlayer} from '@features/music';
import {store} from '@app/store';
import {loadEnv} from '@app/store/envSlice';
import {RootNavigator} from '@app/navigation/RootNavigator';
import {useAppDispatch} from '@app/store/hooks';

function AppBootstrap({children}: {children: React.ReactNode}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    initI18n();
    configureAuthService();
    configureLinkingService();
    createApiClient(ENV_CONFIGS.test.baseUrl);
    registerHomeWebHandlers(store.dispatch);
    dispatch(loadEnv());
    dispatch(initMusicPlayer());
  }, [dispatch]);

  return <>{children}</>;
}

export function AppProviders() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <Provider store={store}>
        <SafeAreaProvider>
          <AppBootstrap>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
            <LoadingPortal />
            <ToastPortal />
          </AppBootstrap>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
});
