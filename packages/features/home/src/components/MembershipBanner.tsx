import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {homeReportTheme} from '../theme/homeReportTheme';

export function MembershipBanner() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.crown}>👑</Text>
      <View style={styles.meta}>
        <Text style={styles.title}>开通会员，解锁全部内容</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          全量剧集 · AI外教不限时 · 专属勋章
        </Text>
      </View>
      <Pressable style={styles.cta}>
        <Text style={styles.ctaText}>立即开通</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: homeReportTheme.bannerBorder,
    backgroundColor: homeReportTheme.bannerStart,
  },
  crown: {fontSize: 28},
  meta: {flex: 1, marginLeft: 10},
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: homeReportTheme.titleWhite,
  },
  subtitle: {fontSize: 11, color: homeReportTheme.subtitleGrey, marginTop: 4},
  cta: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: homeReportTheme.orangeDeep,
  },
  ctaText: {color: '#fff', fontSize: 13, fontWeight: '600'},
});
