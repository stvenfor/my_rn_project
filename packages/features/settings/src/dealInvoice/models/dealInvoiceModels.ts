export type DealInvoiceStatus =
  | 'pendingReview'
  | 'approvedPendingRating'
  | 'rated'
  | 'rejected';

export type DealInvoiceTabId =
  | 'all'
  | 'pendingReview'
  | 'approved'
  | 'rejected';

export type DealInvoiceUploadScene = 'create' | 'detail' | 'reupload';

export type DealInvoiceUploadPhase = 'editing' | 'uploading' | 'detail';

export interface DealInvoiceCustomer {
  phone: string;
  name: string;
}

export interface DealInvoiceStats {
  uploaded: number;
  pendingReview: number;
  approved: number;
  rejected: number;
}

export interface DealInvoiceItem {
  id: string;
  phone: string;
  customerName?: string | null;
  status: DealInvoiceStatus;
  submittedAt: string;
  rejectReason?: string | null;
  ratingStars?: number | null;
}

export interface DealInvoiceUploadParams {
  scene?: DealInvoiceUploadScene;
  item?: DealInvoiceItem;
}

export const DEAL_INVOICE_TABS: {id: DealInvoiceTabId; label: string}[] = [
  {id: 'all', label: '全部发票'},
  {id: 'pendingReview', label: '待审核'},
  {id: 'approved', label: '已通过'},
  {id: 'rejected', label: '未通过'},
];

export const DEAL_INVOICE_STATS_DEMO: DealInvoiceStats = {
  uploaded: 5,
  pendingReview: 2,
  approved: 2,
  rejected: 1,
};

export const DEAL_INVOICE_CUSTOMERS: DealInvoiceCustomer[] = [
  {phone: '13812345678', name: '小张女士'},
  {phone: '13612345678', name: '王先生'},
  {phone: '13987654321', name: '李女士'},
];

export const INVOICE_PREVIEW_URL =
  'https://picsum.photos/seed/deal_invoice_doc/800/520';

export const PROFILE_AVATAR_URL =
  'https://picsum.photos/seed/deal_invoice_profile/200/200';

export function customerDisplay(customer: DealInvoiceCustomer): string {
  return `${customer.phone} ${customer.name}`.trim();
}

export function auditLabel(status: DealInvoiceStatus): string {
  switch (status) {
    case 'pendingReview':
      return '待审核';
    case 'approvedPendingRating':
    case 'rated':
      return '已通过';
    case 'rejected':
      return '未通过';
  }
}

export function auditColor(status: DealInvoiceStatus): string {
  switch (status) {
    case 'pendingReview':
      return '#FAAD14';
    case 'approvedPendingRating':
    case 'rated':
      return '#52C41A';
    case 'rejected':
      return '#E53935';
  }
}

export function matchesTab(
  item: DealInvoiceItem,
  tab: DealInvoiceTabId,
): boolean {
  switch (tab) {
    case 'all':
      return true;
    case 'pendingReview':
      return item.status === 'pendingReview';
    case 'approved':
      return item.status === 'approvedPendingRating' || item.status === 'rated';
    case 'rejected':
      return item.status === 'rejected';
  }
}

export function formatDealInvoiceDateTime(
  iso: string | null | undefined,
): string {
  if (!iso) {
    return '—';
  }
  const time = new Date(iso);
  if (Number.isNaN(time.getTime())) {
    return '—';
  }
  const y = time.getFullYear();
  const m = String(time.getMonth() + 1).padStart(2, '0');
  const d = String(time.getDate()).padStart(2, '0');
  const h = String(time.getHours()).padStart(2, '0');
  const min = String(time.getMinutes()).padStart(2, '0');
  const s = String(time.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}
