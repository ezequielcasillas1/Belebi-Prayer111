import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStore, User } from '../types';
import { Profile } from '../../../types/database';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      currentUser: null,
      supabaseProfile: null,
      isLoading: true,

      login: (user: User) => 
        set({ isAuthenticated: true, currentUser: user }),

      logout: () => 
        set({ 
          isAuthenticated: false, 
          currentUser: null, 
          supabaseProfile: null 
        }),

      setProfile: (profile: Profile | null) => 
        set({ supabaseProfile: profile }),

      setLoading: (loading: boolean) => 
        set({ isLoading: loading }),

      initialize: () => 
        set({ isLoading: false }),
    }),
    {
      name: 'belebi-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setLoading(false);
      },
    }
  )
);
