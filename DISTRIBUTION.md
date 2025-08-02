# 📦 Distribution Guide

Complete guide for setting up distribution channels and managing releases for AirTable CSV Viewer.

## 🚀 Quick Start

### 1. Automated Release Process

```bash
# Release a new version (patch, minor, or major)
./scripts/release.sh patch

# Or specify version type
./scripts/release.sh minor
./scripts/release.sh major
```

This automatically:
- ✅ Bumps version in all files
- ✅ Generates changelog entry
- ✅ Creates git tag and pushes
- ✅ Triggers GitHub Actions build
- ✅ Creates GitHub Release with DMG files

### 2. Manual Version Management

```bash
# Bump version manually
./scripts/version-bump.sh patch

# Generate changelog
./scripts/generate-changelog.sh

# Build locally for testing
./deploy.sh
```

## 🏗️ Distribution Infrastructure

### GitHub Actions Workflows

1. **Release Build** (`.github/workflows/release.yml`)
   - Triggers on git tags (`v*.*.*`)
   - Builds for Apple Silicon, Intel, and Universal
   - Creates GitHub Release with download assets
   - Automatically generates release notes

2. **Website Deployment** (`.github/workflows/deploy-site.yml`)
   - Deploys `docs/` folder to GitHub Pages
   - Updates distribution website automatically

### Distribution Website

- **Location**: `docs/index.html`
- **URL**: GitHub Pages (customizable domain)
- **Features**: Download buttons, feature showcase, analytics ready

## 📊 Analytics & Tracking

### Setup Google Analytics

```bash
# Configure analytics with your GA4 measurement ID
./scripts/analytics-setup.sh G-XXXXXXXXXX
```

### Tracked Events

- **Download Events**: Tracks which platform users download
- **Page Views**: Landing page visits and engagement
- **Custom Events**: User interaction patterns

## 🔧 Configuration Files

### Version Management
- `package.json` - Node.js version
- `src-tauri/tauri.conf.json` - App metadata
- `src-tauri/Cargo.toml` - Rust crate version
- `CHANGELOG.md` - Version history

### Release Assets
Generated for each release:
- `AirTable CSV Viewer_aarch64.dmg` (Apple Silicon)
- `AirTable CSV Viewer_x64.dmg` (Intel Mac)
- `AirTable CSV Viewer_universal.dmg` (Universal Binary)
- `AirTable CSV Viewer_*.app.tar.gz` (App bundles)

## 🌐 Custom Domain Setup

### Option 1: GitHub Pages with Custom Domain

1. Update `docs/CNAME` with your domain:
   ```
   csvviewer.yourdomain.com
   ```

2. Configure DNS:
   ```
   CNAME csvviewer -> your-username.github.io
   ```

3. Enable HTTPS in GitHub repository settings

### Option 2: CDN Distribution

Deploy `docs/` folder to:
- **Netlify**: Drag & drop deployment
- **Vercel**: Connect GitHub repository
- **AWS S3 + CloudFront**: Enterprise setup

## 📋 Release Checklist

### Pre-Release
- [ ] All tests passing locally
- [ ] Documentation updated
- [ ] Icons generated and tested
- [ ] Version bump completed

### Release Process
- [ ] Run `./scripts/release.sh [type]`
- [ ] Monitor GitHub Actions build
- [ ] Verify release assets are uploaded
- [ ] Test download links work

### Post-Release
- [ ] Update distribution website if needed
- [ ] Announce release on social media
- [ ] Monitor analytics for download metrics
- [ ] Address any user feedback

## 🔒 Code Signing (Future)

For production distribution:

1. **Get Apple Developer Account**
   - Enroll in Apple Developer Program ($99/year)
   - Create certificates and provisioning profiles

2. **Configure Signing**
   ```bash
   # Add to GitHub Secrets
   APPLE_CERTIFICATE_P12 (base64 encoded)
   APPLE_CERTIFICATE_PASSWORD
   APPLE_ID_USERNAME
   APPLE_ID_PASSWORD
   ```

3. **Enable in Tauri Config**
   ```json
   {
     "bundle": {
       "macOS": {
         "signingIdentity": "Developer ID Application: Your Name",
         "hardenedRuntime": true
       }
     }
   }
   ```

## 🎯 Distribution Channels

### Primary
- **GitHub Releases**: Main distribution point
- **Website**: Professional landing page
- **Direct Download**: DMG files with auto-updates

### Future Channels
- **Mac App Store**: Requires Apple Developer Account
- **Homebrew**: Community package manager
- **Third-party Sites**: MacUpdate, VersionTracker

## 📈 Metrics & KPIs

Track these key metrics:
- **Download Count**: By platform (Apple Silicon vs Intel)
- **Geographic Distribution**: Where users are located
- **Retention**: Return visitors to website
- **Conversion**: Website visits → Downloads

## 🔧 Troubleshooting

### Build Failures
```bash
# Clean and retry
rm -rf src-tauri/target dist node_modules
npm install
./deploy.sh
```

### Release Upload Issues
- Check GitHub token permissions
- Verify artifact paths in workflow
- Ensure release tag format matches (`v*.*.*`)

### Analytics Not Working
- Verify Google Analytics ID format
- Check website deployment
- Test with browser developer tools

## 🤝 Contributing

For contributors setting up their own distribution:

1. Fork the repository
2. Update GitHub repository references in workflows
3. Configure your own GitHub Pages domain
4. Set up Google Analytics with your measurement ID
5. Follow the release process for your fork

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/air-table/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/air-table/discussions)
- **Email**: support@csvviewer.com (if configured)