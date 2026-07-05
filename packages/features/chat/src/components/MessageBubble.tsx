import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ImMessage} from '@core/im';
import {readStatusLabel} from '../utils/timeDivider';
import {chatAvatarUrls} from '../models/chatAvatarUrls';
import {chatTheme} from '../theme/chatTheme';

interface Props {
  message: ImMessage;
  peerAvatar: string;
  playingVoiceId: string | null;
  onLongPress: () => void;
  onImagePress: (uri: string) => void;
  onVoicePress: () => void;
}

export function MessageBubble({
  message,
  peerAvatar,
  playingVoiceId,
  onLongPress,
  onImagePress,
  onVoicePress,
}: Props) {
  if (message.type === 'time') {
    return (
      <View style={styles.timeWrap}>
        <Text style={styles.timeText}>{message.content}</Text>
      </View>
    );
  }

  if (message.type === 'system') {
    return (
      <View style={styles.systemWrap}>
        <Text style={styles.systemText}>{message.content}</Text>
      </View>
    );
  }

  const isSelf = message.isSelf;
  const status = readStatusLabel(message);

  return (
    <View style={[styles.row, isSelf ? styles.rowSelf : styles.rowPeer]}>
      {!isSelf ? (
        <Image source={{uri: peerAvatar}} style={styles.avatar} />
      ) : null}
      <View style={isSelf ? styles.colSelf : styles.colPeer}>
        <Pressable
          onLongPress={onLongPress}
          style={[
            styles.bubble,
            isSelf ? styles.bubbleSelf : styles.bubblePeer,
          ]}>
          {message.type === 'text' ? (
            <Text style={styles.text}>{message.content}</Text>
          ) : null}
          {message.type === 'image' ? (
            <Pressable
              onPress={() =>
                onImagePress(message.remoteUrl ?? message.localUri ?? '')
              }>
              <Image
                source={{uri: message.remoteUrl ?? message.localUri}}
                style={styles.image}
              />
            </Pressable>
          ) : null}
          {message.type === 'voice' ? (
            <Pressable style={styles.voiceRow} onPress={onVoicePress}>
              <Text style={styles.voiceIcon}>
                {playingVoiceId === message.id ? '▮▮' : '▶'}
              </Text>
              <Text style={styles.voiceDur}>
                {message.voiceDurationSeconds ?? 0}"
              </Text>
            </Pressable>
          ) : null}
        </Pressable>
        {status ? <Text style={styles.status}>{status}</Text> : null}
      </View>
      {isSelf ? (
        <Image source={{uri: chatAvatarUrls.self}} style={styles.avatar} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'flex-start',
  },
  rowSelf: {justifyContent: 'flex-end'},
  rowPeer: {justifyContent: 'flex-start'},
  avatar: {width: 40, height: 40, borderRadius: 20},
  colSelf: {alignItems: 'flex-end', maxWidth: '72%'},
  colPeer: {alignItems: 'flex-start', maxWidth: '72%', marginLeft: 8},
  bubble: {
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleSelf: {backgroundColor: chatTheme.selfBubble},
  bubblePeer: {backgroundColor: chatTheme.peerBubble},
  text: {fontSize: 15, color: chatTheme.titleBlack},
  image: {width: 160, height: 120, borderRadius: 6},
  voiceRow: {flexDirection: 'row', alignItems: 'center', minWidth: 80},
  voiceIcon: {fontSize: 14, color: chatTheme.iconMuted, marginRight: 8},
  voiceDur: {fontSize: 14, color: chatTheme.titleBlack},
  status: {fontSize: 11, color: chatTheme.textHint, marginTop: 4},
  timeWrap: {alignItems: 'center', paddingVertical: 8},
  timeText: {
    fontSize: 12,
    color: '#FFFFFF',
    backgroundColor: chatTheme.timeBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  systemWrap: {alignItems: 'center', paddingVertical: 8},
  systemText: {fontSize: 12, color: chatTheme.textHint},
});
