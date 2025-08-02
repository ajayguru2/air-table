import { useState } from "react";
import Papa from "papaparse";
import FilePickerScreen from "./FilePickerScreen";
import CsvViewerScreen from "./CsvViewerScreen";
import "./App.css";

interface CsvData {
  headers: string[];
  rows: string[][];
}

function App() {
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleBackToFileSelect = () => {
    setCsvData(null);
    setError(null);
    setLoading(false);
    setLoadingProgress(0);
    setLoadingMessage('');
  };

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Check file size (32MB limit warning)
    const fileSizeMB = file.size / (1024 * 1024);
    console.log('File size calculated:', fileSizeMB.toFixed(2), 'MB');
    
    if (fileSizeMB > 100) {
      console.log('File too large, showing error');
      setError(`File size (${fileSizeMB.toFixed(1)}MB) is too large. Please use a file smaller than 100MB.`);
      return;
    }

    if (fileSizeMB > 50) {
      console.log('Large file detected, showing confirmation dialog');
      const proceed = window.confirm(
        `This file is ${fileSizeMB.toFixed(1)}MB and may take a while to load. Continue?`
      );
      console.log('User confirmation result:', proceed);
      if (!proceed) {
        console.log('User cancelled large file loading');
        return;
      }
    }

    console.log('File checks passed, starting loading process');

    setLoading(true);
    setLoadingProgress(0);
    setLoadingMessage('Preparing to load file...');
    setError(null);

    console.log('Starting file processing. Size:', fileSizeMB.toFixed(2), 'MB');

    // Use streaming for large files
    if (fileSizeMB > 5) {
      console.log('Using streaming parser for large file, size:', fileSizeMB.toFixed(2), 'MB');
      let processedRows = 0;
      let allData: string[][] = [];
      let startTime = Date.now();
      let headers: string[] = [];
      
      setLoadingMessage('Reading file in chunks...');
      console.log('Starting chunked parsing...');

      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        chunkSize: 1024 * 50, // Smaller chunks for better responsiveness
        chunk: (results, parser) => {
          try {
            console.log('Chunk received, data length:', results.data.length);
            const chunkData = results.data as string[][];
            
            // Set headers from first chunk
            if (processedRows === 0 && chunkData.length > 0) {
              console.log('Setting headers from first chunk:', chunkData[0]);
              headers = chunkData[0];
              allData = chunkData.slice(1); // Skip header row
              processedRows = chunkData.length - 1;
              console.log('First chunk processed, rows:', processedRows);
            } else {
              allData = allData.concat(chunkData);
              processedRows += chunkData.length;
              console.log('Chunk added, total rows:', processedRows);
            }
            
            // Memory management: limit to 50,000 rows for very large files
            if (processedRows > 50000) {
              console.log('Large file detected, limiting to first 50,000 rows');
              allData = allData.slice(0, 50000);
              processedRows = 50000;
              parser.abort();
            }
            
            const elapsed = Date.now() - startTime;
            const progress = Math.min((processedRows / 50000) * 90, 90);
            
            setLoadingProgress(progress);
            setLoadingMessage(`Processing... ${processedRows.toLocaleString()} rows loaded`);
            
            console.log(`Progress: ${progress.toFixed(1)}%, Rows: ${processedRows}`);
          } catch (error) {
            console.error('Chunk processing error:', error);
            parser.abort();
            setError('Error processing file chunk');
            setLoading(false);
            setLoadingProgress(0);
          }
        },
                complete: (results) => {
          try {
            console.log('Parsing complete, total processed rows:', processedRows);
            console.log('Headers:', headers);
            console.log('Data length:', allData.length);
            
            setLoadingProgress(95);
            setLoadingMessage('Finalizing data...');
            
            if (results.errors.length > 0) {
              console.error('CSV parsing errors:', results.errors);
              setError(`Error parsing CSV: ${results.errors[0].message}`);
              setLoading(false);
              setLoadingProgress(0);
              return;
            }

            if (allData.length === 0) {
              setError("CSV file is empty");
              setLoading(false);
              setLoadingProgress(0);
              return;
            }

            setLoadingMessage('Preparing display...');
            
            // Use setTimeout to prevent UI blocking
            setTimeout(() => {
              console.log('Setting CSV data with', allData.length, 'rows and', headers.length, 'headers');
              setCsvData({ headers, rows: allData });
              setLoading(false);
              setLoadingProgress(0);
              setLoadingMessage('');
              console.log('CSV data set successfully');

              if (processedRows >= 50000) {
                setError(`Large file loaded: Showing first 50,000 rows. Consider using a smaller file for better performance.`);
              }
            }, 100);
          } catch (error) {
            console.error('Completion error:', error);
            setError('Error finalizing file processing');
            setLoading(false);
            setLoadingProgress(0);
          }
        },
        error: (error) => {
          console.error('Papa Parse error for large file:', error);
          setError(`Error reading file: ${error.message}`);
          setLoading(false);
          setLoadingProgress(0);
          setLoadingMessage('');
        }
      });
    } else {
      // Use regular parsing for smaller files
      console.log('Using regular parser for smaller file');
      setLoadingMessage('Processing file...');
      setLoadingProgress(50);
      
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            setLoadingProgress(90);
            setLoadingMessage('Finalizing...');
            
            if (results.errors.length > 0) {
              setError(`Error parsing CSV: ${results.errors[0].message}`);
              setLoading(false);
              setLoadingProgress(0);
              setLoadingMessage('');
              return;
            }

            const data = results.data as string[][];
            if (data.length === 0) {
              setError("CSV file is empty");
              setLoading(false);
              setLoadingProgress(0);
              setLoadingMessage('');
              return;
            }

            const headers = data[0];
            const rows = data.slice(1);

                         setTimeout(() => {
               setCsvData({ headers, rows });
               setLoading(false);
               setLoadingProgress(0);
               setLoadingMessage('');
             }, 50);
          } catch (error) {
            console.error('Processing error:', error);
            setError('Error processing file');
            setLoading(false);
            setLoadingProgress(0);
            setLoadingMessage('');
          }
        },
                 error: (error) => {
           console.error('Papa Parse error for small file:', error);
           setError(`Error reading file: ${error.message}`);
           setLoading(false);
           setLoadingProgress(0);
           setLoadingMessage('');
         }
      });
    }
  };


  return (
    <div className="app">
      {!csvData ? (
        <FilePickerScreen
          onFileSelect={handleFileChange}
          loading={loading}
          loadingProgress={loadingProgress}
          loadingMessage={loadingMessage}
          error={error}
        />
      ) : (
        <CsvViewerScreen
          csvData={csvData}
          onBackToFileSelect={handleBackToFileSelect}
        />
      )}
    </div>
  );
}

export default App;
