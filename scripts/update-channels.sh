#!/bin/bash
# Updates js/channels.json from the live M3U playlist.
# Run daily via cron. Commits + pushes to GitHub if channel data changed.
#
# Target format (matches existing channels.jsx loader):
#   { "Category Name": ["Channel 1", "Channel 2", ...], ... }

set -u

M3U_URL="http://user.webrats.media/get.php?username=louieemby&password=jyWR957Kbr&type=m3u_plus&output=ts"
REPO_DIR="/opt/teeeveee"
JSON_FILE="$REPO_DIR/js/channels.json"
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

# Parse to the exact JSON shape channels.jsx expects: {group: [name, ...]}
python3 - "$TMP_M3U" "$JSON_FILE" <<'PYEOF'
import re, json, sys
src, dst = sys.argv[1], sys.argv[2]
channels = {}
with open(src, "r", encoding="utf-8", errors="replace") as f:
    for line in f:
        line = line.strip()
        if not line.startswith("#EXTINF:"):
            continue
        group_match = re.search(r'group-title="([^"]+)"', line)
        # Channel name is everything after the last comma on the line
        parts = line.rsplit(",", 1)
        if not group_match or len(parts) < 2:
            continue
        group = group_match.group(1).strip()
        name  = parts[1].strip()
        if not group or not name:
            continue
        if group.lower() == "all":
            continue
        channels.setdefault(group, []).append(name)

# Sort groups; dedupe names within each group (preserve first-seen order)
out = {}
for group in sorted(channels.keys()):
    seen = set()
    uniq = []
    for n in channels[group]:
        if n not in seen:
            seen.add(n)
            uniq.append(n)
    out[group] = uniq

with open(dst, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False)

total = sum(len(v) for v in out.values())
live  = sum(len(v) for k,v in out.items() if not k.upper().startswith("VOD"))
vod   = sum(len(v) for k,v in out.items() if k.upper().startswith("VOD"))
print(f"Parsed {total} total ({live} live + {vod} VOD) in {len(out)} categories")
PYEOF

if [ $? -ne 0 ]; then
  log "ERROR: parse failed"
  exit 1
fi

# Write timestamp metadata
mkdir -p "$(dirname "$META_FILE")"
cat > "$META_FILE" <<JSON
{"updated_utc":"$(date -u +%Y-%m-%dT%H:%M:%SZ)","source":"webrats m3u_plus"}
JSON

# Commit + push only if channels.json actually changed
cd "$REPO_DIR" || { log "ERROR: cannot cd to $REPO_DIR"; exit 1; }

if git diff --quiet -- "$JSON_FILE"; then
  log "No channel changes — skipping commit"
else
  git add "$JSON_FILE" "$META_FILE"
  git commit -m "Auto-update channel list ($(date -u +%Y-%m-%d))" >/dev/null
  if git push origin main >/dev/null 2>&1; then
    log "Pushed updated channel list to GitHub"
  else
    log "ERROR: git push failed (commit is local)"
    exit 1
  fi
fi

rm -f "$TMP_M3U"
log "Done"
