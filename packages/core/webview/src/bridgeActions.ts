export const WebBridgeActions = {
  showToast: 'showToast',
  closeWithResult: 'closeWithResult',
  getEnvironment: 'getEnvironment',
  switchEnvironment: 'switchEnvironment',
  getUserInfo: 'getUserInfo',
  refreshDashboard: 'refreshDashboard',
} as const;

export type WebBridgeAction =
  (typeof WebBridgeActions)[keyof typeof WebBridgeActions];

export const CORE_BRIDGE_ACTIONS = new Set<string>([
  WebBridgeActions.showToast,
  WebBridgeActions.closeWithResult,
  WebBridgeActions.getEnvironment,
  WebBridgeActions.switchEnvironment,
  WebBridgeActions.getUserInfo,
]);

export interface BridgeMessage {
  action: string;
  payload?: Record<string, unknown>;
  callbackId: string;
}

export type BridgeHandler = (
  action: string,
  payload?: Record<string, unknown>,
) => Promise<Record<string, unknown>>;
