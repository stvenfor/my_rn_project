import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
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
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppNavBar, AppPageScaffold, AppToast, colors} from '@ui/design-system';
import {personalizedSettingsIcons} from '../assets/settingsAssets';
import {
  DEFAULT_PERSONALIZED_SETTINGS,
  EYE_PROTECTION_OPTIONS,
  loadPersonalizedSettings,
  persistEyeProtectionMode,
  persistPersonalizedBool,
  type EyeProtectionMode,
  type PersonalizedSettingsState,
} from '../services/personalizedSettingsRepository';

type Props = RootStackScreenProps<typeof RoutePath.personalizedSettings>;

const PAGE_BG = '#F5F5F5';
const TITLE_COLOR = '#333333';
const SECTION_COLOR = '#999999';
const VALUE_COLOR = '#666666';
const DIVIDER_COLOR = '#EEEEEE';

export function PersonalizedSettingsScreen({navigation}: Props) {
  const insets = useSafeAreaInsets();
  const [state, setState] = useState<PersonalizedSettingsState>(
    DEFAULT_PERSONALIZED_SETTINGS,
  );
  const [eyePickerVisible, setEyePickerVisible] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadPersonalizedSettings().then(next => {
      if (mounted) {
        setState(next);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const showHelp = useCallback((title: string) => {
    AppToast.show(`${title}：功能说明开发中`);
  }, []);

  const setBool = useCallback(
    async (
      key: keyof Omit<PersonalizedSettingsState, 'eyeProtectionMode'>,
      value: boolean,
    ) => {
      setState(prev => ({...prev, [key]: value}));
      await persistPersonalizedBool(key, value);
    },
    [],
  );

  const setEyeMode = useCallback(async (value: EyeProtectionMode) => {
    setState(prev => ({...prev, eyeProtectionMode: value}));
    setEyePickerVisible(false);
    await persistEyeProtectionMode(value);
  }, []);

  return (
    <AppPageScaffold
      backgroundColor={PAGE_BG}
      navBar={
        <AppNavBar
          title="个性化设置"
          showBackButton
          backgroundColor="#FFFFFF"
          foregroundColor={TITLE_COLOR}
          onBack={() => navigation.goBack()}
        />
      }>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {paddingBottom: insets.bottom + 24},
        ]}
        showsVerticalScrollIndicator={false}>
        <SettingsCard>
          <NavTile
            title="装扮中心"
            onPress={() => AppToast.show('装扮中心（开发中）')}
          />
        </SettingsCard>

        <SectionHeader label="模式选择" />
        <SettingsCard>
          <NavTile
            title="护眼模式"
            showHelp
            onHelpPress={() => showHelp('护眼模式')}
            trailingText={state.eyeProtectionMode}
            onPress={() => setEyePickerVisible(true)}
          />
          <RowDivider />
          <SwitchTile
            title="教学模式"
            showHelp
            onHelpPress={() => showHelp('教学模式')}
            value={state.teachingMode}
            onValueChange={v => setBool('teachingMode', v)}
          />
        </SettingsCard>

        <SectionHeader label="个性化设置" />
        <SettingsCard>
          <SwitchTile
            title="个性化内容推荐"
            showHelp
            onHelpPress={() => showHelp('个性化内容推荐')}
            value={state.contentRecommendation}
            onValueChange={v => setBool('contentRecommendation', v)}
          />
          <RowDivider />
          <SwitchTile
            title="个性化广告推荐"
            showHelp
            onHelpPress={() => showHelp('个性化广告推荐')}
            value={state.adRecommendation}
            onValueChange={v => setBool('adRecommendation', v)}
          />
          <RowDivider />
          <SwitchTile
            title="口语评分"
            value={state.oralScoring}
            onValueChange={v => setBool('oralScoring', v)}
          />
          <RowDivider />
          <SwitchTile
            title="2/3/4/5G 流量播放视频时提醒我"
            value={state.cellularVideoReminder}
            onValueChange={v => setBool('cellularVideoReminder', v)}
          />
          <RowDivider />
          <SwitchTile
            title="作品上传状态监控"
            value={state.uploadStatusMonitor}
            onValueChange={v => setBool('uploadStatusMonitor', v)}
          />
        </SettingsCard>
      </ScrollView>

      <Modal
        transparent
        visible={eyePickerVisible}
        animationType="slide"
        onRequestClose={() => setEyePickerVisible(false)}>
        <View style={styles.sheetRoot}>
          <Pressable
            style={styles.sheetBackdrop}
            onPress={() => setEyePickerVisible(false)}
          />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>护眼模式</Text>
            {EYE_PROTECTION_OPTIONS.map(option => (
              <TouchableOpacity
                key={option}
                style={styles.sheetRow}
                activeOpacity={0.7}
                onPress={() => setEyeMode(option)}>
                <Text style={styles.sheetRowText}>{option}</Text>
                {option === state.eyeProtectionMode ? (
                  <Text style={styles.sheetCheck}>✓</Text>
                ) : null}
              </TouchableOpacity>
            ))}
            <View style={{height: Math.max(insets.bottom, 8)}} />
          </View>
        </View>
      </Modal>
    </AppPageScaffold>
  );
}

function SectionHeader({label}: {label: string}) {
  return <Text style={styles.sectionHeader}>{label}</Text>;
}

function SettingsCard({children}: {children: React.ReactNode}) {
  return <View style={styles.card}>{children}</View>;
}

function RowDivider() {
  return <View style={styles.divider} />;
}

function TitleRow({
  title,
  showHelp,
  onHelpPress,
}: {
  title: string;
  showHelp?: boolean;
  onHelpPress?: () => void;
}) {
  return (
    <View style={styles.titleRow}>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      {showHelp ? (
        <TouchableOpacity
          onPress={onHelpPress}
          hitSlop={8}
          style={styles.helpBtn}>
          <Image
            source={personalizedSettingsIcons.help_circle}
            style={styles.helpIcon}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function NavTile({
  title,
  showHelp,
  onHelpPress,
  trailingText,
  onPress,
}: {
  title: string;
  showHelp?: boolean;
  onHelpPress?: () => void;
  trailingText?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.navTile}
      activeOpacity={0.7}
      onPress={onPress}>
      <View style={styles.navTitleWrap}>
        <TitleRow
          title={title}
          showHelp={showHelp}
          onHelpPress={onHelpPress}
        />
      </View>
      {trailingText ? (
        <Text style={styles.trailingText}>{trailingText}</Text>
      ) : null}
      <Image
        source={personalizedSettingsIcons.chevron_right}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
}

function SwitchTile({
  title,
  showHelp,
  onHelpPress,
  value,
  onValueChange,
}: {
  title: string;
  showHelp?: boolean;
  onHelpPress?: () => void;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.switchTile}>
      <View style={styles.switchTitleWrap}>
        <TitleRow
          title={title}
          showHelp={showHelp}
          onHelpPress={onHelpPress}
        />
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{false: '#E5E5EA', true: colors.primary}}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 8,
    marginHorizontal: 4,
    fontSize: 13,
    color: SECTION_COLOR,
    lineHeight: 17,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: DIVIDER_COLOR,
    marginLeft: 16,
  },
  navTile: {
    minHeight: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navTitleWrap: {
    flex: 1,
  },
  trailingText: {
    fontSize: 15,
    color: VALUE_COLOR,
    marginRight: 4,
  },
  chevron: {
    width: 16,
    height: 16,
  },
  switchTile: {
    minHeight: 52,
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchTitleWrap: {
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: TITLE_COLOR,
    lineHeight: 22,
    flexShrink: 1,
  },
  helpBtn: {
    padding: 6,
  },
  helpIcon: {
    width: 16,
    height: 16,
  },
  sheetRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    zIndex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingTop: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TITLE_COLOR,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sheetRow: {
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetRowText: {
    fontSize: 16,
    color: TITLE_COLOR,
  },
  sheetCheck: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
  },
});
