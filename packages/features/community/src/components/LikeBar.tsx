import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import {AppToast} from '@ui/design-system';
import type {PostModel} from '../models/postModel';
import {toggleLike, type CommunityState} from '../store/communitySlice';
import {
  CommunityCommentIcon,
  CommunityHeartIcon,
  CommunityShareIcon,
} from './CommunityIcons';
import {communityTheme, communityTypography} from '../theme/communityTheme';

type CommunityDispatch = ThunkDispatch<
  {community: CommunityState},
  unknown,
  UnknownAction
>;

interface LikeBarProps {
  post: PostModel;
  onCommentPress: () => void;
}

function ActionButton({
  icon,
  label,
  color,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.actionButton} onPress={onPress}>
      {icon}
      <Text style={[communityTypography.actionLabel, {color}]}>{label}</Text>
    </Pressable>
  );
}

export function LikeBar({post, onCommentPress}: LikeBarProps) {
  const dispatch = useDispatch<CommunityDispatch>();
  const scale = useRef(new Animated.Value(1)).current;
  const color = communityTheme.actionColor;
  const activeColor = post.isLiked ? communityTheme.likeActiveColor : color;

  useEffect(() => {
    scale.setValue(1);
  }, [post.isLiked, scale]);

  const runHeartAnimation = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.28,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLike = () => {
    runHeartAnimation();
    dispatch(toggleLike(post.id));
  };

  return (
    <View style={styles.container}>
      <ActionButton
        icon={
          <Animated.View style={[styles.iconWrap, {transform: [{scale}]}]}>
            <CommunityHeartIcon
              color={activeColor}
              filled={post.isLiked}
              size={communityTheme.actionIconSize}
            />
          </Animated.View>
        }
        label={post.likeCount > 0 ? String(post.likeCount) : '赞'}
        color={activeColor}
        onPress={handleLike}
      />
      <ActionButton
        icon={
          <View style={styles.iconWrap}>
            <CommunityCommentIcon
              color={color}
              size={communityTheme.actionIconSize}
            />
          </View>
        }
        label={post.commentCount > 0 ? String(post.commentCount) : '评论'}
        color={color}
        onPress={onCommentPress}
      />
      <ActionButton
        icon={
          <View style={styles.iconWrap}>
            <CommunityShareIcon
              color={color}
              size={communityTheme.actionIconSize}
            />
          </View>
        }
        label="分享"
        color={color}
        onPress={() => AppToast.show('分享功能开发中')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: communityTheme.likeBarPaddingTop,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginRight: communityTheme.actionGap,
  },
  iconWrap: {
    marginRight: 4,
  },
});
