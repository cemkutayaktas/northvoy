#!/usr/bin/env bash
# Captures REAL interface screenshots from the local production build for use in
# marketing scenes. Width is 500 CSS px — headless Chrome enforces a ~500px minimum
# window, and 500px still renders the mobile (< 640px) layout. No personal data.
# Needs: a built app (pnpm run build) and Google Chrome.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/tools/marketing/assets/screenshots"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || { echo "Google Chrome not found at $CHROME"; exit 1; }
[ -f "$ROOT/dist/public/index.html" ] || { echo "run 'pnpm run build' first"; exit 1; }
mkdir -p "$OUT"
PORT=4181
( cd "$ROOT/dist/public" && python3 -m http.server $PORT --bind 127.0.0.1 >/dev/null 2>&1 ) &
SRV=$!; trap 'kill $SRV 2>/dev/null || true' EXIT; sleep 1.5
shot() { # name url
  perl -e 'alarm 25; exec @ARGV' "$CHROME" --headless=new --disable-gpu --hide-scrollbars --no-first-run \
    --window-size=500,1080 --timeout=7000 --screenshot="$OUT/$1.png" "http://127.0.0.1:$PORT$2" >/dev/null 2>&1 \
    && echo "captured $1.png  ($2)" || echo "FAILED $1 ($2)"
}
shot home "/"
shot questionnaire "/questionnaire/"
shot majors "/majors/"
shot major-cs-tr "/majors/computer-science-software-engineering/"
cat > "$OUT/README.md" <<'EOF'
# Screenshots — provenance
Files in this folder are REAL captures of the built NorthVoy app (500×1080 window —
headless Chrome's minimum width; this is still the mobile layout) with no user data. Regenerate with `pnpm marketing:capture`.
Anything not listed by that script (mockups, stock, stylised frames) is ILLUSTRATIVE
and must be labelled as such in the video.
Note: captures are taken in the default (English) UI unless `northvoy_lang` is set;
for Turkish frames, record the screen manually with the language switched to TR.
EOF
echo "done → $OUT"
