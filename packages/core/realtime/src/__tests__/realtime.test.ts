import {
  MockRealtimeAdapter,
  resetRealtimeAdapter,
} from '../mockRealtimeAdapter';

describe('@core/realtime', () => {
  beforeEach(() => {
    resetRealtimeAdapter();
  });

  it('connects and sends live.join signals', async () => {
    const adapter = new MockRealtimeAdapter();
    await adapter.connect('room_001');
    expect(adapter.getConnectionState()).toBe('connected');
    await adapter.sendSignal('live.join', {seq: 1});
    const signals = adapter.getSignals();
    expect(signals).toHaveLength(1);
    expect(signals[0].type).toBe('live.join');
    expect(signals[0].roomId).toBe('room_001');
  });
});
