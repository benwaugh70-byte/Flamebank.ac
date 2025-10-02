#!/bin/bash

# ===============================================
# Full Autonomous Auto-Commit + JSON Index + Archive
# FlameBank.ac – Waughtheo Legacy
# Author: Ben Alan Waugh / Waughtheo A. ∆Ω
# ===============================================

# CONFIGURATION
REPO_DIR="$HOME/flamebank.ac"        # <-- set your actual repo path
WATCH_DIR="$REPO_DIR/new_work"       # folder for new files
ARCHIVE_DIR="$REPO_DIR/archive_json" # folder for immutable JSON snapshots
MAIN_FILES=("legacy_map.png" "legacy_brief.pdf" "systems_index.json" "README.md")

mkdir -p "$ARCHIVE_DIR"
cd "$REPO_DIR" || { echo "Repo directory not found"; exit 1; }

TIMESTAMP=$(date -u +%Y%m%dT%H%M%SZ)
INDEX_FILE="$REPO_DIR/mini_index.json"
ARCHIVE_FILE="$ARCHIVE_DIR/mini_index_$TIMESTAMP.json"

# ===== Generate JSON index =====
HASH_JSON="{\n  \"files\": [\n"

# Main files
for f in "${MAIN_FILES[@]}"; do
    if [ -f "$f" ]; then
        HASH=$(sha256sum "$f" | awk '{print $1}')
        HASH_JSON="$HASH_JSON    {\"name\": \"$f\", \"sha256\": \"$HASH\", \"timestamp\": \"$TIMESTAMP\"},\n"
    fi
done

# new_work files
if [ -d "$WATCH_DIR" ]; then
    for f in "$WATCH_DIR"/*; do
        if [ -f "$f" ]; then
            HASH=$(sha256sum "$f" | awk '{print $1}')
            HASH_JSON="$HASH_JSON    {\"name\": \"$(basename "$f")\", \"sha256\": \"$HASH\", \"timestamp\": \"$TIMESTAMP\"},\n"
        fi
    done
fi

# Remove trailing comma
HASH_JSON=$(echo "$HASH_JSON" | sed '$ s/,$//')
HASH_JSON="$HASH_JSON\n  ]\n}"

# Save main JSON index and immutable archive copy
echo -e "$HASH_JSON" > "$INDEX_FILE"
echo -e "$HASH_JSON" > "$ARCHIVE_FILE"

# ===== Update README with latest hashes =====
echo -e "## File Hashes (auto-generated $TIMESTAMP)\n" > temp_hashes.md
cat "$INDEX_FILE" >> temp_hashes.md

grep -v "## File Hashes" README.md > temp_readme.md
cat temp_readme.md temp_hashes.md > README.md
rm temp_readme.md temp_hashes.md

# ===== Stage all changes =====
git add .

# ===== Commit with timestamp =====
git commit -m "Auto-update: legacy, new work & index $TIMESTAMP"

# ===== Tag commit =====
TAG="auto-$TIMESTAMP"
git tag -a "$TAG" -m "Auto tag for new work, index & archive"

# ===== Push to remote =====
git push origin main --tags

echo "Auto-commit with full archive completed: $TIMESTAMP"
echo "Archive snapshot saved to: $ARCHIVE_FILE"