import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {initI18n} from '@core/i18n';
import {configureAuthService} from '@core/supabase';
import {configureLinkingService} from '@core/linking';
import {bootstrapMediaPickerService} from '@core/media-picker';
import {createApiClient} from '@core/api-client';
import {ENV_CONFIGS} from '@core/config';
import {DialogHost, LoadingPortal, ToastPortal} from '@ui/design-system';
import {registerHomeWebHandlers} from '@features/home';
import {initMusicPlayer} from '@features/music';
import {loadAuthSession} from '@features/auth';
import {store} from '@app/store';
import {loadEnv} from '@app/store/envSlice';
import {useAppDispatch} from '@app/store/hooks';
import {ThemedNavigation} from './ThemedNavigation';

function AppBootstrap({children}: {children: React.ReactNode}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    initI18n();
    configureAuthService();
    configureLinkingService();
    bootstrapMediaPickerService();
    createApiClient(ENV_CONFIGS.test.baseUrl);
    registerHomeWebHandlers(store.dispatch);
    dispatch(loadEnv());
    dispatch(loadAuthSession());
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
            <LoadingPortal />
            <ToastPortal />
            <DialogHost />
            <ThemedNavigation />
          </AppBootstrap>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
});
