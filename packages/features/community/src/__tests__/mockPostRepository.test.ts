import {
  mockPostRepository,
  resetMockPostRepository,
} from '../services/mockPostRepository';

describe('mockPostRepository', () => {
  beforeEach(() => {
    resetMockPostRepository();
  });

  it('seeds 35 posts with pagination', async () => {
    const page0 = await mockPostRepository.fetchPosts(0, 10);
    const page3 = await mockPostRepository.fetchPosts(3, 10);
    const page4 = await mockPostRepository.fetchPosts(4, 10);

    expect(page0).toHaveLength(10);
    expect(page0[0].id).toBe('post_0');
    expect(page0[0].nickname).toBe('张三');
    expect(page3).toHaveLength(5);
    expect(page4).toHaveLength(0);
  });
});
