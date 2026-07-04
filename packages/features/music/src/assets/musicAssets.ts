import type {ImageSourcePropType} from 'react-native';

export const musicAssets = {
  lady: require('../../assets/defaults/lady.jpeg'),
  musicRecord: require('../../assets/defaults/music_record.jpeg'),
} as const satisfies Record<string, ImageSourcePropType>;

export const MUSIC_ASSET_MANIFEST: Record<keyof typeof musicAssets, string> = {
  lady: 'packages/features/music/assets/defaults/lady.jpeg',
  musicRecord: 'packages/features/music/assets/defaults/music_record.jpeg',
};
