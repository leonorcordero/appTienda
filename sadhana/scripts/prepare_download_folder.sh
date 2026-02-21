#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_ROOT="$(cd "$PROJECT_DIR/.." && pwd)"
PARENT_DIR="$(cd "$REPO_ROOT/.." && pwd)"
DEST_DIR="${1:-$PARENT_DIR/sadhana}"

if [[ "$DEST_DIR" == "$PROJECT_DIR" ]]; then
  echo "Error: el destino no puede ser la carpeta fuente ($PROJECT_DIR)." >&2
  exit 1
fi

rm -rf "$DEST_DIR"
mkdir -p "$DEST_DIR"

rsync -a \
  --exclude 'build' \
  --exclude '.dart_tool' \
  --exclude '.git' \
  --exclude '*.lock' \
  "$PROJECT_DIR/" "$DEST_DIR/"

echo "Carpeta lista para descargar: $DEST_DIR"
