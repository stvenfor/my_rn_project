import React from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {AppNavBar, AppPageScaffold} from '@ui/design-system';
import {
  getDubbingVideos,
  type DubbingVideoItem,
} from '../dubbing/dubbingMediaMockData';

const PRIMARY = '#52C41A';
const BG = '#F5F5F5';
const GRAY = '#8C8C8C';

export function DubbingVideoListScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.dubbingVideoList>) {
  const items = getDubbingVideos();

  return (
    <AppPageScaffold layout="standard" backgroundColor={BG}>
      <AppNavBar
        title="视频列表"
        onBack={() => navigation.goBack()}
        backgroundColor={BG}
      />
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={ListSeparator}
        renderItem={({item}) => (
          <VideoCard
            item={item}
            onPress={() =>
              navigation.navigate(RoutePath.dubbingVideoDetail, {id: item.id})
            }
          />
        )}
      />
    </AppPageScaffold>
  );
}

function ListSeparator() {
  return <View style={styles.separator} />;
}

function VideoCard({
  item,
  onPress,
}: {
  item: DubbingVideoItem;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{uri: item.coverUrl}} style={styles.cover} />
      <View style={styles.meta}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.tags}>
          {item.tags.slice(0, 3).map(tag => {
            const highlight = tag.startsWith('难度') || tag === '合作';
            return (
              <View
                key={tag}
                style={[styles.tag, highlight ? styles.tagHighlight : null]}>
                <Text
                  style={[
                    styles.tagText,
                    highlight ? styles.tagTextHighlight : null,
                  ]}>
                  {tag}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.footer}>
          <Text style={styles.like}>👍 {item.likeCount}</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  list: {padding: 16, paddingBottom: 24},
  separator: {height: 12},
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  cover: {width: 120, height: 90, backgroundColor: '#EEEEEE'},
  meta: {flex: 1, padding: 12},
  title: {fontSize: 14, fontWeight: '600', color: '#1A1A1A'},
  tags: {flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 8},
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
  },
  tagHighlight: {backgroundColor: 'rgba(82,196,26,0.12)'},
  tagText: {fontSize: 10, color: GRAY},
  tagTextHighlight: {color: PRIMARY},
  footer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  like: {fontSize: 12, color: GRAY},
  chevron: {marginLeft: 'auto', fontSize: 18, color: '#BFBFBF'},
});
