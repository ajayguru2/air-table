#!/bin/bash

# AirTable CSV Viewer - Production Deployment Script
# This script builds and prepares the app for distribution

set -e

echo "🚀 Building AirTable CSV Viewer for production..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf src-tauri/target/release/bundle/
rm -rf dist/

# Generate fresh icons
echo "🎨 Generating app icons..."
./generate-icons.sh

# Build the application
echo "📦 Building application..."
npm run build:production

# Check if build was successful
if [ -f "src-tauri/target/release/bundle/dmg/AirTable CSV Viewer_1.0.0_aarch64.dmg" ]; then
    echo "✅ Build successful!"
    
    # Create releases directory
    mkdir -p releases
    
    # Copy artifacts
    echo "📁 Copying build artifacts..."
    cp "src-tauri/target/release/bundle/dmg/AirTable CSV Viewer_1.0.0_aarch64.dmg" releases/
    cp -r "src-tauri/target/release/bundle/macos/AirTable CSV Viewer.app" releases/
    
    # Get file sizes
    DMG_SIZE=$(du -h "releases/AirTable CSV Viewer_1.0.0_aarch64.dmg" | cut -f1)
    APP_SIZE=$(du -h -d 0 "releases/AirTable CSV Viewer.app" | cut -f1)
    
    echo ""
    echo "🎉 Production build complete!"
    echo "📊 Build artifacts:"
    echo "   • DMG installer: $DMG_SIZE"
    echo "   • App bundle: $APP_SIZE"
    echo ""
    echo "📂 Files available in ./releases/"
    echo "   • AirTable CSV Viewer_1.0.0_aarch64.dmg (for distribution)"
    echo "   • AirTable CSV Viewer.app (standalone app)"
    echo ""
    echo "⚠️  Note: This build is unsigned. For production distribution:"
    echo "   1. Set up code signing certificates"
    echo "   2. Configure codesign.conf"
    echo "   3. Enable notarization"
    echo ""
    
else
    echo "❌ Build failed!"
    exit 1
fi