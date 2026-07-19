import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ImConversation} from '@core/im';
import {formatConversationTime} from '../utils/formatChatTime';
import {chatTheme, chatTypography} from '../theme/chatTheme';

interface Props {
  conversation: ImConversation;
  onPress: () => void;
}

export function ConversationListItem({conversation, onPress}: Props) {
  const unread =
    conversation.unreadCount > 99 ? '99+' : String(conversation.unreadCount);

  return (
    <Pressable style={styles.wrap} onPress={onPress}>
      <View style={styles.avatarWrap}>
        <Image source={{uri: conversation.portraitUrl}} style={styles.avatar} />
        {conversation.isOnline ? <View style={styles.onlineDot} /> : null}
      </View>
      <View style={styles.meta}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {conversation.title}
          </Text>
          <Text style={styles.time}>
            {formatConversationTime(conversation.lastMessageTime)}
          </Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.subtitle} numberOfLines={1}>
            {conversation.lastMessage}
          </Text>
          {conversation.unreadCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unread}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: chatTheme.surface,
  },
  avatarWrap: {width: 52, height: 52},
  avatar: {width: 52, height: 52, borderRadius: 26},
  onlineDot: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: chatTheme.online,
    borderWidth: 2,
    borderColor: chatTheme.surface,
  },
  meta: {flex: 1, marginLeft: 12},
  topRow: {flexDirection: 'row', alignItems: 'center'},
  title: {
    flex: 1,
    ...chatTypography.headline,
  },
  time: {...chatTypography.caption},
  bottomRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  subtitle: {
    flex: 1,
    ...chatTypography.subhead,
  },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: chatTheme.unreadBadge,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
