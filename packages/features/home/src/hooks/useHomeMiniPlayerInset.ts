import {useSelector} from 'react-redux';

export const MUSIC_MINI_PLAYER_BAR_HEIGHT = 72;
export const MAIN_TAB_BAR_HEIGHT = 80;

/** Local selector — avoid @features/music import (module boundary). */
function selectMusicHasActiveSession(state: {
  music?: {currentIndex?: number; playerState?: string};
}): boolean {
  const music = state.music;
  if (!music) {
    return false;
  }
  const index = music.currentIndex ?? -1;
  return (
    index >= 0 &&
    (music.playerState === 'playing' || music.playerState === 'paused')
  );
}

export function useHomeMiniPlayerInset(): number {
  const hasSession = useSelector(selectMusicHasActiveSession);
  if (!hasSession) {
    return 0;
  }
  return MUSIC_MINI_PLAYER_BAR_HEIGHT + MAIN_TAB_BAR_HEIGHT;
}
