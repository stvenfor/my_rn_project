import type {ImageSourcePropType} from 'react-native';

export type MusicAlbumArtAssetKey = 'lady' | 'musicRecord';

export interface LocalSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  audioUrl: string;
  durationMs: number;
  albumArtUrl?: string;
  albumArtAsset?: MusicAlbumArtAssetKey;
  accentColor?: string;
}

export function hasNetworkCover(song: LocalSong): boolean {
  return Boolean(song.albumArtUrl?.trim());
}

export function hasAssetCover(song: LocalSong): boolean {
  return song.albumArtAsset != null;
}

export function resolveAlbumArtAsset(
  registry: Record<MusicAlbumArtAssetKey, ImageSourcePropType>,
  key?: MusicAlbumArtAssetKey,
): ImageSourcePropType | undefined {
  if (!key) {
    return undefined;
  }
  return registry[key];
}

export function musicCoverSharedElementId(songId: string): string {
  return `music-cover-${songId}`;
}

export function musicBackgroundSharedElementId(songId: string): string {
  return `music-bg-${songId}`;
}
