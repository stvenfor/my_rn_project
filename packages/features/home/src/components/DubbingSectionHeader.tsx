import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {dubbingHomeAssets} from '../assets/homeAssets';
import {dubbingHomeTheme as t} from '../theme/dubbingHomeTheme';

export type DubbingSectionHeaderStyle = 'chevron' | 'refresh' | 'none';

type Props = {
  title: string;
  subtitle?: string;
  style?: DubbingSectionHeaderStyle;
  onTrailingPress?: () => void;
};

export function DubbingSectionHeader({
  title,
  subtitle,
  style = 'none',
  onTrailingPress,
}: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {style === 'chevron' ? (
        <Pressable
          onPress={onTrailingPress}
          hitSlop={8}
          style={styles.trailingHit}>
          <Image
            source={dubbingHomeAssets.icon_chevron_right}
            style={styles.chevron}
          />
        </Pressable>
      ) : null}
      {style === 'refresh' ? (
        <Pressable
          onPress={onTrailingPress}
          hitSlop={8}
          style={styles.refreshHit}>
          <Image source={dubbingHomeAssets.icon_swap} style={styles.swap} />
          <Text style={styles.refreshLabel}>换一换</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  textCol: {flex: 1},
  title: {
    fontSize: t.sectionTitleSize,
    fontWeight: '600',
    color: t.titleBlack,
    lineHeight: 22,
  },
  subtitle: {marginTop: 4, fontSize: 12, color: t.subtitleGray},
  trailingHit: {padding: 8},
  chevron: {width: 16, height: 16},
  refreshHit: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  swap: {width: 14, height: 14},
  refreshLabel: {marginLeft: 4, fontSize: 13, color: t.subtitleGray},
});
