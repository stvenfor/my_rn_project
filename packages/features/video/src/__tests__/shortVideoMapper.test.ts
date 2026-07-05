import {getShortVideoListItems} from '../services/shortVideoMockData';
import {
  indexForModelId,
  playableShortVideoItems,
  toPlayerItems,
} from '../services/shortVideoMapper';

describe('shortVideoMapper', () => {
  const listItems = getShortVideoListItems();

  it('filters publish tiles from playable items', () => {
    const playable = playableShortVideoItems(listItems);
    expect(playable.every(item => item.type === 'video')).toBe(true);
    expect(playable.length).toBeGreaterThan(0);
  });

  it('maps mock sources to player items with urls', () => {
    const playerItems = toPlayerItems(listItems);
    expect(playerItems.length).toBe(playableShortVideoItems(listItems).length);
    expect(playerItems[0]).toMatchObject({
      id: expect.any(String),
      url: expect.stringContaining('http'),
      coverUrl: expect.stringContaining('picsum.photos'),
    });
  });

  it('resolves initial index by model id', () => {
    const playable = playableShortVideoItems(listItems);
    const second = playable[1];
    expect(indexForModelId(listItems, second.id ?? '')).toBe(1);
    expect(indexForModelId(listItems, 'missing-id')).toBe(0);
  });
});
