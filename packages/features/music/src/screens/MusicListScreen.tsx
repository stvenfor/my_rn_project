import React, {useCallback} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {RoutePath, type RootStackScreenProps} from '@core/navigation';
import {AppNavBar, AppPageScaffold} from '@ui/design-system';
import {MusicMiniPlayerBar} from '../MusicMiniPlayerBar';
import {MusicSongListTile} from '../components/MusicSongListTile';
import {
  initMusicPlayer,
  playAt,
  selectCurrentSong,
  selectHasActiveSession,
  selectMusicSongs,
  shuffleAndPlay,
  type MusicDispatch,
} from '../musicSlice';
import {musicTheme} from '../theme/musicTheme';
import {miniPlayerBottomInset} from '../utils/miniPlayerInset';
import type {LocalSong} from '../models/localSong';

export function MusicListScreen({
  navigation,
}: RootStackScreenProps<typeof RoutePath.musicList>) {
  const {t} = useTranslation();
  const dispatch = useDispatch<MusicDispatch>();
  const songs = useSelector(selectMusicSongs);
  const currentSong = useSelector(selectCurrentSong);
  const hasSession = useSelector(selectHasActiveSession);
  const miniBarInset = miniPlayerBottomInset(hasSession);

  React.useEffect(() => {
    dispatch(initMusicPlayer());
  }, [dispatch]);

  const openNowPlaying = useCallback(
    (trackId: string) => {
      navigation.navigate(RoutePath.musicNowPlaying, {trackId});
    },
    [navigation],
  );

  const handleSongPress = useCallback(
    async (index: number, trackId: string) => {
      try {
        await dispatch(playAt(index));
      } catch {
        // 播放失败仍允许进入 Now Playing（Mock/TrackPlayer 异常时不阻断导航）。
      }
      openNowPlaying(trackId);
    },
    [dispatch, openNowPlaying],
  );

  const handleShuffle = useCallback(async () => {
    const result = await dispatch(shuffleAndPlay());
    const trackId = shuffleAndPlay.fulfilled.match(result)
      ? result.payload
      : undefined;
    if (trackId) {
      openNowPlaying(trackId);
    }
  }, [dispatch, openNowPlaying]);

  const renderItem = useCallback(
    ({item, index}: {item: LocalSong; index: number}) => (
      <MusicSongListTile
        song={item}
        onPress={() => {
          handleSongPress(index, item.id).catch(() => undefined);
        }}
      />
    ),
    [handleSongPress],
  );

  return (
    <AppPageScaffold
      layout="edgeToEdge"
      backgroundColor={musicTheme.listBackground}>
      <View style={styles.root}>
        <View style={[styles.body, {paddingBottom: miniBarInset}]}>
          <AppNavBar
            title={t('musicListTitle')}
            style="dark"
            showBackButton
            onBack={() => navigation.goBack()}
            right={
              hasSession && currentSong ? (
                <Pressable
                  onPress={() => openNowPlaying(currentSong.id)}
                  style={styles.nowPlayingAction}>
                  <Text style={styles.nowPlayingText}>
                    {t('musicNowPlaying')}
                  </Text>
                </Pressable>
              ) : null
            }
          />
          <FlatList
            data={songs}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        </View>
        {hasSession ? (
          <View style={styles.miniBar}>
            <MusicMiniPlayerBar />
          </View>
        ) : null}
        <Pressable
          onPress={() => {
            handleShuffle().catch(() => undefined);
          }}
          style={[styles.fab, {bottom: 16 + miniBarInset}]}
          accessibilityRole="button"
          accessibilityLabel={t('musicShuffle')}>
          <Text style={styles.fabIcon}>⇄</Text>
        </Pressable>
      </View>
    </AppPageScaffold>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: musicTheme.listBackground,
  },
  body: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 88,
  },
  miniBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  nowPlayingAction: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  nowPlayingText: {
    color: musicTheme.titleColor,
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: musicTheme.fabBackground,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
  },
  fabIcon: {
    color: musicTheme.fabIconColor,
    fontSize: 28,
    fontWeight: '600',
  },
});
