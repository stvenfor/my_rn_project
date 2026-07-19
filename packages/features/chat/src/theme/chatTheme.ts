/** Chat visual tokens — aligned with Flutter `ChatTheme` (iOS / iMessage). */
export const chatTheme = {
  accent: '#007AFF',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  fillSecondary: '#E9E9EB',
  labelPrimary: '#000000',
  labelSecondary: 'rgba(60, 60, 67, 0.60)',
  labelTertiary: 'rgba(60, 60, 67, 0.30)',
  separator: '#C6C6C8',
  selfBubble: '#007AFF',
  peerBubble: '#E9E9EB',
  online: '#34C759',
  unreadBadge: '#FF3B30',
  previewBlack: '#000000',

  radiusMd: 12,
  radiusLg: 18,
  bubbleRadius: 18,
  inputRadius: 20,
  emojiPanelHeight: 220,
  recallWindowMinutes: 3,

  // Compat aliases used by older chat components
  pageBackground: '#F2F2F7',
  panelBackground: '#F2F2F7',
  titleBlack: '#000000',
  textSecondary: 'rgba(60, 60, 67, 0.60)',
  textHint: 'rgba(60, 60, 67, 0.30)',
  divider: '#C6C6C8',
  iconMuted: 'rgba(60, 60, 67, 0.60)',
  unreadRed: '#FF3B30',
} as const;

export const chatTypography = {
  largeTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: chatTheme.labelPrimary,
    lineHeight: 37,
    letterSpacing: -0.5,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: chatTheme.labelPrimary,
    lineHeight: 20,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    color: chatTheme.labelPrimary,
    lineHeight: 23,
  },
  subhead: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: chatTheme.labelSecondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: chatTheme.labelSecondary,
    lineHeight: 17,
  },
  selfBubbleText: {
    fontSize: 17,
    fontWeight: '400' as const,
    color: '#FFFFFF',
    lineHeight: 23,
  },
  peerBubbleText: {
    fontSize: 17,
    fontWeight: '400' as const,
    color: chatTheme.labelPrimary,
    lineHeight: 23,
  },
};

export function bubbleRadiusFor(isSelf: boolean) {
  return {
    borderTopLeftRadius: chatTheme.bubbleRadius,
    borderTopRightRadius: chatTheme.bubbleRadius,
    borderBottomLeftRadius: isSelf ? chatTheme.bubbleRadius : 4,
    borderBottomRightRadius: isSelf ? 4 : chatTheme.bubbleRadius,
  };
}

export const CHAT_EMOJI_LIST = [
  '😀',
  '😂',
  '🥰',
  '😎',
  '🤔',
  '👍',
  '🙏',
  '🎉',
  '❤️',
  '🔥',
  '👋',
  '😭',
  '🤣',
  '😊',
  '🥳',
  '💪',
] as const;
