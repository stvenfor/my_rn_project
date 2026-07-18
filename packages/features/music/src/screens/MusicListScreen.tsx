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

  /**
   * Flutter: playAt → push NowPlaying。
   * 关键点勿 await play：TrackPlayer 在部分端（如鸿蒙）setup/play 会挂起，
   * 导致看起来「点击无反应」。先导航 + 乐观切歌，播放异步进行。
   */
  const handleSongPress = useCallback(
    (index: number, trackId: string) => {
      openNowPlaying(trackId);
      dispatch(playAt(index)).catch(() => undefined);
    },
    [dispatch, openNowPlaying],
  );

  const handleShuffle = useCallback(() => {
    if (songs.length === 0) {
      return;
    }
    const index = Date.now() % songs.length;
    const trackId = songs[index]?.id;
    if (!trackId) {
      return;
    }
    openNowPlaying(trackId);
    dispatch(playAt(index)).catch(() => undefined);
  }, [dispatch, openNowPlaying, songs]);

  const renderItem = useCallback(
    ({item, index}: {item: LocalSong; index: number}) => (
      <MusicSongListTile
        song={item}
        onPress={() => handleSongPress(index, item.id)}
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
                  style={styles.nowPlayingAction}
                  hitSlop={8}>
                  <Text style={styles.nowPlayingText}>
                    {t('musicNowPlaying')}
                  </Text>
                </Pressable>
              ) : null
            }
          />
          <FlatList
            style={styles.list}
            data={songs}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={ListSeparator}
          />
        </View>
        {hasSession ? (
          <View style={styles.miniBar} pointerEvents="box-none">
            <MusicMiniPlayerBar />
          </View>
        ) : null}
        <Pressable
          onPress={handleShuffle}
          style={[styles.fab, {bottom: 16 + miniBarInset}]}
          accessibilityRole="button"
          accessibilityLabel={t('musicShuffle')}>
          <Text style={styles.fabIcon}>⇄</Text>
        </Pressable>
      </View>
    </AppPageScaffold>
  );
}

function ListSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: musicTheme.listBackground,
  },
  body: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 88,
    flexGrow: 1,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginLeft: 88,
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
    fontWeight: '500',
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
    zIndex: 20,
  },
  fabIcon: {
    color: musicTheme.fabIconColor,
    fontSize: 26,
    fontWeight: '600',
    transform: [{rotate: '90deg'}],
  },
});
