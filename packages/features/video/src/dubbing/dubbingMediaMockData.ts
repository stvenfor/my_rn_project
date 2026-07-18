import {
  SHORT_VIDEO_MOCK_COVERS,
  VIDEO_MOCK_SOURCES,
} from '@commons/toolkit';

export interface DubbingVideoItem {
  id: string;
  title: string;
  desc: string;
  videoUrl: string;
  coverUrl: string;
  category: string;
  likeCount: number;
  dislikeCount: number;
  sentenceCount: number;
  difficulty: string;
  uploaderName: string;
  tags: string[];
}

export interface DubbingWorkItem {
  id: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  videoUrl: string;
  coverUrl: string;
  likeCount: number;
  commentCount: number;
  publishedAt: string;
  location: string;
  badge?: string;
  duration?: string;
}

const videoTitles = [
  '恐龙科幻电影回归：《侏罗纪世界2：失落王国》电影预告',
  '【合作】制服牛油果小怪兽 Part 1',
  '哈利波特与魔法石 · 赫敏特辑（上）',
];

const videoDescs = [
  '经典科幻大片预告，适合练习口语节奏与情感表达。',
  '趣味动画片段，句子短、难度低，适合入门配音。',
  '人物特辑片段，练习 RP 女音与角色语气。',
];

const workTitles = [
  '你好世界，这里是中国！',
  '【RP女音】赫敏：It is LeviOsa, not LevioSA!',
  '美诺明年夏天见 · 配音作品',
];

const authors: Array<[string, string]> = [
  ['小趣友宁Sir', 'https://picsum.photos/seed/author1/100/100'],
  ['唯有爱与美不可辜...', 'https://picsum.photos/seed/author2/100/100'],
  ['美诺明年夏天见', 'https://picsum.photos/seed/author3/100/100'],
];

function coverAt(index: number): string {
  return SHORT_VIDEO_MOCK_COVERS[index % SHORT_VIDEO_MOCK_COVERS.length];
}

export function getDubbingVideos(): DubbingVideoItem[] {
  return VIDEO_MOCK_SOURCES.map((source, i) => ({
    id: String(source.id),
    title: i < videoTitles.length ? videoTitles[i]! : source.title,
    desc: i < videoDescs.length ? videoDescs[i]! : source.desc,
    videoUrl: source.url,
    coverUrl: coverAt(i),
    category: source.category,
    likeCount: 3983 - i * 500,
    dislikeCount: 12 + i,
    sentenceCount: 10 - i * 2,
    difficulty: `PreA${i + 1}`,
    uploaderName: authors[i % authors.length]![0],
    tags:
      i === 0
        ? ['合作', '10句', '难度 PreA1', '漫威', '经典大片', '超级英雄']
        : [
            '合作',
            `${10 - i * 2}句`,
            `难度 PreA${i + 1}`,
            source.category,
          ],
  }));
}

export function getDubbingWorks(): DubbingWorkItem[] {
  return VIDEO_MOCK_SOURCES.map((source, i) => ({
    id: `work_${source.id}`,
    title: i < workTitles.length ? workTitles[i]! : source.title,
    authorName: authors[i % authors.length]![0],
    authorAvatar: authors[i % authors.length]![1],
    videoUrl: source.url,
    coverUrl: coverAt(i),
    likeCount: 11000 - i * 2000,
    commentCount: 22 + i * 5,
    publishedAt: `2023-11-${23 - i}`,
    location: i === 2 ? '杭州市' : '北京',
    badge: i === 0 ? '精选' : i === 1 ? '高秀' : undefined,
    duration: `${1 + i}:${10 + i * 5}`,
  }));
}

export function findDubbingVideo(id?: string): DubbingVideoItem | undefined {
  const list = getDubbingVideos();
  return list.find(v => v.id === id) ?? list[0];
}

export function findDubbingWork(id?: string): DubbingWorkItem | undefined {
  const list = getDubbingWorks();
  return list.find(v => v.id === id) ?? list[0];
}
