import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {NavigationProp} from '@react-navigation/native';
import {RoutePath, type RootStackParamList} from '@core/navigation';
import {authTextStyles, authTheme} from '../theme/authTheme';

type AuthStackNavigation = NavigationProp<RootStackParamList>;

interface LoginFooterLinksProps {
  navigation: AuthStackNavigation;
}

export function LoginFooterLinks({navigation}: LoginFooterLinksProps) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate(RoutePath.register)}
        style={styles.linkHit}>
        <Text
          style={[
            authTextStyles.caption,
            {color: authTheme.accent, fontWeight: '500'},
          ]}>
          我要注册
        </Text>
      </Pressable>
      <View style={styles.divider} />
      <Pressable
        accessibilityRole="button"
        onPress={() => {}}
        style={styles.linkHit}>
        <Text
          style={[
            authTextStyles.caption,
            {color: authTheme.accent, fontWeight: '500'},
          ]}>
          忘记密码
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkHit: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: authTheme.separator,
    marginHorizontal: 16,
  },
});
