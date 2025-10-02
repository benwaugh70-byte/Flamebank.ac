#!/bin/bash

# ===============================
# Auto-Commit, JSON Index & Push Script
# FlameBank.ac – Waughtheo Legacy
# Author: Ben Alan Waugh / Waughtheo A. ∆Ω
# ===============================

# CONFIGURATION
REPO_DIR="$HOME/flamebank.ac"       # <-- set to your actual repo path
WATCH_DIR="$REPO_DIR/new_work"      # folder for new files
MAIN_FILES=("legacy_map.png" "legacy_brief.pdf" "systems_index.json" "README.md")
INDEX_FILE="$REPO_DIR/mini_index.json"

cd "$REPO_DIR" || { echo "Repo directory not found"; exit 1; }

# ===== Generate SHA-256 hashes and JSON entries =====
HASH_JSON="{"$'\n'"  \"files\": ["$'\n'"

# Process main files
for f in "${MAIN_FILES[@]}"; do
    if [ -f "$f" ]; then
        HASH=$(sha256sum "$f" | awk '{print $1}')
        echo "- $f : $HASH"
        HASH_JSON="$HASH_JSON  {\"name\": \"$f\", \"sha256\": \"$HASH\", \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"},\n"
    fi
done

# Process new_work files
if [ -d "$WATCH_DIR" ]; then
    for f in "$WATCH_DIR"/*; do
        if [ -f "$f" ]; then
            HASH=$(sha256sum "$f" | awk '{print $1}')
            echo "- $(basename "$f") : $HASH"
            HASH_JSON="$HASH_JSON  {\"name\": \"$(basename "$f")\", \"sha256\": \"$HASH\", \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"},\n"
        fi
    done
fi

# Remove trailing comma
HASH_JSON=$(echo "$HASH_JSON" | sed '$ s/,$//')
HASH_JSON="$HASH_JSON"$'\n'"  ]"$'\n'" }"

# Save JSON index
echo "$HASH_JSON" > "$INDEX_FILE"

# ===== Update README with hashes =====
echo "## File Hashes (auto-generated $(date -u))" > temp_hashes.md
cat "$INDEX_FILE" >> temp_hashes.md

grep -v "## File Hashes" README.md > temp_readme.md
cat temp_readme.md temp_hashes.md > README.md
rm temp_readme.md temp_hashes.md

# ===== Stage all changes =====
git add .

# ===== Commit with timestamp =====
git commit -m "Auto-update: legacy, new work & index $(date -u +%Y-%m-%dT%H:%M:%SZ)"

# ===== Tag commit =====
TAG="auto-$(date -u +%Y%m%dT%H%M%SZ)"
git tag -a "$TAG" -m "Auto tag for new work and index"

# ===== Push changes and tags =====
git push origin main --tags

echo "Auto-commit with JSON index completed: $(date -u)"