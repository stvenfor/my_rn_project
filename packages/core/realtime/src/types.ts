export type RealtimeConnectionState =
  | 'connecting'
  | 'connected'
  | 'disconnected';

export interface RealtimeSignal {
  id: string;
  type: string;
  roomId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface RealtimeAdapter {
  connect(roomId: string): Promise<void>;
  disconnect(): void;
  getConnectionState(): RealtimeConnectionState;
  getRoomId(): string | null;
  sendSignal(type: string, payload?: Record<string, unknown>): Promise<void>;
  getSignals(): RealtimeSignal[];
  subscribe(listener: (signal: RealtimeSignal) => void): () => void;
}
