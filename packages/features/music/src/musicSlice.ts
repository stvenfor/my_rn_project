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
  formatDuration,
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
  initialized: boolean;
}

const initialState: MusicState = {
  songs: MUSIC_MOCK_SONGS,
  currentIndex: -1,
  playerState: 'stopped',
  positionMs: 0,
  durationMs: 0,
  isMuted: false,
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
        dispatch(musicSlice.actions.setPlayerState('stopped'));
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
    await player.play(song.audioUrl, song.durationMs, {
      id: song.id,
      title: song.title,
      artist: song.artist,
    });
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
    const next = currentIndex < 0 ? 0 : (currentIndex + 1) % songs.length;
    await dispatch(playAt(next));
  },
);

export const playPrevious = createAsyncThunk(
  'music/prev',
  async (_, {getState, dispatch}) => {
    const {currentIndex, songs} = (getState() as {music: MusicState}).music;
    const prev =
      currentIndex < 0 ? 0 : (currentIndex - 1 + songs.length) % songs.length;
    await dispatch(playAt(prev));
  },
);

export const seekTo = createAsyncThunk(
  'music/seek',
  async (positionMs: number) => {
    const player = await createAudioPlayerService();
    await player.seek(positionMs);
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
      if (action.payload === 'stopped') {
        state.currentIndex = -1;
        state.positionMs = 0;
        state.durationMs = 0;
      }
    },
    toggleMute(state) {
      state.isMuted = !state.isMuted;
      createAudioPlayerService().then(p => p.setVolume(state.isMuted ? 0 : 1));
    },
  },
  extraReducers: builder => {
    builder
      .addCase(initMusicPlayer.fulfilled, state => {
        state.initialized = true;
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
export const selectHasActiveSession = (state: {music: MusicState}) => {
  const {currentIndex, playerState} = state.music;
  return (
    currentIndex >= 0 && (playerState === 'playing' || playerState === 'paused')
  );
};

export {formatDuration};
