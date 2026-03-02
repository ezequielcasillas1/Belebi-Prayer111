import { Profile } from '../../../types/database';

export interface User {
  id: string;
  firstName: string;
  country: string;
  countryCode: string;
  flag: string;
  denomination: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  supabaseProfile: Profile | null;
  isLoading: boolean;
}

export interface AuthActions {
  login: (user: User) => void;
  logout: () => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => void;
}

export type AuthStore = AuthState & AuthActions;
