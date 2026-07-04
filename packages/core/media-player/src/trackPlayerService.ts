import TrackPlayer, {Capability, Event, State} from 'react-native-track-player';
import type {
  AudioPlayerCallbacks,
  AudioPlayerService,
  PlayerState,
} from './types';

function mapState(state: State | null | undefined): PlayerState {
  if (state === State.Playing) {
    return 'playing';
  }
  if (state === State.Paused) {
    return 'paused';
  }
  return 'stopped';
}

export class TrackPlayerAudioService implements AudioPlayerService {
  private callbacks: AudioPlayerCallbacks = {};
  private subscriptions: Array<{remove: () => void}> = [];
  private setupDone = false;

  setCallbacks(callbacks: AudioPlayerCallbacks): void {
    this.callbacks = callbacks;
  }

  async ensureSetup(): Promise<void> {
    if (this.setupDone) {
      return;
    }
    await TrackPlayer.setupPlayer({
      autoHandleInterruptions: true,
    });
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
        Capability.SeekTo,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause],
      progressUpdateEventInterval: 1,
    });

    this.subscriptions.push(
      TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, event => {
        this.callbacks.onPositionChanged?.(Math.floor(event.position * 1000));
        if (event.duration > 0) {
          this.callbacks.onDurationChanged?.(Math.floor(event.duration * 1000));
        }
      }),
    );
    this.subscriptions.push(
      TrackPlayer.addEventListener(Event.PlaybackState, async () => {
        const state = await TrackPlayer.getPlaybackState();
        this.callbacks.onStateChanged?.(mapState(state.state));
      }),
    );
    this.subscriptions.push(
      TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
        this.callbacks.onComplete?.();
        this.callbacks.onStateChanged?.('stopped');
      }),
    );

    this.setupDone = true;
  }

  async play(
    url: string,
    durationMs: number,
    meta?: {id?: string; title?: string; artist?: string},
  ): Promise<void> {
    await this.ensureSetup();
    const trackId = meta?.id ?? url;
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: trackId,
      url,
      title: meta?.title ?? 'Track',
      artist: meta?.artist ?? 'Artist',
    });
    await TrackPlayer.play();
    const durationSec = await TrackPlayer.getDuration();
    const resolvedMs =
      durationSec > 0 ? Math.floor(durationSec * 1000) : durationMs;
    this.callbacks.onDurationChanged?.(resolvedMs);
    this.callbacks.onPositionChanged?.(0);
    this.callbacks.onStateChanged?.('playing');
  }

  async pause(): Promise<void> {
    await TrackPlayer.pause();
    this.callbacks.onStateChanged?.('paused');
  }

  async resume(): Promise<void> {
    await TrackPlayer.play();
    this.callbacks.onStateChanged?.('playing');
  }

  async stop(): Promise<void> {
    await TrackPlayer.reset();
    this.callbacks.onPositionChanged?.(0);
    this.callbacks.onStateChanged?.('stopped');
  }

  async seek(positionMs: number): Promise<void> {
    await TrackPlayer.seekTo(positionMs / 1000);
    this.callbacks.onPositionChanged?.(positionMs);
  }

  setVolume(volume: number): void {
    TrackPlayer.setVolume(volume).catch(() => undefined);
  }

  dispose(): void {
    this.subscriptions.forEach(sub => sub.remove());
    this.subscriptions = [];
    TrackPlayer.reset().catch(() => undefined);
    this.callbacks = {};
    this.setupDone = false;
  }
}
