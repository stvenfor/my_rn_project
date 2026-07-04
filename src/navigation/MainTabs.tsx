import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {RoutePath, type MainTabParamList} from '@core/navigation';
import {selectIsLoggedIn} from '@features/auth';
import {HomeScreen} from '@features/home';
import {ChatScreen} from '@features/chat';
import {CommunityScreen} from '@features/community';
import {MineScreenContainer} from '@app/screens/SettingsWrappers';
import {useAppSelector} from '@app/store/hooks';
import type {StackNavigationProp} from '@react-native-ohos/stack';
import type {RootStackParamList} from '@core/navigation';

import {createAuthTabListener} from './authGuard';

const Tab = createBottomTabNavigator<MainTabParamList>();

function useAuthTabListener() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  return createAuthTabListener(isLoggedIn, () =>
    navigation.navigate(RoutePath.login),
  );
}

export function MainTabs() {
  const {t} = useTranslation();
  const authListener = useAuthTabListener();

  return (
    <Tab.Navigator screenOptions={{headerShown: true}}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{title: t('tabHome')}}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatScreen}
        options={{title: t('tabChat')}}
        listeners={authListener}
      />
      <Tab.Screen
        name="CommunityTab"
        component={CommunityScreen}
        options={{title: t('tabCommunity')}}
        listeners={authListener}
      />
      <Tab.Screen
        name="MineTab"
        component={MineScreenContainer}
        options={{title: t('tabMine')}}
      />
    </Tab.Navigator>
  );
}
