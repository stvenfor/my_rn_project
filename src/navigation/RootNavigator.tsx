import React, {useEffect} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {createStackNavigator} from '@react-native-ohos/stack';
import {
  RoutePath,
  type RootStackParamList,
  type RootStackScreenProps,
} from '@core/navigation';
import {supportsSharedElementNavigation} from '@features/music';
import {WebViewScreen} from '@app/screens/WebViewScreen';
import {SettingsScreenContainer} from '@app/screens/SettingsWrappers';
import {
  DebugBleScreen,
  DebugImScreen,
  DebugLinkingScreen,
  DebugRealtimeScreen,
} from '@app/screens/DebugScreens';
import {collectFeatureRoutes} from '@app/config/moduleManifest';
import {MainTabs} from './MainTabs';
import {colors} from '@ui/design-system';

type StackNavigator = ReturnType<
  typeof createStackNavigator<RootStackParamList>
>;

function createRootStackNavigator(): StackNavigator {
  if (supportsSharedElementNavigation) {
    try {
      const createSharedElementStackNavigator =
        require('react-navigation-shared-element')
          .createSharedElementStackNavigator as typeof import('react-navigation-shared-element').createSharedElementStackNavigator;
      return createSharedElementStackNavigator<RootStackParamList>();
    } catch {
      // Fall back when shared-element stack cannot load.
    }
  }
  return createStackNavigator<RootStackParamList>();
}

const Stack = createRootStackNavigator();

function SplashScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.splash>) {
  const {t} = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(RoutePath.main);
    }, 800);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.splash}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.splashText}>{t('splashLoading')}</Text>
    </View>
  );
}

function MainScreen() {
  return (
    <View style={styles.main}>
      <MainTabs />
    </View>
  );
}

const featureRoutes = collectFeatureRoutes();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={RoutePath.splash}>
      <Stack.Screen
        name={RoutePath.splash}
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={RoutePath.main}
        component={MainScreen}
        options={{headerShown: false}}
      />
      {featureRoutes.map(route => (
        <Stack.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          {...(route.sharedElements
            ? {sharedElements: route.sharedElements}
            : {})}
        />
      ))}
      <Stack.Screen
        name={RoutePath.settings}
        component={SettingsScreenContainer}
      />
      <Stack.Screen name={RoutePath.web} component={WebViewScreen} />
      <Stack.Screen name={RoutePath.debugBle} component={DebugBleScreen} />
      <Stack.Screen
        name={RoutePath.debugLinking}
        component={DebugLinkingScreen}
      />
      <Stack.Screen
        name={RoutePath.debugRealtime}
        component={DebugRealtimeScreen}
      />
      <Stack.Screen name={RoutePath.debugIm} component={DebugImScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  splash: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  splashText: {marginTop: 16, color: colors.textSecondary},
  main: {flex: 1},
});
