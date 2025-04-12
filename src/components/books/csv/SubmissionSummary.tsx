
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmissionSummaryProps {
  selectedCount: number;
  notFoundCount: number;
  submitting: boolean;
  onSubmit: () => void;
}

const SubmissionSummary = ({ 
  selectedCount, 
  notFoundCount, 
  submitting, 
  onSubmit 
}: SubmissionSummaryProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Ready to list {selectedCount} books</p>
            <p className="text-sm text-gray-600">
              {notFoundCount} books couldn't be found
            </p>
          </div>
          <Button
            onClick={onSubmit}
            disabled={selectedCount === 0 || submitting}
          >
            {submitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Listing...</>
            ) : (
              <>List Selected Books</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSummary;
