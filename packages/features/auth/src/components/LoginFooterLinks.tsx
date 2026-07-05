import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {NavigationProp} from '@react-navigation/native';
import {RoutePath, type RootStackParamList} from '@core/navigation';
import {authTheme} from '../theme/authTheme';

type AuthStackNavigation = NavigationProp<RootStackParamList>;

interface LoginFooterLinksProps {
  navigation: AuthStackNavigation;
}

export function LoginFooterLinks({navigation}: LoginFooterLinksProps) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate(RoutePath.register)}>
        <Text style={styles.link}>我要注册</Text>
      </Pressable>
      <View style={styles.divider} />
      <Pressable accessibilityRole="button" onPress={() => {}}>
        <Text style={styles.link}>忘记密码</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  link: {
    fontSize: 13,
    color: authTheme.linkGray,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: authTheme.dividerGray,
    marginHorizontal: 8,
  },
});
