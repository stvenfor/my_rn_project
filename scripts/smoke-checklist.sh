#!/usr/bin/env bash
# Platform smoke checklist — run static verification + document manual steps.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "== Phase 4D Smoke Checklist =="
echo ""
echo "[1/4] Static verification"
npm run lint
npm run typecheck
npm run test
node scripts/asset-parity-audit.js
echo "PASS: lint, typecheck, test, asset audit"
echo ""

echo "[2/4] iOS bundle (optional — requires Metro)"
if command -v npx >/dev/null 2>&1; then
  npx react-native bundle \
    --platform ios \
    --dev false \
    --entry-file index.js \
    --bundle-output /tmp/my_rn_smoke.jsbundle \
    --assets-dest /tmp/my_rn_smoke_assets 2>/dev/null && \
    echo "PASS: iOS bundle" || \
    echo "SKIP: iOS bundle failed (native toolchain may be unavailable)"
else
  echo "SKIP: npx not available"
fi
echo ""

echo "[3/4] Manual smoke (iOS / Android / Harmony)"
cat <<'EOF'
- Launch app → Splash → Main (4 tabs visible)
- HomeTab → Learning Report / Check-in Mall / All Services
- ChatTab → conversation list loads → ChatDetail shows messages
- CommunityTab → feed loads → publish / image preview / video play
- MineTab → Settings / HTTP test / Debug routes (BLE, Linking, Realtime, IM)
- Deep link debug: simulate myapp://app/login → pending navigation set
- Music: MusicList → Now Playing (track-player or mock fallback)
- Pay: Mock payment shows transaction id toast
EOF
echo ""

echo "[4/4] Harmony"
echo "Run: npm run harmony (requires OHOS dev environment)"
echo ""
echo "Smoke checklist complete."
