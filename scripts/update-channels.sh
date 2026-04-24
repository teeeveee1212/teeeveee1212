#!/bin/bash
# Updates js/channels.json (live only) and js/vod.json (on-demand titles)
# from the live M3U playlist. Run daily via cron. Commits + pushes to
# GitHub if either file changed.
#
# Live shape   (channels.json): { "Category": ["Channel 1", ...], ... }
# VOD shape    (vod.json):      { "VOD | GENRE": ["Title 1", ...], ... }
# Meta shape   (channels-updated.json): {"updated_utc", "live_count", "vod_count", "categories", "source"}

set -u

M3U_URL="http://user.webrats.media/get.php?username=louieemby&password=jyWR957Kbr&type=m3u_plus&output=ts"
REPO_DIR="/opt/teeeveee"
LIVE_FILE="$REPO_DIR/js/channels.json"
VOD_FILE="$REPO_DIR/js/vod.json"
META_FILE="$REPO_DIR/js/channels-updated.json"
TMP_M3U="/tmp/teeeveee-channels.m3u"

log() { echo "$(date -u +%Y-%m-%dT%H:%M:%SZ)  $*"; }
log "Starting channel update"

# Download m3u
if ! curl -sSf --max-time 60 -o "$TMP_M3U" "$M3U_URL"; then
  log "ERROR: failed to download M3U"
  exit 1
fi

if [ ! -s "$TMP_M3U" ]; then
  log "ERROR: M3U is empty"
  exit 1
fi

# Parse and split into live vs VOD
python3 - "$TMP_M3U" "$LIVE_FILE" "$VOD_FILE" "$META_FILE" <<'PYEOF'
import re, json, sys
from datetime import datetime, timezone

src, live_dst, vod_dst, meta_dst = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]

channels = {}
with open(src, "r", encoding="utf-8", errors="replace") as f:
    for line in f:
        line = line.strip()
        if not line.startswith("#EXTINF:"):
            continue
        group_match = re.search(r'group-title="([^"]+)"', line)
        # tvg-name is more reliable than the post-comma name when names contain commas
        tvg_name_match = re.search(r'tvg-name="([^"]+)"', line)
        parts = line.rsplit(",", 1)
        if not group_match:
            continue
        group = group_match.group(1).strip()
        name  = (tvg_name_match.group(1).strip() if tvg_name_match else
                 (parts[1].strip() if len(parts) >= 2 else ""))
        if not group or not name:
            continue
        if group.lower() == "all":
            continue
        channels.setdefault(group, []).append(name)

# Sort + dedupe within each group
sorted_out = {}
for group in sorted(channels.keys()):
    seen = set()
    uniq = []
    for n in channels[group]:
        if n not in seen:
            seen.add(n); uniq.append(n)
    sorted_out[group] = uniq

# Split live vs VOD
live = {k: v for k, v in sorted_out.items() if not k.upper().startswith("VOD")}
vod  = {k: v for k, v in sorted_out.items() if k.upper().startswith("VOD")}

live_count = sum(len(v) for v in live.values())
vod_count  = sum(len(v) for v in vod.values())

with open(live_dst, "w", encoding="utf-8") as f:
    json.dump(live, f, ensure_ascii=False)
with open(vod_dst, "w", encoding="utf-8") as f:
    json.dump(vod, f, ensure_ascii=False)

meta = {
    "updated_utc": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "live_count": live_count,
    "vod_count": vod_count,
    "total": live_count + vod_count,
    "live_categories": len(live),
    "vod_categories": len(vod),
    "source": "webrats m3u_plus",
}
with open(meta_dst, "w", encoding="utf-8") as f:
    json.dump(meta, f, ensure_ascii=False, indent=2)

print(f"Parsed {live_count} live channels in {len(live)} categories + "
      f"{vod_count} VOD titles in {len(vod)} categories")
PYEOF

if [ $? -ne 0 ]; then
  log "ERROR: parse failed"
  exit 1
fi

# Commit + push only if any data file changed
cd "$REPO_DIR" || { log "ERROR: cannot cd to $REPO_DIR"; exit 1; }

if git diff --quiet -- "$LIVE_FILE" "$VOD_FILE"; then
  log "No channel/VOD changes — skipping commit"
  # still refresh the meta timestamp but don't push for that alone
else
  git add "$LIVE_FILE" "$VOD_FILE" "$META_FILE"
  git commit -m "Auto-update channels + VOD ($(date -u +%Y-%m-%d))" >/dev/null
  if git push origin main >/dev/null 2>&1; then
    log "Pushed updated channel data to GitHub"
  else
    log "ERROR: git push failed (commit is local)"
    exit 1
  fi
fi

rm -f "$TMP_M3U"
log "Done"
