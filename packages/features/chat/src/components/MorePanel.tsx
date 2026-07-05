import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {chatTheme} from '../theme/chatTheme';

interface Props {
  onPickGallery: () => void;
  onPickCamera: () => void;
}

export function MorePanel({onPickGallery, onPickCamera}: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable style={styles.item} onPress={onPickGallery}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>🖼</Text>
        </View>
        <Text style={styles.label}>相册</Text>
      </Pressable>
      <Pressable style={styles.item} onPress={onPickCamera}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>📷</Text>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: chatTheme.panelBackground,
  },
  item: {alignItems: 'center', marginRight: 24},
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {fontSize: 24},
  label: {fontSize: 12, color: chatTheme.textSecondary, marginTop: 8},
});
