#!/bin/bash
set -euo pipefail

# Simple entrypoint for hosting providers like Railway/Railpack.
# Installs backend deps (if needed) and launches the Flask API.
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT/backend"

PYTHON_BIN="${PYTHON_BIN:-python3}"

if ! command -v "$PYTHON_BIN" >/dev/null 2>&1; then
  if command -v python >/dev/null 2>&1; then
    PYTHON_BIN="python"
  else
    echo "❌ Neither python3 nor python is available on PATH."
    exit 1
  fi
fi

if [ -f requirements.txt ]; then
  "$PYTHON_BIN" -m pip install --no-cache-dir -r requirements.txt
fi

exec "$PYTHON_BIN" app.py
