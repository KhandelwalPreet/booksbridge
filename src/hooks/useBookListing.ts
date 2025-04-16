
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BookListing } from '@/types/database';

interface UseBookListingResult {
  listBook: (bookData: any, location?: {latitude: number, longitude: number}) => Promise<BookListing | null>;
  listingLoading: boolean;
  listingError: any;
}

export const useBookListing = (): UseBookListingResult => {
  const [listingLoading, setListingLoading] = useState<boolean>(false);
  const [listingError, setListingError] = useState<any>(null);

  const listBook = async (bookData: any, location?: {latitude: number, longitude: number}) => {
    try {
      setListingLoading(true);
      setListingError(null);
      
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
      setListingError(err);
      return null;
    } finally {
      setListingLoading(false);
    }
  };

  return { 
    listBook, 
    listingLoading, 
    listingError 
  };
};
