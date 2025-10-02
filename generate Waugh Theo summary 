#!/bin/bash

# ===============================================
# Waughtheo Executive Summary PDF Generator
# Author: Ben Alan Waugh / Waughtheo A. ∆Ω
# ===============================================

# CONFIGURATION
REPO_DIR="$HOME/flamebank.ac"           # adjust path to your repo
MD_FILE="$REPO_DIR/waughtheo_summary.md"
PDF_FILE="$REPO_DIR/Waughtheo_Legacy_Executive_Summary.pdf"
MASTER_VERIFICATION="$REPO_DIR/master_verification.txt"

# Ensure pandoc installed
if ! command -v pandoc &> /dev/null
then
    echo "pandoc could not be found. Install it first."
    exit
fi

cd "$REPO_DIR" || { echo "Repo not found"; exit 1; }

# ===== 1. Get latest Git tag =====
LATEST_TAG=$(git describe --tags --abbrev=0)

# ===== 2. Get IPFS CID from master_verification.txt =====
IPFS_CID=$(grep "IPFS Root CID" "$MASTER_VERIFICATION" | awk '{print $4}')

# ===== 3. Extract SHA-256 hashes =====
SHA_SECTION=$(grep ":" "$MASTER_VERIFICATION")

# ===== 4. Generate Markdown =====
cat > "$MD_FILE" <<EOL
# Waughtheo Systems Legacy – Executive Summary

**Author:** Ben Alan Waugh / Waughtheo A. ∆Ω  
**Final Git Tag:** $LATEST_TAG  
**Date:** $(date -u +%Y-%m-%d)

---

## Overview

The Waughtheo systems evolved from early prototypes to fully deployed frameworks in simulation, analytics, and sovereign governance. This document provides a **canonical, timestamped, and verified record** of all legacy and retro systems.

---

## Key Components

- **Visual Legacy Map:** legacy_map.png  
- **One-Page Brief:** legacy_brief.pdf  
- **JSON System Index:** systems_index.json, mini_index.json  
- **Immutable Archive Snapshots:** archive_json/  
- **Decentralized Backup:** IPFS Root CID: $IPFS_CID  
- **Blockchain Timestamping:** OTS proofs generated for key files  

---

## SHA‑256 Verification

$SHA_SECTION

---

## Public Signaling

- GitHub Repo: [https://github.com/FlameWolx/flamebank.ac](https://