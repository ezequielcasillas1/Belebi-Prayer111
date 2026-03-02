import { create } from 'zustand';
import { ChurchWithMemberCount } from '../../../types/database';

interface ChurchState {
  currentChurch: ChurchWithMemberCount | null;
  userChurches: ChurchWithMemberCount[];
  isLoading: boolean;
}

interface ChurchActions {
  setCurrentChurch: (church: ChurchWithMemberCount | null) => void;
  setUserChurches: (churches: ChurchWithMemberCount[]) => void;
  addChurch: (church: ChurchWithMemberCount) => void;
  removeChurch: (churchId: string) => void;
  setLoading: (loading: boolean) => void;
}

export type ChurchStore = ChurchState & ChurchActions;

export const useChurchStore = create<ChurchStore>((set, get) => ({
  currentChurch: null,
  userChurches: [],
  isLoading: false,

  setCurrentChurch: (church) => set({ currentChurch: church }),
  
  setUserChurches: (churches) => set({ userChurches: churches }),
  
  addChurch: (church) => set((state) => ({
    userChurches: [...state.userChurches, church],
  })),
  
  removeChurch: (churchId) => set((state) => ({
    userChurches: state.userChurches.filter((c) => c.id !== churchId),
    currentChurch: state.currentChurch?.id === churchId ? null : state.currentChurch,
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
}));
