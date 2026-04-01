#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VSCODE_DIR="$SCRIPT_DIR/../vscode"

cd "$VSCODE_DIR"

# Install vsce if not available
if ! command -v vsce &>/dev/null; then
  echo "Installing @vscode/vsce..."
  npm install -g @vscode/vsce
fi

# Package the extension into a .vsix
echo "Packaging Wispy VS Code extension..."
vsce package --out "$VSCODE_DIR/wispy-templates.vsix"

echo "Done: $VSCODE_DIR/wispy-templates.vsix"
