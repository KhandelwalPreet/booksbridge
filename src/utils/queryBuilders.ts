
import { supabase } from '@/integrations/supabase/client';

export const buildInventoryQuery = (category?: string, limit?: number) => {
  // Base query to get inventory items with joined book data
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
  
  return query;
};
