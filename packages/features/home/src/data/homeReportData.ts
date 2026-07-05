export interface LearningHighlight {
  emoji: string;
  title: string;
  subtitle: string;
  trailing: {type: 'score' | 'emoji' | 'play'; value?: string};
}

export interface LearningRecord {
  emoji: string;
  title: string;
  subtitle: string;
  time: string;
  status: string;
  statusHighlight?: boolean;
}

export const learningHighlights: LearningHighlight[] = [
  {
    emoji: '🎬',
    title: '《哈利波特》第3章',
    subtitle: '视频配音 · 刚刚发布',
    trailing: {type: 'score', value: '100'},
  },
  {
    emoji: '🏆',
    title: '解锁「45天」打卡勋章',
    subtitle: '里程碑达成 · 太棒了！',
    trailing: {type: 'emoji', value: '🎉'},
  },
  {
    emoji: '🎵',
    title: '"Wingardium Leviosa!"',
    subtitle: '满分句子 · 可播放原声',
    trailing: {type: 'play'},
  },
];

export const learningRecords: LearningRecord[] = [
  {
    emoji: '🎬',
    title: '视频配音',
    subtitle: '哈利波特 第3章',
    time: '18:32',
    status: '已发布',
    statusHighlight: true,
  },
  {
    emoji: '⚔️',
    title: '配音闯关',
    subtitle: 'Level 8 · 3关',
    time: '17:10',
    status: '15 min',
  },
  {
    emoji: '📚',
    title: '同步练',
    subtitle: 'PEP 五年级上册 Unit 3',
    time: '16:45',
    status: '8 min',
  },
  {
    emoji: '🤖',
    title: 'AI 外教',
    subtitle: '自由对话 · Tom老师',
    time: '15:20',
    status: '12 min',
  },
  {
    emoji: '🎧',
    title: '听力练习',
    subtitle: '英美绕口令 · 5题',
    time: '14:00',
    status: '5 min',
  },
];
