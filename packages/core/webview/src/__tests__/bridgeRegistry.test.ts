import {
  clearModuleBridgeHandlers,
  getModuleBridgeHandler,
  registerModuleBridgeHandler,
} from '../bridgeRegistry';

describe('bridgeRegistry', () => {
  afterEach(() => {
    clearModuleBridgeHandlers();
  });

  it('registers and retrieves handlers', async () => {
    const handler = jest.fn().mockResolvedValue({ok: true});
    registerModuleBridgeHandler('refreshDashboard', handler);
    const found = getModuleBridgeHandler('refreshDashboard');
    expect(found).toBe(handler);
    await found?.({});
    expect(handler).toHaveBeenCalled();
  });

  it('clears handlers', () => {
    registerModuleBridgeHandler('refreshDashboard', jest.fn());
    clearModuleBridgeHandlers();
    expect(getModuleBridgeHandler('refreshDashboard')).toBeUndefined();
  });
});
