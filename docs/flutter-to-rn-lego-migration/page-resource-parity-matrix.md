# Page & Resource Parity Matrix

Date: 2026-07-04  
Machine-readable source: [page-resource-parity-manifest.ts](./page-resource-parity-manifest.ts)

## Summary

| Dimension | Flutter | RN target | Coverage |
|-----------|---------|-----------|----------|
| Pages | 52 | 52 mapped | 100% |
| First-party assets | 76 | 76 migrated | 100% |

Status legend: `Migrated` | `Degraded` | `Placeholder` | `Deferred` | `Removed`

## Page mapping (52)

See `PAGE_PARITY_ENTRIES` in the manifest for the authoritative list.

## Asset mapping (76)

| Module | Count | RN path | Registry |
|--------|------:|---------|----------|
| home | 19 | `packages/features/home/assets/all_services/` | `homeAssets.ts` |
| music | 2 | `packages/features/music/assets/defaults/` | `musicAssets.ts` |
| bfui | 53 | `packages/features/bfui/assets/` | `bfuiAssets.ts` |
| toolkit | 1 | `packages/commons/toolkit/assets/data/` | `videoMockSources.ts` |

## BFUI template status (17 RN templates)

Tracked in `packages/features/bfui/src/bfuiCatalog.ts`:

- `migrated`: layout + local assets aligned
- `visual-degraded`: structure with simplified motion (glass/wave/running/workout)
- `shell`: mediterranean_diet layout shell
- `placeholder`: not used after resource migration

## Evidence

- `Migrated` pages: no placeholder copy; route registered via `collectFeatureRoutes()`
- `Migrated` assets: on disk + typed registry + `assetParity.test.ts`
- `Deferred`: infrastructure debug pages + live realtime + pay SDK
