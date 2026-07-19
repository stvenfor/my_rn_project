import React, {useEffect, useRef, useState} from 'react';
import {Animated, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ImMessage} from '@core/im';
import {readStatusLabel} from '../utils/timeDivider';
import {chatAvatarUrls} from '../models/chatAvatarUrls';
import {bubbleRadiusFor, chatTheme, chatTypography} from '../theme/chatTheme';

interface Props {
  message: ImMessage;
  peerAvatar: string;
  playingVoiceId: string | null;
  onLongPress: () => void;
  onImagePress: (uri: string) => void;
  onVoicePress: () => void;
}

function VoiceWave({isPlaying}: {isPlaying: boolean}) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    const id = setInterval(() => setFrame(f => (f + 1) % 3), 200);
    return () => clearInterval(id);
  }, [isPlaying]);

  const heights = isPlaying
    ? [8 + frame * 2, 14 + ((frame + 1) % 3) * 2, 10 + frame]
    : [8, 14, 10];

  return (
    <View style={styles.waveRow}>
      {heights.map((h, i) => (
        <View key={i} style={[styles.waveBar, {height: h}]} />
      ))}
    </View>
  );
}

export function MessageBubble({
  message,
  peerAvatar,
  playingVoiceId,
  onLongPress,
  onImagePress,
  onVoicePress,
}: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const isSelf = message.isSelf;
    translateX.setValue(isSelf ? 16 : -16);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [message.id, message.isSelf, opacity, translateX]);

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
  const failed = message.sendStatus === 'failed';
  const isPlaying = playingVoiceId === message.id;
  const voiceDuration = Math.min(
    Math.max(message.voiceDurationSeconds ?? 1, 1),
    60,
  );
  const voiceWidth = Math.min(Math.max(80 + voiceDuration * 3, 80), 200);

  return (
    <Animated.View
      style={[
        styles.row,
        isSelf ? styles.rowSelf : styles.rowPeer,
        {opacity, transform: [{translateX}]},
      ]}>
      {!isSelf ? (
        <Image source={{uri: peerAvatar}} style={styles.avatar} />
      ) : null}
      <View style={[styles.col, isSelf ? styles.colSelf : styles.colPeer]}>
        <Pressable
          onLongPress={onLongPress}
          style={[
            message.type === 'text' ? styles.bubblePad : styles.bubbleBare,
            bubbleRadiusFor(isSelf),
            isSelf ? styles.bubbleSelf : styles.bubblePeer,
          ]}>
          {message.type === 'text' ? (
            <Text
              style={
                isSelf
                  ? chatTypography.selfBubbleText
                  : chatTypography.peerBubbleText
              }>
              {message.content}
            </Text>
          ) : null}
          {message.type === 'image' ? (
            <Pressable
              onPress={() =>
                onImagePress(message.remoteUrl ?? message.localUri ?? '')
              }>
              <Image
                source={{uri: message.remoteUrl ?? message.localUri}}
                style={styles.image}
                resizeMode="cover"
              />
            </Pressable>
          ) : null}
          {message.type === 'voice' ? (
            <Pressable
              style={[styles.voiceRow, {width: voiceWidth}]}
              onPress={onVoicePress}>
              {!isSelf ? <VoiceWave isPlaying={isPlaying} /> : null}
              {!isSelf ? <View style={styles.voiceGap} /> : null}
              <Text style={styles.voiceDur}>{voiceDuration}"</Text>
              {isSelf ? <View style={styles.voiceGap} /> : null}
              {isSelf ? <VoiceWave isPlaying={isPlaying} /> : null}
            </Pressable>
          ) : null}
        </Pressable>
        {status ? (
          <Text
            style={[
              styles.status,
              failed ? styles.statusFailed : styles.statusNormal,
            ]}>
            {status}
          </Text>
        ) : null}
      </View>
      {isSelf ? (
        <Image source={{uri: chatAvatarUrls.self}} style={styles.avatar} />
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'flex-end',
  },
  rowSelf: {justifyContent: 'flex-end'},
  rowPeer: {justifyContent: 'flex-start'},
  avatar: {width: 32, height: 32, borderRadius: 16},
  col: {maxWidth: '72%'},
  colSelf: {alignItems: 'flex-end', marginRight: 8},
  colPeer: {alignItems: 'flex-start', marginLeft: 8},
  bubblePad: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleBare: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    overflow: 'hidden',
  },
  bubbleSelf: {backgroundColor: chatTheme.selfBubble},
  bubblePeer: {backgroundColor: chatTheme.peerBubble},
  image: {width: 200, height: 200, maxWidth: 200, maxHeight: 200},
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  voiceGap: {width: 8},
  voiceDur: {fontSize: 14, color: 'rgba(0,0,0,0.87)'},
  waveRow: {flexDirection: 'row', alignItems: 'center'},
  waveBar: {
    width: 3,
    marginHorizontal: 1,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.54)',
  },
  status: {fontSize: 11, marginTop: 4},
  statusNormal: {color: chatTheme.labelSecondary},
  statusFailed: {color: chatTheme.unreadBadge},
  timeWrap: {alignItems: 'center', paddingVertical: 12},
  timeText: {
    fontSize: 12,
    color: chatTheme.labelSecondary,
  },
  systemWrap: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  systemText: {
    ...chatTypography.caption,
    textAlign: 'center',
  },
});
