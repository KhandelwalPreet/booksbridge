
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { EnhancedBookDetails } from '@/utils/googleBooksApi';
import BookItem from './BookItem';

interface BookData {
  title?: string;
  isbn?: string;
  found: boolean;
  details?: EnhancedBookDetails;
  condition: string;
  selected: boolean;
}

interface BooksListProps {
  books: BookData[];
  handleSelectAll: (selected: boolean) => void;
  updateBookCondition: (index: number, condition: string) => void;
  toggleBookSelection: (index: number, selected: boolean) => void;
}

const BooksList = ({ 
  books, 
  handleSelectAll, 
  updateBookCondition, 
  toggleBookSelection 
}: BooksListProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Found {books.length} books</h3>
        <div className="flex items-center space-x-2">
          <Label htmlFor="select-all" className="text-sm">Select all found</Label>
          <Checkbox 
            id="select-all" 
            checked={books.filter(b => b.found).every(b => b.selected)}
            onCheckedChange={handleSelectAll}
          />
        </div>
      </div>

      <div className="mb-6">
        <ScrollArea className="h-[350px] rounded-md border">
          <div className="p-4 grid gap-4">
            {books.map((book, index) => (
              <BookItem 
                key={index}
                book={book}
                index={index}
                updateCondition={updateBookCondition}
                toggleSelection={toggleBookSelection}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default BooksList;
