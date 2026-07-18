import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {AppNavBar, AppPageScaffold} from '@ui/design-system';
import {findDubbingVideo} from '../dubbing/dubbingMediaMockData';

export function DubbingVideoDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<typeof RoutePath.dubbingVideoDetail>) {
  const item = findDubbingVideo(route.params?.id);

  return (
    <AppPageScaffold layout="standard" backgroundColor="#F5F5F5">
      <AppNavBar title="视频详情" onBack={() => navigation.goBack()} />
      {!item ? (
        <View style={styles.center}>
          <Text>未找到视频</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          <Image source={{uri: item.coverUrl}} style={styles.cover} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc}>{item.desc}</Text>
          <Text style={styles.meta}>
            {item.uploaderName} · {item.difficulty} · 👍 {item.likeCount}
          </Text>
          <View style={styles.tags}>
            {item.tags.map(tag => (
              <Text key={tag} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        </ScrollView>
      )}
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  body: {padding: 16},
  cover: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  title: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  desc: {marginTop: 8, fontSize: 14, color: '#666', lineHeight: 20},
  meta: {marginTop: 12, fontSize: 13, color: '#8C8C8C'},
  tags: {flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12},
  tag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: '#8C8C8C',
  },
});
