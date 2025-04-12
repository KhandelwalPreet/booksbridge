
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuthState = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for an existing session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user };
};
