import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ImConversation} from '@core/im';
import {formatConversationTime} from '../utils/formatChatTime';
import {chatTheme} from '../theme/chatTheme';

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
    backgroundColor: '#FFFFFF',
  },
  avatarWrap: {width: 48, height: 48},
  avatar: {width: 48, height: 48, borderRadius: 24},
  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: chatTheme.wechatGreen,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  meta: {flex: 1, marginLeft: 12},
  topRow: {flexDirection: 'row', alignItems: 'center'},
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: chatTheme.titleBlack,
  },
  time: {fontSize: 12, color: chatTheme.textHint},
  bottomRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  subtitle: {
    flex: 1,
    fontSize: 14,
    color: chatTheme.textSecondary,
  },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: chatTheme.unreadRed,
  },
  badgeText: {color: '#FFFFFF', fontSize: 11},
});
