import {
  DEFAULT_PERSONALIZED_SETTINGS,
  loadPersonalizedSettings,
  persistEyeProtectionMode,
  persistPersonalizedBool,
} from '../services/personalizedSettingsRepository';

const mockStore = new Map<string, string>();

jest.mock('@core/storage', () => ({
  storage: {
    getItem: jest.fn(async (key: string) => mockStore.get(key) ?? null),
    setItem: jest.fn(async (key: string, value: string) => {
      mockStore.set(key, value);
    }),
    removeItem: jest.fn(async (key: string) => {
      mockStore.delete(key);
    }),
  },
}));

describe('personalizedSettingsRepository', () => {
  beforeEach(() => {
    mockStore.clear();
  });

  it('returns defaults when storage is empty', async () => {
    await expect(loadPersonalizedSettings()).resolves.toEqual(
      DEFAULT_PERSONALIZED_SETTINGS,
    );
  });

  it('persists bool and eye-protection mode', async () => {
    await persistPersonalizedBool('teachingMode', true);
    await persistEyeProtectionMode('跟随系统');
    await expect(loadPersonalizedSettings()).resolves.toMatchObject({
      teachingMode: true,
      eyeProtectionMode: '跟随系统',
      contentRecommendation: true,
    });
  });
});
