export interface MineStoreOption {
  id: string;
  name: string;
}

export const defaultMineStoreId = 'ward_longding';

export const mineStores: MineStoreOption[] = [
  {id: 'ward_longding', name: '[4S]北京沃德龙鼎吉利'},
  {id: 'tengyuan', name: '[4S]北京腾远吉利北京腾远...'},
];

const storeById = new Map(mineStores.map(store => [store.id, store] as const));

export function findMineStoreById(id: string): MineStoreOption | undefined {
  return storeById.get(id);
}

export function resolveMineStoreName(id: string): string {
  return findMineStoreById(id)?.name ?? mineStores[0].name;
}
