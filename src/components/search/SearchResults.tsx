
import React from 'react';
import BookCarousel from '../BookCarousel';
import { BookListing } from '@/types/database';

interface SearchResultsProps {
  searchQuery: string;
  filteredBooks: any[];
  visibleSearchResults: boolean;
  onBookClick: (bookId: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  searchQuery, 
  filteredBooks, 
  visibleSearchResults, 
  onBookClick 
}) => {
  if (!searchQuery || !visibleSearchResults) return null;

  // Transform BookListing data to match BookCard expected format
  const adaptedBooks = filteredBooks.map(book => ({
    id: book.id,
    title: book.title || 'Untitled',
    author: book.author || 'Unknown Author',
    coverImage: book.cover_image_url || book.thumbnail_url || '/placeholder.svg',
    distance: book.location || '',
    lender: book.lender_id || '',
    categories: book.book?.categories || ''
  }));

  return (
    <BookCarousel 
      title={`Search results for: ${searchQuery}`}
      books={adaptedBooks}
      onBookClick={onBookClick}
    />
  );
};

export default SearchResults;
