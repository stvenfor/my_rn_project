# Acceptance Record — `@features/music` controls / chrome parity

Date: 2026-07-19  
Scope: Material-like icons, Now Playing chrome, seek scrub, mini-player, tablet inset  
Decision: **Accept** (Harmony blur / shared-element remain capability-gated)

## Gaps fixed

| Area | Before | After |
|------|--------|-------|
| Transport / FAB / mute / mini | Unicode emoji | View-based Material-like icons |
| Now Playing title | zh「正在播放」 | Flutter EN「Now Playing」 |
| Now Playing nav | Transparent over blur | Opaque `#000000` |
| Seek | Complete-only | Live `onValueChange` + complete |
| List | Hairline dividers + extra pad | No dividers (Flutter match) |
| Mini artist opacity | 0.6 | 0.65 |
| Cover network fail | iOS defaultSource only | `onError` → musicRecord |
| Home mini inset | Always +80 tab | Width ≥600 → bar only |

## Verification

```text
npx jest packages/features/music src/__tests__/pageParity.test.ts
eslint packages/features/music packages/features/home/src/hooks/useHomeMiniPlayerInset.ts
```

## Known gaps

- Harmony: blur / Hero shared-element when native modules missing  
- Harmony: TrackPlayer may fall back to mock player (documented in media-player)
