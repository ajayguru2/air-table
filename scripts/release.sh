#!/bin/bash

# Release Script for AirTable CSV Viewer
# Usage: ./scripts/release.sh [patch|minor|major]

set -e

BUMP_TYPE=${1:-patch}

echo "🚀 Starting release process..."
echo "=====================================\n"

# Ensure we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Please switch to main branch before releasing"
    echo "   Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Ensure repo is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Working directory is not clean. Please commit or stash changes."
    git status
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Bump version
echo "🔢 Bumping version ($BUMP_TYPE)..."
./scripts/version-bump.sh $BUMP_TYPE

NEW_VERSION=$(node -p "require('./package.json').version")
echo "✅ Version bumped to: v$NEW_VERSION"

# Run tests if they exist
if [ -f "package.json" ] && npm run | grep -q "test"; then
    echo "🧪 Running tests..."
    npm test
fi

# Build the app to ensure it compiles
echo "🔨 Testing build..."
npm run build

# Commit version changes
echo "💾 Committing version bump..."
git add .
git commit -m "chore: bump version to v$NEW_VERSION

- Updated package.json, Tauri config, and Cargo.toml
- Generated changelog entry for v$NEW_VERSION
- Ready for release"

# Create and push tag
echo "🏷️  Creating and pushing tag..."
git tag "v$NEW_VERSION"
git push origin main
git push origin "v$NEW_VERSION"

echo ""
echo "🎉 Release v$NEW_VERSION initiated!"
echo "=====================================\n"
echo "📋 What happens next:"
echo "   • GitHub Actions will automatically build the app"
echo "   • Release artifacts will be created for macOS"
echo "   • DMG files will be uploaded to GitHub Releases"
echo "   • Release notes will be auto-generated"
echo ""
echo "🔗 Monitor the release at:"
echo "   https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions"
echo ""
echo "📦 When complete, release will be available at:"
echo "   https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/releases/tag/v$NEW_VERSION"
echo ""