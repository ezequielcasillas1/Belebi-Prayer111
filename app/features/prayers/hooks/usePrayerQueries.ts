/**
 * React Query Hooks for Prayers Feature
 * Provides data fetching with caching, background updates, and offline support
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys, queryClient } from '../../../lib/queryClient';
import { prayerApi } from '../api/prayerApi';
import { PrayerRequest, SentPrayer } from '../types';
import { useUIStore } from '../../../stores/uiStore';
import { useAuthStore } from '../../auth/stores/authStore';

const PAGE_SIZE = 20;

export function usePrayerRequests(options?: {
  countryCode?: string;
  letter?: string;
  excludeSent?: boolean;
}) {
  const { currentUser } = useAuthStore();
  
  return useQuery({
    queryKey: queryKeys.prayers.list({ 
      countryCode: options?.countryCode, 
      letter: options?.letter,
      excludeSent: options?.excludeSent,
    }),
    queryFn: () => prayerApi.fetchPrayerRequests({
      countryCode: options?.countryCode,
      letter: options?.letter,
      excludeSentByUser: options?.excludeSent ? currentUser?.id : undefined,
      limit: PAGE_SIZE,
    }),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function usePrayerRequestsInfinite(options?: {
  countryCode?: string;
  letter?: string;
  excludeSent?: boolean;
}) {
  const { currentUser } = useAuthStore();
  
  return useInfiniteQuery({
    queryKey: [...queryKeys.prayers.list({ 
      countryCode: options?.countryCode, 
      letter: options?.letter,
      excludeSent: options?.excludeSent,
    }), 'infinite'],
    queryFn: ({ pageParam = 0 }) => prayerApi.fetchPrayerRequests({
      countryCode: options?.countryCode,
      letter: options?.letter,
      excludeSentByUser: options?.excludeSent ? currentUser?.id : undefined,
      limit: PAGE_SIZE,
      offset: pageParam,
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const totalFetched = pages.reduce((acc, page) => acc + page.data.length, 0);
      return totalFetched < lastPage.count ? totalFetched : undefined;
    },
  });
}

export function usePrayerRequest(id: string) {
  return useQuery({
    queryKey: queryKeys.prayers.detail(id),
    queryFn: () => prayerApi.fetchPrayerRequestById(id),
    enabled: !!id,
  });
}

export function useSentPrayers() {
  const { currentUser } = useAuthStore();
  
  return useQuery({
    queryKey: queryKeys.prayers.sent(currentUser?.id || ''),
    queryFn: () => prayerApi.fetchSentPrayers(currentUser?.id || ''),
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreatePrayerRequest() {
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: (request: {
      requestText: string;
      description?: string;
      profileImages?: string[];
      emergencyImages?: string[];
      autoDismissTime?: '1month' | '6months' | '1year';
    }) => prayerApi.createPrayerRequest(request),
    onSuccess: (newRequest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prayers.lists() });
      showToast('success', 'Prayer request created successfully');
    },
    onError: (error) => {
      showToast('error', 'Failed to create prayer request');
      console.error('Create prayer request error:', error);
    },
  });
}

export function useDismissPrayerRequest() {
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: (id: string) => prayerApi.dismissPrayerRequest(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.prayers.lists() });
      
      const previousRequests = queryClient.getQueriesData({ queryKey: queryKeys.prayers.lists() });
      
      queryClient.setQueriesData<{ data: PrayerRequest[]; count: number }>(
        { queryKey: queryKeys.prayers.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter(r => r.id !== id),
            count: old.count - 1,
          };
        }
      );
      
      return { previousRequests };
    },
    onError: (error, id, context) => {
      if (context?.previousRequests) {
        context.previousRequests.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      showToast('error', 'Failed to dismiss prayer request');
    },
    onSuccess: () => {
      showToast('success', 'Prayer request dismissed');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prayers.lists() });
    },
  });
}

export function useSendPrayer() {
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();
  const { currentUser } = useAuthStore();

  return useMutation({
    mutationFn: ({ prayerRequestId, prayerText }: { prayerRequestId: string; prayerText: string }) => 
      prayerApi.sendPrayer(prayerRequestId, prayerText),
    onMutate: async ({ prayerRequestId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.prayers.detail(prayerRequestId) });
      
      const previousRequest = queryClient.getQueryData<PrayerRequest>(
        queryKeys.prayers.detail(prayerRequestId)
      );
      
      if (previousRequest) {
        queryClient.setQueryData<PrayerRequest>(
          queryKeys.prayers.detail(prayerRequestId),
          {
            ...previousRequest,
            prayersSentCount: previousRequest.prayersSentCount + 1,
          }
        );
      }
      
      return { previousRequest };
    },
    onError: (error, variables, context) => {
      if (context?.previousRequest) {
        queryClient.setQueryData(
          queryKeys.prayers.detail(variables.prayerRequestId),
          context.previousRequest
        );
      }
      showToast('error', 'Failed to send prayer');
    },
    onSuccess: (sentPrayer) => {
      showToast('success', 'Prayer sent successfully');
      
      if (currentUser?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.prayers.sent(currentUser.id) });
      }
    },
    onSettled: (_, __, { prayerRequestId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prayers.detail(prayerRequestId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.prayers.lists() });
    },
  });
}

export function useAutoAssignment() {
  const { currentUser } = useAuthStore();
  
  return useQuery({
    queryKey: ['autoAssignment', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return null;
      const assignment = await prayerApi.getAutoAssignment(currentUser.id);
      if (!assignment) return null;
      return prayerApi.fetchPrayerRequestById(assignment.requestId);
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateAutoAssignment() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: () => {
      if (!currentUser?.id) throw new Error('Not authenticated');
      return prayerApi.createAutoAssignment(currentUser.id);
    },
    onSuccess: (request) => {
      if (currentUser?.id) {
        queryClient.setQueryData(['autoAssignment', currentUser.id], request);
      }
      if (request) {
        showToast('success', 'Auto prayer assigned');
      } else {
        showToast('info', 'No available prayers to assign');
      }
    },
    onError: () => {
      showToast('error', 'Failed to create auto assignment');
    },
  });
}

export function useClearAutoAssignment() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();

  return useMutation({
    mutationFn: () => {
      if (!currentUser?.id) throw new Error('Not authenticated');
      return prayerApi.clearAutoAssignment(currentUser.id);
    },
    onSuccess: () => {
      if (currentUser?.id) {
        queryClient.setQueryData(['autoAssignment', currentUser.id], null);
      }
    },
  });
}

export function usePlannedPrayer() {
  const { currentUser } = useAuthStore();
  
  return useQuery({
    queryKey: ['plannedPrayer', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return null;
      const planned = await prayerApi.getPlannedPrayer(currentUser.id);
      if (!planned) return null;
      return prayerApi.fetchPrayerRequestById(planned.requestId);
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSetPlannedPrayer() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: (prayerRequestId: string) => {
      if (!currentUser?.id) throw new Error('Not authenticated');
      return prayerApi.setPlanPrayer(currentUser.id, prayerRequestId);
    },
    onSuccess: async (_, prayerRequestId) => {
      const request = await prayerApi.fetchPrayerRequestById(prayerRequestId);
      if (currentUser?.id) {
        queryClient.setQueryData(['plannedPrayer', currentUser.id], request);
      }
      showToast('success', 'Prayer added to plan');
    },
    onError: () => {
      showToast('error', 'Failed to plan prayer');
    },
  });
}

export function useClearPlannedPrayer() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();

  return useMutation({
    mutationFn: () => {
      if (!currentUser?.id) throw new Error('Not authenticated');
      return prayerApi.clearPlannedPrayer(currentUser.id);
    },
    onSuccess: () => {
      if (currentUser?.id) {
        queryClient.setQueryData(['plannedPrayer', currentUser.id], null);
      }
    },
  });
}

export function useCountryStats() {
  return useQuery({
    queryKey: queryKeys.countries.stats(),
    queryFn: () => prayerApi.fetchCountryStats(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useCountryPrayerRequests(countryCode: string) {
  return usePrayerRequests({ countryCode });
}

export function usePrefetchPrayerRequest(id: string) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.prayers.detail(id),
    queryFn: () => prayerApi.fetchPrayerRequestById(id),
  });
}
