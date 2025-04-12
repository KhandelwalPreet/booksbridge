
import React from 'react';
import ISBNSearchInput from './isbn/ISBNSearchInput';
import BookDetailsDisplay from './shared/BookDetailsDisplay';
import BookSubmissionForm from './isbn/BookSubmissionForm';
import { useISBNSearch } from '@/hooks/useISBNSearch';

interface ISBNSearchProps {
  onBookAdded: () => void;
}

const ISBNSearch = ({ onBookAdded }: ISBNSearchProps) => {
  const { 
    isbn, 
    setIsbn, 
    loading, 
    bookDetails, 
    condition, 
    setCondition, 
    notes, 
    setNotes, 
    confirmed, 
    setConfirmed, 
    submitting, 
    handleISBNSearch, 
    addBook 
  } = useISBNSearch(onBookAdded);

  return (
    <div>
      {/* ISBN Search Input */}
      <ISBNSearchInput 
        isbn={isbn}
        setIsbn={setIsbn}
        loading={loading}
        onSearch={handleISBNSearch}
      />

      {/* Book Details Card */}
      {bookDetails && (
        <BookDetailsDisplay bookDetails={bookDetails} />
      )}

      {/* Book Condition and Notes */}
      {bookDetails && (
        <BookSubmissionForm
          bookDetails={bookDetails}
          condition={condition}
          setCondition={setCondition}
          notes={notes}
          setNotes={setNotes}
          confirmed={confirmed}
          setConfirmed={setConfirmed}
          submitting={submitting}
          onSubmit={addBook}
        />
      )}
    </div>
  );
};

export default ISBNSearch;
