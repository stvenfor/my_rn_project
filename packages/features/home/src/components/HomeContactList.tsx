import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import type {HomeContactItem} from '../models/homeDashboardModel';
import {homeDashboardTheme} from '../theme/homeDashboardTheme';

interface Props {
  items: HomeContactItem[];
}

function trailingIcon(type?: string) {
  switch (type) {
    case 'chat':
      return '💬';
    case 'phone':
      return '📞';
    default:
      return '›';
  }
}

export function HomeContactList({items}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>联系汽车之家</Text>
      <View style={styles.card}>
        {items.map((item, index) => (
          <View key={item.title}>
            <View style={styles.row}>
              <View style={styles.avatar}>
                {item.imageUrl ? (
                  <Image
                    source={{uri: item.imageUrl}}
                    style={styles.avatarImg}
                  />
                ) : (
                  <Text style={styles.emoji}>{item.emoji ?? '?'}</Text>
                )}
              </View>
              <View style={styles.meta}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.trailing}>
                {trailingIcon(item.trailingType)}
              </Text>
            </View>
            {index < items.length - 1 ? <View style={styles.divider} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {paddingHorizontal: 16, paddingTop: 24},
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: homeDashboardTheme.titleBlack,
    marginBottom: 12,
  },
  card: {
    backgroundColor: homeDashboardTheme.cardWhite,
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: homeDashboardTheme.background,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {width: 44, height: 44, borderRadius: 22},
  emoji: {fontSize: 20},
  meta: {flex: 1, marginLeft: 12},
  itemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: homeDashboardTheme.titleBlack,
  },
  itemSubtitle: {
    fontSize: 12,
    color: homeDashboardTheme.textGray,
    marginTop: 2,
  },
  trailing: {fontSize: 18, color: homeDashboardTheme.primaryBlue},
  divider: {
    height: 1,
    backgroundColor: homeDashboardTheme.background,
    marginLeft: 68,
    marginRight: 16,
  },
});
