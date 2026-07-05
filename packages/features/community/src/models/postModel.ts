import type {CommentModel} from './commentModel';

export interface PostModel {
  id: string;
  userId: string;
  nickname: string;
  avatar: string;
  content: string;
  publishTime: string;
  source: string;
  images: string[];
  videoUrl?: string;
  videoCoverUrl?: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isMine: boolean;
  previewComments: CommentModel[];
}

export function hasImages(post: PostModel): boolean {
  return post.images.length > 0;
}

export function hasVideo(post: PostModel): boolean {
  return Boolean(post.videoUrl && post.videoUrl.length > 0);
}
