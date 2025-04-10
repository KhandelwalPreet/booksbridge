
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('latitude, longitude')
            .eq('id', session.user.id)
            .single();
          
          if (data && !error) {
            setUserLocation({
              latitude: data.latitude,
              longitude: data.longitude
            });
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user location:', error);
        setLoading(false);
      }
    };
    
    fetchUserLocation();
  }, []);

  return { userLocation, loading };
};
