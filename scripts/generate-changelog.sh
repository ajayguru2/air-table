#!/bin/bash

# Changelog Generator for AirTable CSV Viewer
# Usage: ./scripts/generate-changelog.sh [version]

set -e

VERSION=${1:-$(node -p "require('./package.json').version")}
DATE=$(date +"%Y-%m-%d")
CHANGELOG_FILE="CHANGELOG.md"

echo "📝 Generating changelog for version $VERSION..."

# Create changelog if it doesn't exist
if [ ! -f "$CHANGELOG_FILE" ]; then
    echo "📄 Creating new CHANGELOG.md..."
    cat > "$CHANGELOG_FILE" << EOF
# Changelog

All notable changes to AirTable CSV Viewer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

EOF
fi

# Get git commits since last tag
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
if [ -n "$LAST_TAG" ]; then
    echo "📋 Getting commits since $LAST_TAG..."
    COMMITS=$(git log $LAST_TAG..HEAD --oneline --no-merges)
else
    echo "📋 Getting all commits (no previous tag found)..."
    COMMITS=$(git log --oneline --no-merges)
fi

# Analyze commits and categorize
FEATURES=""
FIXES=""
CHANGES=""
PERFORMANCE=""

while IFS= read -r commit; do
    if [[ -n "$commit" ]]; then
        if [[ $commit =~ ^[a-f0-9]+\ (feat|feature)[:\ ] ]]; then
            FEATURES="$FEATURES\n- ${commit#* }"
        elif [[ $commit =~ ^[a-f0-9]+\ (fix|bugfix)[:\ ] ]]; then
            FIXES="$FIXES\n- ${commit#* }"
        elif [[ $commit =~ ^[a-f0-9]+\ (perf|performance)[:\ ] ]]; then
            PERFORMANCE="$PERFORMANCE\n- ${commit#* }"
        else
            CHANGES="$CHANGES\n- ${commit#* }"
        fi
    fi
done <<< "$COMMITS"

# Generate changelog entry
CHANGELOG_ENTRY="## [v$VERSION] - $DATE"

if [ -n "$FEATURES" ]; then
    CHANGELOG_ENTRY="$CHANGELOG_ENTRY\n\n### ✨ Added$FEATURES"
fi

if [ -n "$FIXES" ]; then
    CHANGELOG_ENTRY="$CHANGELOG_ENTRY\n\n### 🐛 Fixed$FIXES"
fi

if [ -n "$PERFORMANCE" ]; then
    CHANGELOG_ENTRY="$CHANGELOG_ENTRY\n\n### ⚡ Performance$PERFORMANCE"
fi

if [ -n "$CHANGES" ]; then
    CHANGELOG_ENTRY="$CHANGELOG_ENTRY\n\n### 🔄 Changed$CHANGES"
fi

# Add changelog entry to file
temp_file=$(mktemp)
echo -e "$CHANGELOG_ENTRY\n" > "$temp_file"
if grep -q "^## \[" "$CHANGELOG_FILE"; then
    # Insert after the header but before the first version entry
    awk '/^## \[/{print changelog_entry; print ""; found=1} found{print} !found && !/^## \[/{print}' changelog_entry="$CHANGELOG_ENTRY" "$CHANGELOG_FILE" > "$temp_file"
    mv "$temp_file" "$CHANGELOG_FILE"
else
    # Append to end of file
    echo -e "\n$CHANGELOG_ENTRY" >> "$CHANGELOG_FILE"
fi

echo "✅ Changelog updated!"
echo "📄 Entry added to $CHANGELOG_FILE"

# Show the changelog entry
echo ""
echo "📋 Generated entry:"
echo "==================="
echo -e "$CHANGELOG_ENTRY"
echo "==================="
echo ""