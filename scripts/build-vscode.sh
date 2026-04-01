#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VSCODE_DIR="$SCRIPT_DIR/../vscode"

cd "$VSCODE_DIR"

# Install dependencies (includes vsce locally)
echo "Installing dependencies..."
npm install

# Package the extension into a .vsix
echo "Packaging Wispy VS Code extension..."
npx @vscode/vsce package --out "$VSCODE_DIR/wispy-templates.vsix" --no-update-package-json

echo "Done: $VSCODE_DIR/wispy-templates.vsix"
