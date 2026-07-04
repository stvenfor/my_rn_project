import type {
  RealtimeAdapter,
  RealtimeConnectionState,
  RealtimeSignal,
} from './types';

export class MockRealtimeAdapter implements RealtimeAdapter {
  private roomId: string | null = null;
  private state: RealtimeConnectionState = 'disconnected';
  private signals: RealtimeSignal[] = [];
  private listeners = new Set<(signal: RealtimeSignal) => void>();

  async connect(roomId: string): Promise<void> {
    this.state = 'connecting';
    this.roomId = roomId;
    await new Promise(resolve => setTimeout(resolve, 300));
    this.state = 'connected';
  }

  disconnect(): void {
    this.state = 'disconnected';
    this.roomId = null;
  }

  getConnectionState(): RealtimeConnectionState {
    return this.state;
  }

  getRoomId(): string | null {
    return this.roomId;
  }

  async sendSignal(
    type: string,
    payload: Record<string, unknown> = {},
  ): Promise<void> {
    if (!this.roomId) {
      throw new Error('Not connected');
    }
    const signal: RealtimeSignal = {
      id: `sig_${Date.now()}`,
      type,
      roomId: this.roomId,
      payload,
      timestamp: new Date().toISOString(),
    };
    this.signals = [signal, ...this.signals].slice(0, 30);
    this.listeners.forEach(listener => listener(signal));
  }

  getSignals(): RealtimeSignal[] {
    return [...this.signals];
  }

  subscribe(listener: (signal: RealtimeSignal) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

let adapter: RealtimeAdapter = new MockRealtimeAdapter();

export function getRealtimeAdapter(): RealtimeAdapter {
  return adapter;
}

export function configureRealtimeAdapter(next?: RealtimeAdapter): void {
  adapter = next ?? new MockRealtimeAdapter();
}

export function resetRealtimeAdapter(): void {
  adapter = new MockRealtimeAdapter();
}
