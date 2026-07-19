import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {chatTheme} from '../theme/chatTheme';
import {ChatCameraIcon, ChatPhotoIcon} from './ChatIcons';

interface Props {
  onPickGallery: () => void;
  onPickCamera: () => void;
}

export function MorePanel({onPickGallery, onPickCamera}: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable style={styles.item} onPress={onPickGallery}>
        <View style={styles.iconBox}>
          <ChatPhotoIcon />
        </View>
        <Text style={styles.label}>相册</Text>
      </Pressable>
      <Pressable style={styles.item} onPress={onPickCamera}>
        <View style={styles.iconBox}>
          <ChatCameraIcon />
        </View>
        <Text style={styles.label}>拍摄</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: chatTheme.emojiPanelHeight,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: chatTheme.background,
  },
  item: {alignItems: 'center'},
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: chatTheme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {fontSize: 12, color: chatTheme.labelSecondary, marginTop: 8},
});
