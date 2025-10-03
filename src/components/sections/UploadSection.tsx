import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../Button';
import Card from '../Card';
import { LightCurveData } from '../../lib/supabase';

interface UploadSectionProps {
  onDataUploaded: (data: LightCurveData, name: string) => void;
}

export default function UploadSection({ onDataUploaded }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    setUploadStatus('processing');
    setErrorMessage('');

    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus('error');
      setErrorMessage('File size exceeds 10MB limit');
      return;
    }

    const validTypes = ['text/csv', 'application/json', 'text/plain'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
      setUploadStatus('error');
      setErrorMessage('Please upload a CSV or JSON file');
      return;
    }

    try {
      const text = await file.text();
      let data: LightCurveData;

      if (file.name.endsWith('.json')) {
        const json = JSON.parse(text);
        data = json;
      } else {
        const lines = text.trim().split('\n');
        const headers = lines[0].toLowerCase().split(',').map(h => h.trim());

        const timeIndex = headers.findIndex(h => h.includes('time') || h === 't');
        const fluxIndex = headers.findIndex(h => h.includes('flux') || h === 'f' || h.includes('brightness'));

        if (timeIndex === -1 || fluxIndex === -1) {
          throw new Error('CSV must contain "time" and "flux" columns');
        }

        const time: number[] = [];
        const flux: number[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length > Math.max(timeIndex, fluxIndex)) {
            const t = parseFloat(values[timeIndex].trim());
            const f = parseFloat(values[fluxIndex].trim());
            if (!isNaN(t) && !isNaN(f)) {
              time.push(t);
              flux.push(f);
            }
          }
        }

        data = { time, flux };
      }

      if (!data.time || !data.flux || data.time.length === 0) {
        throw new Error('Invalid data format: missing time or flux arrays');
      }

      if (data.time.length !== data.flux.length) {
        throw new Error('Time and flux arrays must have the same length');
      }

      setUploadStatus('success');
      onDataUploaded(data, file.name);

      setTimeout(() => setUploadStatus('idle'), 3000);
    } catch (err) {
      setUploadStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to process file');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <section id="upload" className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold glow-text">Upload Light Curve Data</h2>
          <p className="text-gray-400 text-lg">
            Upload your CSV or JSON file containing time-series light curve data
          </p>
        </div>

        <Card>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10'
                : uploadStatus === 'success'
                ? 'border-green-500 bg-green-500/10'
                : uploadStatus === 'error'
                ? 'border-red-500 bg-red-500/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            {uploadStatus === 'processing' && (
              <div className="space-y-4">
                <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
                <p className="text-gray-300">Processing your file...</p>
              </div>
            )}

            {uploadStatus === 'success' && (
              <div className="space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <p className="text-green-400 text-lg font-semibold">File uploaded successfully!</p>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="space-y-4">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                <p className="text-red-400 text-lg font-semibold">Upload failed</p>
                <p className="text-gray-400">{errorMessage}</p>
              </div>
            )}

            {uploadStatus === 'idle' && (
              <>
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-300 mb-2">
                  Drag and drop your file here
                </p>
                <p className="text-gray-500 mb-6">or</p>
                <label>
                  <input
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button as="span" className="cursor-pointer inline-block">
                    <FileText className="w-5 h-5 mr-2 inline" />
                    Browse Files
                  </Button>
                </label>
                <p className="text-sm text-gray-500 mt-4">
                  Supported formats: CSV, JSON (max 10MB)
                </p>
              </>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold mb-4">File Format Requirements</h3>
          <div className="space-y-4 text-gray-300">
            <div>
              <h4 className="font-medium text-white mb-2">CSV Format:</h4>
              <pre className="bg-gray-900 rounded p-4 text-sm overflow-x-auto">
{`time,flux
0.0,1.0000
0.5,0.9998
1.0,0.9850
1.5,0.9852
2.0,1.0001`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">JSON Format:</h4>
              <pre className="bg-gray-900 rounded p-4 text-sm overflow-x-auto">
{`{
  "time": [0.0, 0.5, 1.0, 1.5, 2.0],
  "flux": [1.0000, 0.9998, 0.9850, 0.9852, 1.0001]
}`}
              </pre>
            </div>
            <p className="text-sm text-gray-400">
              Your file must contain time and flux data. Column names are flexible but should
              include "time" or "t" and "flux" or "f".
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
