import {
  matchesTab,
  type DealInvoiceItem,
  type DealInvoiceStatus,
  type DealInvoiceTabId,
} from '../models/dealInvoiceModels';

const PAGE_SIZE = 10;
export const DEAL_INVOICE_MAX_PAGES = 5;

const SEED_TIME = new Date(2021, 2, 18, 12, 59, 59).toISOString();

const SEED_ITEMS: DealInvoiceItem[] = [
  {
    id: 'seed_1',
    phone: '13612345678',
    customerName: '小张女士',
    status: 'rated',
    submittedAt: SEED_TIME,
    ratingStars: 4,
  },
  {
    id: 'seed_2',
    phone: '13612345678',
    customerName: '小张女士',
    status: 'approvedPendingRating',
    submittedAt: SEED_TIME,
  },
  {
    id: 'seed_3',
    phone: '13612345678',
    customerName: '小张女士',
    status: 'pendingReview',
    submittedAt: SEED_TIME,
  },
  {
    id: 'seed_4',
    phone: '13612345678',
    customerName: '小张女士',
    status: 'pendingReview',
    submittedAt: SEED_TIME,
  },
  {
    id: 'seed_5',
    phone: '13612345678',
    customerName: '小张女士',
    status: 'rejected',
    submittedAt: SEED_TIME,
    rejectReason: '重复上传发票，请核对后重新提交',
  },
];

const STATUS_CYCLE: DealInvoiceStatus[] = [
  'rated',
  'approvedPendingRating',
  'pendingReview',
  'rejected',
];

function generatePage(page: number): DealInvoiceItem[] {
  return Array.from({length: PAGE_SIZE}, (_, index) => {
    const seq = page * PAGE_SIZE + index;
    const status = STATUS_CYCLE[seq % STATUS_CYCLE.length];
    const base = new Date(2021, 2, 18, 12, 59, 59);
    base.setHours(base.getHours() + seq);
    return {
      id: `page_${page}_${index}`,
      phone: `138${String(10000000 + seq).slice(1)}`,
      status,
      submittedAt: base.toISOString(),
      rejectReason:
        status === 'rejected' ? '发票信息不清晰，请重新拍摄上传' : null,
    };
  });
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Aligns with Flutter `DealInvoiceMockRepository`. */
export async function fetchDealInvoicePage(options: {
  tab: DealInvoiceTabId;
  page: number;
}): Promise<DealInvoiceItem[]> {
  const {tab, page} = options;
  await delay(500);
  if (page >= DEAL_INVOICE_MAX_PAGES) {
    return [];
  }
  const all = page === 0 ? [...SEED_ITEMS] : generatePage(page);
  return all.filter(item => matchesTab(item, tab));
}
