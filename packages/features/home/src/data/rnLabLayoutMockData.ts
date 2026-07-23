export type RnLabTicketStatus =
  | 'pending'
  | 'processing'
  | 'blocked'
  | 'done';

export type RnLabTicketPriority = 'P0' | 'P1' | 'P2' | 'P3';

export type RnLabTicketCategory =
  | '线索'
  | '售后'
  | '交付'
  | '合规'
  | '增长';

export interface RnLabTicket {
  id: string;
  title: string;
  customer: string;
  category: RnLabTicketCategory;
  status: RnLabTicketStatus;
  priority: RnLabTicketPriority;
  assignee: string;
  amount: number;
  progress: number;
  slaHoursLeft: number;
  tags: string[];
  updatedAt: string;
  note: string;
}

export const RN_LAB_STATUS_TABS: {
  key: RnLabTicketStatus | 'all';
  label: string;
}[] = [
  {key: 'all', label: '全部'},
  {key: 'pending', label: '待处理'},
  {key: 'processing', label: '处理中'},
  {key: 'blocked', label: '阻塞'},
  {key: 'done', label: '已完成'},
];

export const RN_LAB_PRIORITIES: RnLabTicketPriority[] = [
  'P0',
  'P1',
  'P2',
  'P3',
];

export const RN_LAB_CATEGORIES: RnLabTicketCategory[] = [
  '线索',
  '售后',
  '交付',
  '合规',
  '增长',
];

const ASSIGNEES = ['林晓', '周凯', '陈雪', '赵磊', '苏晴', '韩冬'];
const CUSTOMERS = [
  '星河车业',
  '蓝湾门店',
  '云启科技',
  '北辰集团',
  '海棠俱乐部',
  '青柠出行',
  '琥珀传媒',
  '万象空间',
];

const TITLES = [
  '线索跟进超时复核',
  '售后工单 SLA 预警',
  '交付验收资料补齐',
  '合规材料二次核验',
  '增长活动预算审批',
  '客户投诉升级处理',
  '合同条款变更确认',
  '门店巡检异常闭环',
];

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function buildUpdatedAt(index: number): string {
  const day = 1 + (index % 28);
  const hour = 8 + (index % 10);
  const minute = (index * 7) % 60;
  return `2026-07-${pad(day)} ${pad(hour)}:${pad(minute)}`;
}

/** Deterministic mock catalog for lab board (48 tickets). */
export const RN_LAB_TICKET_SEED: RnLabTicket[] = Array.from(
  {length: 48},
  (_, index) => {
    const n = index + 1;
    const statusCycle: RnLabTicketStatus[] = [
      'pending',
      'processing',
      'blocked',
      'done',
      'processing',
      'pending',
    ];
    const status = statusCycle[index % statusCycle.length];
    const priority = RN_LAB_PRIORITIES[index % RN_LAB_PRIORITIES.length];
    const category = RN_LAB_CATEGORIES[index % RN_LAB_CATEGORIES.length];
    const progress =
      status === 'done'
        ? 100
        : status === 'pending'
          ? 5 + (index % 15)
          : 20 + ((index * 13) % 70);
    return {
      id: `TK-${1000 + n}`,
      title: `${TITLES[index % TITLES.length]} #${n}`,
      customer: CUSTOMERS[index % CUSTOMERS.length],
      category,
      status,
      priority,
      assignee: ASSIGNEES[index % ASSIGNEES.length],
      amount: 800 + ((index * 137) % 42000),
      progress,
      slaHoursLeft:
        status === 'done' ? 0 : priority === 'P0' ? 2 + (index % 6) : 8 + (index % 40),
      tags:
        index % 3 === 0
          ? ['加急', category]
          : index % 3 === 1
            ? [category, '可批量']
            : [category],
      updatedAt: buildUpdatedAt(index),
      note: status === 'blocked' ? '依赖上游资料，待客户补充。' : '',
    };
  },
);

export function formatRnLabAmount(amount: number): string {
  return `¥${amount.toLocaleString('zh-CN')}`;
}

export function rnLabStatusLabel(status: RnLabTicketStatus): string {
  switch (status) {
    case 'pending':
      return '待处理';
    case 'processing':
      return '处理中';
    case 'blocked':
      return '阻塞';
    case 'done':
      return '已完成';
    default:
      return status;
  }
}
