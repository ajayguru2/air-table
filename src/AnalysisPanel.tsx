import React, { useState, useMemo } from 'react';

interface AnalysisPanelProps {
  data: string[][];
  headers: string[];
  onFilter: (filteredData: string[][]) => void;
  onSort: (sortedData: string[][]) => void;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ data, headers, onFilter, onSort }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedColumn, setSelectedColumn] = useState<number>(0);

  const columnStats = useMemo(() => {
    if (!data.length || selectedColumn >= headers.length) return null;

    const columnData = data.map(row => row[selectedColumn]).filter(Boolean);
    const numericData = columnData.map(val => parseFloat(val)).filter(val => !isNaN(val));
    const isNumeric = numericData.length > columnData.length * 0.5;

    const stats = {
      totalRows: columnData.length,
      uniqueValues: new Set(columnData).size,
      emptyValues: data.length - columnData.length,
      isNumeric,
      ...(isNumeric && {
        min: Math.min(...numericData),
        max: Math.max(...numericData),
        avg: numericData.reduce((a, b) => a + b, 0) / numericData.length,
        median: numericData.sort((a, b) => a - b)[Math.floor(numericData.length / 2)]
      })
    };

    return stats;
  }, [data, selectedColumn, headers]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      onFilter(data);
      return;
    }

    const filtered = data.filter(row =>
      row.some(cell => cell?.toLowerCase().includes(term.toLowerCase()))
    );
    onFilter(filtered);
  };

  const handleSort = (columnIndex: number) => {
    const direction = sortColumn === columnIndex && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnIndex);
    setSortDirection(direction);

    const sorted = [...data].sort((a, b) => {
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

    onSort(sorted);
  };

  return (
    <div className="analysis-panel">
      <div className="search-section">
        <input
          type="text"
          placeholder="Search across all columns..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="sort-section">
        <label>Sort by column:</label>
        <select 
          onChange={(e) => handleSort(parseInt(e.target.value))}
          className="sort-select"
        >
          {headers.map((header, index) => (
            <option key={index} value={index}>
              {header} {sortColumn === index ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="stats-section">
        <label>Column Statistics:</label>
        <select 
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(parseInt(e.target.value))}
          className="column-select"
        >
          {headers.map((header, index) => (
            <option key={index} value={index}>{header}</option>
          ))}
        </select>
        
        {columnStats && (
          <div className="stats-display">
            <div className="stat-item">
              <span className="stat-label">Total Rows:</span>
              <span className="stat-value">{columnStats.totalRows}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Unique Values:</span>
              <span className="stat-value">{columnStats.uniqueValues}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Empty Values:</span>
              <span className="stat-value">{columnStats.emptyValues}</span>
            </div>
            {columnStats.isNumeric && (
              <>
                <div className="stat-item">
                  <span className="stat-label">Min:</span>
                  <span className="stat-value">{columnStats.min?.toFixed(2)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Max:</span>
                  <span className="stat-value">{columnStats.max?.toFixed(2)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Average:</span>
                  <span className="stat-value">{columnStats.avg?.toFixed(2)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Median:</span>
                  <span className="stat-value">{columnStats.median?.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;