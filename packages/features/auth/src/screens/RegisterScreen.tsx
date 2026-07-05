import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppNavBar, AppPageScaffold} from '@ui/design-system';
import {RegisterEmailForm} from '../components/RegisterEmailForm';
import {RegisterPhoneForm} from '../components/RegisterPhoneForm';
import {authTheme} from '../theme/authTheme';

type RegisterTab = 'email' | 'phone';

export function RegisterScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.register>) {
  const [activeTab, setActiveTab] = useState<RegisterTab>('email');

  return (
    <AppPageScaffold backgroundColor={authTheme.screenBackground}>
      <AppNavBar
        title="注册"
        showBackButton
        onBack={() => navigation.goBack()}
        backgroundColor={authTheme.screenBackground}
        foregroundColor={authTheme.titleBlack}
      />
      <View style={styles.tabBar}>
        <Pressable
          accessibilityRole="tab"
          style={styles.tab}
          onPress={() => setActiveTab('email')}>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'email' && styles.tabLabelActive,
            ]}>
            邮箱注册
          </Text>
          {activeTab === 'email' ? <View style={styles.indicator} /> : null}
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          style={styles.tab}
          onPress={() => setActiveTab('phone')}>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'phone' && styles.tabLabelActive,
            ]}>
            手机注册
          </Text>
          {activeTab === 'phone' ? <View style={styles.indicator} /> : null}
        </Pressable>
      </View>
      {activeTab === 'email' ? (
        <RegisterEmailForm navigation={navigation} bottomInset={0} />
      ) : (
        <RegisterPhoneForm navigation={navigation} bottomInset={0} />
      )}
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: authTheme.dividerGray,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabLabel: {
    fontSize: 15,
    color: authTheme.textGray,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: authTheme.primaryBlue,
    fontWeight: '600',
  },
  indicator: {
    marginTop: 8,
    width: 24,
    height: 2,
    borderRadius: 1,
    backgroundColor: authTheme.primaryBlue,
  },
});
