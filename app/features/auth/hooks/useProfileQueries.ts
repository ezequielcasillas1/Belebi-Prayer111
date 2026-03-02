/**
 * React Query Hooks for Profile/Auth Feature
 * Profile data fetching and mutations with caching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryClient';
import { authService } from '../api/authService';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../../../stores/uiStore';
import { Profile } from '../../../types/database';

export function useCurrentProfile() {
  const currentUser = useAuthStore((state) => state.currentUser);
  
  return useQuery({
    queryKey: queryKeys.profiles.current(),
    queryFn: () => {
      if (!currentUser?.id) return null;
      return authService.getProfile(currentUser.id);
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useProfile(userId: string) {
  return useQuery({
    queryKey: queryKeys.profiles.detail(userId),
    queryFn: () => authService.getProfile(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.currentUser);
  const setProfile = useAuthStore((state) => state.setProfile);
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: (updates: Partial<Profile>) => {
      if (!currentUser?.id) throw new Error('Not authenticated');
      return authService.updateProfile(currentUser.id, updates);
    },
    onMutate: async (updates) => {
      if (!currentUser?.id) return;
      
      await queryClient.cancelQueries({ queryKey: queryKeys.profiles.current() });
      await queryClient.cancelQueries({ queryKey: queryKeys.profiles.detail(currentUser.id) });
      
      const previousProfile = queryClient.getQueryData<Profile | null>(
        queryKeys.profiles.current()
      );
      
      if (previousProfile) {
        const optimisticProfile = { ...previousProfile, ...updates };
        queryClient.setQueryData(queryKeys.profiles.current(), optimisticProfile);
        queryClient.setQueryData(queryKeys.profiles.detail(currentUser.id), optimisticProfile);
      }
      
      return { previousProfile };
    },
    onError: (error, updates, context) => {
      if (context?.previousProfile && currentUser?.id) {
        queryClient.setQueryData(queryKeys.profiles.current(), context.previousProfile);
        queryClient.setQueryData(queryKeys.profiles.detail(currentUser.id), context.previousProfile);
      }
      showToast('error', (error as Error).message || 'Failed to update profile');
    },
    onSuccess: (updatedProfile) => {
      setProfile(updatedProfile);
      showToast('success', 'Profile updated');
    },
    onSettled: () => {
      if (currentUser?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.profiles.current() });
        queryClient.invalidateQueries({ queryKey: queryKeys.profiles.detail(currentUser.id) });
      }
    },
  });
}

export function useSignUp() {
  const login = useAuthStore((state) => state.login);
  const setProfile = useAuthStore((state) => state.setProfile);
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: ({
      email,
      password,
      userData,
    }: {
      email: string;
      password: string;
      userData: {
        firstName: string;
        country: string;
        countryCode: string;
        flag: string;
        denomination: string;
      };
    }) => authService.signUp(email, password, userData),
    onSuccess: ({ user, profile }) => {
      if (profile) {
        const appUser = {
          id: user.id,
          name: profile.first_name,
          letter: profile.first_name.charAt(0).toUpperCase(),
          country: profile.country,
          countryCode: profile.country_code,
          flag: profile.flag,
          denomination: profile.denomination,
        };
        login(appUser);
        setProfile(profile);
      }
      showToast('success', 'Account created! Please verify your email.');
    },
    onError: (error) => {
      showToast('error', (error as Error).message || 'Sign up failed');
    },
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();
  const login = useAuthStore((state) => state.login);
  const setProfile = useAuthStore((state) => state.setProfile);
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signIn(email, password),
    onSuccess: ({ user, profile }) => {
      if (profile) {
        const appUser = {
          id: user.id,
          name: profile.first_name,
          letter: profile.first_name.charAt(0).toUpperCase(),
          country: profile.country,
          countryCode: profile.country_code,
          flag: profile.flag,
          denomination: profile.denomination,
        };
        login(appUser);
        setProfile(profile);
        
        queryClient.setQueryData(queryKeys.profiles.current(), profile);
        queryClient.setQueryData(queryKeys.profiles.detail(user.id), profile);
      }
      showToast('success', 'Welcome back!');
    },
    onError: (error) => {
      showToast('error', (error as Error).message || 'Sign in failed');
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      logout();
      queryClient.clear();
      showToast('success', 'Signed out');
    },
    onError: (error) => {
      showToast('error', (error as Error).message || 'Sign out failed');
    },
  });
}

export function usePrefetchProfile(userId: string) {
  const queryClient = useQueryClient();
  
  return () => queryClient.prefetchQuery({
    queryKey: queryKeys.profiles.detail(userId),
    queryFn: () => authService.getProfile(userId),
  });
}
