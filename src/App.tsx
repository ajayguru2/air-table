import { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import VirtualizedTable from "./VirtualizedTable";
import AnalysisPanel from "./AnalysisPanel";
import RowDetailsPanel from "./RowDetailsPanel";
import "./App.css";

interface CsvData {
  headers: string[];
  rows: string[][];
}

function App() {
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [displayData, setDisplayData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
  }, [csvData]);

  const handleFileSelect = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = handleFileChange;
    input.click();
  };

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError(`Error parsing CSV: ${results.errors[0].message}`);
          setLoading(false);
          return;
        }

        const data = results.data as string[][];
        if (data.length === 0) {
          setError("CSV file is empty");
          setLoading(false);
          return;
        }

        const headers = data[0];
        const rows = data.slice(1);

        setCsvData({ headers, rows });
        setDisplayData(rows);
        setSortColumn(null);
        setSortDirection('asc');
        setSelectedRow(null);
        setLoading(false);
      },
      error: (error) => {
        setError(`Error reading file: ${error.message}`);
        setLoading(false);
      }
    });
  };

  const handleSort = (columnIndex: number) => {
    const direction = sortColumn === columnIndex && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnIndex);
    setSortDirection(direction);

    if (!csvData) return;

    const sorted = [...csvData.rows].sort((a, b) => {
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
    <main className="container">
      <h1>CSV Viewer</h1>
      
      <div className="toolbar">
        <button onClick={handleFileSelect} disabled={loading}>
          {loading ? "Loading..." : "Open CSV File"}
        </button>
        {csvData && (
          <>
            <div className="file-info">
              <span>{displayData.length} of {csvData.rows.length} rows, {csvData.headers.length} columns</span>
            </div>
            <button onClick={() => setShowAnalysis(!showAnalysis)}>
              {showAnalysis ? "Hide Analysis" : "Show Analysis"}
            </button>
          </>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      {csvData && (
        <div className="main-content">
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
          <div ref={containerRef} className="csv-container">
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
          {selectedRow !== null && csvData && (
            <div className="details-sidebar">
              <RowDetailsPanel
                headers={csvData.headers}
                row={displayData[selectedRow]}
                onClose={() => setSelectedRow(null)}
              />
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default App;
