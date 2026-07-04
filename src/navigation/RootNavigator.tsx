import React, {useEffect} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {createStackNavigator} from '@react-native-ohos/stack';
import {
  RoutePath,
  type RootStackParamList,
  type RootStackScreenProps,
} from '@core/navigation';
import {MusicMiniPlayerBar} from '@features/music';
import {WebViewScreen} from '@app/screens/WebViewScreen';
import {ImagePreviewScreen} from '@app/screens/ImagePreviewScreen';
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

const Stack = createStackNavigator<RootStackParamList>();

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
      <View style={styles.mainContent}>
        <MainTabs />
      </View>
      <MusicMiniPlayerBar />
    </View>
  );
}

const featureRoutes = collectFeatureRoutes();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: true}}
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
        />
      ))}
      <Stack.Screen
        name={RoutePath.settings}
        component={SettingsScreenContainer}
      />
      <Stack.Screen name={RoutePath.web} component={WebViewScreen} />
      <Stack.Screen
        name={RoutePath.imagePreview}
        component={ImagePreviewScreen}
      />
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
  mainContent: {flex: 1},
});
