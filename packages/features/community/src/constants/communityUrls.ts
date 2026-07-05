/** 对齐 Flutter CommunityAvatarUrls + mock 网络资源 */
export const communityAvatarUrl = (seed: number): string =>
  `https://i.pravatar.cc/200?img=${seed}`;

export const SAMPLE_VIDEO_URL =
  'https://flutter.github.io/assets-for-api-docs/assets/videos/bee.mp4';

export const postImageUrl = (postId: string, index: number): string =>
  `https://picsum.photos/seed/${postId}_${index}/400/400`;

export const videoCoverUrl = (postId: string): string =>
  `https://picsum.photos/seed/video_${postId}/640/360`;
