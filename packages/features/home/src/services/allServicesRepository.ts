import {storage} from '@core/storage';
import type {AllServiceItem} from '../data/allServicesData';
import {
  allCatalogItems,
  defaultFavoriteItems,
  findItemById,
  MAX_FAVORITE_COUNT,
  MIN_FAVORITE_COUNT,
} from '../data/allServicesData';

const FAVORITE_IDS_KEY = 'home_favorite_service_ids_v2';

function resolveItems(ids: string[]): AllServiceItem[] {
  return ids
    .map(id => findItemById(id))
    .filter((item): item is AllServiceItem => item != null);
}

function normalizeFavorites(items: AllServiceItem[]): AllServiceItem[] {
  let normalized = [...items];

  if (normalized.length > MAX_FAVORITE_COUNT) {
    normalized = normalized.slice(0, MAX_FAVORITE_COUNT);
  }

  if (normalized.length < MIN_FAVORITE_COUNT) {
    const existingIds = new Set(normalized.map(item => item.id));
    for (const candidate of defaultFavoriteItems) {
      if (normalized.length >= MIN_FAVORITE_COUNT) {
        break;
      }
      if (!existingIds.has(candidate.id)) {
        existingIds.add(candidate.id);
        normalized.push(candidate);
      }
    }
  }

  if (normalized.length < MIN_FAVORITE_COUNT) {
    return [...defaultFavoriteItems];
  }

  return normalized;
}

async function loadFavoriteIds(): Promise<string[]> {
  const raw = await storage.getItem(FAVORITE_IDS_KEY);
  if (!raw) {
    return defaultFavoriteItems.map(item => item.id);
  }
  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : defaultFavoriteItems.map(i => i.id);
  } catch {
    return defaultFavoriteItems.map(item => item.id);
  }
}

async function saveFavoriteIds(ids: string[]): Promise<void> {
  await storage.setItem(FAVORITE_IDS_KEY, JSON.stringify(ids));
}

export async function loadFavoriteItems(): Promise<AllServiceItem[]> {
  const stored = await loadFavoriteIds();
  if (stored.length === 0) {
    await saveFavoriteIds(defaultFavoriteItems.map(item => item.id));
    return [...defaultFavoriteItems];
  }

  const items = normalizeFavorites(resolveItems(stored));
  const normalizedIds = items.map(item => item.id);
  if (
    normalizedIds.length !== stored.length ||
    normalizedIds.some((id, i) => id !== stored[i])
  ) {
    await saveFavoriteIds(normalizedIds);
  }
  return items;
}

export async function saveFavoriteItems(
  items: AllServiceItem[],
): Promise<void> {
  await saveFavoriteIds(items.map(item => item.id));
}

export function getAllCatalogItems(): AllServiceItem[] {
  return allCatalogItems;
}
