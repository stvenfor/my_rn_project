import React, {useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useDispatch, useSelector} from 'react-redux';
import type {MainTabParamList} from '@core/navigation';
import {
  selectMainTabSelectedIndex,
  selectMainTabSwitchRevision,
  setMainTabIndex,
} from '@app/store/mainTabSlice';
import {getMainTabComponent, getMainTabRegistrations} from './mainTabRegistry';
import {PhoneBottomNavigationBar} from './PhoneBottomNavigationBar';

const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabControllerSync({
  navigation,
  state,
}: Pick<BottomTabBarProps, 'navigation' | 'state'>) {
  const dispatch = useDispatch();
  const selectedIndex = useSelector(selectMainTabSelectedIndex);
  const switchRevision = useSelector(selectMainTabSwitchRevision);
  const lastHandledRevision = useRef(0);

  useEffect(() => {
    if (switchRevision <= lastHandledRevision.current) {
      return;
    }
    lastHandledRevision.current = switchRevision;
    const tabs = getMainTabRegistrations();
    const target = tabs[selectedIndex];
    if (!target) {
      return;
    }
    if (state.routes[state.index]?.name !== target.name) {
      navigation.navigate(target.name);
    }
  }, [navigation, selectedIndex, state.index, state.routes, switchRevision]);

  useEffect(() => {
    dispatch(setMainTabIndex(state.index));
  }, [dispatch, state.index]);

  return null;
}

function MainTabBar(props: BottomTabBarProps) {
  return (
    <>
      <MainTabControllerSync navigation={props.navigation} state={props.state} />
      <PhoneBottomNavigationBar {...props} />
    </>
  );
}

export function MainTabs() {
  const tabs = getMainTabRegistrations();

  if (tabs.length === 0) {
    return null;
  }

  return (
    <View style={styles.root}>
      <Tab.Navigator
        tabBar={props => <MainTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          lazy: false,
        }}>
        {tabs.map(tab => (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={getMainTabComponent(tab.name)}
          />
        ))}
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
