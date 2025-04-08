
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard from './BookCard';
import { Button } from '@/components/ui/button';

interface BookCarouselProps {
  title: string;
  books: Array<{
    id: string;
    title: string;
    author: string;
    coverImage: string;
    distance?: string;
    lender?: string;
  }>;
  onBookClick: (bookId: string) => void;
}

const BookCarousel = ({ title, books = [], onBookClick }: BookCarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ 
        left: -300, 
        behavior: 'smooth' 
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ 
        left: 300, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-book-maroon">{title}</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full border-book-warm text-book-warm hover:bg-book-warm/10"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full border-book-warm text-book-warm hover:bg-book-warm/10" 
            onClick={scrollRight}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Scrollable container */}
      <div 
        ref={scrollContainerRef}
        className="book-carousel flex gap-4 overflow-x-auto pb-4"
      >
        {books && books.length > 0 ? (
          books.map(book => (
            <BookCard 
              key={book.id}
              book={book}
              onClick={() => onBookClick(book.id)}
              showDistance={title.toLowerCase().includes('near you')}
            />
          ))
        ) : (
          <div className="flex items-center justify-center w-full py-10 text-gray-500">
            No books available in this category
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCarousel;
