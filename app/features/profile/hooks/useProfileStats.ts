import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../auth/stores/authStore';
import { useUIStore } from '../../../stores/uiStore';
import { profileService, ProfileStats } from '../api/profileService';
import { AnsweredPrayer, UserMilestone, MilestoneKey, PublicTestimony } from '../../../types/database';

export const profileQueryKeys = {
  all: ['profile'] as const,
  stats: (userId: string) => ['profile', 'stats', userId] as const,
  milestones: (userId: string) => ['profile', 'milestones', userId] as const,
  answeredPrayers: (userId: string) => ['profile', 'answered-prayers', userId] as const,
  activity: (userId: string, days: number) => ['profile', 'activity', userId, days] as const,
  publicTestimonies: (year: number, month: number) => ['profile', 'public-testimonies', year, month] as const,
};

export function useProfileStats() {
  const currentUser = useAuthStore((state) => state.currentUser);

  return useQuery({
    queryKey: profileQueryKeys.stats(currentUser?.id || ''),
    queryFn: () => {
      if (!currentUser?.id) return null;
      return profileService.getProfileStats(currentUser.id);
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useMilestones() {
  const currentUser = useAuthStore((state) => state.currentUser);

  return useQuery({
    queryKey: profileQueryKeys.milestones(currentUser?.id || ''),
    queryFn: () => {
      if (!currentUser?.id) return [];
      return profileService.getMilestones(currentUser.id);
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCheckMilestones() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.currentUser);
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: async (stats: ProfileStats) => {
      if (!currentUser?.id) throw new Error('Not authenticated');
      return profileService.checkAndAwardMilestones(currentUser.id, stats);
    },
    onSuccess: (newMilestones) => {
      if (newMilestones.length > 0) {
        queryClient.invalidateQueries({ 
          queryKey: profileQueryKeys.milestones(currentUser?.id || '') 
        });
        const milestoneNames: Record<MilestoneKey, string> = {
          faithful_intercessor: 'Faithful Intercessor',
          steadfast_in_prayer: 'Steadfast in Prayer',
          nations_advocate: 'Nations Advocate',
          church_pillar: 'Church Pillar',
          emergency_responder: 'Emergency Responder',
          prayer_warrior: 'Prayer Warrior',
          intercessor_100: 'Intercessor 100',
          daily_devoted: 'Daily Devoted',
        };
        newMilestones.forEach(key => {
          showToast('success', `Milestone achieved: ${milestoneNames[key]}!`);
        });
      }
    },
  });
}

export function useAnsweredPrayers() {
  const currentUser = useAuthStore((state) => state.currentUser);

  return useQuery({
    queryKey: profileQueryKeys.answeredPrayers(currentUser?.id || ''),
    queryFn: () => {
      if (!currentUser?.id) return [];
      return profileService.getAnsweredPrayers(currentUser.id);
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAddAnsweredPrayer() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.currentUser);
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: ({
      testimonyText,
      prayerRequestId,
      isPublic,
    }: {
      testimonyText: string;
      prayerRequestId?: string;
      isPublic?: boolean;
    }) => {
      if (!currentUser?.id) throw new Error('Not authenticated');
      return profileService.addAnsweredPrayer(
        currentUser.id,
        testimonyText,
        prayerRequestId,
        isPublic
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileQueryKeys.answeredPrayers(currentUser?.id || ''),
      });
      queryClient.invalidateQueries({
        queryKey: profileQueryKeys.stats(currentUser?.id || ''),
      });
      showToast('success', 'Testimony added!');
    },
    onError: (error) => {
      showToast('error', (error as Error).message || 'Failed to add testimony');
    },
  });
}

export function useDeleteAnsweredPrayer() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.currentUser);
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: (id: string) => profileService.deleteAnsweredPrayer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileQueryKeys.answeredPrayers(currentUser?.id || ''),
      });
      queryClient.invalidateQueries({
        queryKey: profileQueryKeys.stats(currentUser?.id || ''),
      });
      showToast('success', 'Testimony removed');
    },
    onError: (error) => {
      showToast('error', (error as Error).message || 'Failed to remove testimony');
    },
  });
}

export function usePrayerActivity(days: number = 30) {
  const currentUser = useAuthStore((state) => state.currentUser);

  return useQuery({
    queryKey: profileQueryKeys.activity(currentUser?.id || '', days),
    queryFn: () => {
      if (!currentUser?.id) return [];
      return profileService.getPrayerActivity(currentUser.id, days);
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePublicTestimonies(year: number, month: number) {
  return useQuery({
    queryKey: profileQueryKeys.publicTestimonies(year, month),
    queryFn: () => profileService.getPublicTestimonies(year, month),
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateTestimony() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.currentUser);
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: { testimony_text?: string; is_public?: boolean } }) => 
      profileService.updateAnsweredPrayer(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileQueryKeys.answeredPrayers(currentUser?.id || ''),
      });
      queryClient.invalidateQueries({
        queryKey: ['profile', 'public-testimonies'],
      });
      showToast('success', 'Testimony updated');
    },
    onError: (error) => {
      showToast('error', (error as Error).message || 'Failed to update testimony');
    },
  });
}
