import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import type {PostModel} from '../models/postModel';
import {formatPublishTime} from '../utils/formatPublishTime';
import {communityTheme, communityTypography} from '../theme/communityTheme';

interface UserInfoRowProps {
  post: PostModel;
}

export function UserInfoRow({post}: UserInfoRowProps) {
  return (
    <View style={styles.row}>
      <Image source={{uri: post.avatar}} style={styles.avatar} />
      <View style={styles.meta}>
        <Text style={communityTypography.nickname}>{post.nickname}</Text>
        <Text style={communityTypography.meta}>
          {formatPublishTime(post.publishTime)} · {post.source}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: communityTheme.avatarSize,
    height: communityTheme.avatarSize,
    borderRadius: communityTheme.avatarSize / 2,
    backgroundColor: communityTheme.dividerColor,
  },
  meta: {
    flex: 1,
    marginLeft: communityTheme.avatarGap,
  },
});
