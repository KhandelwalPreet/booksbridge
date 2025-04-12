
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, Loader2 } from 'lucide-react';
import BookConditionSelect from '../shared/BookConditionSelect';
import { EnhancedBookDetails } from '@/utils/googleBooksApi';

interface BookSubmissionFormProps {
  bookDetails: EnhancedBookDetails;
  condition: string;
  setCondition: (condition: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  confirmed: boolean;
  setConfirmed: (confirmed: boolean) => void;
  submitting: boolean;
  onSubmit: () => void;
}

const BookSubmissionForm = ({
  bookDetails,
  condition,
  setCondition,
  notes,
  setNotes,
  confirmed,
  setConfirmed,
  submitting,
  onSubmit
}: BookSubmissionFormProps) => {
  return (
    <div className="space-y-4">
      <BookConditionSelect 
        condition={condition}
        onConditionChange={setCondition}
      />
      
      <div className="space-y-2">
        <Label htmlFor="notes">Condition Notes (Optional)</Label>
        <Textarea 
          id="notes" 
          placeholder="Add any specific details about the condition of your book"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="resize-none"
        />
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <Checkbox 
          id="confirm" 
          checked={confirmed}
          onCheckedChange={(checked) => setConfirmed(checked as boolean)}
        />
        <label
          htmlFor="confirm"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I confirm the book details are correct
        </label>
      </div>

      <Button 
        className="w-full bg-[#F18F01] hover:bg-[#F18F01]/90 mt-4"
        onClick={onSubmit}
        disabled={submitting || !confirmed}
      >
        {submitting ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding Book...</>
        ) : (
          <><Check className="mr-2 h-4 w-4" /> List This Book</>
        )}
      </Button>
    </div>
  );
};

export default BookSubmissionForm;
