#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")/.." && pwd)"

export PATH="$PROJECT_ROOT/.local/bin:$PATH"

if ! command -v node >/dev/null 2>&1; then
  echo "Local Node runtime not found at $PROJECT_ROOT/.local/bin/node"
  echo "Install it with:"
  echo "  curl -fsSL https://nodejs.org/dist/v22.13.1/node-v22.13.1-darwin-arm64.tar.gz -o /tmp/node-v22.13.1-darwin-arm64.tar.gz"
  echo "  mkdir -p $PROJECT_ROOT/.local/node $PROJECT_ROOT/.local/bin"
  echo "  tar -xzf /tmp/node-v22.13.1-darwin-arm64.tar.gz -C $PROJECT_ROOT/.local/node --strip-components=1"
  echo "  ln -sf ../node/bin/node $PROJECT_ROOT/.local/bin/node"
  echo "  ln -sf ../node/bin/npm $PROJECT_ROOT/.local/bin/npm"
  echo "  ln -sf ../node/bin/npx $PROJECT_ROOT/.local/bin/npx"
  exit 1
fi

echo "Using node: $(command -v node)"
node -v
npm -v
