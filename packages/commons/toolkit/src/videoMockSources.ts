export interface VideoMockSource {
  id: number;
  title: string;
  desc: string;
  url: string;
  coverUrl?: string;
  category: string;
}

const sources =
  require('../assets/data/video_mock_sources.json') as VideoMockSource[];

export const VIDEO_MOCK_SOURCES: VideoMockSource[] = sources;

export const VIDEO_MOCK_ASSET_MANIFEST = {
  video_mock_sources:
    'packages/commons/toolkit/assets/data/video_mock_sources.json',
} as const;
