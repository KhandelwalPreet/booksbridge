
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BookDb, BookListing } from '../types/database';

interface UseInventoryBooksResult {
  books: BookListing[];
  loading: boolean;
  error: any;
  refetch: () => Promise<void>;
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
      
      // First attempt to use the new table structure with joined book data
      let query = supabase
        .from('inventory_new')
        .select(`
          *,
          book:book_id(*)
        `)
        .eq('available', true);
      
      // Apply category filter if provided
      if (category) {
        query = query.like('book.categories', `%${category}%`);
      }
      
      // Apply limit if provided
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data: newInventoryData, error: newError } = await query;

      // If we got results, map them to our interface
      if (newInventoryData && newInventoryData.length > 0) {
        const processedBooks: BookListing[] = newInventoryData.map((item: any) => {
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
        setLoading(false);
        return;
      }

      // If that fails or returns no results, use the old inventory table
      console.info('Falling back to old inventory table');
      const { data: oldInventoryData, error: oldError } = await supabase
        .from('inventory')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit || 50);
      
      if (oldError) throw oldError;
      
      // Map old inventory data to our interface
      if (oldInventoryData) {
        const oldProcessedBooks = oldInventoryData.map(item => ({
          id: item.id,
          book_id: '', // Old table doesn't have this concept
          lender_id: item.user_id,
          condition: item.condition,
          condition_notes: item.condition_notes,
          available: true,
          location: null,
          lending_duration: item.lending_duration,
          pickup_preferences: item.pickup_preferences,
          created_at: item.created_at,
          updated_at: item.updated_at || item.created_at,
          title: item.title,
          author: item.author,
          isbn: item.isbn,
          thumbnail_url: item.thumbnail_url,
          cover_image_url: item.thumbnail_url,
          status: 'Available'
        }));
        
        setBooks(oldProcessedBooks);
      }
    } catch (err) {
      console.error('Error fetching inventory books:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [category, limit]);

  return { books, loading, error, refetch: fetchBooks };
};
