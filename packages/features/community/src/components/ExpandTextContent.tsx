import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import type {ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import type {PostModel} from '../models/postModel';
import {
  selectIsExpanded,
  toggleExpanded,
  type CommunityState,
} from '../store/communitySlice';
import {RichTextContent} from './RichTextContent';
import {communityTypography} from '../theme/communityTheme';

const MAX_COLLAPSED_LINES = 3;

type CommunityDispatch = ThunkDispatch<
  {community: CommunityState},
  unknown,
  UnknownAction
>;

interface ExpandTextContentProps {
  post: PostModel;
}

function needsToggle(text: string): boolean {
  if (text.length < 60) {
    return false;
  }
  return text.includes('\n') || text.length > 80;
}

export function ExpandTextContent({post}: ExpandTextContentProps) {
  const dispatch = useDispatch<CommunityDispatch>();
  const expanded = useSelector((state: {community: CommunityState}) =>
    selectIsExpanded(state, post.id),
  );
  const opacity = useRef(new Animated.Value(1)).current;
  const showToggle = needsToggle(post.content);

  useEffect(() => {
    opacity.setValue(0.35);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [expanded, opacity]);

  return (
    <View>
      <Animated.View style={[styles.fade, {opacity}]}>
        <RichTextContent
          content={post.content}
          numberOfLines={expanded ? undefined : MAX_COLLAPSED_LINES}
        />
      </Animated.View>
      {showToggle ? (
        <Pressable
          onPress={() => dispatch(toggleExpanded(post.id))}
          hitSlop={8}>
          <Text style={[communityTypography.expand, styles.toggle]}>
            {expanded ? '收起' : '全文'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fade: {},
  toggle: {
    marginTop: 4,
  },
});
