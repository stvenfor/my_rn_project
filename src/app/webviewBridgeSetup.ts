import {useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {AppEnv} from '@core/domain';
import {ENV_CONFIGS} from '@core/config';
import {AppToast} from '@ui/design-system';
import type {CoreBridgeContext} from '@core/webview';
import {useAppDispatch, useAppSelector} from '@app/store/hooks';
import {selectUser} from '@features/auth';
import {selectCurrentEnv, setEnv} from '@app/store/envSlice';

export function useWebViewBridgeContext(): CoreBridgeContext {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const currentEnv = useAppSelector(selectCurrentEnv);

  return useMemo(
    () => ({
      showToast: (text: string) => {
        AppToast.show(text);
      },
      goBack: () => {
        navigation.goBack();
      },
      getEnvironment: async () => {
        const cfg = ENV_CONFIGS[currentEnv];
        return {
          ok: true,
          env: currentEnv,
          label: cfg.label,
          baseUrl: cfg.baseUrl,
        };
      },
      switchEnvironment: async (raw: string) => {
        if (!(raw in ENV_CONFIGS)) {
          return {ok: false, message: '缺少或无效的 payload.env'};
        }
        await dispatch(setEnv(raw as AppEnv));
        const cfg = ENV_CONFIGS[raw as AppEnv];
        return {ok: true, env: raw, label: cfg.label};
      },
      getUserInfo: async () => {
        if (!user) {
          return {ok: true, loggedIn: false};
        }
        return {
          ok: true,
          loggedIn: true,
          userId: user.id,
          name: user.displayName ?? user.email ?? user.phone ?? user.id,
          avatar: null,
        };
      },
      handleModuleAction: async () => ({
        ok: false,
        message: '未注册模块 handler',
      }),
    }),
    [currentEnv, dispatch, navigation, user],
  );
}
