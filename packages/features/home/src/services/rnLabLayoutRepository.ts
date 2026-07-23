import {
  RN_LAB_TICKET_SEED,
  type RnLabTicket,
  type RnLabTicketCategory,
  type RnLabTicketPriority,
  type RnLabTicketStatus,
} from '../data/rnLabLayoutMockData';

export type RnLabSortKey = 'slaAsc' | 'amountDesc' | 'updatedDesc';

export interface RnLabQuery {
  status: RnLabTicketStatus | 'all';
  priority: RnLabTicketPriority | 'all';
  category: RnLabTicketCategory | 'all';
  keyword: string;
  sort: RnLabSortKey;
  page: number;
  pageSize: number;
  /** When true, repository rejects once to exercise error UI. */
  forceError?: boolean;
}

export interface RnLabPageResult {
  list: RnLabTicket[];
  total: number;
  page: number;
  hasMore: boolean;
  statusCounts: Record<RnLabTicketStatus | 'all', number>;
}

export interface RnLabBatchResult {
  updatedIds: string[];
  skippedIds: string[];
}

let catalog: RnLabTicket[] = RN_LAB_TICKET_SEED.map(item => ({...item}));

export function resetRnLabCatalogForTests(): void {
  catalog = RN_LAB_TICKET_SEED.map(item => ({...item}));
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function matchesQuery(ticket: RnLabTicket, query: RnLabQuery): boolean {
  if (query.status !== 'all' && ticket.status !== query.status) {
    return false;
  }
  if (query.priority !== 'all' && ticket.priority !== query.priority) {
    return false;
  }
  if (query.category !== 'all' && ticket.category !== query.category) {
    return false;
  }
  const keyword = query.keyword.trim().toLowerCase();
  if (!keyword) {
    return true;
  }
  const haystack = [
    ticket.id,
    ticket.title,
    ticket.customer,
    ticket.assignee,
    ticket.tags.join(' '),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(keyword);
}

function sortTickets(list: RnLabTicket[], sort: RnLabSortKey): RnLabTicket[] {
  const next = [...list];
  next.sort((a, b) => {
    switch (sort) {
      case 'slaAsc':
        return a.slaHoursLeft - b.slaHoursLeft;
      case 'amountDesc':
        return b.amount - a.amount;
      case 'updatedDesc':
        return b.updatedAt.localeCompare(a.updatedAt);
      default:
        return 0;
    }
  });
  return next;
}

function buildStatusCounts(
  filteredWithoutStatus: RnLabTicket[],
): Record<RnLabTicketStatus | 'all', number> {
  const counts: Record<RnLabTicketStatus | 'all', number> = {
    all: filteredWithoutStatus.length,
    pending: 0,
    processing: 0,
    blocked: 0,
    done: 0,
  };
  for (const ticket of filteredWithoutStatus) {
    counts[ticket.status] += 1;
  }
  return counts;
}

export async function fetchRnLabTicketPage(
  query: RnLabQuery,
): Promise<RnLabPageResult> {
  await delay(query.page === 0 ? 480 : 320);
  if (query.forceError) {
    throw new Error('模拟网络异常：工单列表加载失败');
  }

  const base = catalog.filter(ticket => {
    if (query.priority !== 'all' && ticket.priority !== query.priority) {
      return false;
    }
    if (query.category !== 'all' && ticket.category !== query.category) {
      return false;
    }
    const keyword = query.keyword.trim().toLowerCase();
    if (!keyword) {
      return true;
    }
    const haystack = [
      ticket.id,
      ticket.title,
      ticket.customer,
      ticket.assignee,
      ticket.tags.join(' '),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(keyword);
  });

  const statusCounts = buildStatusCounts(base);
  const filtered = sortTickets(
    base.filter(ticket => matchesQuery(ticket, query)),
    query.sort,
  );
  const start = query.page * query.pageSize;
  const list = filtered.slice(start, start + query.pageSize).map(item => ({
    ...item,
  }));

  return {
    list,
    total: filtered.length,
    page: query.page,
    hasMore: start + query.pageSize < filtered.length,
    statusCounts,
  };
}

export async function updateRnLabTicket(
  id: string,
  patch: Partial<
    Pick<RnLabTicket, 'status' | 'priority' | 'note' | 'progress' | 'assignee'>
  >,
): Promise<RnLabTicket> {
  await delay(260);
  const index = catalog.findIndex(item => item.id === id);
  if (index < 0) {
    throw new Error(`工单不存在：${id}`);
  }
  const next: RnLabTicket = {
    ...catalog[index],
    ...patch,
    updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  if (patch.status === 'done') {
    next.progress = 100;
    next.slaHoursLeft = 0;
  }
  catalog[index] = next;
  return {...next};
}

/**
 * Batch advance: pending→processing, processing→done.
 * Blocked / done are skipped (business rule).
 */
export async function batchAdvanceRnLabTickets(
  ids: string[],
): Promise<RnLabBatchResult> {
  await delay(360);
  const updatedIds: string[] = [];
  const skippedIds: string[] = [];
  for (const id of ids) {
    const index = catalog.findIndex(item => item.id === id);
    if (index < 0) {
      skippedIds.push(id);
      continue;
    }
    const current = catalog[index];
    if (current.status === 'pending') {
      catalog[index] = {
        ...current,
        status: 'processing',
        progress: Math.max(current.progress, 35),
        updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      updatedIds.push(id);
    } else if (current.status === 'processing') {
      catalog[index] = {
        ...current,
        status: 'done',
        progress: 100,
        slaHoursLeft: 0,
        updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      updatedIds.push(id);
    } else {
      skippedIds.push(id);
    }
  }
  return {updatedIds, skippedIds};
}
