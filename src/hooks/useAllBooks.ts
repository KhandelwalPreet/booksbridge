
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BookListing } from '@/types/database';

interface UseAllBooksResult {
  allBooks: BookListing[];
  loading: boolean;
  refetch: () => Promise<void>;
}

export const useAllBooks = (): UseAllBooksResult => {
  const [allBooks, setAllBooks] = useState<BookListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAllBooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory_new')
        .select(`
          *,
          book:books_db(*)
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
          isbn_10: item.book?.isbn_10,
          categories: item.book?.categories
        }));
        setAllBooks(processedBooks);
      }
    } catch (error) {
      console.error('Error fetching all books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  return { allBooks, loading, refetch: fetchAllBooks };
};
