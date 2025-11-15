#!/bin/bash
set -euo pipefail

# Simple entrypoint for hosting providers like Railway/Railpack.
# Installs backend deps (if needed) and launches the Flask API.
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT/backend"

if [ -f requirements.txt ]; then
  python -m pip install --no-cache-dir -r requirements.txt
fi

exec python app.py
