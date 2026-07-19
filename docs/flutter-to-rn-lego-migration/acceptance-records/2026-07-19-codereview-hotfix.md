# Acceptance Record — Code review hotfix round

Date: 2026-07-19  
Scope: P0–P2 findings from project code review  
Decision: **Accept** (WebView scrubber still Degraded)

## Fixes

| Finding | Fix |
|---------|-----|
| Classroom `progress` crash | Drive bar/% from `completionRate`; navBar prop; smoke test |
| typecheck on main | `isHarmonyOS()`, `PhotoQuality`, RootStackScreenProps, used-car navigate typing |
| WebView audio after leave | Unmount teardown JS in dubbing + community players |
| WebView URL injection | `sanitizeHttpUrl` + `escapeHtmlAttr` in `@commons/toolkit` |
| Chat voice timer leak | Clear timeout + reset playing id on unmount |
| Album Part cosmetic only | Parts carry `videoUrl`; header remounts on selection |
| Manifest honesty | Updated notes for classroom / video / community |

## Verification

```text
npm run typecheck
npx jest packages/features/classroom packages/features/video packages/commons/toolkit packages/features/home src/__tests__/pageParity.test.ts
```

## Residual

- WebView scrubber still UI-only (Degraded note)
- Native pay / production WS still Deferred (unchanged)
