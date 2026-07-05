import {musicTheme} from '../theme/musicTheme';

export function miniPlayerBottomInset(visible: boolean): number {
  return visible ? musicTheme.miniPlayerBarHeight : 0;
}
