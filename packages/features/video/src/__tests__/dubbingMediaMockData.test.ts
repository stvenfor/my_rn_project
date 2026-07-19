import {
  findDubbingVideo,
  findDubbingWork,
  getDubbingVideos,
  getDubbingWorks,
  resolveDubbingId,
} from '../dubbing/dubbingMediaMockData';

describe('dubbingMediaMockData', () => {
  it('includes detail fields for video items', () => {
    const videos = getDubbingVideos();
    expect(videos.length).toBeGreaterThan(0);
    const first = videos[0]!;
    expect(first.subtitleEn).toBeTruthy();
    expect(first.subtitleZh).toBeTruthy();
    expect(first.albumParts.length).toBeGreaterThanOrEqual(3);
    expect(first.albumParts[0]?.videoUrl).toContain('http');
    expect(first.latestWorkAvatars.length).toBe(6);
    expect(first.leaderboard?.userName).toBeTruthy();
  });

  it('resolves find by id and rejects missing', () => {
    const id = getDubbingVideos()[0]!.id;
    expect(findDubbingVideo(id)?.id).toBe(id);
    expect(findDubbingVideo('missing')).toBeUndefined();
    expect(resolveDubbingId(12)).toBe('12');
  });

  it('returns work items with author meta', () => {
    const works = getDubbingWorks();
    expect(works[0]?.authorAvatar).toContain('http');
    expect(findDubbingWork(works[0]!.id)?.title).toBe(works[0]!.title);
  });
});
