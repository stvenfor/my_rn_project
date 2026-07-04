import {registerModuleBridgeHandler, WebBridgeActions} from '@core/webview';
import {loadHomeDashboard} from '../homeSlice';

export function registerHomeWebHandlers(
  dispatch: (action: unknown) => void,
): void {
  registerModuleBridgeHandler(WebBridgeActions.refreshDashboard, async () => {
    await dispatch(loadHomeDashboard());
    return {ok: true, message: '首页数据已刷新'};
  });
}
