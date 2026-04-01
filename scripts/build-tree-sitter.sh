#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TS_DIR="$SCRIPT_DIR/../tree-sitter"

cd "$TS_DIR"

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate the parser from grammar.js
echo "Generating Tree-sitter parser..."
npx tree-sitter generate

# Run tests if they exist
if [ -d "test" ]; then
  echo "Running tests..."
  npx tree-sitter test
fi

echo "Done: parser generated in $TS_DIR/src/"
