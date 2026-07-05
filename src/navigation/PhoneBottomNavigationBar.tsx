import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RoutePath, type RootStackParamList} from '@core/navigation';
import {selectIsLoggedIn} from '@features/auth';
import {MusicMiniPlayerBar, selectHasActiveSession} from '@features/music';
import {selectThemeMode} from '@app/store/appSlice';
import {useAppSelector} from '@app/store/hooks';
import type {StackNavigationProp} from '@react-native-ohos/stack';
import {setMainTabIndex} from '@app/store/mainTabSlice';
import {MainTabIcon} from './mainTabIcons';
import {
  MAIN_TAB_BAR_HEIGHT,
  resolveMainTabBarPalette,
} from './mainTabBarTheme';
import {getMainTabRegistrations} from './mainTabOrder';

export function PhoneBottomNavigationBar({
  state,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const themeMode = useAppSelector(selectThemeMode);
  const systemDark = useColorScheme() === 'dark';
  const palette = resolveMainTabBarPalette(themeMode, systemDark);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const hasMusicSession = useSelector(selectHasActiveSession);
  const rootNavigation =
    useNavigation<StackNavigationProp<RootStackParamList>>();

  const tabs = getMainTabRegistrations();
  const activeTab = tabs[state.index];
  const showMiniPlayer = activeTab?.moduleId === 'home' && hasMusicSession;
  const elevation = showMiniPlayer
    ? palette.elevationWithMiniPlayer
    : palette.elevation;

  const handlePress = (index: number) => {
    const tab = tabs[index];
    if (!tab) {
      return;
    }

    if (tab.requiresAuth && !isLoggedIn) {
      rootNavigation.navigate(RoutePath.login);
      return;
    }

    const route = state.routes[index];
    if (!route) {
      return;
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (event.defaultPrevented) {
      return;
    }

    if (state.index !== index) {
      navigation.navigate(route.name);
    }
    dispatch(setMainTabIndex(index));
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: palette.background,
          paddingBottom: insets.bottom,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOpacity: elevation > 0 ? 0.12 : 0,
              shadowRadius: elevation > 0 ? 12 : 0,
              shadowOffset: {width: 0, height: elevation > 0 ? -2 : 0},
            },
            android: {
              elevation,
            },
            default: {
              elevation,
            },
          }),
        },
      ]}>
      {showMiniPlayer ? <MusicMiniPlayerBar /> : null}
      <View style={styles.bar}>
        {tabs.map((tab, index) => {
          const selected = state.index === index;
          const color = selected ? palette.labelSelected : palette.labelUnselected;
          const iconColor = selected ? palette.iconSelected : palette.iconUnselected;

          return (
            <Pressable
              key={tab.name}
              accessibilityRole="button"
              accessibilityState={selected ? {selected: true} : {}}
              onPress={() => handlePress(index)}
              style={styles.item}>
              <View
                style={[
                  styles.indicator,
                  selected && {backgroundColor: palette.indicator},
                ]}>
                <MainTabIcon
                  icon={tab.icon}
                  selectedIcon={tab.selectedIcon}
                  selected={selected}
                  color={iconColor}
                  size={24}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  {
                    color,
                    fontWeight: selected ? '600' : '400',
                  },
                ]}>
                {t(tab.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  bar: {
    height: MAIN_TAB_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    paddingBottom: 4,
  },
  indicator: {
    width: 64,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
  },
});
