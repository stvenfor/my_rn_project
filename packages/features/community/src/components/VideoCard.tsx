import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-native-ohos/stack';
import {RoutePath, type RootStackParamList} from '@core/navigation';
import {communityTheme} from '../theme/communityTheme';

interface VideoCardProps {
  videoUrl: string;
  coverUrl?: string;
}

export function VideoCard({videoUrl, coverUrl}: VideoCardProps) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate(RoutePath.communityVideoPlay, {url: videoUrl})
      }>
      <View style={styles.container}>
        {coverUrl ? (
          <Image
            source={{uri: coverUrl}}
            style={styles.cover}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.cover, styles.placeholder]} />
        )}
        <View style={styles.playButton}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: communityTheme.imageRadiusSingle,
    overflow: 'hidden',
    aspectRatio: 16 / 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cover: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  playButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: communityTheme.videoPlayOverlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: communityTheme.videoPlayIconSize,
    marginLeft: 4,
  },
});
