import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrayerStore, SentPrayer, PrayerRequest } from '../types';

export const usePrayerStore = create<PrayerStore>()(
  persist(
    (set, get) => ({
      sentPrayers: [],

      addSentPrayer: (prayer: SentPrayer) =>
        set((state) => ({
          sentPrayers: [prayer, ...state.sentPrayers],
        })),

      hasSentPrayer: (requestId: string): boolean => {
        return get().sentPrayers.some((s) => s.requestId === requestId);
      },

      getAvailableRequests: (allRequests: PrayerRequest[]): PrayerRequest[] => {
        const sentIds = get().sentPrayers.map((s) => s.requestId);
        return allRequests.filter((r) => !sentIds.includes(r.id));
      },

      getRequestById: (allRequests: PrayerRequest[], id: string): PrayerRequest | undefined => {
        return allRequests.find((r) => r.id === id);
      },

      submitPrayer: (request: PrayerRequest, prayerText: string) => {
        const sentPrayer: SentPrayer = {
          id: `sent_${Date.now()}`,
          requestId: request.id,
          requestSnapshot: { ...request },
          prayerText,
          sentAt: new Date().toISOString(),
        };
        set((state) => ({
          sentPrayers: [sentPrayer, ...state.sentPrayers],
        }));
      },
    }),
    {
      name: 'belebi-prayers',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
