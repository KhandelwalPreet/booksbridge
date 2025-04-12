
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EnhancedBookDetails } from '@/utils/googleBooksApi';

interface BookDetailsDisplayProps {
  bookDetails: EnhancedBookDetails;
}

const BookDetailsDisplay = ({ bookDetails }: BookDetailsDisplayProps) => {
  return (
    <Card className="mb-6 shadow-md border border-[#E5E7EB] rounded-2xl">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Book Cover */}
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="w-32 h-44 bg-gray-100 rounded-md overflow-hidden">
              {bookDetails.imageLinks?.thumbnail ? (
                <img 
                  src={bookDetails.imageLinks.thumbnail} 
                  alt={bookDetails.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Cover
                </div>
              )}
            </div>
          </div>
          
          {/* Book Info */}
          <div className="w-full md:w-2/3">
            <h3 className="text-xl font-semibold text-[#1C1C1C]">{bookDetails.title}</h3>
            <p className="text-[#6B7280]">by {bookDetails.authors ? bookDetails.authors.join(', ') : 'Unknown Author'}</p>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div>
                <p className="text-sm text-[#6B7280]">Publisher</p>
                <p className="text-sm">{bookDetails.publisher || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Published Date</p>
                <p className="text-sm">{bookDetails.publishedDate || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Pages</p>
                <p className="text-sm">{bookDetails.pageCount || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Categories</p>
                <p className="text-sm">{bookDetails.categories ? bookDetails.categories.join(', ') : 'N/A'}</p>
              </div>
              {bookDetails.language && (
                <div>
                  <p className="text-sm text-[#6B7280]">Language</p>
                  <p className="text-sm">{bookDetails.language.toUpperCase()}</p>
                </div>
              )}
              {bookDetails.isbn13 && (
                <div>
                  <p className="text-sm text-[#6B7280]">ISBN-13</p>
                  <p className="text-sm">{bookDetails.isbn13}</p>
                </div>
              )}
            </div>

            <p className="text-sm text-[#6B7280] mt-4">Description</p>
            <p className="text-sm line-clamp-3">{bookDetails.description || 'No description available'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookDetailsDisplay;
