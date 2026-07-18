import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import type {PostModel} from '../models/postModel';
import {selectIsExpanded, toggleExpanded} from '../store/communitySlice';
import {RichTextContent} from './RichTextContent';
import {communityTypography} from '../theme/communityTheme';

const MAX_COLLAPSED_LINES = 3;

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
  const dispatch = useDispatch();
  const expanded = useSelector(state =>
    selectIsExpanded(state as Parameters<typeof selectIsExpanded>[0], post.id),
  );
  const showToggle = needsToggle(post.content);

  return (
    <View>
      <RichTextContent
        content={post.content}
        numberOfLines={expanded ? undefined : MAX_COLLAPSED_LINES}
      />
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
  toggle: {
    marginTop: 4,
  },
});
