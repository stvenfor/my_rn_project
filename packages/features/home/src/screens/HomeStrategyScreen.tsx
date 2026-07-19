import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {AppNavBar, AppPageScaffold} from '@ui/design-system';
import {StrategyFearGreedGauge} from '../components/StrategyFearGreedGauge';
import {homeDashboardTheme as t} from '../theme/homeDashboardTheme';

const SUB_TABS = ['推荐', '逆向', '趋势'] as const;
const PERIODS = ['今年来', '近1周', '近1月', '近3月', '近1年'] as const;
const GRID: {label: string; value: string; positive: boolean}[] = [
  {label: 'A股', value: '+19.22%', positive: true},
  {label: '中债', value: '+3.15%', positive: true},
  {label: '黄金', value: '+8.76%', positive: true},
  {label: '港股', value: '+12.40%', positive: true},
  {label: '美股', value: '+15.88%', positive: true},
  {label: '原油', value: '-2.34%', positive: false},
  {label: '美元债', value: '-1.80%', positive: false},
  {label: '商品', value: '+4.56%', positive: true},
  {label: '现金', value: '+1.20%', positive: true},
];

const INTRO =
  '「大类资产九宫格策略」通过分散配置降低波动，帮助你在不同市场环境下保持稳健收益。';

const FOOTNOTE =
  '在恐慌时买入、贪婪时卖出，通过定期定额降低择时压力，适合长期持有的投资者。';

export function HomeStrategyScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.homeStrategy>) {
  const insets = useSafeAreaInsets();
  const [subTab, setSubTab] = useState(0);
  const [period, setPeriod] = useState(4);

  return (
    <AppPageScaffold layout="standard" backgroundColor={t.background}>
      <AppNavBar
        title="策略"
        showBackButton
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[
          styles.body,
          {paddingBottom: insets.bottom + 24},
        ]}>
        <View style={styles.subTabs}>
          {SUB_TABS.map((label, index) => {
            const active = index === subTab;
            return (
              <Pressable
                key={label}
                style={styles.subTab}
                onPress={() => setSubTab(index)}>
                <Text
                  style={[styles.subTabText, active && styles.subTabActive]}>
                  {label}
                </Text>
                <View
                  style={[
                    styles.subUnderline,
                    active && styles.subUnderlineActive,
                  ]}
                />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.intro}>{INTRO}</Text>
          <View style={styles.grid}>
            {GRID.map(cell => (
              <View
                key={cell.label}
                style={[
                  styles.cell,
                  cell.positive ? styles.cellUp : styles.cellDown,
                ]}>
                <Text style={styles.cellLabel}>{cell.label}</Text>
                <Text
                  style={[
                    styles.cellValue,
                    cell.positive ? styles.cellValueUp : styles.cellValueDown,
                  ]}>
                  {cell.value}
                </Text>
              </View>
            ))}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.periodScroll}>
            {PERIODS.map((label, index) => {
              const active = index === period;
              return (
                <Pressable
                  key={label}
                  style={styles.periodBtn}
                  onPress={() => setPeriod(index)}>
                  <Text
                    style={[
                      styles.period,
                      active ? styles.periodActive : styles.periodInactive,
                    ]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.card}>
          <View style={styles.strategyHeader}>
            <View style={styles.strategyHeaderLeft}>
              <Text style={styles.strategyTitle}>黄金恐贪定投 · 第一期</Text>
              <View style={styles.tag}>
                <Text style={styles.tagText}>逆向</Text>
              </View>
            </View>
            <Text style={styles.link}>如何跟投</Text>
          </View>

          <View style={styles.returnRow}>
            <View>
              <Text style={styles.returnValue}>-11.35%</Text>
              <Text style={styles.returnLabel}>本期收益率</Text>
            </View>
            <StrategyFearGreedGauge />
          </View>

          <Text style={styles.progressLabel}>定投进度</Text>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
            <Text style={styles.progressOverlay}>36 / 50</Text>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>本周已投 1 份</Text>
            <Pressable style={styles.subscribe} onPress={() => {}}>
              <Text style={styles.subscribeText}>订阅</Text>
            </Pressable>
          </View>

          <Text style={styles.footnote}>{FOOTNOTE}</Text>
        </View>
      </ScrollView>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  body: {paddingHorizontal: 16, paddingTop: 8},
  subTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  subTab: {marginHorizontal: 16, alignItems: 'center'},
  subTabText: {fontSize: 16, color: t.labelSecondary, fontWeight: '400'},
  subTabActive: {color: t.labelPrimary, fontWeight: '600'},
  subUnderline: {
    marginTop: 8,
    width: 0,
    height: 3,
    borderRadius: 2,
  },
  subUnderlineActive: {width: 24, backgroundColor: t.accent},
  card: {
    backgroundColor: t.surface,
    borderRadius: t.radiusMd,
    borderWidth: 0.5,
    borderColor: t.separator,
    padding: 16,
    marginBottom: 16,
  },
  intro: {
    fontSize: 13,
    color: t.labelPrimary,
    lineHeight: 20,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cell: {
    width: '31.5%',
    aspectRatio: 1.35,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellUp: {backgroundColor: 'rgba(255,59,48,0.08)'},
  cellDown: {backgroundColor: 'rgba(52,199,89,0.08)'},
  cellLabel: {fontSize: 12, color: t.labelPrimary},
  cellValue: {marginTop: 4, fontSize: 14, fontWeight: '700'},
  cellValueUp: {color: '#FF3B30'},
  cellValueDown: {color: '#34C759'},
  periodScroll: {marginTop: 8},
  periodBtn: {marginRight: 16},
  period: {fontSize: 13},
  periodActive: {color: t.accent, fontWeight: '600'},
  periodInactive: {color: t.labelSecondary, fontWeight: '400'},
  strategyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  strategyHeaderLeft: {flex: 1, marginRight: 12},
  strategyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: t.labelPrimary,
  },
  tag: {
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
  tagText: {fontSize: 11, fontWeight: '600', color: t.accent},
  link: {fontSize: 14, color: t.accent, fontWeight: '500'},
  returnRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  returnValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#34C759',
  },
  returnLabel: {fontSize: 13, color: t.labelSecondary, marginTop: 2},
  progressLabel: {marginTop: 20, fontSize: 13, color: t.labelSecondary},
  progressTrack: {
    marginTop: 8,
    height: 24,
    borderRadius: 6,
    backgroundColor: t.fillSecondary,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '72%',
    backgroundColor: t.accent,
  },
  progressOverlay: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: t.labelPrimary,
  },
  footerRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {fontSize: 13, color: t.labelSecondary},
  subscribe: {
    minWidth: 72,
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: t.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeText: {color: '#fff', fontWeight: '600'},
  footnote: {
    marginTop: 16,
    fontSize: 13,
    color: t.labelSecondary,
    lineHeight: 20,
  },
});
