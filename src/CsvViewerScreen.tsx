import React, { useState, useRef, useEffect } from 'react';
import VirtualizedTable from "./VirtualizedTable";
import AnalysisPanel from "./AnalysisPanel";
import RowDetailsPanel from "./RowDetailsPanel";
import './CsvViewerScreen.css';

interface CsvData {
  headers: string[];
  rows: string[][];
}

interface CsvViewerScreenProps {
  csvData: CsvData;
  onBackToFileSelect: () => void;
}

const CsvViewerScreen: React.FC<CsvViewerScreenProps> = ({
  csvData,
  onBackToFileSelect
}) => {
  const [displayData, setDisplayData] = useState<string[][]>(csvData.rows);
  const [containerHeight, setContainerHeight] = useState(600);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [analysisPanelHeight, setAnalysisPanelHeight] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const availableHeight = window.innerHeight - rect.top - 20;
        setContainerHeight(Math.max(400, availableHeight));
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Keyboard shortcuts for resizing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showAnalysis) return;
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault();
            setAnalysisPanelHeight(prev => Math.min(prev + 50, containerHeight - 200));
            break;
          case '-':
            e.preventDefault();
            setAnalysisPanelHeight(prev => Math.max(prev - 50, 150));
            break;
          case '0':
            e.preventDefault();
            setAnalysisPanelHeight(250); // Reset to default
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showAnalysis, containerHeight]);


  const handleSort = (columnIndex: number) => {
    const direction = sortColumn === columnIndex && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnIndex);
    setSortDirection(direction);

    // For large datasets, sort only the displayed data to maintain performance
    const dataToSort = csvData.rows.length > 10000 ? displayData : csvData.rows;
    
    const sorted = [...dataToSort].sort((a, b) => {
      const aVal = a[columnIndex] || '';
      const bVal = b[columnIndex] || '';
      
      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return direction === 'asc' ? aNum - bNum : bNum - aNum;
      }
      
      return direction === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

    setDisplayData(sorted);
  };

  return (
    <div className="csv-viewer-screen">
      <div className="csv-header">
        <div className="csv-header-left">
          <button onClick={onBackToFileSelect} className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="m12 19-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <div className="file-info">
            <span className="row-count">{displayData.length.toLocaleString()}</span>
            <span className="separator">×</span>
            <span className="col-count">{csvData.headers.length}</span>
            {csvData.rows.length !== displayData.length && (
              <span className="total-info">of {csvData.rows.length.toLocaleString()} total rows</span>
            )}
          </div>
        </div>
        <div className="csv-header-right">
          <button 
            onClick={() => setShowAnalysis(!showAnalysis)}
            className={`analysis-toggle ${showAnalysis ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="m19 9-5 5-4-4-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {showAnalysis ? "Hide Analysis" : "Show Analysis"}
          </button>
        </div>
      </div>

      <div className="csv-content" ref={containerRef}>
        <div className="csv-main-content">
          <div className="csv-table-area">
            <VirtualizedTable 
              headers={csvData.headers}
              rows={displayData}
              height={showAnalysis ? containerHeight - analysisPanelHeight : containerHeight}
              onSort={handleSort}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              selectedRow={selectedRow}
              onRowSelect={setSelectedRow}
            />
          </div>
          {selectedRow !== null && (
            <div className="details-sidebar">
              <RowDetailsPanel
                headers={csvData.headers}
                row={displayData[selectedRow]}
                onClose={() => setSelectedRow(null)}
              />
            </div>
          )}
        </div>
        {showAnalysis && (
          <div 
            className="analysis-bottom-panel" 
            style={{ height: analysisPanelHeight }}
          >
            <div 
              className={`resize-handle ${isResizing ? 'resizing' : ''}`}
              onMouseDown={(e) => {
                setIsResizing(true);
                const startY = e.clientY;
                const startHeight = analysisPanelHeight;
                document.body.style.cursor = 'ns-resize';
                document.body.style.userSelect = 'none';

                const handleMouseMove = (moveEvent: MouseEvent) => {
                  const deltaY = startY - moveEvent.clientY;
                  const newHeight = Math.min(Math.max(150, startHeight + deltaY), containerHeight - 200);
                  setAnalysisPanelHeight(newHeight);
                };

                const handleMouseUp = () => {
                  setIsResizing(false);
                  document.body.style.cursor = '';
                  document.body.style.userSelect = '';
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
              <div className="resize-handle-bar"></div>
            </div>
            <AnalysisPanel
              data={csvData.rows}
              headers={csvData.headers}
              onFilter={setDisplayData}
              onSort={setDisplayData}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CsvViewerScreen;