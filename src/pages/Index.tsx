
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import BookCarousel from '@/components/BookCarousel';
import BookDetailModal from '@/components/BookDetailModal';
import { useInventoryBooks } from '@/hooks/useInventoryBooks';
import { useAllBooks } from '@/hooks/useAllBooks';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useNearbyBooks } from '@/hooks/useNearbyBooks';
import { useBookDetails } from '@/hooks/useBookDetails';
import SearchResults from '@/components/search/SearchResults';
import GenreCarousels from '@/components/genres/GenreCarousels';

// List of genres for categorization
const GENRES = [
  "Fiction", "Romance", "Comedy", "Thriller", "Sci-Fi", 
  "Biography", "Children", "History", "Mystery", "Non-fiction"
];

const Index = () => {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleSearchResults, setVisibleSearchResults] = useState(false);

  // Custom hooks
  const { allBooks } = useAllBooks();
  const { userLocation } = useUserLocation();
  const { nearbyBooks } = useNearbyBooks(userLocation, allBooks);
  const { bookDetails, fetchBookDetails, setBookDetails } = useBookDetails();
  
  // Fetch books from inventory table for Recently Added section
  const { books: recentBooksData } = useInventoryBooks(undefined, 12);
  
  // Filter books by search query
  const filteredBooks = searchQuery 
    ? allBooks.filter(book => 
        book.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allBooks;

  // Transform BookListing data to match BookCard expected format
  const adaptBookListingsForCarousel = (books: any[]) => {
    return books.map(book => ({
      id: book.id,
      title: book.title || 'Untitled',
      author: book.author || 'Unknown Author',
      coverImage: book.cover_image_url || book.thumbnail_url || '/placeholder.svg',
      distance: book.location || '',
      lender: book.lender_id || '',
      categories: book.book?.categories || ''
    }));
  };

  const handleBookClick = async (bookId: string) => {
    setSelectedBook(bookId);
    await fetchBookDetails(bookId, userLocation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setVisibleSearchResults(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background">
      <Navbar onSearch={handleSearch} onBookClick={handleBookClick} />
      
      <main className="flex-grow pt-16">
        <HeroSection />
        
        <div className="container mx-auto px-4 py-8">
          {/* Search Results */}
          <SearchResults 
            searchQuery={searchQuery}
            filteredBooks={filteredBooks}
            visibleSearchResults={visibleSearchResults}
            onBookClick={handleBookClick}
          />

          {/* Recently Added Books */}
          <BookCarousel 
            title="Recently Added Books"
            books={adaptBookListingsForCarousel(recentBooksData)}
            onBookClick={handleBookClick}
          />
          
          {/* Popular Near You */}
          <BookCarousel 
            title="Popular Near You"
            books={adaptBookListingsForCarousel(nearbyBooks)}
            onBookClick={handleBookClick}
          />
          
          {/* Genre-based carousels */}
          <GenreCarousels 
            genres={GENRES} 
            allBooks={allBooks} 
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
