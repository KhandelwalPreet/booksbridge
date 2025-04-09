
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import BookCarousel from '@/components/BookCarousel';
import BookDetailModal from '@/components/BookDetailModal';
import { useInventoryBooks } from '@/hooks/useInventoryBooks';
import { 
  mockBooks, 
  getMostRequestedBooks, 
  getNearbyBooks,
  getPopularAuthorsBooks
} from '@/data/mockBooks';
import { BookListing } from '@/types/database';

const Index = () => {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch books from inventory table
  const { books: recentBooksData, loading: loadingRecent } = useInventoryBooks(undefined, 12);
  const { books: fictionBooksData } = useInventoryBooks('Fiction', 12);

  // Transform BookListing data to match BookCard expected format
  const adaptBookListingsForCarousel = (books: BookListing[]) => {
    return books.map(book => ({
      id: book.id,
      title: book.title || 'Untitled',
      author: book.author || 'Unknown Author',
      coverImage: book.cover_image_url || book.thumbnail_url || '/placeholder.svg',
      distance: book.location || '',
      lender: book.lender_id || '',
    }));
  };

  // Adapted books for carousel
  const recentBooks = adaptBookListingsForCarousel(recentBooksData);
  const fictionBooks = adaptBookListingsForCarousel(fictionBooksData);

  const handleBookClick = (bookId: string) => {
    setSelectedBook(bookId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const bookDetails = selectedBook ? mockBooks.find(book => book.id === selectedBook) : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8]">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <HeroSection />
        
        <div className="container mx-auto px-4 py-8">
          {/* Recently Added Books - now from database! */}
          <BookCarousel 
            title="Recently Added Books" 
            books={recentBooks}
            onBookClick={handleBookClick}
          />
          
          {/* Most Requested Titles - still using mock data */}
          <BookCarousel 
            title="Most Requested Titles" 
            books={getMostRequestedBooks()}
            onBookClick={handleBookClick}
          />
          
          {/* Available Near You - still using mock data */}
          <BookCarousel 
            title="Available Near You" 
            books={getNearbyBooks()}
            onBookClick={handleBookClick}
          />
          
          {/* Popular Authors - still using mock data */}
          <BookCarousel 
            title="Popular Authors" 
            books={getPopularAuthorsBooks()}
            onBookClick={handleBookClick}
          />
          
          {/* Fiction You May Like - now from database with 'Fiction' category filter! */}
          <BookCarousel 
            title="Fiction You May Like" 
            books={fictionBooks}
            onBookClick={handleBookClick}
          />
        </div>
        
        {/* Book Detail Modal */}
        <BookDetailModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          book={bookDetails}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
