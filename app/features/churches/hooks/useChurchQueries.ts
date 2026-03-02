/**
 * React Query Hooks for Churches Feature
 * Provides data fetching with caching, background updates, and offline support
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryClient';
import { churchService, churchPrayerService } from '../api/churchService';
import { useUIStore } from '../../../stores/uiStore';
import { useAuthStore } from '../../auth/stores/authStore';
import { ChurchWithMemberCount, Church, ChurchPrayerWithAuthor, ChurchPrayer } from '../../../types/database';

export function useUserChurches() {
  const { currentUser } = useAuthStore();
  
  return useQuery({
    queryKey: queryKeys.churches.list(currentUser?.id || ''),
    queryFn: () => churchService.getUserChurches(currentUser?.id || ''),
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useChurch(churchId: string) {
  return useQuery({
    queryKey: queryKeys.churches.detail(churchId),
    queryFn: () => churchService.getChurchById(churchId),
    enabled: !!churchId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useChurchMembers(churchId: string) {
  return useQuery({
    queryKey: queryKeys.churches.members(churchId),
    queryFn: () => churchService.getChurchMembers(churchId),
    enabled: !!churchId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useChurchPrayers(churchId: string) {
  return useQuery({
    queryKey: queryKeys.churches.prayers(churchId),
    queryFn: () => churchPrayerService.getChurchPrayers(churchId),
    enabled: !!churchId,
    staleTime: 1000 * 60 * 2,
  });
}

export function usePrayerResponses(prayerId: string) {
  return useQuery({
    queryKey: ['prayerResponses', prayerId],
    queryFn: () => churchPrayerService.getPrayerResponses(prayerId),
    enabled: !!prayerId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateChurch() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: ({ name, denomination }: { name: string; denomination: string }) => {
      if (!currentUser?.id) throw new Error('Not authenticated');
      return churchService.createChurch(name, denomination, currentUser.id);
    },
    onSuccess: (newChurch) => {
      if (currentUser?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.churches.list(currentUser.id) });
      }
      showToast('success', 'Church created successfully');
    },
    onError: (error) => {
      showToast('error', (error as Error).message || 'Failed to create church');
    },
  });
}

export function useJoinChurch() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: (inviteCode: string) => {
      if (!currentUser?.id) throw new Error('Not authenticated');
      return churchService.joinChurchByCode(inviteCode, currentUser.id);
    },
    onSuccess: (church) => {
      if (currentUser?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.churches.list(currentUser.id) });
      }
      showToast('success', `Joined ${church.name} successfully`);
    },
    onError: (error) => {
      showToast('error', (error as Error).message || 'Failed to join church');
    },
  });
}

export function useLeaveChurch() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: (churchId: string) => {
      if (!currentUser?.id) throw new Error('Not authenticated');
      return churchService.leaveChurch(churchId, currentUser.id);
    },
    onMutate: async (churchId) => {
      if (!currentUser?.id) return;
      
      await queryClient.cancelQueries({ queryKey: queryKeys.churches.list(currentUser.id) });
      
      const previousChurches = queryClient.getQueryData<ChurchWithMemberCount[]>(
        queryKeys.churches.list(currentUser.id)
      );
      
      queryClient.setQueryData<ChurchWithMemberCount[]>(
        queryKeys.churches.list(currentUser.id),
        (old) => old?.filter(c => c.id !== churchId) || []
      );
      
      return { previousChurches };
    },
    onError: (error, churchId, context) => {
      if (context?.previousChurches && currentUser?.id) {
        queryClient.setQueryData(
          queryKeys.churches.list(currentUser.id),
          context.previousChurches
        );
      }
      showToast('error', (error as Error).message || 'Failed to leave church');
    },
    onSuccess: () => {
      showToast('success', 'Left church successfully');
    },
    onSettled: () => {
      if (currentUser?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.churches.list(currentUser.id) });
      }
    },
  });
}

export function useDeleteChurch() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: (churchId: string) => {
      if (!currentUser?.id) throw new Error('Not authenticated');
      return churchService.deleteChurch(churchId, currentUser.id);
    },
    onMutate: async (churchId) => {
      if (!currentUser?.id) return;
      
      await queryClient.cancelQueries({ queryKey: queryKeys.churches.list(currentUser.id) });
      
      const previousChurches = queryClient.getQueryData<ChurchWithMemberCount[]>(
        queryKeys.churches.list(currentUser.id)
      );
      
      queryClient.setQueryData<ChurchWithMemberCount[]>(
        queryKeys.churches.list(currentUser.id),
        (old) => old?.filter(c => c.id !== churchId) || []
      );
      
      return { previousChurches };
    },
    onError: (error, churchId, context) => {
      if (context?.previousChurches && currentUser?.id) {
        queryClient.setQueryData(
          queryKeys.churches.list(currentUser.id),
          context.previousChurches
        );
      }
      showToast('error', (error as Error).message || 'Failed to delete church');
    },
    onSuccess: () => {
      showToast('success', 'Church deleted successfully');
    },
    onSettled: () => {
      if (currentUser?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.churches.list(currentUser.id) });
      }
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: ({ churchId, memberId }: { churchId: string; memberId: string }) => {
      if (!currentUser?.id) throw new Error('Not authenticated');
      return churchService.removeMember(churchId, memberId, currentUser.id);
    },
    onMutate: async ({ churchId, memberId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.churches.members(churchId) });
      
      const previousMembers = queryClient.getQueryData(
        queryKeys.churches.members(churchId)
      );
      
      queryClient.setQueryData<Array<{ user_id: string; joined_at: string; profile: any }>>(
        queryKeys.churches.members(churchId),
        (old) => old?.filter(m => m.user_id !== memberId) || []
      );
      
      return { previousMembers };
    },
    onError: (error, { churchId }, context) => {
      if (context?.previousMembers) {
        queryClient.setQueryData(
          queryKeys.churches.members(churchId),
          context.previousMembers
        );
      }
      showToast('error', (error as Error).message || 'Failed to remove member');
    },
    onSuccess: (_, { churchId }) => {
      showToast('success', 'Member removed successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.churches.detail(churchId) });
    },
    onSettled: (_, __, { churchId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.churches.members(churchId) });
    },
  });
}

export function useCreateChurchPrayer() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: ({ churchId, requestText, expiresAt }: { 
      churchId: string; 
      requestText: string; 
      expiresAt?: string 
    }) => {
      if (!currentUser?.id) throw new Error('Not authenticated');
      return churchPrayerService.createPrayer(churchId, currentUser.id, requestText, expiresAt);
    },
    onSuccess: (newPrayer, { churchId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.churches.prayers(churchId) });
      showToast('success', 'Prayer request created');
    },
    onError: (error) => {
      showToast('error', (error as Error).message || 'Failed to create prayer request');
    },
  });
}

export function useRespondToPrayer() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: ({ prayerId, prayerText, churchId }: { 
      prayerId: string; 
      prayerText: string;
      churchId: string;
    }) => {
      if (!currentUser?.id) throw new Error('Not authenticated');
      return churchPrayerService.respondToPrayer(prayerId, currentUser.id, prayerText);
    },
    onMutate: async ({ prayerId, churchId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.churches.prayers(churchId) });
      
      const previousPrayers = queryClient.getQueryData<ChurchPrayerWithAuthor[]>(
        queryKeys.churches.prayers(churchId)
      );
      
      queryClient.setQueryData<ChurchPrayerWithAuthor[]>(
        queryKeys.churches.prayers(churchId),
        (old) => old?.map(p => 
          p.id === prayerId 
            ? { ...p, responses_count: p.responses_count + 1 }
            : p
        ) || []
      );
      
      return { previousPrayers };
    },
    onError: (error, { churchId }, context) => {
      if (context?.previousPrayers) {
        queryClient.setQueryData(
          queryKeys.churches.prayers(churchId),
          context.previousPrayers
        );
      }
      showToast('error', (error as Error).message || 'Failed to send prayer');
    },
    onSuccess: (_, { prayerId, churchId }) => {
      showToast('success', 'Prayer sent');
      queryClient.invalidateQueries({ queryKey: ['prayerResponses', prayerId] });
    },
    onSettled: (_, __, { churchId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.churches.prayers(churchId) });
    },
  });
}

export function useDeleteChurchPrayer() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: ({ prayerId, churchId }: { prayerId: string; churchId: string }) => {
      if (!currentUser?.id) throw new Error('Not authenticated');
      return churchPrayerService.deletePrayer(prayerId, currentUser.id);
    },
    onMutate: async ({ prayerId, churchId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.churches.prayers(churchId) });
      
      const previousPrayers = queryClient.getQueryData<ChurchPrayerWithAuthor[]>(
        queryKeys.churches.prayers(churchId)
      );
      
      queryClient.setQueryData<ChurchPrayerWithAuthor[]>(
        queryKeys.churches.prayers(churchId),
        (old) => old?.filter(p => p.id !== prayerId) || []
      );
      
      return { previousPrayers };
    },
    onError: (error, { churchId }, context) => {
      if (context?.previousPrayers) {
        queryClient.setQueryData(
          queryKeys.churches.prayers(churchId),
          context.previousPrayers
        );
      }
      showToast('error', (error as Error).message || 'Failed to delete prayer');
    },
    onSuccess: () => {
      showToast('success', 'Prayer deleted');
    },
    onSettled: (_, __, { churchId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.churches.prayers(churchId) });
    },
  });
}
