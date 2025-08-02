import React from 'react';
import './FilePickerScreen.css';

interface FilePickerScreenProps {
  onFileSelect: (event: Event) => void;
  loading: boolean;
  loadingProgress: number;
  loadingMessage: string;
  error: string | null;
}

const FilePickerScreen: React.FC<FilePickerScreenProps> = ({
  onFileSelect,
  loading,
  loadingProgress,
  loadingMessage,
  error
}) => {
  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = onFileSelect;
    input.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        // Create a synthetic event to match the expected interface
        const syntheticEvent = {
          target: {
            files: [file]
          }
        } as any;
        onFileSelect(syntheticEvent);
      }
    }
  };

  return (
    <div className="file-picker-screen">
      <div className="file-picker-container">
        <div className="file-picker-header">
          <h1>CSV Viewer Pro</h1>
          <p>Upload and analyze your CSV files with ease</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div 
          className="drop-zone"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleFileSelect}
        >
          <div className="drop-zone-content">
            <div className="upload-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>Drop your CSV file here</h2>
            <p>or click to browse files</p>
            <div className="file-types">
              <span>Supports: .csv files up to 100MB</span>
            </div>
          </div>
        </div>

        <div className="features">
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <div className="feature-text">
              <h3>Fast Processing</h3>
              <p>Handles large files with streaming technology</p>
            </div>
          </div>
          <div className="feature">
            <div className="feature-icon">🔍</div>
            <div className="feature-text">
              <h3>Advanced Analysis</h3>
              <p>Sort, filter, and analyze your data</p>
            </div>
          </div>
          <div className="feature">
            <div className="feature-icon">📊</div>
            <div className="feature-text">
              <h3>Detailed View</h3>
              <p>Explore individual rows and columns</p>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-container">
            <div className="spinner"></div>
            <div className="loading-text">{loadingMessage || 'Loading...'}</div>
            {loadingProgress > 0 && (
              <>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <div className="progress-text">{Math.round(loadingProgress)}%</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilePickerScreen;