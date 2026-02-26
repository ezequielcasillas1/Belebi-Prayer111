// app/context/AppContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrayerRequest, PRAYER_REQUESTS } from '../data/mockData';

export interface User {
  id: string;
  firstName: string;
  country: string;
  countryCode: string;
  flag: string;
  denomination: string;
  email: string;
}

export interface AutoAssignment {
  requestId: string;
  assignedAt: number;
  expiresAt: number;
}

export interface PlannedPrayer {
  requestId: string;
  addedAt: number;
  expiresAt: number;
}

export interface SentPrayer {
  id: string;
  requestId: string;
  prayerText: string;
  submittedAt: number;
  requestSnapshot: {
    name: string;
    country: string;
    flag: string;
    requestText: string;
  };
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppState {
  isAuthenticated: boolean;
  currentUser: User | null;
  selectionMode: 'manual' | 'auto';
  autoAssignment: AutoAssignment | null;
  plannedPrayer: PlannedPrayer | null;
  sentPrayers: SentPrayer[];
  toasts: Toast[];
  viewerCounts: Record<string, number>;
}

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_SELECTION_MODE'; payload: 'manual' | 'auto' }
  | { type: 'SET_AUTO_ASSIGNMENT'; payload: AutoAssignment | null }
  | { type: 'SET_PLANNED_PRAYER'; payload: PlannedPrayer | null }
  | { type: 'ADD_SENT_PRAYER'; payload: SentPrayer }
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'UPDATE_VIEWER_COUNT'; payload: { requestId: string; count: number } }
  | { type: 'HYDRATE'; payload: Partial<AppState> };

const STORAGE_KEY = 'belebi_app_state';

// AsyncStorage for React Native (replaces localStorage)
async function loadState(): Promise<Partial<AppState>> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {};
}

async function saveState(state: AppState) {
  try {
    const { toasts: _, viewerCounts: __, ...toSave } = state;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {}
}

function generateViewerCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  PRAYER_REQUESTS.forEach(req => {
    counts[req.id] = Math.floor(Math.random() * 18) + 1;
  });
  return counts;
}

function buildInitialState(): AppState {
  return {
    isAuthenticated: false,
    currentUser: null,
    selectionMode: 'manual',
    autoAssignment: null,
    plannedPrayer: null,
    sentPrayers: [],
    toasts: [],
    viewerCounts: generateViewerCounts(),
  };
}

const initialState: AppState = buildInitialState();

const CLEAN_STATE: Omit<AppState, 'viewerCounts'> = {
  isAuthenticated: false,
  currentUser: null,
  selectionMode: 'manual',
  autoAssignment: null,
  plannedPrayer: null,
  sentPrayers: [],
  toasts: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload };
    case 'LOGIN':
      return { ...state, isAuthenticated: true, currentUser: action.payload };
    case 'LOGOUT':
      return { ...CLEAN_STATE, viewerCounts: state.viewerCounts };
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
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    case 'UPDATE_VIEWER_COUNT':
      return {
        ...state,
        viewerCounts: { ...state.viewerCounts, [action.payload.requestId]: action.payload.count },
      };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (user: User) => void;
  logout: () => void;
  setSelectionMode: (mode: 'manual' | 'auto') => void;
  assignAuto: () => PrayerRequest | null;
  checkAutoExpiry: () => boolean;
  setPlanPrayer: (requestId: string) => boolean;
  clearPlanPrayer: () => void;
  checkPlanExpiry: () => boolean;
  submitPrayer: (requestId: string, prayerText: string) => void;
  hasSentPrayer: (requestId: string) => boolean;
  showToast: (type: Toast['type'], message: string) => void;
  getViewerCount: (requestId: string) => number;
  getAvailableRequests: () => PrayerRequest[];
  getAutoRequest: () => PrayerRequest | null;
  getPlannedRequest: () => PrayerRequest | null;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, buildInitialState());

  // Load persisted state on mount
  useEffect(() => {
    loadState().then(stored => {
      if (Object.keys(stored).length > 0) {
        dispatch({ type: 'HYDRATE', payload: stored });
      }
    });
  }, []);

  // Save state on changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Viewer count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      const requests = PRAYER_REQUESTS;
      if (requests.length > 0) {
        const randomRequest = requests[Math.floor(Math.random() * requests.length)];
        const current = state.viewerCounts[randomRequest.id] || 5;
        const delta = Math.random() > 0.5 ? 1 : -1;
        const newCount = Math.max(1, Math.min(30, current + delta));
        dispatch({
          type: 'UPDATE_VIEWER_COUNT',
          payload: { requestId: randomRequest.id, count: newCount },
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [state.viewerCounts]);

  const login = (user: User) => dispatch({ type: 'LOGIN', payload: user });
  const logout = () => dispatch({ type: 'LOGOUT' });
  const setSelectionMode = (mode: 'manual' | 'auto') =>
    dispatch({ type: 'SET_SELECTION_MODE', payload: mode });

  const hasSentPrayer = (requestId: string) =>
    state.sentPrayers.some(sp => sp.requestId === requestId);

  const getAvailableRequests = (): PrayerRequest[] => {
    return PRAYER_REQUESTS.filter(req => !hasSentPrayer(req.id));
  };

  const assignAuto = (): PrayerRequest | null => {
    const available = getAvailableRequests().filter(req => req.prayersSentCount <= 2);
    if (available.length === 0) return null;
    const selected = available[Math.floor(Math.random() * available.length)];
    const now = Date.now();
    dispatch({
      type: 'SET_AUTO_ASSIGNMENT',
      payload: {
        requestId: selected.id,
        assignedAt: now,
        expiresAt: now + 12 * 60 * 60 * 1000,
      },
    });
    return selected;
  };

  const checkAutoExpiry = (): boolean => {
    if (!state.autoAssignment) return true;
    if (Date.now() > state.autoAssignment.expiresAt) {
      dispatch({ type: 'SET_AUTO_ASSIGNMENT', payload: null });
      return true;
    }
    return false;
  };

  const getAutoRequest = (): PrayerRequest | null => {
    if (!state.autoAssignment) return null;
    if (Date.now() > state.autoAssignment.expiresAt) return null;
    if (hasSentPrayer(state.autoAssignment.requestId)) return null;
    return PRAYER_REQUESTS.find(r => r.id === state.autoAssignment!.requestId) || null;
  };

  const setPlanPrayer = (requestId: string): boolean => {
    const now = Date.now();
    dispatch({
      type: 'SET_PLANNED_PRAYER',
      payload: {
        requestId,
        addedAt: now,
        expiresAt: now + 24 * 60 * 60 * 1000,
      },
    });
    return true;
  };

  const clearPlanPrayer = () => dispatch({ type: 'SET_PLANNED_PRAYER', payload: null });

  const checkPlanExpiry = (): boolean => {
    if (!state.plannedPrayer) return true;
    if (Date.now() > state.plannedPrayer.expiresAt) {
      dispatch({ type: 'SET_PLANNED_PRAYER', payload: null });
      return true;
    }
    return false;
  };

  const getPlannedRequest = (): PrayerRequest | null => {
    if (!state.plannedPrayer) return null;
    if (Date.now() > state.plannedPrayer.expiresAt) return null;
    if (hasSentPrayer(state.plannedPrayer.requestId)) return null;
    return PRAYER_REQUESTS.find(r => r.id === state.plannedPrayer!.requestId) || null;
  };

  const submitPrayer = (requestId: string, prayerText: string) => {
    const request = PRAYER_REQUESTS.find(r => r.id === requestId);
    if (!request) return;
    const sentPrayer: SentPrayer = {
      id: `sent-${Date.now()}`,
      requestId,
      prayerText,
      submittedAt: Date.now(),
      requestSnapshot: {
        name: request.name,
        country: request.country,
        flag: request.flag,
        requestText: request.requestText,
      },
    };
    dispatch({ type: 'ADD_SENT_PRAYER', payload: sentPrayer });
    if (state.plannedPrayer?.requestId === requestId) {
      dispatch({ type: 'SET_PLANNED_PRAYER', payload: null });
    }
    if (state.autoAssignment?.requestId === requestId) {
      dispatch({ type: 'SET_AUTO_ASSIGNMENT', payload: null });
    }
  };

  const showToast = (type: Toast['type'], message: string) => {
    const id = `toast-${Date.now()}`;
    dispatch({ type: 'ADD_TOAST', payload: { id, type, message } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 3500);
  };

  const getViewerCount = (requestId: string) => state.viewerCounts[requestId] || 5;

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        login,
        logout,
        setSelectionMode,
        assignAuto,
        checkAutoExpiry,
        setPlanPrayer,
        clearPlanPrayer,
        checkPlanExpiry,
        submitPrayer,
        hasSentPrayer,
        showToast,
        getViewerCount,
        getAvailableRequests,
        getAutoRequest,
        getPlannedRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
📄 app/navigation/RootNavigator.tsx (React Navigation Setup)
// app/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useApp } from '../context/AppContext';

// Import all screens
import WelcomeScreen from '../screens/WelcomeScreen';
import SetupScreen from '../screens/SetupScreen';
import VerifyScreen from '../screens/VerifyScreen';
import HomeScreen from '../screens/HomeScreen';
import DirectoryScreen from '../screens/DirectoryScreen';
import PrayForNationScreen from '../screens/PrayForNationScreen';
import AutoModeScreen from '../screens/AutoModeScreen';
import PrayerProfileScreen from '../screens/PrayerProfileScreen';
import CountryDetailScreen from '../screens/CountryDetailScreen';
import LivePrayerRoomScreen from '../screens/LivePrayerRoomScreen';
import PlanPrayerScreen from '../screens/PlanPrayerScreen';
import PrayerListScreen from '../screens/PrayerListScreen';
import PrayersSentScreen from '../screens/PrayersSentScreen';
import CreateRequestScreen from '../screens/CreateRequestScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HelpSafetyScreen from '../screens/HelpSafetyScreen';
import DrawerNav from '../components/DrawerNav';

export type RootStackParamList = {
  Welcome: undefined;
  Setup: undefined;
  Verify: undefined;
  Main: undefined;
  PrayerProfile: { requestId: string };
  CountryDetail: { countryCode: string };
  LivePrayerRoom: { countryCode: string };
  CreateRequest: undefined;
};

export type MainDrawerParamList = {
  Home: undefined;
  Directory: undefined;
  PrayForNation: undefined;
  AutoMode: undefined;
  PlanPrayer: undefined;
  PrayerList: undefined;
  PrayersSent: undefined;
  Settings: undefined;
  HelpSafety: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<MainDrawerParamList>();

function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerNav {...props} />}
      screenOptions={{ headerShown: false, drawerType: 'slide' }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Directory" component={DirectoryScreen} />
      <Drawer.Screen name="PrayForNation" component={PrayForNationScreen} />
      <Drawer.Screen name="AutoMode" component={AutoModeScreen} />
      <Drawer.Screen name="PlanPrayer" component={PlanPrayerScreen} />
      <Drawer.Screen name="PrayerList" component={PrayerListScreen} />
      <Drawer.Screen name="PrayersSent" component={PrayersSentScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="HelpSafety" component={HelpSafetyScreen} />
    </Drawer.Navigator>
  );
}

export default function RootNavigator() {
  const { state } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!state.isAuthenticated ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Setup" component={SetupScreen} />
            <Stack.Screen name="Verify" component={VerifyScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainDrawer} />
            <Stack.Screen name="PrayerProfile" component={PrayerProfileScreen} />
            <Stack.Screen name="CountryDetail" component={CountryDetailScreen} />
            <Stack.Screen name="LivePrayerRoom" component={LivePrayerRoomScreen} />
            <Stack.Screen name="CreateRequest" component={CreateRequestScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}