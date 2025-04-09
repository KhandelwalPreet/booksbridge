
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
    <div className="my-8">
      <h2 className="text-xl font-semibold text-book-maroon mb-4">{title}</h2>
      
      {books && books.length > 0 ? (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {books.map((book) => (
              <CarouselItem key={book.id} className="basis-auto pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <BookCard 
                  book={book}
                  onClick={() => onBookClick(book.id)}
                  showDistance={title.toLowerCase().includes('near you')}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      ) : (
        <div className="flex items-center justify-center w-full py-10 text-gray-500">
          No books available in this category
        </div>
      )}
    </div>
  );
};

export default BookCarousel;
