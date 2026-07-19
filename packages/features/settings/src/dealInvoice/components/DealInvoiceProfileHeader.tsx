import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {
  PROFILE_AVATAR_URL,
  type DealInvoiceStats,
} from '../models/dealInvoiceModels';

export function DealInvoiceProfileHeader({stats}: {stats: DealInvoiceStats}) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.meta}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              东东枪
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>销售经理</Text>
            </View>
          </View>
          <Text style={styles.store}>[4S] 北京沃德龙鼎吉利</Text>
        </View>
        <Image source={{uri: PROFILE_AVATAR_URL}} style={styles.avatar} />
      </View>
      <View style={styles.statsRow}>
        <StatCell value={`${stats.uploaded}`} label="已上传" />
        <StatCell value={`${stats.pendingReview}`} label="待审核" />
        <StatCell value={`${stats.approved}`} label="已通过" />
        <StatCell value={`${stats.rejected}`} label="未通过" />
      </View>
    </View>
  );
}

function StatCell({value, label}: {value: string; label: string}) {
  return (
    <View style={styles.statCell}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  meta: {flex: 1},
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    flexShrink: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#3B8CFF',
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  store: {
    marginTop: 8,
    fontSize: 13,
    color: '#616161',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginLeft: 12,
    backgroundColor: '#EEE',
  },
  statsRow: {
    marginTop: 20,
    flexDirection: 'row',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#757575',
  },
});
