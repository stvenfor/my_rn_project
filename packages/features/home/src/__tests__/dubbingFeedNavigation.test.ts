import {buildDubbingHomeFeed} from '../data/dubbingMockData';

describe('dubbing home feed parity data', () => {
  it('includes expert showcase and editor picks in Flutter order slots', () => {
    const feed = buildDubbingHomeFeed();
    expect(feed.expertShowcase.length).toBeGreaterThan(0);
    expect(feed.editorPicks).toHaveLength(4);
    expect(feed.features.some(f => f.action === 'scrollToHotRank')).toBe(true);
    expect(feed.recentLearning[0]?.id).toBeTruthy();
    expect(feed.hotRankBoards[0]?.items[0]?.id).toBeTruthy();
  });
});
