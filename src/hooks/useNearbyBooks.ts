
import { useState, useEffect } from 'react';
import { BookListing } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';

interface UseNearbyBooksResult {
  nearbyBooks: BookListing[];
  loading: boolean;
}

export const useNearbyBooks = (
  userLocation: { latitude: number, longitude: number } | null,
  allBooks: BookListing[]
): UseNearbyBooksResult => {
  const [nearbyBooks, setNearbyBooks] = useState<BookListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (userLocation && allBooks.length > 0) {
      // In a production app, we would implement distance calculation on the server
      // For now, just set first 12 books as nearby for the carousel
      setNearbyBooks(allBooks.slice(0, 12));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [userLocation, allBooks]);

  return { nearbyBooks, loading };
};
