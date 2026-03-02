import { create } from 'zustand';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface UIState {
  toasts: Toast[];
  isLoading: boolean;
  viewerCounts: Record<string, number>;
}

interface UIActions {
  showToast: (type: 'success' | 'error' | 'info', message: string) => void;
  removeToast: (id: string) => void;
  setLoading: (loading: boolean) => void;
  updateViewerCount: (requestId: string, count: number) => void;
  getViewerCount: (requestId: string) => number;
}

export type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set, get) => ({
  toasts: [],
  isLoading: false,
  viewerCounts: {},

  showToast: (type, message) => {
    const id = `toast_${Date.now()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3500);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  setLoading: (loading) => set({ isLoading: loading }),

  updateViewerCount: (requestId, count) => {
    set((state) => ({
      viewerCounts: { ...state.viewerCounts, [requestId]: count },
    }));
  },

  getViewerCount: (requestId) => {
    const count = get().viewerCounts[requestId];
    return count ?? Math.floor(Math.random() * 18) + 1;
  },
}));
