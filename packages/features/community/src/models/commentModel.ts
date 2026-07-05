export interface CommentModel {
  id: string;
  postId: string;
  nickname: string;
  avatar: string;
  content: string;
  createTime: string;
  replyToNickname?: string;
}
