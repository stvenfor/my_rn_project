import fs from 'fs';
import path from 'path';
import {
  ASSET_PARITY_ENTRIES,
  EXPECTED_ASSET_COUNT,
} from '../../docs/flutter-to-rn-lego-migration/page-resource-parity-manifest';
import {BFUI_ASSET_MANIFEST} from '@features/bfui/assets/bfuiAssets';
import {HOME_ASSET_MANIFEST} from '@features/home/assets/homeAssets';
import {MUSIC_ASSET_MANIFEST} from '@features/music/assets/musicAssets';
import {SETTINGS_ASSET_MANIFEST} from '@features/settings/assets/settingsAssets';
import {MEMBERSHIP_ASSET_MANIFEST} from '@features/pay';
import {VIDEO_MOCK_ASSET_MANIFEST} from '@commons/toolkit';
import {APP_SHELL_ASSET_MANIFEST} from '../../assets/app/appShellAssets';
import {WEB_ASSET_MANIFEST} from '@core/webview';

const ROOT = path.resolve(__dirname, '../..');

describe('asset parity', () => {
  const allManifests = {
    ...HOME_ASSET_MANIFEST,
    ...MUSIC_ASSET_MANIFEST,
    ...BFUI_ASSET_MANIFEST,
    ...SETTINGS_ASSET_MANIFEST,
    ...MEMBERSHIP_ASSET_MANIFEST,
    ...VIDEO_MOCK_ASSET_MANIFEST,
    ...APP_SHELL_ASSET_MANIFEST,
    ...WEB_ASSET_MANIFEST,
  };

  it(`has ${EXPECTED_ASSET_COUNT} first-party assets on disk`, () => {
    const diskCount = Object.values(allManifests).filter(relativePath =>
      fs.existsSync(path.join(ROOT, relativePath)),
    ).length;
    expect(diskCount).toBe(EXPECTED_ASSET_COUNT);
  });

  it('maps manifest entries to existing files', () => {
    for (const entry of ASSET_PARITY_ENTRIES) {
      expect(fs.existsSync(path.join(ROOT, entry.rnPath))).toBe(true);
    }
    for (const relativePath of Object.values(BFUI_ASSET_MANIFEST)) {
      expect(fs.existsSync(path.join(ROOT, relativePath))).toBe(true);
    }
  });
});
