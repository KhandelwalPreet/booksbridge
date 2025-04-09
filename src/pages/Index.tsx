
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import BookCarousel from '@/components/BookCarousel';
import BookDetailModal from '@/components/BookDetailModal';
import { useInventoryBooks } from '@/hooks/useInventoryBooks';
import { BookListing } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';

const GENRES = [
  "Fiction",
  "Romance", 
  "Comedy", 
  "Thriller", 
  "Sci-Fi", 
  "Biography", 
  "Children", 
  "History", 
  "Mystery", 
  "Non-fiction"
];

const Index = () => {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookDetails, setBookDetails] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allBooks, setAllBooks] = useState<BookListing[]>([]);
  const [nearbyBooks, setNearbyBooks] = useState<BookListing[]>([]);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);

  // Fetch books from inventory table
  const { books: recentBooksData, loading: loadingRecent, refetch } = useInventoryBooks(undefined, 12);
  
  // Fetch all books for search
  useEffect(() => {
    const fetchAllBooks = async () => {
      const { data, error } = await supabase
        .from('inventory_new')
        .select(`
          *,
          book:book_id(*)
        `)
        .eq('available', true);
      
      if (data && !error) {
        const processedBooks: BookListing[] = data.map((item: any) => ({
          ...item,
          title: item.book?.title,
          author: item.book?.author,
          cover_image_url: item.book?.cover_image_url,
          thumbnail_url: item.book?.cover_image_url,
          isbn: item.book?.isbn_13 || item.book?.isbn_10,
          isbn_13: item.book?.isbn_13,
          isbn_10: item.book?.isbn_10
        }));
        setAllBooks(processedBooks);
      }
    };

    fetchAllBooks();
  }, []);

  // Get current user's location
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('latitude, longitude')
            .eq('id', session.user.id)
            .single();
          
          if (data && !error) {
            setUserLocation({
              latitude: data.latitude,
              longitude: data.longitude
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user location:', error);
      }
    };
    
    fetchUserLocation();
  }, []);

  // Calculate nearby books when user location is available
  useEffect(() => {
    if (userLocation && allBooks.length > 0) {
      // We'll implement the full Haversine calculation in the modal component
      // For now, just set all books as nearby for the carousel
      setNearbyBooks(allBooks.slice(0, 12));
    }
  }, [userLocation, allBooks]);

  // Filter books by search query
  const filteredBooks = searchQuery 
    ? allBooks.filter(book => 
        book.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allBooks;

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

  // Fetch book details when a book is selected
  const fetchBookDetails = async (bookId: string) => {
    try {
      const { data, error } = await supabase
        .from('inventory_new')
        .select(`
          *,
          book:book_id(*)
        `)
        .eq('id', bookId)
        .single();
      
      if (data && !error) {
        // Get lender profile info
        const { data: lenderData } = await supabase
          .from('profiles')
          .select('name, gender, latitude, longitude')
          .eq('id', data.lender_id)
          .single();
        
        // Calculate distance if we have both user and lender coordinates
        let distance = null;
        if (userLocation && lenderData && lenderData.latitude && lenderData.longitude) {
          // Haversine formula for distance calculation
          const R = 6371; // Radius of the Earth in km
          const dLat = (lenderData.latitude - userLocation.latitude) * Math.PI / 180;
          const dLon = (lenderData.longitude - userLocation.longitude) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(lenderData.latitude * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          distance = R * c;
        }

        setBookDetails({
          id: data.id,
          title: data.book?.title || 'Unknown Title',
          author: data.book?.author || 'Unknown Author',
          coverImage: data.book?.cover_image_url || '/placeholder.svg',
          pageCount: data.book?.page_count || 0,
          genre: data.book?.categories || 'Uncategorized',
          language: data.book?.language || 'Unknown',
          description: data.book?.description || 'No description available',
          listings: [{
            id: data.id,
            lenderId: data.lender_id, // Added lenderId for supplier details
            lenderName: lenderData?.name || 'Unknown',
            distance: distance ? `${distance.toFixed(1)} km away` : 'Distance unknown',
            distanceValue: distance || 9999
          }]
        });
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
    }
  };

  const handleBookClick = async (bookId: string) => {
    setSelectedBook(bookId);
    await fetchBookDetails(bookId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8]">
      <Navbar onSearch={handleSearch} />
      
      <main className="flex-grow pt-16">
        <HeroSection />
        
        <div className="container mx-auto px-4 py-8">
          {/* Show search results if search is active */}
          {searchQuery && (
            <BookCarousel 
              title={`Search results for: ${searchQuery}`}
              books={adaptBookListingsForCarousel(filteredBooks)}
              onBookClick={handleBookClick}
            />
          )}

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
          {GENRES.map(genre => {
            const { books: genreBooks } = useInventoryBooks(genre, 12);
            return (
              <BookCarousel
                key={genre}
                title={genre}
                books={adaptBookListingsForCarousel(genreBooks)}
                onBookClick={handleBookClick}
              />
            );
          })}
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
