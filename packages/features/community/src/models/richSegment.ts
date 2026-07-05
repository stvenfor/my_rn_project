export type RichSegmentType = 'plain' | 'mention' | 'hashtag' | 'link';

export interface RichSegment {
  type: RichSegmentType;
  text: string;
  payload?: string;
}
