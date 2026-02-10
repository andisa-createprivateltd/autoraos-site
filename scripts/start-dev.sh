#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Prefer project-local Node runtime when available.
if [[ -x "$ROOT_DIR/.local/bin/node" && -x "$ROOT_DIR/.local/bin/npm" ]]; then
  export PATH="$ROOT_DIR/.local/bin:$PATH"
fi

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Node/npm not found. Run: source scripts/use-local-node.sh"
  exit 1
fi

PORT="${PORT:-3000}"
HOST="${HOST:-127.0.0.1}"

echo "Starting AUTORA on http://${HOST}:${PORT}"
exec npm run dev -- -H "$HOST" -p "$PORT"
