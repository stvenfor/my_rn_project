import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {AppNavBar, AppPageScaffold} from '@ui/design-system';
import {homeDashboardTheme as t} from '../theme/homeDashboardTheme';

const SUB_TABS = ['推荐', '逆向', '趋势'];
const PERIODS = ['今年来', '近1周', '近1月', '近3月', '近1年'];
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

export function HomeStrategyScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.homeStrategy>) {
  const insets = useSafeAreaInsets();
  const [subTab, setSubTab] = useState(0);
  const [period, setPeriod] = useState(4);

  return (
    <AppPageScaffold layout="standard" backgroundColor={t.background}>
      <AppNavBar title="策略" onBack={() => navigation.goBack()} />
      <View style={[styles.body, {paddingBottom: insets.bottom + 24}]}>
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
                {active ? <View style={styles.subUnderline} /> : null}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.intro}>
            资产九宫格展示主要大类资产区间表现，数据仅供参考。
          </Text>
          <View style={styles.grid}>
            {GRID.map(cell => (
              <View
                key={cell.label}
                style={[
                  styles.cell,
                  {
                    backgroundColor: cell.positive
                      ? 'rgba(255,59,48,0.08)'
                      : 'rgba(52,199,89,0.08)',
                  },
                ]}>
                <Text style={styles.cellLabel}>{cell.label}</Text>
                <Text
                  style={[
                    styles.cellValue,
                    {color: cell.positive ? '#FF3B30' : '#34C759'},
                  ]}>
                  {cell.value}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.periods}>
            {PERIODS.map((label, index) => {
              const active = index === period;
              return (
                <Pressable key={label} onPress={() => setPeriod(index)}>
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
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.strategyHeader}>
            <Text style={styles.strategyTitle}>黄金恐贪定投 · 第一期</Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>逆向</Text>
            </View>
            <Text style={styles.link}>如何跟投</Text>
          </View>
          <Text style={styles.returnValue}>-11.35%</Text>
          <Text style={styles.returnLabel}>本期收益率</Text>
          <View style={styles.gauge}>
            <Text style={styles.gaugeText}>63 中立</Text>
          </View>
          <Text style={styles.progressLabel}>定投进度</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, {width: '72%'}]} />
            <Text style={styles.progressOverlay}>36 / 50</Text>
          </View>
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>本周已投 1 份</Text>
            <Pressable style={styles.subscribe}>
              <Text style={styles.subscribeText}>订阅</Text>
            </Pressable>
          </View>
          <Text style={styles.footnote}>
            策略内容仅供合格投资者参考，不构成投资建议。
          </Text>
        </View>
      </View>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  body: {paddingHorizontal: 16, paddingTop: 8},
  subTabs: {flexDirection: 'row', marginBottom: 12},
  subTab: {marginRight: 32, alignItems: 'center'},
  subTabText: {fontSize: 16, color: t.labelSecondary},
  subTabActive: {color: t.labelPrimary, fontWeight: '600'},
  subUnderline: {
    marginTop: 6,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: t.accent,
  },
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
    color: t.labelSecondary,
    lineHeight: 20,
    marginBottom: 12,
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
  },
  cellLabel: {fontSize: 12, color: t.labelPrimary},
  cellValue: {marginTop: 4, fontSize: 14, fontWeight: '700'},
  periods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  period: {fontSize: 13},
  periodActive: {color: t.accent, fontWeight: '600'},
  periodInactive: {color: t.labelSecondary},
  strategyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  strategyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: t.labelPrimary,
    marginRight: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: 'rgba(0,122,255,0.1)',
    marginRight: 8,
  },
  tagText: {fontSize: 11, fontWeight: '600', color: t.accent},
  link: {fontSize: 13, color: t.accent, fontWeight: '500'},
  returnValue: {
    marginTop: 12,
    fontSize: 32,
    fontWeight: '700',
    color: '#34C759',
  },
  returnLabel: {fontSize: 13, color: t.labelSecondary, marginTop: 4},
  gauge: {
    marginTop: 12,
    width: 88,
    height: 56,
    borderRadius: 8,
    backgroundColor: t.fillSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeText: {fontSize: 12, fontWeight: '600', color: t.labelPrimary},
  progressLabel: {marginTop: 12, fontSize: 13, color: t.labelSecondary},
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
    backgroundColor: t.accent,
  },
  progressOverlay: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  footerRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {fontSize: 14, color: t.labelPrimary},
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
    marginTop: 12,
    fontSize: 12,
    color: t.labelSecondary,
    lineHeight: 18,
  },
});
