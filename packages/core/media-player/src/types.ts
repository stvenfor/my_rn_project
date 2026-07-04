export type PlayerState = 'stopped' | 'playing' | 'paused';

export interface AudioPlayerCallbacks {
  onPositionChanged?: (positionMs: number) => void;
  onDurationChanged?: (durationMs: number) => void;
  onComplete?: () => void;
  onStateChanged?: (state: PlayerState) => void;
}

export interface AudioPlayerService {
  play(
    url: string,
    durationMs: number,
    meta?: {id?: string; title?: string; artist?: string},
  ): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  stop(): Promise<void>;
  seek(positionMs: number): Promise<void>;
  setVolume(volume: number): void;
  setCallbacks(callbacks: AudioPlayerCallbacks): void;
  dispose(): void;
}

export interface TrackMeta {
  id?: string;
  title?: string;
  artist?: string;
}
