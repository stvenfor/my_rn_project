import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {CHAT_EMOJI_LIST, chatTheme} from '../theme/chatTheme';

interface Props {
  onPick: (emoji: string) => void;
}

export function EmojiPanel({onPick}: Props) {
  const {width} = useWindowDimensions();
  const cellWidth = width / 8;

  return (
    <View style={styles.wrap}>
      <FlatList
        data={CHAT_EMOJI_LIST as unknown as string[]}
        numColumns={8}
        keyExtractor={item => item}
        scrollEnabled={false}
        renderItem={({item}) => (
          <Pressable
            style={[styles.cell, {width: cellWidth}]}
            onPress={() => onPick(item)}>
            <Text style={styles.emoji}>{item}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: chatTheme.emojiPanelHeight,
    backgroundColor: chatTheme.background,
    paddingVertical: 8,
  },
  cell: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {fontSize: 28},
});
