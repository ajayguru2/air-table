#!/bin/bash

# Generate app icons from SVG
# This script creates all required icon sizes for macOS app

set -e

SVG_FILE="app-icon.svg"
ICONS_DIR="src-tauri/icons"

if [ ! -f "$SVG_FILE" ]; then
    echo "❌ SVG file not found: $SVG_FILE"
    exit 1
fi

echo "🎨 Generating app icons from $SVG_FILE..."

# Create icons directory if it doesn't exist
mkdir -p "$ICONS_DIR"

# Required sizes for macOS app
sizes=(16 32 64 128 256 512 1024)

# Generate PNG files
for size in "${sizes[@]}"; do
    echo "📏 Generating ${size}x${size} icon..."
    rsvg-convert -w $size -h $size "$SVG_FILE" > "$ICONS_DIR/${size}x${size}.png"
done

# Generate @2x versions for Retina displays
echo "📏 Generating 128x128@2x icon..."
rsvg-convert -w 256 -h 256 "$SVG_FILE" > "$ICONS_DIR/128x128@2x.png"

# Generate standard app icon
echo "📏 Generating icon.png..."
rsvg-convert -w 512 -h 512 "$SVG_FILE" > "$ICONS_DIR/icon.png"

# Generate ICNS file for macOS (requires iconutil)
echo "🍎 Creating ICNS file for macOS..."

# Create iconset directory
ICONSET_DIR="$ICONS_DIR/icon.iconset"
mkdir -p "$ICONSET_DIR"

# Copy files with proper naming for iconset
cp "$ICONS_DIR/16x16.png" "$ICONSET_DIR/icon_16x16.png"
cp "$ICONS_DIR/32x32.png" "$ICONSET_DIR/icon_16x16@2x.png"
cp "$ICONS_DIR/32x32.png" "$ICONSET_DIR/icon_32x32.png"
cp "$ICONS_DIR/64x64.png" "$ICONSET_DIR/icon_32x32@2x.png"
cp "$ICONS_DIR/128x128.png" "$ICONSET_DIR/icon_128x128.png"
cp "$ICONS_DIR/256x256.png" "$ICONSET_DIR/icon_128x128@2x.png"
cp "$ICONS_DIR/256x256.png" "$ICONSET_DIR/icon_256x256.png"
cp "$ICONS_DIR/512x512.png" "$ICONSET_DIR/icon_256x256@2x.png"
cp "$ICONS_DIR/512x512.png" "$ICONSET_DIR/icon_512x512.png"
cp "$ICONS_DIR/1024x1024.png" "$ICONSET_DIR/icon_512x512@2x.png"

# Generate ICNS file
iconutil -c icns "$ICONSET_DIR" -o "$ICONS_DIR/icon.icns"

# Clean up iconset directory
rm -rf "$ICONSET_DIR"

# Generate ICO file for Windows (if needed)
echo "🪟 Creating ICO file for Windows..."
sips -s format ico "$ICONS_DIR/256x256.png" --out "$ICONS_DIR/icon.ico" 2>/dev/null || {
    echo "⚠️  Could not create ICO file (sips doesn't support ICO on this system)"
    # Create a simple copy as fallback
    cp "$ICONS_DIR/256x256.png" "$ICONS_DIR/icon.ico"
}

echo ""
echo "✅ Icon generation complete!"
echo "📂 Generated files in $ICONS_DIR/:"
echo "   • PNG files: 16x16, 32x32, 64x64, 128x128, 256x256, 512x512, 1024x1024"
echo "   • Retina: 128x128@2x.png"
echo "   • macOS: icon.icns"
echo "   • Windows: icon.ico"
echo "   • Generic: icon.png"
echo ""
echo "🚀 Ready to rebuild the app with new icons!"
echo "Run: npm run build:production"