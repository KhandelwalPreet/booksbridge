
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

type BookData = {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  distance?: string;
  lender?: string;
};

export const useInventoryBooks = (category?: string, limit: number = 10) => {
  const [books, setBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('inventory')
          .select('id, title, author, thumbnail_url, condition')
          .limit(limit);
        
        // Add category filter if provided
        if (category) {
          query = query.eq('categories', category);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        // Transform the data to match BookCard props
        const transformedData = data.map(book => ({
          id: book.id,
          title: book.title || 'Unknown Title',
          author: book.author || 'Unknown Author',
          coverImage: book.thumbnail_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=2730&ixlib=rb-4.0.3',
          // For now, we don't have distance data in our table
          // This could be calculated later based on user location
        }));
        
        setBooks(transformedData);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category, limit]);

  return { books, loading, error };
};
