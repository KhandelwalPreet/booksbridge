
import React from 'react';
import BookCarousel from '../BookCarousel';
import { BookListing } from '@/types/database';

interface GenreCarouselsProps {
  genres: string[];
  allBooks: BookListing[];
  onBookClick: (bookId: string) => void;
}

const GenreCarousels: React.FC<GenreCarouselsProps> = ({ genres, allBooks, onBookClick }) => {
  // Group books by genre for the genre carousels
  const booksByGenre = genres.reduce((acc: Record<string, BookListing[]>, genre) => {
    acc[genre] = allBooks.filter((book) => 
      book.book?.categories?.toLowerCase().includes(genre.toLowerCase())
    ).slice(0, 12);
    return acc;
  }, {});

  // Transform BookListing data to match BookCard expected format
  const adaptBookListingsForCarousel = (books: BookListing[]) => {
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

  return (
    <>
      {genres.map(genre => (
        <BookCarousel
          key={genre}
          title={genre}
          books={adaptBookListingsForCarousel(booksByGenre[genre] || [])}
          onBookClick={onBookClick}
        />
      ))}
    </>
  );
};

export default GenreCarousels;
