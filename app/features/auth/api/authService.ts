import { supabase } from '../../../lib/supabase';
import { Profile } from '../../../types/database';

export const authService = {
  async signUp(
    email: string,
    password: string,
    userData: {
      firstName: string;
      country: string;
      countryCode: string;
      flag: string;
      denomination: string;
    }
  ): Promise<{ user: any; profile: Profile | null }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          country: userData.country,
          country_code: userData.countryCode,
          flag: userData.flag,
          denomination: userData.denomination,
        },
      },
    });

    if (error) throw error;

    let profile: Profile | null = null;
    if (data.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      profile = profileData;
    }

    return { user: data.user, profile };
  },

  async signIn(email: string, password: string): Promise<{ user: any; profile: Profile | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    let profile: Profile | null = null;
    if (data.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      profile = profileData;
    }

    return { user: data.user, profile };
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
