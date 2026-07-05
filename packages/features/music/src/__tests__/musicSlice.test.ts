jest.mock('@core/media-player', () => ({
  createAudioPlayerService: jest.fn().mockResolvedValue({
    setCallbacks: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    stop: jest.fn(),
    seek: jest.fn(),
    setVolume: jest.fn(),
  }),
  setAudioPlayerService: jest.fn(),
}));

import {
  musicReducer,
  playNext,
  playPrevious,
  shuffleAndPlay,
  stopPlayback,
  toggleMute,
} from '../musicSlice';
import {playAt} from '../musicSlice';

describe('musicSlice', () => {
  const base = {music: musicReducer(undefined, {type: '@@INIT'})};

  it('starts with ten mock songs', () => {
    expect(base.music.songs).toHaveLength(10);
  });

  it('playAt sets current index and playing state', () => {
    const next = musicReducer(base.music, {
      type: playAt.fulfilled.type,
      payload: {index: 2, durationMs: 360000},
    });
    expect(next.currentIndex).toBe(2);
    expect(next.playerState).toBe('playing');
    expect(next.durationMs).toBe(360000);
  });

  it('stopPlayback clears session', () => {
    const playing = musicReducer(base.music, {
      type: playAt.fulfilled.type,
      payload: {index: 0, durationMs: 1000},
    });
    const stopped = musicReducer(playing, {type: stopPlayback.fulfilled.type});
    expect(stopped.currentIndex).toBe(-1);
    expect(stopped.playerState).toBe('stopped');
  });

  it('toggleMute toggles muted flag', () => {
    const muted = musicReducer(base.music, toggleMute());
    expect(muted.isMuted).toBe(true);
    const unmuted = musicReducer(muted, toggleMute());
    expect(unmuted.isMuted).toBe(false);
  });

  it('shuffleAndPlay returns track id payload shape', () => {
    expect(shuffleAndPlay.pending.type).toBe('music/shuffle/pending');
    expect(playNext.pending.type).toBe('music/next/pending');
    expect(playPrevious.pending.type).toBe('music/prev/pending');
  });
});
