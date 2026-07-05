import type {RichSegment} from '../models/richSegment';

const PATTERN =
  /(@[\u4e00-\u9fa5A-Za-z0-9_]+|#[\u4e00-\u9fa5A-Za-z0-9_]+|https?:\/\/[^\s]+)/g;

/** 对齐 Flutter RichTextParser.parse */
export function parseRichText(raw: string): RichSegment[] {
  if (!raw) {
    return [{type: 'plain', text: ''}];
  }

  const segments: RichSegment[] = [];
  let start = 0;

  for (const match of raw.matchAll(PATTERN)) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > start) {
      segments.push({
        type: 'plain',
        text: raw.substring(start, matchIndex),
      });
    }

    const token = match[0];
    if (token.startsWith('@')) {
      segments.push({
        type: 'mention',
        text: token,
        payload: token.slice(1),
      });
    } else if (token.startsWith('#')) {
      segments.push({
        type: 'hashtag',
        text: token,
        payload: token.slice(1),
      });
    } else {
      segments.push({
        type: 'link',
        text: token,
        payload: token,
      });
    }
    start = matchIndex + token.length;
  }

  if (start < raw.length) {
    segments.push({
      type: 'plain',
      text: raw.substring(start),
    });
  }

  return segments.length > 0 ? segments : [{type: 'plain', text: raw}];
}
