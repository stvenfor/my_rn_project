import type {FeedItem} from '../communitySlice';

const NICKNAMES = [
  'Alice',
  'Bob',
  'Carol',
  'David',
  'Eve',
  'Frank',
  'Grace',
  'Henry',
];

const SAMPLE_CONTENTS = [
  '今天去了 @张三 推荐的咖啡店，环境不错。',
  '周末 hiking，天气太好了！',
  '刚读完一本好书，推荐大家也看看。',
  '分享一张随手拍～',
  '项目上线啦，感谢团队！',
  '午餐打卡',
  '学习 React Native 鸿蒙适配中…',
];

function buildMockFeed(): FeedItem[] {
  const now = Date.now();
  return Array.from({length: 12}, (_row, i) => {
    const id = `post_${i}`;
    const isVideo = i % 5 === 0;
    const imgCount = isVideo ? 0 : (i % 3) + 1;
    return {
      id,
      userId: `user_${i % 8}`,
      author: NICKNAMES[i % NICKNAMES.length],
      avatar: `https://picsum.photos/seed/avatar_${i}/80/80`,
      content: SAMPLE_CONTENTS[i % SAMPLE_CONTENTS.length],
      publishTime: new Date(now - i * 17 * 60_000).toISOString(),
      source: i % 2 === 0 ? '来自 iPhone' : '来自 Android',
      likes: (i * 17) % 200,
      commentCount: i % 7,
      images: isVideo
        ? undefined
        : Array.from(
            {length: imgCount},
            (_img, index) =>
              `https://picsum.photos/seed/${id}_${index}/400/400`,
          ),
      videoUrl: isVideo
        ? 'https://flutter.github.io/assets-for-api-docs/assets/videos/bee.mp4'
        : undefined,
      videoCoverUrl: isVideo
        ? `https://picsum.photos/seed/video_${i}/640/360`
        : undefined,
    };
  });
}

let cachedFeed: FeedItem[] | null = null;

export async function fetchCommunityFeed(): Promise<FeedItem[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  if (!cachedFeed) {
    cachedFeed = buildMockFeed();
  }
  return [...cachedFeed];
}

export function resetCommunityFeedCache(): void {
  cachedFeed = null;
}
