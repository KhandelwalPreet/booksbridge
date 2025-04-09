
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard from './BookCard';
import { Button } from '@/components/ui/button';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

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
  return (
    <div className="my-6">
      <h2 className="text-xl font-semibold text-book-maroon mb-3">{title}</h2>
      
      {books && books.length > 0 ? (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {books.map((book) => (
              <CarouselItem key={book.id} className="basis-auto pl-2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                <BookCard 
                  book={book}
                  onClick={() => onBookClick(book.id)}
                  showDistance={title.toLowerCase().includes('near you')}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 h-8 w-8 rounded-full opacity-70 hover:opacity-100" />
          <CarouselNext className="-right-4 h-8 w-8 rounded-full opacity-70 hover:opacity-100" />
        </Carousel>
      ) : (
        <div className="flex items-center justify-center w-full py-8 text-gray-500">
          No books available in this category
        </div>
      )}
    </div>
  );
};

export default BookCarousel;
