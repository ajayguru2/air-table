# 📊 AirTable CSV Viewer

A powerful, high-performance CSV viewer and analysis tool built with React, TypeScript, and Tauri. Features advanced data visualization, trend analysis, and an intuitive resizable console interface similar to modern development tools.

## ✨ Features

### 🚀 Core Functionality
- **High-Performance CSV Loading**: Handles large files (100MB+) with streaming parser
- **Virtualized Table**: Smooth scrolling through millions of rows without performance loss
- **Smart File Processing**: Automatic chunked loading with progress indicators
- **Memory Optimization**: GPU acceleration and efficient rendering

### 📈 Advanced Analysis
- **Resizable Analysis Console**: Debug console-style bottom panel that can be dragged to resize
- **Dual-Tab Interface**: 
  - **Overview Tab**: Search, sort, and column statistics
  - **Trend Tab**: Time-series analysis with interactive charts
- **Real-time Statistics**: Min, max, average, median, unique values, and data type detection
- **Interactive Trend Charts**: SVG-based charts with hover effects and data point visualization

### 🎨 Modern UI/UX
- **Dark Theme**: Professional dark interface with blue accent colors
- **Smooth Animations**: GPU-accelerated transitions and hover effects
- **Responsive Design**: Adapts to different screen sizes and layouts
- **Loading States**: Beautiful spinners and progress indicators
- **Keyboard Shortcuts**: Quick panel resizing with Ctrl/Cmd + +/-/0

### ⚡ Performance Optimizations
- **Lazy Loading**: Trend analysis only processes when needed
- **Smart Caching**: Results cached to avoid recalculation
- **Async Processing**: Non-blocking data analysis with batch processing
- **Component Memoization**: Optimized re-rendering with React.memo

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Desktop**: Tauri (Rust backend)
- **Styling**: CSS3 with custom animations and GPU acceleration
- **Data Processing**: PapaParse for CSV parsing
- **Virtualization**: React Window for large datasets
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- Rust (for Tauri)
- npm or yarn

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/air-table.git
   cd air-table
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Run Tauri app (desktop)**
   ```bash
   npm run tauri:dev
   ```

## 📱 Production Build

### Build for macOS

1. **Quick production build**
   ```bash
   ./deploy.sh
   ```

2. **Manual build commands**
   ```bash
   # Build for current architecture (Apple Silicon)
   npm run build:production
   
   # Build for Intel Macs
   npm run build:mac-intel
   
   # Build Universal binary (both architectures)
   npm run build:universal
   ```

3. **Build outputs**
   - **DMG Installer**: `src-tauri/target/release/bundle/dmg/AirTable CSV Viewer_1.0.0_aarch64.dmg`
   - **App Bundle**: `src-tauri/target/release/bundle/macos/AirTable CSV Viewer.app`

### Code Signing (Optional)

For production distribution, configure code signing:

1. **Set up certificates**
   - Get Apple Developer account
   - Install Developer ID certificates
   - Configure signing identity in `tauri.conf.json`

2. **Update configuration**
   ```json
   "signingIdentity": "Developer ID Application: Your Name (TEAM_ID)",
   "hardenedRuntime": true,
   "entitlements": "entitlements.plist"
   ```

3. **Notarization for Gatekeeper**
   ```bash
   xcrun notarytool submit "AirTable CSV Viewer_1.0.0_aarch64.dmg" \
     --apple-id "$APPLE_ID" \
     --password "$APPLE_APP_SPECIFIC_PASSWORD" \
     --team-id "$APPLE_TEAM_ID" \
     --wait
   ```

## 🚀 Usage

### Loading CSV Files
1. Click "Choose File" or drag and drop a CSV file
2. Files up to 100MB are supported
3. Large files show confirmation dialog and progress indicator
4. Automatic streaming parser for files over 5MB

### Analysis Console
1. Click "Show Analysis" to open the bottom console
2. **Drag the top edge** to resize the panel (like VS Code debugger)
3. Use keyboard shortcuts:
   - `Ctrl/Cmd + +`: Increase panel height
   - `Ctrl/Cmd + -`: Decrease panel height  
   - `Ctrl/Cmd + 0`: Reset to default height

### Overview Tab
- **Search**: Real-time filtering across all columns
- **Sort**: Click column headers or use dropdown
- **Statistics**: Select any column to see detailed stats
- **Data Types**: Automatic detection of numeric vs text data

### Trend Tab
- **Date Column**: Select column containing dates
- **Value Column**: Select numeric column for analysis
- **Interactive Chart**: Hover over data points for details
- **Statistics**: Trend direction, change percentage, data points, etc.

### Row Details
- Click any row to open the details sidebar
- View all column values for the selected row
- Copy individual values or entire row data
- Navigate between rows with arrow keys

## 🏗️ Architecture

### Component Structure
```
src/
├── App.tsx                 # Main application router
├── FilePickerScreen.tsx    # File selection and loading
├── CsvViewerScreen.tsx     # Main viewer with layout
├── VirtualizedTable.tsx    # Performance-optimized table
├── AnalysisPanel.tsx       # Resizable analysis console
├── RowDetailsPanel.tsx     # Row detail sidebar
└── utils/
    └── performance.ts      # GPU acceleration utilities
```

### Key Features Implementation

**Resizable Console**
- Mouse drag handlers with visual feedback
- Dynamic height calculation and table resizing
- Smooth animations and state management

**Performance Optimization**
- Virtual scrolling for large datasets
- Async batch processing for trend analysis
- Smart memoization and caching strategies
- GPU acceleration for smooth animations

**Data Processing**
- Streaming CSV parser with chunked reading
- Memory-efficient data structures
- Progressive loading with user feedback

## 🎨 Customization

### Theme Colors
The app uses a modern dark theme with customizable accent colors:
- Primary: `#3b82f6` (Blue)
- Secondary: `#1d4ed8` (Dark Blue)
- Success: `#10b981` (Green)
- Background: `#1a1a2e` to `#0f3460` (Gradient)

### Performance Tuning
Adjust these values in the code for different performance characteristics:
- `batchSize`: 500 (trend processing batch size)
- `ROW_HEIGHT`: 35px (table row height)
- `maxRows`: 50,000 (memory limit for very large files)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for type safety
- Follow the existing code style and conventions
- Add comments for complex logic
- Test performance with large datasets
- Ensure responsive design works on all screen sizes

## 📋 Roadmap

- [ ] Export filtered/sorted data to CSV
- [ ] Multiple file tabs support
- [ ] Advanced filtering with conditions
- [ ] Data transformation tools
- [ ] Custom chart types
- [ ] Collaborative features
- [ ] Plugin system
- [ ] Cloud storage integration

## 🐛 Known Issues

- Very large files (>100MB) may require increased memory allocation
- Date parsing is locale-dependent
- Some CSV dialects may need manual configuration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Tauri](https://tauri.app/) for cross-platform desktop apps
- CSV parsing powered by [PapaParse](https://www.papaparse.com/)
- Virtualization by [React Window](https://github.com/bvaughn/react-window)
- Icons and design inspiration from modern development tools

## 📞 Support

- Create an [Issue](https://github.com/your-username/air-table/issues) for bug reports
- Start a [Discussion](https://github.com/your-username/air-table/discussions) for questions
- Follow [@your-username](https://twitter.com/your-username) for updates

---

**Made with ❤️ using React, TypeScript, and Tauri**

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
