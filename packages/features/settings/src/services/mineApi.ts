import {getApiClient} from '@core/api-client';
import {
  parseHarmonyIndexModel,
  type HarmonyIndexModel,
} from '../models/harmonyIndexModel';

export const HARMONY_INDEX_PATH = '/harmony/index/json';

export async function fetchHarmonyIndex(): Promise<HarmonyIndexModel> {
  const api = getApiClient();
  const response = await api.get(HARMONY_INDEX_PATH);
  const payload = response.data?.data ?? response.data;
  if (!payload || typeof payload !== 'object') {
    throw new Error('接口返回数据为空');
  }
  return parseHarmonyIndexModel(payload as Record<string, unknown>);
}
