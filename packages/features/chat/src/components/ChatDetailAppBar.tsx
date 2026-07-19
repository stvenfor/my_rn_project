import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ChatBackIcon, ChatEllipsisIcon} from './ChatIcons';
import {chatTheme, chatTypography} from '../theme/chatTheme';

interface Props {
  title: string;
  portraitUrl: string;
  isOnline: boolean;
  onBack: () => void;
  onMore?: () => void;
}

/** Matches Flutter `_ChatDetailHeader` (not the unused WeChat app bar). */
export function ChatDetailAppBar({
  title,
  portraitUrl,
  isOnline,
  onBack,
  onMore,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, {paddingTop: insets.top}]}>
      <View style={styles.row}>
        <Pressable onPress={onBack} style={styles.iconBtn} hitSlop={8}>
          <ChatBackIcon />
        </Pressable>
        <Image source={{uri: portraitUrl}} style={styles.avatar} />
        <View style={styles.meta}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
          <Text
            style={[
              styles.status,
              {color: isOnline ? chatTheme.online : chatTheme.labelSecondary},
            ]}>
            {isOnline ? '在线' : '离线'}
          </Text>
        </View>
        <Pressable onPress={onMore} style={styles.iconBtn} hitSlop={8}>
          <ChatEllipsisIcon />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: chatTheme.surface,
    paddingLeft: 4,
    paddingRight: 4,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {width: 36, height: 36, borderRadius: 18},
  meta: {marginLeft: 10, flex: 1},
  titleText: {
    ...chatTypography.headline,
    fontSize: 16,
  },
  status: {
    ...chatTypography.caption,
    marginTop: 1,
  },
});
