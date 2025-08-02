import React, { useState } from 'react';

interface RowDetailsPanelProps {
  headers: string[];
  row: string[] | null;
  onClose: () => void;
}

const RowDetailsPanel: React.FC<RowDetailsPanelProps> = ({ headers, row, onClose }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'success' | 'error'>('idle');

  if (!row) return null;

  const copyAsJson = async () => {
    try {
      setCopyStatus('copying');
      
      // Create JSON object from headers and row data
      const jsonObject: Record<string, string> = {};
      headers.forEach((header, index) => {
        jsonObject[header] = row[index] || '';
      });

      // Format JSON with proper indentation
      const jsonString = JSON.stringify(jsonObject, null, 2);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(jsonString);
      
      setCopyStatus('success');
      
      // Reset status after 500ms for brief green flash
      setTimeout(() => {
        setCopyStatus('idle');
      }, 500);
      
    } catch (error) {
      console.error('Failed to copy JSON:', error);
      setCopyStatus('error');
      
      // Reset status after 1 second for error
      setTimeout(() => {
        setCopyStatus('idle');
      }, 1000);
    }
  };

  const getCopyButtonText = () => {
    switch (copyStatus) {
      case 'copying':
        return 'Copying...';
      case 'success':
        return '';
      case 'error':
        return 'Error!';
      default:
        return '';
    }
  };

  const getCopyButtonClass = () => {
    switch (copyStatus) {
      case 'copying':
        return 'copy-button copying';
      case 'success':
        return 'copy-button success';
      case 'error':
        return 'copy-button error';
      default:
        return 'copy-button';
    }
  };

  return (
    <div className="row-details-panel">
      <div className="row-details-header">
        <h3>Row Details</h3>
        <div className="header-actions">
          <button 
            onClick={copyAsJson}
            className={getCopyButtonClass()}
            disabled={copyStatus === 'copying'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 4v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {getCopyButtonText()}
          </button>
          <button onClick={onClose} className="close-button">×</button>
        </div>
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