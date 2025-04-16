
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BookListing } from '@/types/database';
import { buildInventoryQuery } from '@/utils/queryBuilders';

interface UseInventoryCoreResult {
  books: BookListing[];
  loading: boolean;
  error: any;
  refetch: () => Promise<void>;
}

export const useInventoryCore = (
  category?: string,
  limit?: number
): UseInventoryCoreResult => {
  const [books, setBooks] = useState<BookListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      
      // Get query from utility function
      const query = buildInventoryQuery(category, limit);
      
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

  return { books, loading, error, refetch: fetchBooks };
};
