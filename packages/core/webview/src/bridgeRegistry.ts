export type ModuleBridgeHandler = (
  payload?: Record<string, unknown>,
) => Promise<Record<string, unknown>>;

const moduleHandlers = new Map<string, ModuleBridgeHandler>();

export function registerModuleBridgeHandler(
  action: string,
  handler: ModuleBridgeHandler,
): void {
  moduleHandlers.set(action, handler);
}

export function getModuleBridgeHandler(
  action: string,
): ModuleBridgeHandler | undefined {
  return moduleHandlers.get(action);
}

export function clearModuleBridgeHandlers(): void {
  moduleHandlers.clear();
}
