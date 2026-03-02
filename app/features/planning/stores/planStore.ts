import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRAYER_REQUESTS, PrayerRequest, AutoAssignment, PlannedPrayer } from '../../../data/mockData';

const AUTO_ASSIGNMENT_HOURS = 12;
const PLAN_PRAYER_HOURS = 24;

interface PlanState {
  selectionMode: 'manual' | 'auto';
  autoAssignment: AutoAssignment | null;
  plannedPrayer: PlannedPrayer | null;
}

interface PlanActions {
  setSelectionMode: (mode: 'manual' | 'auto') => void;
  assignAuto: (sentPrayerIds: string[]) => void;
  checkAutoExpiry: () => boolean;
  getAutoRequest: () => PrayerRequest | null;
  setPlanPrayer: (requestId: string) => void;
  clearPlanPrayer: () => void;
  checkPlanExpiry: () => boolean;
  getPlannedRequest: () => PrayerRequest | null;
  clearAutoAssignment: () => void;
}

export type PlanStore = PlanState & PlanActions;

export const usePlanStore = create<PlanStore>()(
  persist(
    (set, get) => ({
      selectionMode: 'manual',
      autoAssignment: null,
      plannedPrayer: null,

      setSelectionMode: (mode) => set({ selectionMode: mode }),

      assignAuto: (sentPrayerIds: string[]) => {
        const available = PRAYER_REQUESTS.filter(
          (r) => r.prayersSentCount <= 2 && !sentPrayerIds.includes(r.id)
        );
        if (available.length === 0) {
          set({ autoAssignment: null });
          return;
        }
        const randomRequest = available[Math.floor(Math.random() * available.length)];
        const now = new Date();
        const expiresAt = new Date(now.getTime() + AUTO_ASSIGNMENT_HOURS * 60 * 60 * 1000);
        set({
          autoAssignment: {
            requestId: randomRequest.id,
            assignedAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
          },
        });
      },

      checkAutoExpiry: (): boolean => {
        const { autoAssignment } = get();
        if (!autoAssignment) return false;
        const now = new Date();
        const expiresAt = new Date(autoAssignment.expiresAt);
        if (now >= expiresAt) {
          set({ autoAssignment: null });
          return true;
        }
        return false;
      },

      getAutoRequest: (): PrayerRequest | null => {
        const { autoAssignment } = get();
        if (!autoAssignment) return null;
        return PRAYER_REQUESTS.find((r) => r.id === autoAssignment.requestId) || null;
      },

      setPlanPrayer: (requestId: string) => {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + PLAN_PRAYER_HOURS * 60 * 60 * 1000);
        set({
          plannedPrayer: {
            requestId,
            addedAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
          },
        });
      },

      clearPlanPrayer: () => set({ plannedPrayer: null }),

      checkPlanExpiry: (): boolean => {
        const { plannedPrayer } = get();
        if (!plannedPrayer) return false;
        const now = new Date();
        const expiresAt = new Date(plannedPrayer.expiresAt);
        if (now >= expiresAt) {
          set({ plannedPrayer: null });
          return true;
        }
        return false;
      },

      getPlannedRequest: (): PrayerRequest | null => {
        const { plannedPrayer } = get();
        if (!plannedPrayer) return null;
        return PRAYER_REQUESTS.find((r) => r.id === plannedPrayer.requestId) || null;
      },

      clearAutoAssignment: () => set({ autoAssignment: null }),
    }),
    {
      name: 'belebi-planning',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
