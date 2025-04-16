
import { useEffect } from 'react';
import { BookListing } from '@/types/database';
import { useInventoryCore } from './useInventoryCore';
import { useBookListing } from './useBookListing';

interface UseInventoryBooksResult {
  books: BookListing[];
  loading: boolean;
  error: any;
  refetch: () => Promise<void>;
  listBook: (bookData: any, location?: {latitude: number, longitude: number}) => Promise<BookListing | null>;
}

export const useInventoryBooks = (
  category?: string,
  limit?: number
): UseInventoryBooksResult => {
  // Use the core inventory functionality
  const { books, loading, error, refetch } = useInventoryCore(category, limit);
  
  // Use the book listing functionality
  const { listBook, listingLoading, listingError } = useBookListing();

  // Fetch books on initial load and when dependencies change
  useEffect(() => {
    refetch();
  }, [category, limit]);

  // Combine errors if needed
  const combinedError = error || listingError;

  return { 
    books, 
    loading: loading || listingLoading, 
    error: combinedError,
    refetch,
    listBook
  };
};
