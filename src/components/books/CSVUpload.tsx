
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useCSVUpload } from '@/hooks/useCSVUpload';
import CSVUploadInstructions from './csv/CSVUploadInstructions';
import FileUploader from './csv/FileUploader';
import BooksList from './csv/BooksList';
import SubmissionSummary from './csv/SubmissionSummary';

interface CSVUploadProps {
  onBooksAdded: () => void;
}

const CSVUpload = ({ onBooksAdded }: CSVUploadProps) => {
  const {
    books,
    uploading,
    processing,
    submitting,
    handleFileUpload,
    handleSelectAll,
    toggleBookSelection,
    updateBookCondition,
    handleListBooks
  } = useCSVUpload(onBooksAdded);

  return (
    <div>
      <div className="space-y-4 mb-6">
        <CSVUploadInstructions />
        <FileUploader 
          uploading={uploading} 
          processing={processing}
          onFileUpload={handleFileUpload}
        />
      </div>

      {processing && (
        <div className="text-center py-4 mb-6">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-book-warm" />
          <p className="text-sm text-gray-600">Looking up book details...</p>
        </div>
      )}

      {books.length > 0 && !processing && (
        <>
          <BooksList 
            books={books}
            handleSelectAll={handleSelectAll}
            updateBookCondition={updateBookCondition}
            toggleBookSelection={toggleBookSelection}
          />

          <SubmissionSummary 
            selectedCount={books.filter(b => b.selected && b.found).length}
            notFoundCount={books.filter(b => !b.found).length}
            submitting={submitting}
            onSubmit={handleListBooks}
          />
        </>
      )}

      {books.length === 0 && !uploading && !processing && (
        <div className="text-center py-6 text-gray-500">
          Upload a CSV file to get started
        </div>
      )}
    </div>
  );
};

export default CSVUpload;
