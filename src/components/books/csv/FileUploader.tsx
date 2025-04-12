
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Loader2 } from 'lucide-react';

interface FileUploaderProps {
  uploading: boolean;
  processing: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const FileUploader = ({ uploading, processing, onFileUpload }: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
      <FileText className="h-10 w-10 text-gray-400 mb-2" />
      <p className="text-sm text-center text-gray-600 mb-4">
        Click to browse or drag and drop your CSV file
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={onFileUpload}
        className="hidden"
        id="csv-upload"
        disabled={uploading || processing}
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || processing}
      >
        {uploading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
        ) : (
          <><Upload className="mr-2 h-4 w-4" /> Upload CSV</>
        )}
      </Button>
    </div>
  );
};

export default FileUploader;
