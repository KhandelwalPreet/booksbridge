
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useBookDetails = () => {
  const [bookDetails, setBookDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchBookDetails = async (bookId: string, userLocation: {latitude: number, longitude: number} | null) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('inventory_new')
        .select(`
          *,
          book:books_db(*)
        `)
        .eq('id', bookId)
        .single();
      
      if (data && !error) {
        // Get lender profile info
        const { data: lenderData } = await supabase
          .from('profiles')
          .select('name, gender, latitude, longitude')
          .eq('id', data.lender_id)
          .single();
        
        // Calculate distance if we have both user and lender coordinates
        let distance = null;
        if (userLocation && lenderData && lenderData.latitude && lenderData.longitude) {
          // Haversine formula for distance calculation
          const R = 6371; // Radius of the Earth in km
          const dLat = (lenderData.latitude - userLocation.latitude) * Math.PI / 180;
          const dLon = (lenderData.longitude - userLocation.longitude) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(lenderData.latitude * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          distance = R * c;
        }

        // Create a more comprehensive book details object
        setBookDetails({
          id: data.id,
          title: data.book?.title || 'Unknown Title',
          author: data.book?.author || 'Unknown Author',
          coverImage: data.book?.cover_image_url || '/placeholder.svg',
          pageCount: data.book?.page_count || 0,
          genre: data.book?.categories || 'Uncategorized',
          language: data.book?.language || 'Unknown',
          description: data.book?.description || 'No description available',
          isbn10: data.book?.isbn_10 || null,
          isbn13: data.book?.isbn_13 || null,
          publisher: data.book?.publisher || null,
          publishedDate: data.book?.published_date || null,
          googleBooksId: data.book?.google_books_id || null,
          condition: data.condition || 'Good',
          conditionNotes: data.condition_notes || null,
          lendingDuration: data.lending_duration || 14,
          pickupPreferences: data.pickup_preferences || null,
          listings: [{
            id: data.id,
            lenderId: data.lender_id,
            lenderName: lenderData?.name || 'Unknown',
            distance: distance ? `${distance.toFixed(1)} km away` : 'Distance unknown',
            distanceValue: distance || 9999
          }]
        });
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { bookDetails, isLoading, fetchBookDetails, setBookDetails };
};
