# Changelog

All notable changes to AirTable CSV Viewer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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