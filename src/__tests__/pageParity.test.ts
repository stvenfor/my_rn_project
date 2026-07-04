import {
  EXPECTED_PAGE_COUNT,
  PAGE_PARITY_ENTRIES,
} from '../../docs/flutter-to-rn-lego-migration/page-resource-parity-manifest';

describe('page parity manifest', () => {
  it('covers all 52 Flutter pages', () => {
    expect(PAGE_PARITY_ENTRIES).toHaveLength(EXPECTED_PAGE_COUNT);
  });

  it('assigns status to every page', () => {
    for (const entry of PAGE_PARITY_ENTRIES) {
      expect(entry.status).toBeTruthy();
      expect(entry.flutterPath).toBeTruthy();
    }
  });

  it('requires route and component for Migrated pages', () => {
    const migrated = PAGE_PARITY_ENTRIES.filter(e => e.status === 'Migrated');
    for (const entry of migrated) {
      expect(entry.rnRoute ?? entry.rnComponent).toBeTruthy();
    }
  });

  it('documents Deferred entries with owner and target version when present', () => {
    const deferred = PAGE_PARITY_ENTRIES.filter(e => e.status === 'Deferred');
    for (const entry of deferred) {
      expect(entry.note).toBeTruthy();
      expect(entry.owner).toBeTruthy();
      expect(entry.targetVersion).toBeTruthy();
    }
  });
});
