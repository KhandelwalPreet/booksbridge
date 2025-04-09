
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
        // First try to fetch from the new database structure
        let { data: inventoryNewData, error: inventoryNewError } = await supabase
          .from('inventory_new')
          .select(`
            id,
            book:book_id(
              id, title, author, cover_image_url, categories
            )
          `)
          .eq('available', true)
          .limit(limit);
        
        // If the query succeeds but no data is found, or if the query fails, fall back to old structure
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
            // For now, we don't have distance data in our table
            // This could be calculated later based on user location
          }));
          
          setBooks(transformedData);
        } else {
          // We have data from the new structure, transform it
          const transformedData = inventoryNewData.map(item => {
            const book = item.book;
            return {
              id: item.id,
              title: book?.title || 'Unknown Title',
              author: book?.author || 'Unknown Author',
              coverImage: book?.cover_image_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=2730&ixlib=rb-4.0.3',
              // Distance data not available yet
            };
          });
          
          // If category is specified, filter by category
          const filteredData = category 
            ? transformedData.filter(book => 
                (book.book?.categories && book.book.categories.toLowerCase().includes(category.toLowerCase()))
              )
            : transformedData;
          
          setBooks(filteredData);
        }
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
