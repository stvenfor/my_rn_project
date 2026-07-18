import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  type UnknownAction,
  type ThunkDispatch,
} from '@reduxjs/toolkit';
import {
  createAudioPlayerService,
  setAudioPlayerService,
  type PlayerState,
} from '@core/media-player';
import {MUSIC_MOCK_SONGS, type LocalSong} from './musicMockData';

export type MusicPlayerState = PlayerState;

interface MusicState {
  songs: LocalSong[];
  currentIndex: number;
  playerState: MusicPlayerState;
  positionMs: number;
  durationMs: number;
  isMuted: boolean;
  volumeBeforeMute: number;
  initialized: boolean;
}

const initialState: MusicState = {
  songs: MUSIC_MOCK_SONGS,
  currentIndex: -1,
  playerState: 'stopped',
  positionMs: 0,
  durationMs: 0,
  isMuted: false,
  volumeBeforeMute: 1,
  initialized: false,
};

export const initMusicPlayer = createAsyncThunk(
  'music/init',
  async (_, {dispatch}) => {
    const player = await createAudioPlayerService();
    setAudioPlayerService(player);
    player.setCallbacks({
      onPositionChanged: positionMs => {
        dispatch(musicSlice.actions.setPosition(positionMs));
      },
      onDurationChanged: durationMs => {
        dispatch(musicSlice.actions.setDuration(durationMs));
      },
      onComplete: () => {
        dispatch(playNext());
      },
      onStateChanged: state => {
        dispatch(musicSlice.actions.setPlayerState(state));
      },
    });
  },
);

export const playAt = createAsyncThunk(
  'music/playAt',
  async (index: number, {getState}) => {
    const {songs} = (getState() as {music: MusicState}).music;
    if (index < 0 || index >= songs.length) {
      return;
    }
    const song = songs[index];
    const player = await createAudioPlayerService();
    try {
      await Promise.race([
        player.play(song.audioUrl, song.durationMs, {
          id: song.id,
          title: song.title,
          artist: song.artist,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('play timeout')), 8000),
        ),
      ]);
    } catch (error) {
      // 播放失败不阻断 UI：列表页已乐观切歌并导航到 Now Playing。
      console.warn('[music] playAt failed:', error);
    }
    return {index, durationMs: song.durationMs};
  },
);

export const togglePlayPause = createAsyncThunk(
  'music/toggle',
  async (_, {getState, dispatch}) => {
    const music = (getState() as {music: MusicState}).music;
    const player = await createAudioPlayerService();
    if (music.currentIndex < 0) {
      await dispatch(playAt(0));
      return;
    }
    if (music.playerState === 'playing') {
      await player.pause();
    } else if (music.playerState === 'paused') {
      await player.resume();
    }
  },
);

export const playNext = createAsyncThunk(
  'music/next',
  async (_, {getState, dispatch}) => {
    const {currentIndex, songs} = (getState() as {music: MusicState}).music;
    if (songs.length === 0) {
      return;
    }
    const next = currentIndex + 1;
    if (next >= songs.length) {
      await dispatch(playAt(0));
    } else {
      await dispatch(playAt(next));
    }
  },
);

export const playPrevious = createAsyncThunk(
  'music/prev',
  async (_, {getState, dispatch}) => {
    const {currentIndex, songs} = (getState() as {music: MusicState}).music;
    if (songs.length === 0) {
      return;
    }
    const prev = currentIndex - 1;
    if (prev < 0) {
      await dispatch(playAt(songs.length - 1));
    } else {
      await dispatch(playAt(prev));
    }
  },
);

export const shuffleAndPlay = createAsyncThunk(
  'music/shuffle',
  async (_, {getState, dispatch}) => {
    const {songs} = (getState() as {music: MusicState}).music;
    if (songs.length === 0) {
      return undefined;
    }
    const index = Date.now() % songs.length;
    await dispatch(playAt(index));
    return songs[index]?.id;
  },
);

export const seekTo = createAsyncThunk(
  'music/seek',
  async (positionMs: number, {getState}) => {
    const music = (getState() as {music: MusicState}).music;
    const player = await createAudioPlayerService();
    const maxMs =
      music.durationMs > 0
        ? music.durationMs
        : music.currentIndex >= 0
        ? music.songs[music.currentIndex]?.durationMs ?? 0
        : 0;
    const clamped = Math.max(0, Math.min(positionMs, maxMs));
    await player.seek(clamped);
    return clamped;
  },
);

export const stopPlayback = createAsyncThunk('music/stop', async () => {
  const player = await createAudioPlayerService();
  await player.stop();
});

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setPosition(state, action: PayloadAction<number>) {
      state.positionMs = action.payload;
    },
    setDuration(state, action: PayloadAction<number>) {
      state.durationMs = action.payload;
    },
    setPlayerState(state, action: PayloadAction<MusicPlayerState>) {
      state.playerState = action.payload;
      if (action.payload === 'stopped' && state.currentIndex < 0) {
        state.positionMs = 0;
        state.durationMs = 0;
      }
    },
    toggleMute(state) {
      if (state.isMuted) {
        const restoreVolume = state.volumeBeforeMute;
        state.isMuted = false;
        createAudioPlayerService().then(p => p.setVolume(restoreVolume));
      } else {
        state.volumeBeforeMute = 1;
        state.isMuted = true;
        createAudioPlayerService().then(p => p.setVolume(0));
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(initMusicPlayer.fulfilled, state => {
        state.initialized = true;
      })
      // Flutter playAt 先写 currentIndex/playing，再 await 音频 —— 乐观更新保证点击立刻有反馈
      .addCase(playAt.pending, (state, action) => {
        const index = action.meta.arg;
        if (index < 0 || index >= state.songs.length) {
          return;
        }
        state.currentIndex = index;
        state.durationMs = state.songs[index]?.durationMs ?? 0;
        state.positionMs = 0;
        state.playerState = 'playing';
      })
      .addCase(playAt.fulfilled, (state, action) => {
        if (!action.payload) {
          return;
        }
        state.currentIndex = action.payload.index;
        state.durationMs = action.payload.durationMs;
        state.positionMs = 0;
        state.playerState = 'playing';
      })
      .addCase(seekTo.fulfilled, (state, action) => {
        if (action.payload != null) {
          state.positionMs = action.payload;
        }
      })
      .addCase(stopPlayback.fulfilled, state => {
        state.currentIndex = -1;
        state.positionMs = 0;
        state.durationMs = 0;
        state.playerState = 'stopped';
      });
  },
});

export const musicReducer = musicSlice.reducer;
export type MusicDispatch = ThunkDispatch<
  {music: MusicState},
  unknown,
  UnknownAction
>;
export const {toggleMute} = musicSlice.actions;

export const selectMusicSongs = (state: {music: MusicState}) =>
  state.music.songs;
export const selectCurrentSong = (state: {music: MusicState}) => {
  const {currentIndex, songs} = state.music;
  if (currentIndex < 0 || currentIndex >= songs.length) {
    return null;
  }
  return songs[currentIndex];
};
export const selectMusicPlayerState = (state: {music: MusicState}) =>
  state.music.playerState;
export const selectMusicPosition = (state: {music: MusicState}) =>
  state.music.positionMs;
export const selectMusicDuration = (state: {music: MusicState}) =>
  state.music.durationMs;
export const selectMusicIsMuted = (state: {music: MusicState}) =>
  state.music.isMuted;
export const selectHasActiveSession = (state: {music: MusicState}) => {
  const {currentIndex, playerState} = state.music;
  return (
    currentIndex >= 0 && (playerState === 'playing' || playerState === 'paused')
  );
};

export {formatMusicDuration} from './utils/formatMusicDuration';
