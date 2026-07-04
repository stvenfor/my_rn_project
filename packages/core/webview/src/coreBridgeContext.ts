import type {BridgeHandler} from './bridgeActions';

export interface CoreBridgeContext {
  showToast: (text: string) => void;
  goBack: () => void;
  getEnvironment: () => Promise<Record<string, unknown>>;
  switchEnvironment: (env: string) => Promise<Record<string, unknown>>;
  getUserInfo: () => Promise<Record<string, unknown>>;
  handleModuleAction: BridgeHandler;
}
