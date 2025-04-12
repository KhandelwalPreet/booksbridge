
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Check, AlertCircle } from 'lucide-react';
import BookConditionSelect from '../shared/BookConditionSelect';
import { EnhancedBookDetails } from '@/utils/googleBooksApi';

interface BookData {
  title?: string;
  isbn?: string;
  found: boolean;
  details?: EnhancedBookDetails;
  condition: string;
  selected: boolean;
}

interface BookItemProps {
  book: BookData;
  index: number;
  updateCondition: (index: number, condition: string) => void;
  toggleSelection: (index: number, selected: boolean) => void;
}

const BookItem = ({ book, index, updateCondition, toggleSelection }: BookItemProps) => {
  return (
    <Card key={index} className={book.found ? "" : "opacity-60"}>
      <CardContent className="p-4">
        <div className="flex">
          <div className="mr-3 flex-shrink-0">
            {book.found ? (
              <Check className="h-6 w-6 text-green-500" />
            ) : (
              <AlertCircle className="h-6 w-6 text-amber-500" />
            )}
          </div>

          {book.found && book.details?.imageLinks?.thumbnail && (
            <div className="flex-shrink-0 w-16 h-24 bg-gray-100 rounded overflow-hidden mr-4">
              <img
                src={book.details.imageLinks.thumbnail}
                alt="Book cover"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-grow">
            {book.found && book.details ? (
              <>
                <h4 className="font-medium">{book.details.title}</h4>
                <p className="text-sm text-gray-600">
                  by {book.details.authors.join(', ')}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                  <div className="text-xs">
                    {book.details.isbn13 
                      ? `ISBN-13: ${book.details.isbn13}` 
                      : book.details.isbn10 
                        ? `ISBN-10: ${book.details.isbn10}` 
                        : ''}
                  </div>
                  <div className="text-xs text-gray-500">
                    {book.details.pageCount ? `${book.details.pageCount} pages` : ''}
                    {book.details.pageCount && book.details.publishedDate ? ' • ' : ''}
                    {book.details.publishedDate || ''}
                  </div>
                </div>
                {book.details.language && (
                  <div className="text-xs text-gray-500 mt-1">
                    Language: {book.details.language.toUpperCase()}
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="font-medium">Book not found</p>
                <p className="text-sm text-gray-600">
                  {book.isbn ? `ISBN: ${book.isbn}` : ''}
                  {book.isbn && book.title ? ' • ' : ''}
                  {book.title ? `Title: ${book.title}` : ''}
                </p>
              </>
            )}

            {book.found && (
              <div className="flex items-center justify-between mt-3">
                <BookConditionSelect
                  condition={book.condition}
                  onConditionChange={(value) => updateCondition(index, value)}
                  label={false}
                  className="w-36"
                />
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`select-book-${index}`} className="text-sm">Include</Label>
                  <Checkbox
                    id={`select-book-${index}`}
                    checked={book.selected}
                    onCheckedChange={(checked) => toggleSelection(index, checked as boolean)}
                    disabled={!book.found}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookItem;
