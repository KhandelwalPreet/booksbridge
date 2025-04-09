
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { BookDb, InventoryItem } from '@/types/database';

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
        // First fetch from books_db directly
        let query = supabase
          .from('books_db')
          .select('*');
        
        // Add category filter if provided
        if (category) {
          query = query.ilike('categories', `%${category}%`);
        }
        
        // Add limit
        query = query.limit(limit);
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching from books_db:', error);
          
          // Fall back to the old method if books_db fetch fails
          fallbackToInventory();
          return;
        }
        
        if (data && data.length > 0) {
          // Transform data to match BookCard props
          const transformedData = data.map((book: BookDb) => ({
            id: book.id,
            title: book.title || 'Unknown Title',
            author: book.author || 'Unknown Author',
            coverImage: book.cover_image_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=2730&ixlib=rb-4.0.3',
          }));
          
          setBooks(transformedData);
        } else {
          // If no data found in books_db, try the fallback
          fallbackToInventory();
        }
      } catch (err) {
        console.error('Error in useInventoryBooks:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    const fallbackToInventory = async () => {
      try {
        // First try the new inventory structure
        const { data: inventoryNewData, error: inventoryNewError } = await supabase
          .from('inventory_new')
          .select(`
            id,
            book_id,
            book:books_db!book_id(
              id, title, author, cover_image_url, categories
            )
          `)
          .eq('available', true)
          .limit(limit);
        
        if (inventoryNewError || !inventoryNewData || inventoryNewData.length === 0) {
          console.log('Falling back to old inventory table');
          
          let query = supabase
            .from('inventory')
            .select('id, title, author, thumbnail_url, condition')
            .limit(limit);
          
          // Add category filter if provided
          if (category) {
            query = query.ilike('categories', `%${category}%`);
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
          }));
          
          setBooks(transformedData);
        } else {
          // We have data from the new structure, transform it
          const transformedData = inventoryNewData.map(item => {
            return {
              id: item.id,
              title: item.book?.title || 'Unknown Title',
              author: item.book?.author || 'Unknown Author',
              coverImage: item.book?.cover_image_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=2730&ixlib=rb-4.0.3',
            };
          });
          
          // If category is specified, filter by category
          const filteredData = category 
            ? transformedData.filter(book => {
                const bookItem = inventoryNewData.find(item => item.id === book.id);
                return bookItem?.book?.categories && 
                       bookItem.book.categories.toLowerCase().includes(category.toLowerCase());
              })
            : transformedData;
          
          setBooks(filteredData);
        }
      } catch (err) {
        console.error('Error in fallback fetch:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category, limit]);

  return { books, loading, error };
};
