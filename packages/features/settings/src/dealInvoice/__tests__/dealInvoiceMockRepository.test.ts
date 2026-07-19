import {
  DEAL_INVOICE_MAX_PAGES,
  fetchDealInvoicePage,
} from '../mock/dealInvoiceMockRepository';
import {matchesTab} from '../models/dealInvoiceModels';

describe('dealInvoiceMockRepository', () => {
  it('returns seed items filtered by tab on page 0', async () => {
    const all = await fetchDealInvoicePage({tab: 'all', page: 0});
    expect(all.length).toBe(5);
    const pending = await fetchDealInvoicePage({
      tab: 'pendingReview',
      page: 0,
    });
    expect(pending.every(i => i.status === 'pendingReview')).toBe(true);
    expect(pending.length).toBe(2);
  });

  it('stops after max pages', async () => {
    const empty = await fetchDealInvoicePage({
      tab: 'all',
      page: DEAL_INVOICE_MAX_PAGES,
    });
    expect(empty).toEqual([]);
  });

  it('matchesTab covers approved statuses', () => {
    expect(
      matchesTab(
        {
          id: '1',
          phone: '1',
          status: 'rated',
          submittedAt: new Date().toISOString(),
        },
        'approved',
      ),
    ).toBe(true);
  });
});
