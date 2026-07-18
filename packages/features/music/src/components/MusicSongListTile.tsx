import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {MusicCoverAvatar} from './MusicCoverAvatar';
import {musicTheme} from '../theme/musicTheme';
import type {LocalSong} from '../models/localSong';

export interface MusicSongListTileProps {
  song: LocalSong;
  onPress: () => void;
}

/** Align Flutter Material ListTile row for MusicListPage._SongListTile */
export function MusicSongListTile({song, onPress}: MusicSongListTileProps) {
  const {t} = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
      android_ripple={{color: 'rgba(255,255,255,0.12)'}}
      accessibilityRole="button"
      accessibilityLabel={song.title}>
      <MusicCoverAvatar song={song} />
      <View style={styles.meta}>
        <Text style={styles.title} numberOfLines={1}>
          {song.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {t('musicByArtist', {artist: song.artist})}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 72,
    backgroundColor: musicTheme.listBackground,
  },
  rowPressed: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  meta: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    color: musicTheme.titleColor,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22,
  },
  subtitle: {
    color: musicTheme.subtitleColor,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
});
