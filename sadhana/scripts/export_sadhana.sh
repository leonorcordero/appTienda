#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="${1:-$PWD}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
ARCHIVE_NAME="sadhana_${TIMESTAMP}.zip"
ARCHIVE_PATH="${OUTPUT_DIR%/}/${ARCHIVE_NAME}"

mkdir -p "$OUTPUT_DIR"

(
  cd "$PROJECT_DIR"
  zip -rq "$ARCHIVE_PATH" . -x "build/*" ".dart_tool/*" "*.lock" ".git/*"
)

echo "Archivo generado: $ARCHIVE_PATH"
