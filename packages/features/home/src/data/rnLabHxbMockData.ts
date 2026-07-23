export type HxbCourse = {
  id: string;
  name: string;
  tag: string;
  major: string;
  level: string;
  daysToExam: number;
  assessScore: number;
  memberExpire: string;
  listenProgress: number;
  practiceProgress: number;
  wrongCount: number;
  qaCountLabel: string;
  qaBadge: string;
  hoursSinceStudy: number;
  processScore: number;
};

export const HXB_COURSES: HxbCourse[] = [
  {
    id: 'trade',
    name: '国际贸易理论与实务',
    tag: '统',
    major: '会计学',
    level: '自考本科',
    daysToExam: 20,
    assessScore: 20,
    memberExpire: '2026.10.10到期',
    listenProgress: 20,
    practiceProgress: 60,
    wrongCount: 58,
    qaCountLabel: '999+',
    qaBadge: '99+',
    hoursSinceStudy: 10,
    processScore: 20.5,
  },
  {
    id: 'finance',
    name: '财务报表分析',
    tag: '统',
    major: '会计学',
    level: '自考本科',
    daysToExam: 35,
    assessScore: 18,
    memberExpire: '2026.10.10到期',
    listenProgress: 12,
    practiceProgress: 40,
    wrongCount: 31,
    qaCountLabel: '128',
    qaBadge: '12',
    hoursSinceStudy: 26,
    processScore: 18.0,
  },
];

export const HXB_SERVICES = [
  {
    id: 'topic',
    title: '专题学习',
    subtitle: '重点专题 加强巩固',
    tone: 'blue' as const,
  },
  {
    id: 'live',
    title: '重难直播',
    subtitle: '正在直播',
    tone: 'live' as const,
  },
  {
    id: 'memorize',
    title: '智能速背',
    subtitle: '智能筛选 快速掌握',
    tone: 'cyan' as const,
  },
  {
    id: 'mock',
    title: '考前模拟',
    subtitle: '考试前20天开启',
    tone: 'indigo' as const,
  },
] as const;

export const HXB_TABS = [
  {id: 'study', label: '学习'},
  {id: 'message', label: '消息', badge: '99+'},
  {id: 'store', label: '商品库'},
  {id: 'mine', label: '我的'},
] as const;
