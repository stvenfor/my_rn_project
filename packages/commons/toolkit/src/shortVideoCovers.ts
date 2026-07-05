/** 对齐 Flutter `ShortVideoMockSamples._covers` */
export const SHORT_VIDEO_MOCK_COVERS = [
  'https://picsum.photos/seed/sv_play_1/400/700',
  'https://picsum.photos/seed/sv_play_2/400/700',
  'https://picsum.photos/seed/sv_play_3/400/700',
] as const;

export function shortVideoCoverAt(index: number): string {
  return SHORT_VIDEO_MOCK_COVERS[index % SHORT_VIDEO_MOCK_COVERS.length];
}
