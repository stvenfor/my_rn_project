import {useCallback} from 'react';
import {getModuleBridgeHandler} from './bridgeRegistry';
import {WebBridgeActions, type BridgeHandler} from './bridgeActions';
import type {CoreBridgeContext} from './coreBridgeContext';

export function useCoreBridgeHandlers(ctx: CoreBridgeContext): BridgeHandler {
  return useCallback(
    async (action, payload) => {
      switch (action) {
        case WebBridgeActions.showToast: {
          const text = payload?.text?.toString() ?? '';
          if (!text) {
            return {ok: false, message: 'toast 内容为空'};
          }
          ctx.showToast(text);
          return {ok: true};
        }
        case WebBridgeActions.closeWithResult: {
          ctx.goBack();
          return {ok: true, result: payload ?? {}};
        }
        case WebBridgeActions.getEnvironment:
          return ctx.getEnvironment();
        case WebBridgeActions.switchEnvironment: {
          const raw = payload?.env?.toString();
          if (!raw) {
            return {ok: false, message: '缺少或无效的 payload.env'};
          }
          return ctx.switchEnvironment(raw);
        }
        case WebBridgeActions.getUserInfo:
          return ctx.getUserInfo();
        case WebBridgeActions.refreshDashboard: {
          const moduleHandler = getModuleBridgeHandler(action);
          if (moduleHandler) {
            return moduleHandler(payload);
          }
          return ctx.handleModuleAction(action, payload);
        }
        default: {
          const moduleHandler = getModuleBridgeHandler(action);
          if (moduleHandler) {
            return moduleHandler(payload);
          }
          return {ok: false, message: `未知 action: ${action}`};
        }
      }
    },
    [ctx],
  );
}
