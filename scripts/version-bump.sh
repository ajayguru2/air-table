#!/bin/bash

# Version Bump Script for AirTable CSV Viewer
# Usage: ./scripts/version-bump.sh [patch|minor|major]

set -e

BUMP_TYPE=${1:-patch}
CURRENT_VERSION=$(node -p "require('./package.json').version")

echo "📋 Current version: $CURRENT_VERSION"
echo "🔄 Bump type: $BUMP_TYPE"

# Function to increment version
increment_version() {
    local version=$1
    local type=$2
    
    IFS='.' read -ra PARTS <<< "$version"
    local major=${PARTS[0]}
    local minor=${PARTS[1]}
    local patch=${PARTS[2]}
    
    case $type in
        major)
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        minor)
            minor=$((minor + 1))
            patch=0
            ;;
        patch)
            patch=$((patch + 1))
            ;;
        *)
            echo "❌ Invalid bump type. Use: patch, minor, or major"
            exit 1
            ;;
    esac
    
    echo "$major.$minor.$patch"
}

NEW_VERSION=$(increment_version $CURRENT_VERSION $BUMP_TYPE)
echo "🆕 New version: $NEW_VERSION"

# Update package.json
echo "📦 Updating package.json..."
npm version $NEW_VERSION --no-git-tag-version

# Update Tauri config
echo "⚙️  Updating Tauri configuration..."
sed -i '' "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" src-tauri/tauri.conf.json

# Update Cargo.toml
echo "🦀 Updating Cargo.toml..."
sed -i '' "s/version = \"$CURRENT_VERSION\"/version = \"$NEW_VERSION\"/" src-tauri/Cargo.toml

# Generate changelog entry
echo "📝 Generating changelog entry..."
./scripts/generate-changelog.sh $NEW_VERSION

echo ""
echo "✅ Version bump complete!"
echo "📋 Summary:"
echo "   • Updated package.json: $CURRENT_VERSION → $NEW_VERSION"
echo "   • Updated src-tauri/tauri.conf.json"
echo "   • Updated src-tauri/Cargo.toml"
echo "   • Generated changelog entry"
echo ""
echo "🚀 Next steps:"
echo "   1. Review changes: git diff"
echo "   2. Commit changes: git add . && git commit -m 'chore: bump version to v$NEW_VERSION'"
echo "   3. Create tag: git tag v$NEW_VERSION"
echo "   4. Push with tags: git push origin main --tags"
echo ""