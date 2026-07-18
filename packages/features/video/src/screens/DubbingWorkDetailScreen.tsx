import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {RootStackScreenProps} from '@core/navigation';
import {RoutePath} from '@core/navigation';
import {AppNavBar, AppPageScaffold} from '@ui/design-system';
import {findDubbingWork} from '../dubbing/dubbingMediaMockData';

export function DubbingWorkDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<typeof RoutePath.dubbingWorkDetail>) {
  const item = findDubbingWork(route.params?.id);

  return (
    <AppPageScaffold layout="standard" backgroundColor="#F5F5F5">
      <AppNavBar title="作品详情" onBack={() => navigation.goBack()} />
      {!item ? (
        <View style={styles.center}>
          <Text>未找到作品</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          <Image source={{uri: item.coverUrl}} style={styles.cover} />
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.authorRow}>
            <Image source={{uri: item.authorAvatar}} style={styles.avatar} />
            <Text style={styles.author}>{item.authorName}</Text>
          </View>
          <Text style={styles.meta}>
            {item.location} · {item.publishedAt} · 👍 {item.likeCount} · 💬{' '}
            {item.commentCount}
          </Text>
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
    height: 220,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  title: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  authorRow: {flexDirection: 'row', alignItems: 'center', marginTop: 12},
  avatar: {width: 32, height: 32, borderRadius: 16},
  author: {marginLeft: 8, fontSize: 14, color: '#333'},
  meta: {marginTop: 10, fontSize: 13, color: '#8C8C8C'},
});
