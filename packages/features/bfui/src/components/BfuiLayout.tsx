import React from 'react';
import {Image, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {bfuiColors} from '../theme/bfuiTheme';

export function BfuiPage({
  children,
  backgroundColor = bfuiColors.nearlyWhite,
  style,
}: {
  children: React.ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.page, {backgroundColor}, style]}>{children}</View>
  );
}

export function BfuiHeroCard({
  title,
  subtitle,
  accent = bfuiColors.hotelPrimary,
  imageSource,
}: {
  title: string;
  subtitle?: string;
  accent?: string;
  imageSource?: number;
}) {
  return (
    <View style={[styles.hero, {borderLeftColor: accent}]}>
      {imageSource ? (
        <Image
          source={imageSource}
          style={styles.heroImage}
          resizeMode="cover"
        />
      ) : null}
      <Text style={styles.heroTitle}>{title}</Text>
      {subtitle ? <Text style={styles.heroSub}>{subtitle}</Text> : null}
    </View>
  );
}

export function BfuiChip({label, active}: {label: string; active?: boolean}) {
  return (
    <View style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </View>
  );
}

export function BfuiListCard({
  title,
  subtitle,
  meta,
  imageSource,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  imageSource?: number;
}) {
  return (
    <View style={styles.card}>
      {imageSource ? (
        <Image source={imageSource} style={styles.cardThumbImage} />
      ) : (
        <View style={styles.cardThumb} />
      )}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{title}</Text>
        {subtitle ? <Text style={styles.cardSub}>{subtitle}</Text> : null}
        {meta ? <Text style={styles.cardMeta}>{meta}</Text> : null}
      </View>
    </View>
  );
}

export function BfuiStatRow({
  items,
}: {
  items: {label: string; value: string}[];
}) {
  return (
    <View style={styles.statRow}>
      {items.map(item => (
        <View key={item.label} style={styles.statItem}>
          <Text style={styles.statValue}>{item.value}</Text>
          <Text style={styles.statLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1, padding: 16},
  hero: {
    backgroundColor: bfuiColors.white,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
    overflow: 'hidden',
  },
  heroImage: {width: '100%', height: 140, borderRadius: 8, marginBottom: 12},
  heroTitle: {fontSize: 20, fontWeight: '700', color: bfuiColors.darkerText},
  heroSub: {fontSize: 14, color: bfuiColors.lightText, marginTop: 6},
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: bfuiColors.chipBackground,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {backgroundColor: bfuiColors.hotelPrimary},
  chipText: {fontSize: 13, color: bfuiColors.darkText},
  chipTextActive: {color: '#fff'},
  card: {
    flexDirection: 'row',
    backgroundColor: bfuiColors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardThumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: bfuiColors.chipBackground,
    marginRight: 12,
  },
  cardThumbImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
    marginRight: 12,
  },
  cardBody: {flex: 1, justifyContent: 'center'},
  cardTitle: {fontSize: 16, fontWeight: '600', color: bfuiColors.darkerText},
  cardSub: {fontSize: 13, color: bfuiColors.lightText, marginTop: 4},
  cardMeta: {fontSize: 12, color: bfuiColors.hotelPrimary, marginTop: 6},
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  statItem: {flex: 1, alignItems: 'center'},
  statValue: {fontSize: 22, fontWeight: '700', color: bfuiColors.darkerText},
  statLabel: {fontSize: 12, color: bfuiColors.lightText, marginTop: 4},
});
