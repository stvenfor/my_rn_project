import {storage} from '@core/storage';
import {
  defaultMineStoreId,
  findMineStoreById,
  resolveMineStoreName,
} from '../models/mineStoreData';

const SELECTED_STORE_ID_KEY = 'mine_selected_store_id';

export async function loadSelectedStoreId(): Promise<string> {
  const stored = await storage.getItem(SELECTED_STORE_ID_KEY);
  if (!stored) {
    return defaultMineStoreId;
  }
  if (!findMineStoreById(stored)) {
    return defaultMineStoreId;
  }
  return stored;
}

export async function saveSelectedStoreId(id: string): Promise<void> {
  await storage.setItem(SELECTED_STORE_ID_KEY, id);
}

export function resolveStoreName(id: string): string {
  return resolveMineStoreName(id);
}
