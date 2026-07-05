import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AppNavBar} from '@ui/design-system';
import {checkInMallTheme} from '../theme/checkInMallTheme';

interface Props {
  title: string;
  onBack: () => void;
}

export function CheckInMallHeader({
  title,
  onBack,
  consecutiveDays,
  iCarCoins,
  growthValue,
}: Props & {
  consecutiveDays: number;
  iCarCoins: number;
  growthValue: number;
}) {
  return (
    <View style={styles.header}>
      <AppNavBar
        title={title}
        showBackButton
        onBack={onBack}
        backgroundColor={checkInMallTheme.primaryBlue}
        foregroundColor="#FFFFFF"
        barStyle={styles.navBar}
      />
      <View style={styles.noticeBar}>
        <Text style={styles.noticeIcon}>🔊</Text>
        <Text style={styles.noticeText}>
          温馨提示：本页面只保留近3个月内的i车币记录
        </Text>
      </View>
      <View style={styles.statsRow}>
        <StatItem label="我的i车币" value={String(iCarCoins)} />
        <StatItem label="我的成长值" value={String(growthValue)} />
      </View>
      <Text style={styles.subNotice}>
        连续签到 {consecutiveDays} 天，今日奖励 +5 i车币
      </Text>
    </View>
  );
}

function StatItem({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.statItem}>
      <View style={styles.statLabelRow}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.chevron}>›</Text>
      </View>
      <View style={styles.statValueRow}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.helpIcon}>?</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: checkInMallTheme.primaryBlue,
    paddingBottom: 16,
  },
  navBar: {borderBottomWidth: 0},
  noticeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: checkInMallTheme.noticeBlue,
    borderRadius: 4,
  },
  noticeIcon: {fontSize: 14, marginRight: 8},
  noticeText: {flex: 1, color: '#fff', fontSize: 12},
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 16,
  },
  statItem: {flex: 1},
  statLabelRow: {flexDirection: 'row', alignItems: 'center'},
  statLabel: {color: 'rgba(255,255,255,0.8)', fontSize: 13},
  chevron: {color: 'rgba(255,255,255,0.8)', fontSize: 14, marginLeft: 2},
  statValueRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  statValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  helpIcon: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginLeft: 4,
  },
  subNotice: {
    color: '#E8F1FA',
    fontSize: 12,
    marginTop: 8,
    paddingHorizontal: 16,
  },
});
