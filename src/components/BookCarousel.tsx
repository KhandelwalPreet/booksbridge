
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
    categories?: string;
  }>;
  onBookClick: (bookId: string) => void;
}

const BookCarousel = ({ title, books = [], onBookClick }: BookCarouselProps) => {
  return (
    <div className="my-3"> {/* Reduced vertical spacing */}
      <h2 className="text-xl font-semibold text-book-maroon mb-2">{title}</h2>
      
      {books && books.length > 0 ? (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-1"> {/* Reduced left margin for tighter spacing */}
            {books.map((book) => (
              <CarouselItem key={book.id} className="basis-auto pl-1 md:basis-1/5 lg:basis-1/6 xl:basis-1/7">
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
        <div className="flex items-center justify-center w-full py-6 text-gray-500">
          No books available in this category
        </div>
      )}
    </div>
  );
};

export default BookCarousel;
