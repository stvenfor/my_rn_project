jest.mock('react-native-webview', () => ({
  WebView: 'WebView',
  default: 'WebView',
}));

jest.mock('react-native-track-player', () => ({
  __esModule: true,
  default: {
    setupPlayer: jest.fn(),
    addEventListener: jest.fn(),
    getState: jest.fn(),
  },
  Capability: {},
  Event: {},
  State: {},
}));

import {RoutePath} from '@core/navigation';
import {collectFeatureRoutes} from '@app/config/moduleManifest';
import {PAGE_PARITY_ENTRIES} from '../../../docs/flutter-to-rn-lego-migration/page-resource-parity-manifest';

describe('route registration', () => {
  const registered = new Set(collectFeatureRoutes().map(r => r.name));

  it('registers all Migrated stack routes from parity matrix', () => {
    const migratedRoutes = PAGE_PARITY_ENTRIES.filter(
      e => e.status === 'Migrated' && e.rnRoute,
    ).map(e => e.rnRoute!);

    const appShellRoutes = new Set([
      'Main',
      'Splash',
      RoutePath.settings,
      RoutePath.web,
      RoutePath.imagePreview,
      RoutePath.debugBle,
      RoutePath.debugLinking,
      RoutePath.debugRealtime,
      RoutePath.debugIm,
    ]);

    for (const route of migratedRoutes) {
      if (appShellRoutes.has(route)) {
        continue;
      }
      if (route.endsWith('Tab')) {
        continue;
      }
      expect(registered.has(route as keyof typeof RoutePath)).toBe(true);
    }
  });
});
