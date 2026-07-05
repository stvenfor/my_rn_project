import type {CommentModel} from '../models/commentModel';
import type {PostModel} from '../models/postModel';
import {
  communityAvatarUrl,
  postImageUrl,
  SAMPLE_VIDEO_URL,
  videoCoverUrl,
} from '../constants/communityUrls';
import type {PostRepository} from './postRepository';
import {PAGE_SIZE} from './postRepository';

const NICKNAMES = [
  '张三',
  '李四',
  '王五',
  '赵六',
  '小明',
  '小红',
  '开发者',
  '产品经理',
];

const SAMPLE_CONTENTS = [
  '今天去了 @张三 推荐的咖啡店，环境不错。\n#Flutter开发\n欢迎访问：https://flutter.dev',
  '周末 hiking，天气太好了！#户外',
  '刚读完一本好书，推荐 @李四 也看看。',
  '分享一张随手拍～',
  '项目上线啦，感谢团队！#Flutter开发 https://dart.dev',
  '午餐打卡 @王五',
  '学习 GetX 状态管理中…',
];

function createSeededRandom(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) {
    state += 2147483646;
  }
  return {
    nextInt(max: number): number {
      state = (state * 16807) % 2147483647;
      return state % max;
    },
  };
}

function seedComments(
  postId: string,
  now: Date,
  index: number,
): CommentModel[] {
  return [
    {
      id: `c_${postId}_1`,
      postId,
      nickname: NICKNAMES[(index + 1) % NICKNAMES.length],
      avatar: communityAvatarUrl(((index + 2) % 70) + 1),
      content: '说得对！',
      createTime: new Date(
        now.getTime() - (index * 5 + 3) * 60_000,
      ).toISOString(),
    },
    {
      id: `c_${postId}_2`,
      postId,
      nickname: NICKNAMES[(index + 3) % NICKNAMES.length],
      avatar: communityAvatarUrl(((index + 4) % 70) + 1),
      content: '同感 +1',
      createTime: new Date(
        now.getTime() - (index * 5 + 1) * 60_000,
      ).toISOString(),
      replyToNickname: NICKNAMES[index % NICKNAMES.length],
    },
  ];
}

class MockPostRepository implements PostRepository {
  private static instance: MockPostRepository | null = null;

  static getInstance(): MockPostRepository {
    if (!MockPostRepository.instance) {
      MockPostRepository.instance = new MockPostRepository();
    }
    return MockPostRepository.instance;
  }

  private allPosts: PostModel[] = [];
  private commentsByPost = new Map<string, CommentModel[]>();
  private seeded = false;
  private commentSeq = 0;

  resetForTests(): void {
    this.allPosts = [];
    this.commentsByPost.clear();
    this.seeded = false;
    this.commentSeq = 0;
  }

  private ensureSeed(): void {
    if (this.seeded) {
      return;
    }
    this.seeded = true;
    const now = new Date();
    const random = createSeededRandom(42);

    for (let i = 0; i < 35; i += 1) {
      const id = `post_${i}`;
      const imgCount = i % 10 === 0 ? 0 : (i % 9) + 1;
      const isVideo = i % 10 === 0;
      const images = isVideo
        ? []
        : Array.from({length: imgCount}, (_row, j) => postImageUrl(id, j));

      const previewComments = seedComments(id, now, i);
      const post: PostModel = {
        id,
        userId: `user_${i % 8}`,
        nickname: NICKNAMES[i % NICKNAMES.length],
        avatar: communityAvatarUrl((i % 70) + 1),
        content: SAMPLE_CONTENTS[i % SAMPLE_CONTENTS.length],
        publishTime: new Date(
          now.getTime() - (i * 17 + random.nextInt(30)) * 60_000,
        ).toISOString(),
        source: i % 2 === 0 ? '来自 iPhone' : '来自 Android',
        images,
        videoUrl: isVideo ? SAMPLE_VIDEO_URL : undefined,
        videoCoverUrl: isVideo ? videoCoverUrl(String(i)) : undefined,
        likeCount: random.nextInt(200),
        commentCount: 2 + random.nextInt(8),
        isLiked: i % 4 === 0,
        isMine: i === 0,
        previewComments,
      };
      this.allPosts.push(post);
      this.commentsByPost.set(id, [...previewComments]);
    }
  }

  async fetchPosts(page: number, pageSize = PAGE_SIZE): Promise<PostModel[]> {
    this.ensureSeed();
    await delay(400 + page * 50);
    const start = page * pageSize;
    if (start >= this.allPosts.length) {
      return [];
    }
    const end = Math.min(start + pageSize, this.allPosts.length);
    return this.allPosts.slice(start, end).map(clonePost);
  }

  async fetchComments(postId: string): Promise<CommentModel[]> {
    this.ensureSeed();
    await delay(200);
    return [...(this.commentsByPost.get(postId) ?? [])];
  }

  async addComment(params: {
    postId: string;
    content: string;
    replyToNickname?: string;
  }): Promise<CommentModel> {
    this.ensureSeed();
    await delay(300);
    this.commentSeq += 1;
    const comment: CommentModel = {
      id: `c_new_${this.commentSeq}`,
      postId: params.postId,
      nickname: '我',
      avatar: communityAvatarUrl(12),
      content: params.content,
      createTime: new Date().toISOString(),
      replyToNickname: params.replyToNickname,
    };
    const existing = this.commentsByPost.get(params.postId) ?? [];
    this.commentsByPost.set(params.postId, [comment, ...existing]);

    const index = this.allPosts.findIndex(p => p.id === params.postId);
    if (index >= 0) {
      const post = this.allPosts[index];
      const previews = [comment, ...post.previewComments].slice(0, 2);
      this.allPosts[index] = {
        ...post,
        commentCount: post.commentCount + 1,
        previewComments: previews,
      };
    }
    return comment;
  }

  async toggleLike(postId: string, liked: boolean): Promise<PostModel> {
    this.ensureSeed();
    await delay(150);
    const index = this.allPosts.findIndex(p => p.id === postId);
    if (index < 0) {
      throw new Error('post not found');
    }
    const post = this.allPosts[index];
    const updated: PostModel = {
      ...post,
      isLiked: liked,
      likeCount: Math.max(0, post.likeCount + (liked ? 1 : -1)),
    };
    this.allPosts[index] = updated;
    return clonePost(updated);
  }

  async deletePost(postId: string): Promise<void> {
    this.ensureSeed();
    this.allPosts = this.allPosts.filter(p => p.id !== postId);
    this.commentsByPost.delete(postId);
  }
}

function clonePost(post: PostModel): PostModel {
  return {
    ...post,
    images: [...post.images],
    previewComments: post.previewComments.map(c => ({...c})),
  };
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const mockPostRepository = MockPostRepository.getInstance();

export function resetMockPostRepository(): void {
  mockPostRepository.resetForTests();
}
