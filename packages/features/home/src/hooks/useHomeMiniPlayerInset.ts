import {useWindowDimensions} from 'react-native';
import {useSelector} from 'react-redux';

export const MUSIC_MINI_PLAYER_BAR_HEIGHT = 72;
export const MAIN_TAB_BAR_HEIGHT = 80;
/** Aligns with Flutter tablet breakpoint (≥600dp): tab bar offset is 0. */
const TABLET_MIN_WIDTH = 600;

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
  const {width} = useWindowDimensions();
  if (!hasSession) {
    return 0;
  }
  if (width >= TABLET_MIN_WIDTH) {
    return MUSIC_MINI_PLAYER_BAR_HEIGHT;
  }
  return MUSIC_MINI_PLAYER_BAR_HEIGHT + MAIN_TAB_BAR_HEIGHT;
}
