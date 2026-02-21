#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_ROOT="$(cd "$PROJECT_DIR/.." && pwd)"
DEST_DIR="${1:-$REPO_ROOT/sadhana_descarga}"

rm -rf "$DEST_DIR"
mkdir -p "$DEST_DIR"

rsync -a \
  --exclude 'build' \
  --exclude '.dart_tool' \
  --exclude '.git' \
  --exclude '*.lock' \
  "$PROJECT_DIR/" "$DEST_DIR/"

echo "Carpeta lista para descargar: $DEST_DIR"
