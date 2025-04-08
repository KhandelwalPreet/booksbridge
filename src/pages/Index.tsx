
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import BookCarousel from '@/components/BookCarousel';
import BookDetailModal from '@/components/BookDetailModal';
import { 
  mockBooks, 
  getRecentlyAddedBooks, 
  getMostRequestedBooks, 
  getNearbyBooks,
  getPopularAuthorsBooks,
  getGenreBooks
} from '@/data/mockBooks';

const Index = () => {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookClick = (bookId: string) => {
    setSelectedBook(bookId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const bookDetails = selectedBook ? mockBooks.find(book => book.id === selectedBook) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <HeroSection />
        
        <div className="container mx-auto px-4 py-8">
          {/* Recently Added Books */}
          <BookCarousel 
            title="Recently Added Books" 
            books={getRecentlyAddedBooks()}
            onBookClick={handleBookClick}
          />
          
          {/* Most Requested Titles */}
          <BookCarousel 
            title="Most Requested Titles" 
            books={getMostRequestedBooks()}
            onBookClick={handleBookClick}
          />
          
          {/* Available Near You */}
          <BookCarousel 
            title="Available Near You" 
            books={getNearbyBooks()}
            onBookClick={handleBookClick}
          />
          
          {/* Popular Authors */}
          <BookCarousel 
            title="Popular Authors" 
            books={getPopularAuthorsBooks()}
            onBookClick={handleBookClick}
          />
          
          {/* Fiction You May Like */}
          <BookCarousel 
            title="Fiction You May Like" 
            books={getGenreBooks('Fiction')}
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
