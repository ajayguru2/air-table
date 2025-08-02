import React, { useRef, useCallback, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { optimizeVirtualScrolling } from './utils/performance';

interface VirtualizedTableProps {
  headers: string[];
  rows: string[][];
  height: number;
  onSort?: (columnIndex: number) => void;
  sortColumn?: number | null;
  sortDirection?: 'asc' | 'desc';
  selectedRow?: number | null;
  onRowSelect?: (rowIndex: number | null) => void;
}

const VirtualizedTable: React.FC<VirtualizedTableProps> = React.memo(({ 
  headers, 
  rows, 
  height, 
  onSort, 
  sortColumn, 
  sortDirection, 
  selectedRow, 
  onRowSelect 
}) => {
  const ROW_HEIGHT = 35;
  const HEADER_HEIGHT = 40;
  const listRef = useRef<List>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyContainerRef = useRef<HTMLElement | null>(null);

  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const row = rows[index];
    const isSelected = selectedRow === index;
    
    return (
      <div 
        style={{
          ...style,
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          willChange: 'transform, background-color'
        }} 
        className={`virtual-row ${isSelected ? 'selected' : ''}`}
        onClick={() => onRowSelect?.(isSelected ? null : index)}
      >
        {row.map((cell, cellIndex) => (
          <div 
            key={cellIndex} 
            className="virtual-cell"
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
          >
            {cell}
          </div>
        ))}
      </div>
    );
  }, [rows, selectedRow, onRowSelect]);

  useEffect(() => {
    const handleBodyScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      if (headerRef.current && target) {
        headerRef.current.scrollLeft = target.scrollLeft;
      }
    };

    // Find the scrollable container inside the List component
    const findScrollableContainer = () => {
      if (listRef.current) {
        // Access the internal DOM element of react-window
        const listElement = (listRef.current as any)._outerRef;
        if (listElement) {
          listElement.addEventListener('scroll', handleBodyScroll);
          bodyContainerRef.current = listElement;
          return listElement;
        }
      }
      return null;
    };

    // Set up the scroll listener with a small delay to ensure the component is rendered
    const timeoutId = setTimeout(() => {
      const container = findScrollableContainer();
      if (container) {
        optimizeVirtualScrolling(container);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (bodyContainerRef.current) {
        bodyContainerRef.current.removeEventListener('scroll', handleBodyScroll);
      }
    };
  }, []);

  return (
    <div className="virtualized-table">
      <div 
        ref={headerRef}
        className="virtual-header" 
        style={{ height: HEADER_HEIGHT, overflowX: 'hidden' }}
      >
        <div className="virtual-header-content">
          {headers.map((header, index) => (
            <div 
              key={index} 
              className={`virtual-header-cell ${onSort ? 'sortable' : ''}`}
              onClick={() => onSort?.(index)}
            >
              <span className="header-text">{header}</span>
              {onSort && (
                <span className="sort-indicator">
                  {sortColumn === index ? (
                    sortDirection === 'asc' ? '▲' : '▼'
                  ) : (
                    '⇅'
                  )}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <List
        ref={listRef}
        height={height - HEADER_HEIGHT}
        itemCount={rows.length}
        itemSize={ROW_HEIGHT}
        width="100%"
        overscanCount={10}
        useIsScrolling={false}
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          willChange: 'scroll-position'
        }}
      >
        {Row}
      </List>
    </div>
  );
});

VirtualizedTable.displayName = 'VirtualizedTable';

export default VirtualizedTable;