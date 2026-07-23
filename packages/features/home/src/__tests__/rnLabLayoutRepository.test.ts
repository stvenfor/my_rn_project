import {
  resetRnLabCatalogForTests,
  fetchRnLabTicketPage,
  batchAdvanceRnLabTickets,
  updateRnLabTicket,
} from '../services/rnLabLayoutRepository';

describe('rnLabLayoutRepository', () => {
  beforeEach(() => {
    resetRnLabCatalogForTests();
  });

  it('filters by status/priority and paginates', async () => {
    const page0 = await fetchRnLabTicketPage({
      status: 'pending',
      priority: 'P0',
      category: 'all',
      keyword: '',
      sort: 'slaAsc',
      page: 0,
      pageSize: 5,
    });
    expect(page0.list.length).toBeGreaterThan(0);
    expect(page0.list.length).toBeLessThanOrEqual(5);
    expect(page0.list.every(item => item.status === 'pending')).toBe(true);
    expect(page0.list.every(item => item.priority === 'P0')).toBe(true);
    expect(page0.statusCounts.pending).toBeGreaterThan(0);

    if (page0.hasMore) {
      const page1 = await fetchRnLabTicketPage({
        status: 'pending',
        priority: 'P0',
        category: 'all',
        keyword: '',
        sort: 'slaAsc',
        page: 1,
        pageSize: 5,
      });
      expect(page1.page).toBe(1);
      expect(page1.list[0]?.id).not.toBe(page0.list[0]?.id);
    }
  });

  it('searches keyword across id/customer/assignee', async () => {
    const result = await fetchRnLabTicketPage({
      status: 'all',
      priority: 'all',
      category: 'all',
      keyword: 'TK-1001',
      sort: 'updatedDesc',
      page: 0,
      pageSize: 10,
    });
    expect(result.list.some(item => item.id === 'TK-1001')).toBe(true);
  });

  it('rejects when forceError is set', async () => {
    await expect(
      fetchRnLabTicketPage({
        status: 'all',
        priority: 'all',
        category: 'all',
        keyword: '',
        sort: 'slaAsc',
        page: 0,
        pageSize: 10,
        forceError: true,
      }),
    ).rejects.toThrow(/模拟网络异常/);
  });

  it('updates ticket and batch-advances with skip rules', async () => {
    const updated = await updateRnLabTicket('TK-1001', {
      status: 'blocked',
      note: '等待合同',
    });
    expect(updated.status).toBe('blocked');
    expect(updated.note).toBe('等待合同');

    const batch = await batchAdvanceRnLabTickets([
      'TK-1001',
      'TK-1002',
      'TK-1003',
    ]);
    expect(batch.skippedIds).toContain('TK-1001');
    expect(batch.updatedIds.length + batch.skippedIds.length).toBe(3);
  });
});
