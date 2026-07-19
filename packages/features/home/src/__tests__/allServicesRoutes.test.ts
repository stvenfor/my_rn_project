import {RoutePath} from '@core/navigation';
import {
  allCatalogItems,
  catalogSections,
  defaultFavoriteItems,
} from '../data/allServicesData';

const validRoutePaths = new Set<string>(Object.values(RoutePath));

describe('allServicesData routes', () => {
  const items = [
    ...defaultFavoriteItems,
    ...catalogSections.flatMap(section => section.items),
  ];

  it('uses only RoutePath values for routePath (no raw feature paths)', () => {
    for (const entry of items) {
      expect(validRoutePaths.has(entry.routePath)).toBe(true);
    }
  });

  it('requires templateId when routePath is bfuiTemplate', () => {
    for (const entry of allCatalogItems) {
      if (entry.routePath === RoutePath.bfuiTemplate) {
        expect(entry.templateId).toBeTruthy();
      }
    }
  });

  it('keeps bfuiGallery and inviteFriend in 其他服务 (G1 RN delta)', () => {
    const other = catalogSections.find(section => section.title === '其他服务');
    expect(other?.items.map(item => item.label)).toEqual(
      expect.arrayContaining(['BFUI 模板目录', '邀请好友']),
    );
    expect(
      other?.items.find(item => item.routePath === RoutePath.bfuiGallery),
    ).toBeTruthy();
    expect(
      other?.items.find(
        item =>
          item.routePath === RoutePath.bfuiTemplate &&
          item.templateId === 'invite_friend',
      ),
    ).toBeTruthy();
  });
});
