import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {dubbingHomeAssets, dubbingRankBadge} from '../assets/homeAssets';
import type {DubbingHotRankBoard} from '../data/dubbingMockData';
import {
  HOT_RANK_THEMES,
  dubbingHomeTheme as t,
} from '../theme/dubbingHomeTheme';

type Props = {
  board: DubbingHotRankBoard;
  onViewAll: () => void;
  onItemPress: (id: string) => void;
};

export function DubbingHotRankCard({board, onViewAll, onItemPress}: Props) {
  const theme = HOT_RANK_THEMES[board.theme];
  const previewItems = board.items.slice(0, 3);

  return (
    <View style={styles.card}>
      <View style={[styles.header, {backgroundColor: theme.top}]}>
        <Image source={dubbingHomeAssets.wheat_left} style={styles.wheat} />
        <Text style={styles.headerTitle} numberOfLines={1}>
          {board.title}
        </Text>
        <Text style={styles.topLabel}>TOP 10</Text>
        <Image source={dubbingHomeAssets.wheat_right} style={styles.wheat} />
      </View>
      <View style={[styles.body, {backgroundColor: theme.bottom}]}>
        {previewItems.map((item, index) => (
          <View key={item.id}>
            {index > 0 ? <View style={styles.divider} /> : null}
            <Pressable style={styles.row} onPress={() => onItemPress(item.id)}>
              <View style={styles.coverWrap}>
                <Image source={item.cover} style={styles.cover} />
                {item.rank <= 3 ? (
                  <Image
                    source={dubbingRankBadge(item.rank)}
                    style={styles.rankBadge}
                  />
                ) : null}
              </View>
              <View style={styles.meta}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.itemSub} numberOfLines={1}>
                  {item.subtitle}
                </Text>
                <Text style={styles.itemSub}>热度 {item.heat}</Text>
              </View>
            </Pressable>
          </View>
        ))}
      </View>
      <Pressable style={styles.viewAll} onPress={onViewAll}>
        <Text style={styles.viewAllText}>查看全部</Text>
        <Image
          source={dubbingHomeAssets.icon_chevron_right}
          style={styles.viewAllChevron}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: t.cardRadius,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  wheat: {width: 12, height: 16},
  headerTitle: {
    flex: 1,
    marginHorizontal: 4,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: t.titleBlack,
  },
  topLabel: {fontSize: 10, color: t.subtitleGray, marginRight: 4},
  body: {paddingBottom: 4},
  divider: {
    marginHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: t.divider,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  coverWrap: {marginRight: 6},
  cover: {width: 44, height: 44, borderRadius: 6},
  rankBadge: {
    position: 'absolute',
    left: -3,
    top: -5,
    width: 16,
    height: 18,
  },
  meta: {flex: 1},
  itemTitle: {fontSize: 12, fontWeight: '600', color: t.titleBlack},
  itemSub: {marginTop: 2, fontSize: 10, color: t.subtitleGray},
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    backgroundColor: t.viewAllBackground,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: t.divider,
  },
  viewAllText: {fontSize: 12, color: t.subtitleGray},
  viewAllChevron: {
    width: 10,
    height: 10,
    marginLeft: 2,
    tintColor: t.subtitleGray,
  },
});
