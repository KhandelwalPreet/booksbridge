
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BookDb, BookListing } from '../types/database';

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
  const [books, setBooks] = useState<BookListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      
      // Query inventory_new table with joined book data
      let query = supabase
        .from('inventory_new')
        .select(`
          *,
          book:book_id(*)
        `)
        .eq('available', true);
      
      // Apply category filter if provided
      if (category) {
        query = query.filter('book.categories', 'ilike', `%${category}%`);
      }
      
      // Apply limit if provided
      if (limit) {
        query = query.limit(limit);
      }
      
      // Order by most recent
      query = query.order('created_at', { ascending: false });
      
      const { data: inventoryData, error: inventoryError } = await query;

      if (inventoryError) throw inventoryError;

      // If we got results, map them to our interface
      if (inventoryData && inventoryData.length > 0) {
        const processedBooks: BookListing[] = inventoryData.map((item: any) => {
          return {
            ...item,
            title: item.book?.title,
            author: item.book?.author,
            cover_image_url: item.book?.cover_image_url,
            thumbnail_url: item.book?.cover_image_url,
            isbn: item.book?.isbn_13 || item.book?.isbn_10,
            isbn_13: item.book?.isbn_13,
            isbn_10: item.book?.isbn_10
          };
        });
        
        setBooks(processedBooks);
      } else {
        setBooks([]);
      }
    } catch (err) {
      console.error('Error fetching inventory books:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const listBook = async (bookData: any, location?: {latitude: number, longitude: number}) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.error('No authenticated user');
        return null;
      }

      const inventoryData = {
        ...bookData,
        lender_id: session.user.id,
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0
      };

      const { data, error } = await supabase
        .from('inventory_new')
        .insert(inventoryData)
        .select();

      if (error) throw error;

      return data?.[0] as BookListing;
    } catch (err) {
      console.error('Error listing book:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [category, limit]);

  return { books, loading, error, refetch: fetchBooks, listBook };
};
