import {storage} from '@core/storage';
import {
  defaultMineFunctionOrderIds,
  resolveOrderedMineFunctions,
} from '../data/mineFunctionData';
import type {MineFunctionItem} from '../models/mineFunctionItem';

const ORDER_IDS_KEY = 'mine_function_order_ids';

function sameIds(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((id, index) => id === b[index]);
}

async function loadOrderIds(): Promise<string[]> {
  const raw = await storage.getItem(ORDER_IDS_KEY);
  if (!raw) {
    return [...defaultMineFunctionOrderIds];
  }
  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [...defaultMineFunctionOrderIds];
  } catch {
    return [...defaultMineFunctionOrderIds];
  }
}

async function saveOrderIds(ids: string[]): Promise<void> {
  await storage.setItem(ORDER_IDS_KEY, JSON.stringify(ids));
}

export async function loadMineFunctions(): Promise<MineFunctionItem[]> {
  const stored = await loadOrderIds();
  if (stored.length === 0) {
    const defaults = resolveOrderedMineFunctions(defaultMineFunctionOrderIds);
    await saveMineFunctions(defaults);
    return defaults;
  }

  const resolved = resolveOrderedMineFunctions(stored);
  const normalizedIds = resolved.map(item => item.id);
  if (
    normalizedIds.length !== stored.length ||
    !sameIds(normalizedIds, stored)
  ) {
    await saveOrderIds(normalizedIds);
  }
  return resolved;
}

export async function saveMineFunctions(
  items: MineFunctionItem[],
): Promise<void> {
  await saveOrderIds(items.map(item => item.id));
}
