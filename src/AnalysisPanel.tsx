import React, { useState, useMemo, useCallback, useEffect } from 'react';

interface AnalysisPanelProps {
  data: string[][];
  headers: string[];
  onFilter: (filteredData: string[][]) => void;
  onSort: (sortedData: string[][]) => void;
}

interface TrendData {
  date: string;
  value: number;
  formattedDate: string;
}

interface TrendChartProps {
  data: TrendData[];
}

const TrendChart: React.FC<TrendChartProps> = React.memo(({ data }) => {
  if (!data || data.length < 2) return null;

  const width = 300;
  const height = 150;
  const padding = 20;

  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue;

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
    return { x, y, point };
  });

  const pathData = points.map((point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    return `L ${point.x} ${point.y}`;
  }).join(' ');

  return (
    <div className="trend-chart-container">
      <svg width={width} height={height} className="trend-chart-svg">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(71, 85, 105, 0.2)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Trend line */}
        <path
          d={pathData}
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          className="trend-line"
        />
        
        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="#3b82f6"
            className="trend-point"
          />
        ))}
        
        {/* Start and end labels */}
        <text x={padding} y={height - 5} className="chart-label">
          {data[0].formattedDate}
        </text>
        <text x={width - padding} y={height - 5} className="chart-label" textAnchor="end">
          {data[data.length - 1].formattedDate}
        </text>
      </svg>
    </div>
  );
});

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ data, headers, onFilter, onSort }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedColumn, setSelectedColumn] = useState<number>(0);
  const [trendDateColumn, setTrendDateColumn] = useState<number>(0);
  const [trendValueColumn, setTrendValueColumn] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'trend'>('overview');
  const [trendDataCache, setTrendDataCache] = useState<TrendData[] | null>(null);
  const [isTrendLoading, setIsTrendLoading] = useState(false);
  const [trendCacheKey, setTrendCacheKey] = useState('');

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

  // Optimized trend data calculation with async batching
  const calculateTrendData = useCallback(async (dataRows: string[][], dateCol: number, valueCol: number): Promise<TrendData[]> => {
    const trendPoints: TrendData[] = [];
    const batchSize = 500; // Smaller batches for better responsiveness
    
    // Process data in async batches to prevent UI blocking
    for (let i = 0; i < dataRows.length; i += batchSize) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          const batch = dataRows.slice(i, i + batchSize);
          
          batch.forEach(row => {
            const dateStr = row[dateCol];
            const valueStr = row[valueCol];
            
            if (!dateStr || !valueStr) return;
            
            // Try to parse the date
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return;
            
            // Try to parse the value as number
            const value = parseFloat(valueStr);
            if (isNaN(value)) return;
            
            trendPoints.push({
              date: date.toISOString(),
              value,
              formattedDate: date.toLocaleDateString()
            });
          });
          
          resolve();
        }, 0);
      });
    }

    // Sort by date
    trendPoints.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return trendPoints;
  }, []);

  // Effect to handle trend data loading
  useEffect(() => {
    if (activeTab !== 'trend' || !data.length) {
      setTrendDataCache(null);
      return;
    }

    const cacheKey = `${data.length}-${trendDateColumn}-${trendValueColumn}`;
    
    // Return cached data if available
    if (trendCacheKey === cacheKey && trendDataCache) {
      return;
    }

    setIsTrendLoading(true);
    
    calculateTrendData(data, trendDateColumn, trendValueColumn)
      .then((result) => {
        setTrendDataCache(result);
        setTrendCacheKey(cacheKey);
        setIsTrendLoading(false);
      })
      .catch(() => {
        setIsTrendLoading(false);
      });
  }, [data, trendDateColumn, trendValueColumn, activeTab, calculateTrendData, trendCacheKey, trendDataCache]);

  const trendData = trendDataCache;

  // Calculate trend statistics
  const trendStats = useMemo(() => {
    if (!trendData || trendData.length < 2) return null;

    const values = trendData.map(point => point.value);
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const change = lastValue - firstValue;
    const changePercent = (change / firstValue) * 100;
    
    const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    // Calculate trend direction
    const trendDirection = change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable';
    
    return {
      dataPoints: trendData.length,
      firstValue: firstValue.toFixed(2),
      lastValue: lastValue.toFixed(2),
      change: change.toFixed(2),
      changePercent: changePercent.toFixed(2),
      avgValue: avgValue.toFixed(2),
      minValue: minValue.toFixed(2),
      maxValue: maxValue.toFixed(2),
      trendDirection,
      startDate: trendData[0].formattedDate,
      endDate: trendData[trendData.length - 1].formattedDate
    };
  }, [trendData]);

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
      <div className="analysis-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'trend' ? 'active' : ''}`}
          onClick={() => setActiveTab('trend')}
        >
          Trend
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
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
        )}

        {activeTab === 'trend' && (
          <div className="trend-tab">
            <div className="trend-controls">
              <div className="trend-select-group">
                <label>Date Column:</label>
                <select 
                  value={trendDateColumn}
                  onChange={(e) => setTrendDateColumn(parseInt(e.target.value))}
                  className="trend-select"
                  disabled={isTrendLoading}
                >
                  {headers.map((header, index) => (
                    <option key={index} value={index}>{header}</option>
                  ))}
                </select>
              </div>
              
              <div className="trend-select-group">
                <label>Value Column:</label>
                <select 
                  value={trendValueColumn}
                  onChange={(e) => setTrendValueColumn(parseInt(e.target.value))}
                  className="trend-select"
                  disabled={isTrendLoading}
                >
                  {headers.map((header, index) => (
                    <option key={index} value={index}>{header}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {isTrendLoading && (
              <div className="trend-loading">
                <div className="trend-spinner"></div>
                <p>Analyzing trend data...</p>
              </div>
            )}
            
            {!isTrendLoading && trendStats && trendData && (
              <div className="trend-stats">
                <div className="trend-summary">
                  <div className={`trend-direction ${trendStats.trendDirection}`}>
                    <span className="trend-icon">
                      {trendStats.trendDirection === 'increasing' ? '↗' : 
                       trendStats.trendDirection === 'decreasing' ? '↘' : '→'}
                    </span>
                    <span className="trend-text">
                      {trendStats.trendDirection.charAt(0).toUpperCase() + trendStats.trendDirection.slice(1)}
                    </span>
                  </div>
                  <div className="trend-change">
                    <span className="change-value">
                      {parseFloat(trendStats.changePercent) > 0 ? '+' : ''}{trendStats.changePercent}%
                    </span>
                    <span className="change-period">
                      ({trendStats.startDate} → {trendStats.endDate})
                    </span>
                  </div>
                </div>
                
                <div className="trend-chart">
                  <TrendChart data={trendData} />
                </div>
                
                <div className="trend-details">
                  <div className="trend-stat-item">
                    <span className="trend-stat-label">Data Points:</span>
                    <span className="trend-stat-value">{trendStats.dataPoints}</span>
                  </div>
                  <div className="trend-stat-item">
                    <span className="trend-stat-label">First Value:</span>
                    <span className="trend-stat-value">{trendStats.firstValue}</span>
                  </div>
                  <div className="trend-stat-item">
                    <span className="trend-stat-label">Last Value:</span>
                    <span className="trend-stat-value">{trendStats.lastValue}</span>
                  </div>
                  <div className="trend-stat-item">
                    <span className="trend-stat-label">Change:</span>
                    <span className="trend-stat-value">
                      {parseFloat(trendStats.change) > 0 ? '+' : ''}{trendStats.change}
                    </span>
                  </div>
                  <div className="trend-stat-item">
                    <span className="trend-stat-label">Average:</span>
                    <span className="trend-stat-value">{trendStats.avgValue}</span>
                  </div>
                  <div className="trend-stat-item">
                    <span className="trend-stat-label">Range:</span>
                    <span className="trend-stat-value">{trendStats.minValue} - {trendStats.maxValue}</span>
                  </div>
                </div>
              </div>
            )}
            
            {!isTrendLoading && !trendStats && activeTab === 'trend' && trendData !== null && (
              <div className="trend-error">
                <p>Unable to generate trend. Please ensure:</p>
                <ul>
                  <li>Date column contains valid dates</li>
                  <li>Value column contains numeric data</li>
                  <li>At least 2 data points are available</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;