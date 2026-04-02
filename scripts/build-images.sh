#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$SCRIPT_DIR/.."
BRANDING_DIR="$ROOT_DIR/branding"
IMAGES_DIR="$ROOT_DIR/vscode/images"

# Detect ImageMagick command
if command -v magick &>/dev/null; then
  CONVERT="magick"
elif command -v convert &>/dev/null; then
  CONVERT="convert"
else
  echo "Error: ImageMagick is required but not found. Install it with:"
  echo "  sudo pacman -S imagemagick   # Arch"
  echo "  sudo apt install imagemagick  # Debian/Ubuntu"
  echo "  brew install imagemagick      # macOS"
  exit 1
fi

mkdir -p "$IMAGES_DIR"

# --- File icons (square) from grove-icon.svg ---
FILE_ICON_SRC="$BRANDING_DIR/grove-icon.svg"
FILE_ICON_SIZES=(16 32 48 64 128 256 512)

echo "Generating file icons from $(basename "$FILE_ICON_SRC")..."
for size in "${FILE_ICON_SIZES[@]}"; do
  out="$IMAGES_DIR/icon-${size}.png"
  $CONVERT -background none -density 300 "$FILE_ICON_SRC" -resize "${size}x${size}" "$out"
  echo "  icon-${size}.png (${size}x${size})"
done

# icon.png is the 256px version used by package.json language icon
cp "$IMAGES_DIR/icon-256.png" "$IMAGES_DIR/icon.png"
echo "  icon.png (copy of icon-256.png)"

# --- Extension marketplace icons from grove-letter-icon.svg ---
EXT_ICON_SRC="$BRANDING_DIR/grove-letter-icon.svg"
EXT_ICON_HEIGHTS=(256 512)

echo "Generating extension icons from $(basename "$EXT_ICON_SRC")..."
for height in "${EXT_ICON_HEIGHTS[@]}"; do
  out="$IMAGES_DIR/extension-icon-${height}.png"
  $CONVERT -background none -density 300 "$EXT_ICON_SRC" -resize "x${height}" "$out"
  echo "  extension-icon-${height}.png (height ${height}, aspect ratio preserved)"
done

echo "Done. All images written to vscode/images/"
