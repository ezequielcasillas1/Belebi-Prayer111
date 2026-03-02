import React, { ReactNode, useEffect } from 'react';
import { usePlanStore } from '../features/planning/stores/planStore';
import { useAuthStore } from '../features/auth/stores/authStore';
import { supabase } from '../lib/supabase';
import { QueryProvider } from './QueryProvider';
import { translationService, supabaseEdgeProvider } from '../services/translation';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const checkAutoExpiry = usePlanStore((state) => state.checkAutoExpiry);
  const checkPlanExpiry = usePlanStore((state) => state.checkPlanExpiry);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    translationService.setProvider(supabaseEdgeProvider);
    translationService.initialize();
  }, []);

  useEffect(() => {
    const syncAuthSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const metadata = session.user.user_metadata;
          login({
            id: session.user.id,
            firstName: metadata?.first_name || 'User',
            country: metadata?.country || 'Unknown',
            countryCode: metadata?.country_code || 'XX',
            flag: metadata?.flag || '🌍',
            denomination: metadata?.denomination || 'Prefer not to say',
            email: session.user.email || '',
          });
        }
      } catch (error) {
        console.error('Auth session sync error:', error);
      } finally {
        setLoading(false);
      }
    };

    syncAuthSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const metadata = session.user.user_metadata;
        login({
          id: session.user.id,
          firstName: metadata?.first_name || 'User',
          country: metadata?.country || 'Unknown',
          countryCode: metadata?.country_code || 'XX',
          flag: metadata?.flag || '🌍',
          denomination: metadata?.denomination || 'Prefer not to say',
          email: session.user.email || '',
        });
      } else if (event === 'SIGNED_OUT') {
        logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [login, logout, setLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkAutoExpiry();
      checkPlanExpiry();
    }, 60000);

    return () => clearInterval(interval);
  }, [checkAutoExpiry, checkPlanExpiry]);

  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}

export default AppProviders;
