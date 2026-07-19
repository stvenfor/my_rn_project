import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ENV_CONFIGS} from '@core/config';
import type {AppEnv} from '@core/domain';
import {RoutePath} from '@core/navigation';
import {useTheme} from '@react-navigation/native';
import {AppNavBar, AppPageScaffold, AppToast} from '@ui/design-system';
import {MineIcon} from '../components/mineIcons';
import type {SettingsScreenProps} from '../types';

export type {SettingsScreenProps};

export function SettingsScreen({
  navigation,
  currentEnv,
  themeMode,
  locale,
  onSetEnv,
  onSetLocale,
  onToggleTheme,
}: SettingsScreenProps) {
  const insets = useSafeAreaInsets();
  const navTheme = useTheme();
  const isDark = navTheme.dark;
  const envConfig = ENV_CONFIGS[currentEnv];

  const [envPickerVisible, setEnvPickerVisible] = useState(false);
  const [languagePickerVisible, setLanguagePickerVisible] = useState(false);

  const handleSetEnv = (env: AppEnv) => {
    onSetEnv(env);
    setEnvPickerVisible(false);
    const cfg = ENV_CONFIGS[env];
    AppToast.show(`环境已切换：${cfg.label} · ${cfg.baseUrl}`);
  };

  const titleColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const subtitleColor = isDark ? '#8E8E93' : '#666666';
  const rowBorder = isDark ? '#38383A' : '#F0F0F0';
  const pageBg = navTheme.colors.background;
  const cardBg = navTheme.colors.card;

  return (
    <AppPageScaffold
      backgroundColor={pageBg}
      navBar={
        <AppNavBar
          title="设置"
          showBackButton
          backgroundColor={cardBg}
          foregroundColor={titleColor}
          onBack={() => navigation.goBack()}
        />
      }>
      <ScrollView
        style={{backgroundColor: pageBg}}
        contentContainerStyle={{paddingBottom: insets.bottom + 24}}>
        <SettingsRow
          title="运行环境"
          subtitle={`${envConfig.label} · ${envConfig.baseUrl}`}
          onPress={() => setEnvPickerVisible(true)}
          showChevron
          titleColor={titleColor}
          subtitleColor={subtitleColor}
          borderColor={rowBorder}
        />
        <View style={[styles.switchRow, {borderBottomColor: rowBorder}]}>
          <View style={styles.switchText}>
            <Text style={[styles.rowTitle, {color: titleColor}]}>深色模式</Text>
            <Text style={[styles.rowSubtitle, {color: subtitleColor}]}>
              切换浅色 / 深色主题
            </Text>
          </View>
          <Switch
            value={themeMode === 'dark'}
            onValueChange={onToggleTheme}
            trackColor={{false: '#E5E5EA', true: '#34C759'}}
            thumbColor="#FFFFFF"
          />
        </View>
        <SettingsRow
          title="语言"
          subtitle={locale === 'en' ? 'English' : '简体中文'}
          onPress={() => setLanguagePickerVisible(true)}
          showChevron
          titleColor={titleColor}
          subtitleColor={subtitleColor}
          borderColor={rowBorder}
        />
        <SettingsRow
          title="蓝牙连接示例"
          subtitle="BLE 扫描、连接、服务发现"
          onPress={() => navigation.navigate(RoutePath.debugBle)}
          showChevron
          titleColor={titleColor}
          subtitleColor={subtitleColor}
          borderColor={rowBorder}
        />
        <SettingsRow
          title="新车成交示例"
          subtitle="悬浮 Tab、下拉刷新、上拉加载更多"
          onPress={() => navigation.navigate(RoutePath.dealInvoiceDemo)}
          showChevron
          titleColor={titleColor}
          subtitleColor={subtitleColor}
          borderColor={rowBorder}
        />

        {__DEV__ ? (
          <>
            <Text style={[styles.debugHeader, {color: subtitleColor}]}>
              开发调试
            </Text>
            <SettingsRow
              title="弹框调度示例"
              subtitle="样式、优先级队列、清空/取消待展示"
              onPress={() => navigation.navigate(RoutePath.dialogDemo)}
              showChevron
              titleColor={titleColor}
              subtitleColor={subtitleColor}
              borderColor={rowBorder}
            />
            <SettingsRow
              title="链接与推送调试"
              subtitle="Mock Deeplink / 前台 Push Banner"
              onPress={() => navigation.navigate(RoutePath.debugLinking)}
              showChevron
              titleColor={titleColor}
              subtitleColor={subtitleColor}
              borderColor={rowBorder}
            />
            <SettingsRow
              title="Realtime / WebSocket 调试"
              subtitle="连接状态、Mock 信令、离线队列"
              onPress={() => navigation.navigate(RoutePath.debugRealtime)}
              showChevron
              titleColor={titleColor}
              subtitleColor={subtitleColor}
              borderColor={rowBorder}
            />
            <SettingsRow
              title="融云 IM 调试"
              subtitle="imUserId、连接态、备份队列"
              onPress={() => navigation.navigate(RoutePath.debugIm)}
              showChevron
              titleColor={titleColor}
              subtitleColor={subtitleColor}
              borderColor={rowBorder}
            />
          </>
        ) : null}
      </ScrollView>

      <PickerSheet
        visible={envPickerVisible}
        onClose={() => setEnvPickerVisible(false)}>
        {(Object.keys(ENV_CONFIGS) as AppEnv[]).map(env => (
          <PickerOption
            key={env}
            title={ENV_CONFIGS[env].label}
            subtitle={ENV_CONFIGS[env].baseUrl}
            selected={currentEnv === env}
            onPress={() => handleSetEnv(env)}
          />
        ))}
      </PickerSheet>

      <PickerSheet
        visible={languagePickerVisible}
        onClose={() => setLanguagePickerVisible(false)}>
        <PickerOption
          title="简体中文"
          onPress={() => {
            onSetLocale('zh');
            setLanguagePickerVisible(false);
          }}
        />
        <PickerOption
          title="English"
          onPress={() => {
            onSetLocale('en');
            setLanguagePickerVisible(false);
          }}
        />
      </PickerSheet>
    </AppPageScaffold>
  );
}

function SettingsRow({
  title,
  subtitle,
  onPress,
  showChevron,
  titleColor,
  subtitleColor,
  borderColor,
}: {
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  titleColor: string;
  subtitleColor: string;
  borderColor: string;
}) {
  return (
    <TouchableOpacity
      style={[styles.row, {borderBottomColor: borderColor}]}
      onPress={onPress}>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, {color: titleColor}]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.rowSubtitle, {color: subtitleColor}]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {showChevron ? (
        <MineIcon name="chevron_right_rounded" color="#C7C7CC" size={18} />
      ) : null}
    </TouchableOpacity>
  );
}

function PickerSheet({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable style={styles.sheetMask} onPress={onClose}>
        <Pressable
          style={[styles.sheet, {paddingBottom: Math.max(insets.bottom, 12)}]}
          onPress={() => {}}>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function PickerOption({
  title,
  subtitle,
  selected,
  onPress,
}: {
  title: string;
  subtitle?: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.pickerOption} onPress={onPress}>
      <View style={styles.pickerText}>
        <Text style={styles.pickerTitle}>{title}</Text>
        {subtitle ? (
          <Text style={styles.pickerSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
      {selected ? (
        <MineIcon name="check_rounded" color="#007AFF" size={20} />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
  },
  rowSubtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  switchText: {
    flex: 1,
    paddingRight: 12,
  },
  debugHeader: {
    marginTop: 24,
    marginBottom: 4,
    paddingHorizontal: 16,
    fontSize: 13,
    fontWeight: '600',
  },
  sheetMask: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingTop: 8,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pickerText: {
    flex: 1,
  },
  pickerTitle: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  pickerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#666666',
  },
});
