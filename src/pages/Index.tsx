
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, MapPin, TrendingUp } from 'lucide-react';

// List of genres for categorization
const GENRES = [
  "Fiction", "Romance", "Mystery", "Sci-Fi", 
  "Biography", "History", "Fantasy", "Non-fiction"
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
      
      <main className="flex-grow">
        <HeroSection />
        
        <div className="container mx-auto px-4 py-12">
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-card to-secondary/80 border-secondary backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col items-center">
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold">5,000+</p>
                <p className="text-sm text-muted-foreground text-center">Books Shared</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-card to-secondary/80 border-secondary backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col items-center">
                <Users className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold">2,000+</p>
                <p className="text-sm text-muted-foreground text-center">Active Readers</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-card to-secondary/80 border-secondary backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col items-center">
                <MapPin className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold">150+</p>
                <p className="text-sm text-muted-foreground text-center">Communities</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-card to-secondary/80 border-secondary backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col items-center">
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold">10K+</p>
                <p className="text-sm text-muted-foreground text-center">Monthly Exchanges</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Search Results */}
          <SearchResults 
            searchQuery={searchQuery}
            filteredBooks={filteredBooks}
            visibleSearchResults={visibleSearchResults}
            onBookClick={handleBookClick}
          />

          {/* Recently Added Books */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-gradient">Recently Added Books</h2>
            <BookCarousel 
              title=""
              books={adaptBookListingsForCarousel(recentBooksData)}
              onBookClick={handleBookClick}
            />
          </div>
          
          {/* Popular Near You */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-gradient">Popular Near You</h2>
            <BookCarousel 
              title=""
              books={adaptBookListingsForCarousel(nearbyBooks)}
              onBookClick={handleBookClick}
            />
          </div>
          
          {/* Genre-based carousels */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-4 text-gradient">Explore by Genre</h2>
            <GenreCarousels 
              genres={GENRES} 
              allBooks={allBooks} 
              onBookClick={handleBookClick} 
            />
          </div>
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
