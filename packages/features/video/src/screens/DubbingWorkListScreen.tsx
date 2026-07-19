import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {AppNavBar, AppPageScaffold} from '@ui/design-system';
import {
  getDubbingWorks,
  type DubbingWorkItem,
} from '../dubbing/dubbingMediaMockData';

const BG = '#F5F5F5';
const GRAY = '#8C8C8C';

export function DubbingWorkListScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.dubbingWorkList>) {
  const items = getDubbingWorks();
  const {width} = useWindowDimensions();
  const cardWidth = (width - 16 * 2 - 12) / 2;

  return (
    <AppPageScaffold
      layout="standard"
      backgroundColor={BG}
      navBar={
        <AppNavBar
          title="作品列表"
          showBackButton
          onBack={() => navigation.goBack()}
          backgroundColor={BG}
        />
      }>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <WorkCard
            item={item}
            width={cardWidth}
            onPress={() =>
              navigation.navigate(RoutePath.dubbingWorkDetail, {id: item.id})
            }
          />
        )}
      />
    </AppPageScaffold>
  );
}

function WorkCard({
  item,
  width,
  onPress,
}: {
  item: DubbingWorkItem;
  width: number;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.card, {width}]} onPress={onPress}>
      <View>
        <Image source={{uri: item.coverUrl}} style={styles.cover} />
        {item.duration ? (
          <View style={styles.duration}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        ) : null}
        {item.badge ? (
          <View
            style={[
              styles.badge,
              item.badge === '精选' ? styles.badgeFeatured : styles.badgeHot,
            ]}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.authorRow}>
          <Image source={{uri: item.authorAvatar}} style={styles.avatar} />
          <Text style={styles.author} numberOfLines={1}>
            {item.authorName}
          </Text>
        </View>
        <Text style={styles.stats}>
          👍 {item.likeCount} 💬 {item.commentCount}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  list: {padding: 16, paddingBottom: 24},
  row: {justifyContent: 'space-between', marginBottom: 12},
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  cover: {width: '100%', height: 120, backgroundColor: '#EEEEEE'},
  duration: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: 'rgba(0,0,0,0.54)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: {color: '#fff', fontSize: 10},
  badge: {
    position: 'absolute',
    left: 8,
    top: 8,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeFeatured: {backgroundColor: '#FF69B4'},
  badgeHot: {backgroundColor: '#FF8A34'},
  badgeText: {color: '#fff', fontSize: 10},
  body: {padding: 10},
  title: {fontSize: 13, fontWeight: '600', color: '#1A1A1A'},
  authorRow: {flexDirection: 'row', alignItems: 'center', marginTop: 8},
  avatar: {width: 20, height: 20, borderRadius: 10, backgroundColor: '#eee'},
  author: {flex: 1, marginLeft: 6, fontSize: 11, color: GRAY},
  stats: {marginTop: 6, fontSize: 11, color: GRAY},
});
