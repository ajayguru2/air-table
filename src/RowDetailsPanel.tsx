import React from 'react';

interface RowDetailsPanelProps {
  headers: string[];
  row: string[] | null;
  onClose: () => void;
}

const RowDetailsPanel: React.FC<RowDetailsPanelProps> = ({ headers, row, onClose }) => {
  if (!row) return null;

  return (
    <div className="row-details-panel">
      <div className="row-details-header">
        <h3>Row Details</h3>
        <button onClick={onClose} className="close-button">×</button>
      </div>
      <div className="row-details-content">
        {headers.map((header, index) => (
          <div key={index} className="detail-item">
            <div className="detail-label">{header}</div>
            <div className="detail-value">
              {row[index] || <span className="empty-value">(empty)</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RowDetailsPanel; 