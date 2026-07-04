import type {
  AudioPlayerCallbacks,
  AudioPlayerService,
  PlayerState,
} from './types';

export class MockAudioPlayerService implements AudioPlayerService {
  private callbacks: AudioPlayerCallbacks = {};
  private timer: ReturnType<typeof setInterval> | null = null;
  private positionMs = 0;
  private durationMs = 0;
  private state: PlayerState = 'stopped';

  setCallbacks(callbacks: AudioPlayerCallbacks): void {
    this.callbacks = callbacks;
  }

  async play(_url: string, durationMs: number): Promise<void> {
    this.clearTimer();
    this.durationMs = durationMs;
    this.positionMs = 0;
    this.callbacks.onDurationChanged?.(durationMs);
    this.callbacks.onPositionChanged?.(0);
    this.setState('playing');
    this.startTimer();
  }

  async pause(): Promise<void> {
    if (this.state !== 'playing') {
      return;
    }
    this.clearTimer();
    this.setState('paused');
  }

  async resume(): Promise<void> {
    if (this.state !== 'paused') {
      return;
    }
    this.setState('playing');
    this.startTimer();
  }

  async stop(): Promise<void> {
    this.clearTimer();
    this.positionMs = 0;
    this.durationMs = 0;
    this.callbacks.onPositionChanged?.(0);
    this.setState('stopped');
  }

  async seek(positionMs: number): Promise<void> {
    this.positionMs = Math.max(0, Math.min(positionMs, this.durationMs));
    this.callbacks.onPositionChanged?.(this.positionMs);
  }

  setVolume(_volume: number): void {}

  dispose(): void {
    this.clearTimer();
    this.callbacks = {};
  }

  private setState(state: PlayerState): void {
    this.state = state;
    this.callbacks.onStateChanged?.(state);
  }

  private startTimer(): void {
    this.clearTimer();
    this.timer = setInterval(() => {
      if (this.positionMs >= this.durationMs) {
        this.clearTimer();
        this.setState('stopped');
        this.callbacks.onComplete?.();
        return;
      }
      this.positionMs += 1000;
      this.callbacks.onPositionChanged?.(this.positionMs);
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
