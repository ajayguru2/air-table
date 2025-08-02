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
        {showAnalysis && (
          <div className="analysis-sidebar">
            <AnalysisPanel
              data={csvData.rows}
              headers={csvData.headers}
              onFilter={setDisplayData}
              onSort={setDisplayData}
            />
          </div>
        )}
        <div className="csv-main">
          <VirtualizedTable 
            headers={csvData.headers}
            rows={displayData}
            height={containerHeight}
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
    </div>
  );
};

export default CsvViewerScreen;