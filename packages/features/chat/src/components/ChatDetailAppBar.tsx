import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {AppNavBar} from '@ui/design-system';
import {chatTheme} from '../theme/chatTheme';

interface Props {
  title: string;
  portraitUrl: string;
  isOnline: boolean;
  onBack: () => void;
  onMore?: () => void;
}

export function ChatDetailAppBar({
  title,
  portraitUrl,
  isOnline,
  onBack,
  onMore,
}: Props) {
  return (
    <AppNavBar
      showBackButton
      onBack={onBack}
      backgroundColor={chatTheme.pageBackground}
      centerTitle={false}
      titleComponent={
        <View style={styles.titleRow}>
          <Image source={{uri: portraitUrl}} style={styles.avatar} />
          <View style={styles.meta}>
            <Text style={styles.titleText} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.status}>{isOnline ? '在线' : '离线'}</Text>
          </View>
        </View>
      }
      right={
        <Pressable onPress={onMore} style={styles.moreBtn}>
          <Text style={styles.moreText}>⋯</Text>
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {width: 36, height: 36, borderRadius: 18},
  meta: {marginLeft: 8, flex: 1},
  titleText: {fontSize: 16, fontWeight: '600', color: chatTheme.titleBlack},
  status: {fontSize: 12, color: chatTheme.textHint, marginTop: 2},
  moreBtn: {paddingHorizontal: 8},
  moreText: {fontSize: 22, color: chatTheme.iconMuted},
});
