import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  AutoAssignment,
  PlannedPrayer,
  SentPrayer,
  Toast,
  PrayerRequest,
  PRAYER_REQUESTS,
} from '../data/mockData';

const STORAGE_KEY = 'belebi_app_state';
const AUTO_ASSIGNMENT_HOURS = 12;
const PLAN_PRAYER_HOURS = 24;

interface AppState {
  isAuthenticated: boolean;
  currentUser: User | null;
  selectionMode: 'manual' | 'auto';
  autoAssignment: AutoAssignment | null;
  plannedPrayer: PlannedPrayer | null;
  sentPrayers: SentPrayer[];
  toasts: Toast[];
  viewerCounts: Record<string, number>;
  isLoading: boolean;
}

type AppAction =
  | { type: 'INIT'; payload: Partial<AppState> }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_SELECTION_MODE'; payload: 'manual' | 'auto' }
  | { type: 'SET_AUTO_ASSIGNMENT'; payload: AutoAssignment | null }
  | { type: 'SET_PLANNED_PRAYER'; payload: PlannedPrayer | null }
  | { type: 'ADD_SENT_PRAYER'; payload: SentPrayer }
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'UPDATE_VIEWER_COUNT'; payload: { requestId: string; count: number } }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  isAuthenticated: false,
  currentUser: null,
  selectionMode: 'manual',
  autoAssignment: null,
  plannedPrayer: null,
  sentPrayers: [],
  toasts: [],
  viewerCounts: {},
  isLoading: true,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'INIT':
      return { ...state, ...action.payload, isLoading: false };
    case 'LOGIN':
      return { ...state, isAuthenticated: true, currentUser: action.payload };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
        viewerCounts: state.viewerCounts,
      };
    case 'SET_SELECTION_MODE':
      return { ...state, selectionMode: action.payload };
    case 'SET_AUTO_ASSIGNMENT':
      return { ...state, autoAssignment: action.payload };
    case 'SET_PLANNED_PRAYER':
      return { ...state, plannedPrayer: action.payload };
    case 'ADD_SENT_PRAYER':
      return { ...state, sentPrayers: [action.payload, ...state.sentPrayers] };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };
    case 'UPDATE_VIEWER_COUNT':
      return {
        ...state,
        viewerCounts: { ...state.viewerCounts, [action.payload.requestId]: action.payload.count },
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  login: (user: User) => void;
  logout: () => void;
  setSelectionMode: (mode: 'manual' | 'auto') => void;
  assignAuto: () => void;
  checkAutoExpiry: () => boolean;
  getAutoRequest: () => PrayerRequest | null;
  setPlanPrayer: (requestId: string) => void;
  clearPlanPrayer: () => void;
  checkPlanExpiry: () => boolean;
  getPlannedRequest: () => PrayerRequest | null;
  submitPrayer: (requestId: string, prayerText: string) => void;
  hasSentPrayer: (requestId: string) => boolean;
  showToast: (type: 'success' | 'error' | 'info', message: string) => void;
  getViewerCount: (requestId: string) => number;
  getAvailableRequests: () => PrayerRequest[];
  getRequestById: (id: string) => PrayerRequest | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function generateViewerCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  PRAYER_REQUESTS.forEach((req) => {
    counts[req.id] = Math.floor(Math.random() * 18) + 1;
  });
  return counts;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const viewerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadState();
    initViewerCounts();

    return () => {
      if (viewerIntervalRef.current) {
        clearInterval(viewerIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      persistState();
    }
  }, [state.isAuthenticated, state.currentUser, state.selectionMode, state.autoAssignment, state.plannedPrayer, state.sentPrayers]);

  const loadState = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        dispatch({
          type: 'INIT',
          payload: {
            isAuthenticated: parsed.isAuthenticated || false,
            currentUser: parsed.currentUser || null,
            selectionMode: parsed.selectionMode || 'manual',
            autoAssignment: parsed.autoAssignment || null,
            plannedPrayer: parsed.plannedPrayer || null,
            sentPrayers: parsed.sentPrayers || [],
          },
        });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Failed to load state:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const persistState = async () => {
    try {
      const toPersist = {
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        selectionMode: state.selectionMode,
        autoAssignment: state.autoAssignment,
        plannedPrayer: state.plannedPrayer,
        sentPrayers: state.sentPrayers,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
    } catch (error) {
      console.error('Failed to persist state:', error);
    }
  };

  const initViewerCounts = () => {
    const counts = generateViewerCounts();
    Object.entries(counts).forEach(([requestId, count]) => {
      dispatch({ type: 'UPDATE_VIEWER_COUNT', payload: { requestId, count } });
    });

    viewerIntervalRef.current = setInterval(() => {
      const requestIds = PRAYER_REQUESTS.map((r) => r.id);
      const randomId = requestIds[Math.floor(Math.random() * requestIds.length)];
      const currentCount = state.viewerCounts[randomId] || Math.floor(Math.random() * 18) + 1;
      const change = Math.random() > 0.5 ? 1 : -1;
      const newCount = Math.max(1, Math.min(30, currentCount + change));
      dispatch({ type: 'UPDATE_VIEWER_COUNT', payload: { requestId: randomId, count: newCount } });
    }, 4000);
  };

  const login = useCallback((user: User) => {
    dispatch({ type: 'LOGIN', payload: user });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const setSelectionMode = useCallback((mode: 'manual' | 'auto') => {
    dispatch({ type: 'SET_SELECTION_MODE', payload: mode });
  }, []);

  const assignAuto = useCallback(() => {
    const available = PRAYER_REQUESTS.filter(
      (r) => r.prayersSentCount <= 2 && !state.sentPrayers.some((s) => s.requestId === r.id)
    );
    if (available.length === 0) {
      dispatch({ type: 'SET_AUTO_ASSIGNMENT', payload: null });
      return;
    }
    const randomRequest = available[Math.floor(Math.random() * available.length)];
    const now = new Date();
    const expiresAt = new Date(now.getTime() + AUTO_ASSIGNMENT_HOURS * 60 * 60 * 1000);
    dispatch({
      type: 'SET_AUTO_ASSIGNMENT',
      payload: {
        requestId: randomRequest.id,
        assignedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      },
    });
  }, [state.sentPrayers]);

  const checkAutoExpiry = useCallback((): boolean => {
    if (!state.autoAssignment) return false;
    const now = new Date();
    const expiresAt = new Date(state.autoAssignment.expiresAt);
    if (now >= expiresAt) {
      dispatch({ type: 'SET_AUTO_ASSIGNMENT', payload: null });
      return true;
    }
    return false;
  }, [state.autoAssignment]);

  const getAutoRequest = useCallback((): PrayerRequest | null => {
    if (!state.autoAssignment) return null;
    return PRAYER_REQUESTS.find((r) => r.id === state.autoAssignment!.requestId) || null;
  }, [state.autoAssignment]);

  const setPlanPrayer = useCallback((requestId: string) => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + PLAN_PRAYER_HOURS * 60 * 60 * 1000);
    dispatch({
      type: 'SET_PLANNED_PRAYER',
      payload: {
        requestId,
        addedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      },
    });
  }, []);

  const clearPlanPrayer = useCallback(() => {
    dispatch({ type: 'SET_PLANNED_PRAYER', payload: null });
  }, []);

  const checkPlanExpiry = useCallback((): boolean => {
    if (!state.plannedPrayer) return false;
    const now = new Date();
    const expiresAt = new Date(state.plannedPrayer.expiresAt);
    if (now >= expiresAt) {
      dispatch({ type: 'SET_PLANNED_PRAYER', payload: null });
      return true;
    }
    return false;
  }, [state.plannedPrayer]);

  const getPlannedRequest = useCallback((): PrayerRequest | null => {
    if (!state.plannedPrayer) return null;
    return PRAYER_REQUESTS.find((r) => r.id === state.plannedPrayer!.requestId) || null;
  }, [state.plannedPrayer]);

  const submitPrayer = useCallback((requestId: string, prayerText: string) => {
    const request = PRAYER_REQUESTS.find((r) => r.id === requestId);
    if (!request) return;

    const sentPrayer: SentPrayer = {
      id: `sent_${Date.now()}`,
      requestId,
      requestSnapshot: { ...request },
      prayerText,
      sentAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_SENT_PRAYER', payload: sentPrayer });

    if (state.plannedPrayer?.requestId === requestId) {
      dispatch({ type: 'SET_PLANNED_PRAYER', payload: null });
    }
    if (state.autoAssignment?.requestId === requestId) {
      dispatch({ type: 'SET_AUTO_ASSIGNMENT', payload: null });
    }
  }, [state.plannedPrayer, state.autoAssignment]);

  const hasSentPrayer = useCallback((requestId: string): boolean => {
    return state.sentPrayers.some((s) => s.requestId === requestId);
  }, [state.sentPrayers]);

  const showToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast_${Date.now()}`;
    dispatch({ type: 'ADD_TOAST', payload: { id, type, message } });
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, 3500);
  }, []);

  const getViewerCount = useCallback((requestId: string): number => {
    return state.viewerCounts[requestId] || Math.floor(Math.random() * 18) + 1;
  }, [state.viewerCounts]);

  const getAvailableRequests = useCallback((): PrayerRequest[] => {
    return PRAYER_REQUESTS.filter((r) => !state.sentPrayers.some((s) => s.requestId === r.id));
  }, [state.sentPrayers]);

  const getRequestById = useCallback((id: string): PrayerRequest | undefined => {
    return PRAYER_REQUESTS.find((r) => r.id === id);
  }, []);

  const value: AppContextType = {
    state,
    login,
    logout,
    setSelectionMode,
    assignAuto,
    checkAutoExpiry,
    getAutoRequest,
    setPlanPrayer,
    clearPlanPrayer,
    checkPlanExpiry,
    getPlannedRequest,
    submitPrayer,
    hasSentPrayer,
    showToast,
    getViewerCount,
    getAvailableRequests,
    getRequestById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
