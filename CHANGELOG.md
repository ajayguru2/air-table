# Changelog

All notable changes to AirTable CSV Viewer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.0.1] - 2025-08-03

### 🔄 Changed
- Initialize changelog and distribution documentation for AirTable CSV Viewer. Added detailed release process, analytics setup, and distribution guide, including GitHub Actions workflows for automated releases and website deployment. Created initial CHANGELOG.md for version tracking.
- Add initial project files for AirTable CSV Viewer, including SVG app icon, deployment script, code signing configuration, and icon generation script. Update package.json and README.md for version 1.0.0, and include necessary icons for macOS and Windows. Implement entitlements for code signing and notarization.
- Revamp README.md to reflect new project focus as "AirTable CSV Viewer"; added detailed features, installation instructions, usage guidelines, and architecture overview. Enhanced documentation for better clarity and user onboarding.
- Implement trend analysis feature in AnalysisPanel; added TrendChart component for visualizing data trends, optimized trend data calculation with async batching, and introduced tabbed navigation for overview and trend views. Enhanced UI with new styles for trend-related elements in App.css.
- Enhance performance with GPU acceleration optimizations; updated viewport settings in index.html, added GPU-related styles in App.css, and integrated GPU checks in App.tsx. Improved VirtualizedTable for better scrolling performance and added configuration updates in tauri settings.
- Refactor CSV viewer with new file picker and viewer screens; added loading states, improved error handling, and enhanced UI animations.
- Modern UI overhaul with smooth animations and developer styling
- init

## [v1.0.0] - 2024-12-20

### ✨ Added
- Initial release of AirTable CSV Viewer
- High-performance CSV file loading and viewing
- Resizable analysis panel with tabbed interface (Overview & Trend)
- Advanced trend analysis with async batch processing
- Virtualized table rendering for large datasets
- Custom app icon with modern gradient design
- Professional macOS app packaging with DMG installer
- Automated build and release pipeline

### ⚡ Performance
- GPU-accelerated rendering optimizations
- Lazy loading for trend analysis data
- Smart caching system for computed trend data
- Async batch processing to prevent UI blocking
- Virtualized scrolling for handling large CSV files

### 🎨 UI/UX
- Bottom console-style analysis panel (like VS Code debug console)
- Smooth animations and transitions
- Cohesive tab design with modern styling
- Drag-to-resize panel functionality
- Loading indicators for long-running operations
- Dark theme with professional color scheme

### 🔧 Technical
- Built with React + TypeScript + Tauri
- Automated icon generation from SVG source
- Cross-platform build support (Apple Silicon, Intel, Universal)
- Code signing preparation for production distribution
- Comprehensive test and build pipeline
