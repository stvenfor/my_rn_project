import {useSelector} from 'react-redux';
import {selectHasActiveSession} from '@features/music';

export const MUSIC_MINI_PLAYER_BAR_HEIGHT = 72;
export const MAIN_TAB_BAR_HEIGHT = 80;

export function useHomeMiniPlayerInset(): number {
  const hasSession = useSelector(selectHasActiveSession);
  if (!hasSession) {
    return 0;
  }
  return MUSIC_MINI_PLAYER_BAR_HEIGHT + MAIN_TAB_BAR_HEIGHT;
}
