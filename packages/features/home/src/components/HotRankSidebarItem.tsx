import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {dubbingHomeAssets} from '../assets/homeAssets';
import {dubbingHomeTheme as t} from '../theme/dubbingHomeTheme';

const HOT_SEARCH_LABEL = '热搜榜';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function HotRankSidebarItem({label, active, onPress}: Props) {
  const showTopBadge = active && label === HOT_SEARCH_LABEL;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.item, active && styles.itemActive]}>
      {showTopBadge ? (
        <Image
          source={dubbingHomeAssets.hot_rank_badge_top20}
          style={styles.topBadge}
        />
      ) : null}
      {active ? (
        <View style={styles.wheatRow}>
          <Image
            source={dubbingHomeAssets.wheat_left}
            style={[styles.wheat, styles.wheatTint]}
          />
          <Image
            source={dubbingHomeAssets.wheat_right}
            style={[styles.wheat, styles.wheatTint]}
          />
        </View>
      ) : null}
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    marginHorizontal: 6,
    marginVertical: 2,
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderRadius: 8,
  },
  itemActive: {
    backgroundColor: t.hotRankSidebarActive,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  topBadge: {
    position: 'absolute',
    top: -18,
    width: 36,
    height: 16,
  },
  wheatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  wheat: {width: 10, height: 12},
  wheatTint: {tintColor: t.svipGold},
  label: {fontSize: 13, color: t.textGray, textAlign: 'center', lineHeight: 16},
  labelActive: {color: t.titleBlack, fontWeight: '600'},
});
