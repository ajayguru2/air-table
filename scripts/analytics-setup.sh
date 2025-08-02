#!/bin/bash

# Analytics Setup Script for AirTable CSV Viewer
# This script helps configure Google Analytics and download tracking

echo "📊 Setting up analytics and download tracking..."
echo "=============================================="

# Check if Google Analytics ID is provided
if [ -z "$1" ]; then
    echo "📋 Usage: ./scripts/analytics-setup.sh [GOOGLE_ANALYTICS_ID]"
    echo ""
    echo "🔧 To set up analytics:"
    echo "   1. Create a Google Analytics 4 property"
    echo "   2. Get your Measurement ID (format: G-XXXXXXXXXX)"
    echo "   3. Run: ./scripts/analytics-setup.sh G-XXXXXXXXXX"
    echo ""
    echo "📈 This will add tracking for:"
    echo "   • Page views on your distribution site"
    echo "   • Download clicks for each platform (Apple Silicon, Intel, Universal)"
    echo "   • Source/referrer tracking"
    echo "   • User engagement metrics"
    echo ""
    exit 1
fi

GA_ID="$1"
DOCS_FILE="docs/index.html"

# Validate GA ID format
if [[ ! $GA_ID =~ ^G-[A-Z0-9]{10}$ ]]; then
    echo "❌ Invalid Google Analytics ID format"
    echo "   Expected format: G-XXXXXXXXXX"
    echo "   Provided: $GA_ID"
    exit 1
fi

echo "🔧 Configuring Google Analytics ID: $GA_ID"

# Create analytics snippet
ANALYTICS_SNIPPET="<!-- Google Analytics -->
<script async src=\"https://www.googletagmanager.com/gtag/js?id=$GA_ID\"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '$GA_ID', {
    page_title: 'AirTable CSV Viewer',
    page_location: window.location.href,
    custom_map: {
      'custom_parameter_1': 'download_type'
    }
  });
</script>"

# Insert analytics snippet into HTML
if grep -q "<!-- Google Analytics -->" "$DOCS_FILE"; then
    echo "⚠️  Analytics already configured. Updating..."
    # Remove existing analytics block
    sed -i '' '/<!-- Google Analytics -->/,/^<\/script>$/d' "$DOCS_FILE"
fi

# Insert before closing head tag
sed -i '' "/<\/head>/i\\
$ANALYTICS_SNIPPET
" "$DOCS_FILE"

# Update the analytics placeholder in the script section
sed -i '' "s/if (typeof gtag !== 'undefined') {/if (typeof gtag === 'function') {/" "$DOCS_FILE"

echo "✅ Analytics configuration complete!"
echo ""
echo "📊 Tracking configured for:"
echo "   • Page views and user sessions"
echo "   • Download events by platform type"
echo "   • Custom events for user engagement"
echo ""
echo "🔗 View analytics at:"
echo "   https://analytics.google.com/analytics/web/#/p{your-property-id}"
echo ""
echo "📋 Next steps:"
echo "   1. Commit and push changes to enable tracking"
echo "   2. Test downloads to verify event tracking"
echo "   3. Set up custom dashboards in Google Analytics"
echo "   4. Consider adding conversion goals for power users"
echo ""