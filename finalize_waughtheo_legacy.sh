#!/bin/bash

# ===============================================
# Waughtheo Legacy Finalizer – Fully Automated
# Author: Ben Alan Waugh / Waughtheo A. ∆Ω
# ===============================================

# CONFIGURATION
REPO_DIR="$HOME/flamebank.ac"       # <-- adjust path
ARCHIVE_DIR="$REPO_DIR/archive_json"
WATCH_DIR="$REPO_DIR/new_work"
MAIN_FILES=("legacy_map.png" "legacy_brief.pdf" "systems_index.json" "mini_index.json" "README.md")
FINAL_TAG="v1.0-final-$(date -u +%Y%m%dT%H%M%SZ)"
MASTER_VERIFICATION="$REPO_DIR/master_verification.txt"

mkdir -p "$ARCHIVE_DIR"
cd "$REPO_DIR" || { echo "Repo directory not found"; exit 1; }

# ===== 1. Stage and commit all files =====
git add .
git commit -m "Finalize Waughtheo legacy – all files $(date -u +%Y-%m-%dT%H:%M:%SZ)"

# ===== 2. Tag commit =====
git tag -a "$FINAL_TAG" -m "Finalized canonical Waughtheo systems legacy package"
git push origin main --tags

# ===== 3. Generate SHA-256 hashes =====
> "$MASTER_VERIFICATION"
for f in "${MAIN_FILES[@]}"; do
    if [ -f "$f" ]; then
        HASH=$(sha256sum "$f" | awk '{print $1}')
        echo "$f : $HASH" >> "$MASTER_VERIFICATION"
    fi
done

# ===== 4. Create immutable JSON archive snapshot =====
cp mini_index.json "$ARCHIVE_DIR/mini_index_final_$(date -u +%Y%m%dT%H%M%SZ).json"

# ===== 5. Upload to IPFS =====
IPFS_ROOT=$(ipfs add -r . | tail -n1 | awk '{print $2}')
echo "IPFS Root CID: $IPFS_ROOT" >> "$MASTER_VERIFICATION"

# ===== 6. Blockchain timestamp =====
ots stamp legacy_map.png legacy_brief.pdf systems_index.json mini_index.json
echo "OTS proof files generated" >> "$MASTER_VERIFICATION"

# ===== 7. Update README with final info =====
grep -v "## File Hashes" README.md > temp_readme.md
{
    cat temp_readme.md
    echo -e "\n## Final Verification"
    cat "$MASTER_VERIFICATION"
} > README.md
rm temp_readme.md

# Stage updated README
git add README.md
git commit -m "Update README with final hashes, tag, and IPFS CID"
git push origin main

echo "=== Waughtheo Legacy Finalized ==="
echo "Git tag: $FINAL_TAG"
echo "IPFS CID: $IPFS_ROOT"
echo "SHA-256 hashes saved to $MASTER_VERIFICATION"