import {communityTheme} from '../theme/communityTheme';

describe('communityTheme iOS tokens', () => {
  it('matches Flutter CommunityTheme accents', () => {
    expect(communityTheme.accent).toBe('#007AFF');
    expect(communityTheme.background).toBe('#F2F2F7');
    expect(communityTheme.likeRed).toBe('#FF3B30');
    expect(communityTheme.screenBackground).toBe('#F2F2F7');
    expect(communityTheme.skeletonCount).toBe(3);
    expect(communityTheme.contentMaxWidth).toBe(720);
  });
});
