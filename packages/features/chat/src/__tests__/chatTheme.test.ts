import {bubbleRadiusFor, chatTheme, CHAT_EMOJI_LIST} from '../theme/chatTheme';

describe('chatTheme iOS tokens', () => {
  it('matches Flutter ChatTheme accent / bubbles', () => {
    expect(chatTheme.accent).toBe('#007AFF');
    expect(chatTheme.background).toBe('#F2F2F7');
    expect(chatTheme.selfBubble).toBe('#007AFF');
    expect(chatTheme.peerBubble).toBe('#E9E9EB');
    expect(chatTheme.online).toBe('#34C759');
    expect(chatTheme.unreadBadge).toBe('#FF3B30');
  });

  it('uses asymmetric bubble radii like Flutter', () => {
    expect(bubbleRadiusFor(true)).toMatchObject({
      borderBottomRightRadius: 4,
      borderBottomLeftRadius: 18,
    });
    expect(bubbleRadiusFor(false)).toMatchObject({
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 18,
    });
  });

  it('keeps emoji list length', () => {
    expect(CHAT_EMOJI_LIST).toHaveLength(16);
  });
});
