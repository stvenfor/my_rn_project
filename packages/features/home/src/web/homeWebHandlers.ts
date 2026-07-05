import {registerModuleBridgeHandler, WebBridgeActions} from '@core/webview';
import {refreshHomeDashboard} from '../store/homeSlice';

export function registerHomeWebHandlers(
  dispatch: (action: unknown) => void,
): void {
  registerModuleBridgeHandler(WebBridgeActions.refreshDashboard, async () => {
    await dispatch(refreshHomeDashboard());
    return {ok: true, message: '首页数据已刷新'};
  });
}
