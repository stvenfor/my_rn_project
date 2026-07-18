export type SearchRankTab =
  | 'hotDubbing'
  | 'reading'
  | 'series'
  | 'record'
  | 'collaboration';

export const SEARCH_RANK_TABS: {key: SearchRankTab; label: string}[] = [
  {key: 'hotDubbing', label: '热配榜'},
  {key: 'reading', label: '诵读榜'},
  {key: 'series', label: '剧集榜'},
  {key: 'record', label: '记录榜'},
  {key: 'collaboration', label: '合作榜'},
];

export interface SearchRankItem {
  id: string;
  rank: number;
  title: string;
  subtitle: string;
  coverUrl: string;
}

export const SEARCH_HISTORY_SEED = [
  '客户管理',
  '二手车评估',
  '直播话术',
  '签到商城',
  '学习报告',
];

export const SEARCH_DISCOVERY_SEED = [
  '新能源',
  '门店短视频',
  '恐贪定投',
  '配音练习',
  '客户跟进',
  '展厅拍摄',
];

export const SEARCH_FILTER_TAGS = ['全部', '课程', '视频', '资讯', '工具'];

export function buildSearchRankMock(tab: SearchRankTab): SearchRankItem[] {
  return Array.from({length: 8}, (_, i) => ({
    id: `${tab}-${i + 1}`,
    rank: i + 1,
    title: `${SEARCH_RANK_TABS.find(t => t.key === tab)?.label ?? ''}条目 ${
      i + 1
    }`,
    subtitle: '热度持续上升',
    coverUrl: `https://picsum.photos/seed/search-rank-${i + 1}/144/144`,
  }));
}
