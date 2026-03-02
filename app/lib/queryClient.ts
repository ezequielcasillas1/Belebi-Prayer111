/**
 * React Query Client Configuration
 * Configured for offline-first with persistence and optimistic updates
 */

import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      networkMode: 'offlineFirst',
    },
  },
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'belebi-query-cache',
  throttleTime: 1000,
});

export const queryKeys = {
  prayers: {
    all: ['prayers'] as const,
    lists: () => [...queryKeys.prayers.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.prayers.lists(), filters] as const,
    details: () => [...queryKeys.prayers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.prayers.details(), id] as const,
    sent: (userId: string) => [...queryKeys.prayers.all, 'sent', userId] as const,
    byCountry: (countryCode: string) => [...queryKeys.prayers.all, 'country', countryCode] as const,
  },
  churches: {
    all: ['churches'] as const,
    lists: () => [...queryKeys.churches.all, 'list'] as const,
    list: (userId: string) => [...queryKeys.churches.lists(), userId] as const,
    details: () => [...queryKeys.churches.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.churches.details(), id] as const,
    members: (churchId: string) => [...queryKeys.churches.all, 'members', churchId] as const,
    prayers: (churchId: string) => [...queryKeys.churches.all, 'prayers', churchId] as const,
  },
  profiles: {
    all: ['profiles'] as const,
    detail: (id: string) => [...queryKeys.profiles.all, id] as const,
    current: () => [...queryKeys.profiles.all, 'current'] as const,
  },
  countries: {
    all: ['countries'] as const,
    stats: () => [...queryKeys.countries.all, 'stats'] as const,
    detail: (code: string) => [...queryKeys.countries.all, code] as const,
  },
  translations: {
    all: ['translations'] as const,
    content: (contentId: string, targetLang: string) => 
      [...queryKeys.translations.all, contentId, targetLang] as const,
  },
} as const;
