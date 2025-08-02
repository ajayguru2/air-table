#!/bin/bash

# Create GitHub Release Script
# This will create a release and upload the DMG file

set -e

VERSION="v1.0.1"
DMG_FILE="src-tauri/target/release/bundle/dmg/AirTable CSV Viewer_1.0.1_aarch64.dmg"

echo "🚀 Creating GitHub release $VERSION..."

# Check if DMG exists
if [ ! -f "$DMG_FILE" ]; then
    echo "❌ DMG file not found: $DMG_FILE"
    echo "Run 'npm run tauri build' first"
    exit 1
fi

echo "📦 DMG file found: $(du -h "$DMG_FILE" | cut -f1)"

# Create release using GitHub CLI (if available) or provide manual instructions
if command -v gh &> /dev/null; then
    echo "🔧 Creating release with GitHub CLI..."
    
    gh release create "$VERSION" \
        --title "AirTable CSV Viewer $VERSION" \
        --notes "## 🎉 First Release of AirTable CSV Viewer!

### ✨ Features
- High-performance CSV viewing with virtualized scrolling
- Resizable analysis panel with Overview and Trend tabs
- GPU-accelerated rendering for smooth performance
- Async batch processing for trend analysis
- Professional dark theme with modern UI

### 📦 Downloads
- **AirTable CSV Viewer_1.0.1_aarch64.dmg** - For Apple Silicon Macs (M1/M2/M3)

### 📋 Requirements
- macOS 10.15 or later
- 4GB RAM minimum
- 50MB disk space

### 🔧 Installation
1. Download the DMG file
2. Open the DMG and drag the app to Applications
3. Launch from Applications folder

---
Built with ❤️ using React, TypeScript, and Tauri" \
        "$DMG_FILE"
        
    echo "✅ Release created successfully!"
    echo "🔗 View at: https://github.com/ajayguru2/air-table/releases/tag/$VERSION"
    
else
    echo "⚠️  GitHub CLI not found. Manual steps:"
    echo ""
    echo "1. Go to: https://github.com/ajayguru2/air-table/releases/new"
    echo "2. Tag version: $VERSION"
    echo "3. Release title: AirTable CSV Viewer $VERSION"
    echo "4. Upload file: $DMG_FILE"
    echo "5. Add release notes (see template above)"
    echo ""
fi