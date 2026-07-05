import type {CommentModel} from '../models/commentModel';
import type {PostModel} from '../models/postModel';

export interface PostRepository {
  fetchPosts(page: number, pageSize?: number): Promise<PostModel[]>;
  fetchComments(postId: string): Promise<CommentModel[]>;
  addComment(params: {
    postId: string;
    content: string;
    replyToNickname?: string;
  }): Promise<CommentModel>;
  toggleLike(postId: string, liked: boolean): Promise<PostModel>;
  deletePost(postId: string): Promise<void>;
}

export const PAGE_SIZE = 10;
