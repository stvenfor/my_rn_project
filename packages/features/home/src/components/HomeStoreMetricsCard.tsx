import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {HomeMetric, HomeMetricDetail} from '../models/homeDashboardModel';
import {homeDashboardTheme} from '../theme/homeDashboardTheme';

interface Props {
  storeName: string;
  selectedTab: number;
  tabs: readonly string[];
  metrics: HomeMetric[];
  details: HomeMetricDetail[];
  onTabSelected: (index: number) => void;
}

export function HomeStoreMetricsCard({
  storeName,
  selectedTab,
  tabs,
  metrics,
  details,
  onTabSelected,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.storeRow}>
        <Text style={styles.storeName} numberOfLines={1}>
          {storeName}
        </Text>
        <Text style={styles.storeIcon}>⌄</Text>
        <Text style={styles.swapIcon}>⇄</Text>
      </View>
      <View style={styles.tabRow}>
        {tabs.map((tab, index) => {
          const active = index === selectedTab;
          return (
            <Pressable
              key={tab}
              style={styles.tabItem}
              onPress={() => onTabSelected(index)}>
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {tab}
              </Text>
              <View
                style={[
                  styles.tabIndicator,
                  active && styles.tabIndicatorActive,
                ]}
              />
            </Pressable>
          );
        })}
      </View>
      <View style={styles.metricsGrid}>
        {metrics.map(metric => (
          <View key={metric.label} style={styles.metricCell}>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricLabel}>{metric.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.divider} />
      <View style={styles.detailsRow}>
        {details.map(detail => (
          <View key={detail.label} style={styles.detailCell}>
            <Text style={styles.detailValue}>{detail.value}</Text>
            <Text style={styles.detailLabel}>{detail.label}</Text>
            <Text style={styles.detailAction}>{detail.actionLabel}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.moreLink}>查看更多 &gt;</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    backgroundColor: homeDashboardTheme.cardWhite,
    borderRadius: 16,
  },
  storeRow: {flexDirection: 'row', alignItems: 'center'},
  storeName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: homeDashboardTheme.titleBlack,
  },
  storeIcon: {fontSize: 18, color: homeDashboardTheme.titleBlack},
  swapIcon: {fontSize: 16, color: homeDashboardTheme.textGray, marginLeft: 4},
  tabRow: {flexDirection: 'row', marginTop: 12},
  tabItem: {marginRight: 20},
  tabText: {fontSize: 14, color: homeDashboardTheme.textGray},
  tabTextActive: {
    fontWeight: '600',
    color: homeDashboardTheme.primaryBlue,
  },
  tabIndicator: {
    marginTop: 6,
    width: 24,
    height: 2,
    backgroundColor: 'transparent',
  },
  tabIndicatorActive: {backgroundColor: homeDashboardTheme.primaryBlue},
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  metricCell: {width: '50%', marginBottom: 16},
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: homeDashboardTheme.titleBlack,
  },
  metricLabel: {fontSize: 12, color: homeDashboardTheme.textGray, marginTop: 2},
  divider: {
    height: 1,
    backgroundColor: homeDashboardTheme.background,
    marginVertical: 8,
  },
  detailsRow: {flexDirection: 'row'},
  detailCell: {flex: 1, alignItems: 'center'},
  detailValue: {
    fontSize: 18,
    fontWeight: '700',
    color: homeDashboardTheme.titleBlack,
  },
  detailLabel: {fontSize: 11, color: homeDashboardTheme.textGray, marginTop: 4},
  detailAction: {
    fontSize: 11,
    color: homeDashboardTheme.primaryBlue,
    marginTop: 4,
  },
  moreLink: {
    textAlign: 'center',
    fontSize: 13,
    color: homeDashboardTheme.textGray,
    marginTop: 12,
  },
});
