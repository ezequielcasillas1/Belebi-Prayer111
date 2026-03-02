/**
 * Prayer API Service
 * Supabase API calls for global prayer requests
 */

import { supabase } from '../../../lib/supabase';
import { PrayerRequest, SentPrayer } from '../types';

export interface PrayerRequestRow {
  id: string;
  requester_id: string;
  request_text: string;
  description: string | null;
  profile_images: string[];
  emergency_images: string[];
  auto_dismiss_time: '1month' | '6months' | '1year';
  prayers_sent_count: number;
  detected_language: string;
  is_active: boolean;
  created_at: string;
  expires_at: string;
  profiles: {
    id: string;
    first_name: string;
    country: string;
    country_code: string;
    flag: string;
    denomination: string;
  };
}

export interface SentPrayerRow {
  id: string;
  prayer_request_id: string;
  sender_id: string;
  prayer_text: string;
  sent_at: string;
  prayer_requests: PrayerRequestRow;
}

function mapRowToPrayerRequest(row: PrayerRequestRow): PrayerRequest {
  return {
    id: row.id,
    name: row.profiles.first_name,
    letter: row.profiles.first_name.charAt(0).toUpperCase(),
    country: row.profiles.country,
    countryCode: row.profiles.country_code,
    flag: row.profiles.flag,
    denomination: row.profiles.denomination,
    requestText: row.request_text,
    description: row.description || '',
    profileImages: row.profile_images || [],
    emergencyImages: row.emergency_images || [],
    prayersSentCount: row.prayers_sent_count,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    autoDismissTime: row.auto_dismiss_time,
    requesterId: row.requester_id,
  };
}

export const prayerApi = {
  async fetchPrayerRequests(options?: {
    countryCode?: string;
    letter?: string;
    excludeSentByUser?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: PrayerRequest[]; count: number }> {
    let query = supabase
      .from('prayer_requests')
      .select(`
        *,
        profiles!requester_id (
          id, first_name, country, country_code, flag, denomination
        )
      `, { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (options?.countryCode) {
      query = query.eq('profiles.country_code', options.countryCode);
    }

    if (options?.letter) {
      query = query.ilike('profiles.first_name', `${options.letter}%`);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options?.limit || 20) - 1);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    let requests = (data as PrayerRequestRow[]).map(mapRowToPrayerRequest);

    if (options?.excludeSentByUser) {
      const { data: sentPrayers } = await supabase
        .from('sent_prayers')
        .select('prayer_request_id')
        .eq('sender_id', options.excludeSentByUser);

      if (sentPrayers) {
        const sentIds = new Set(sentPrayers.map(p => p.prayer_request_id));
        requests = requests.filter(r => !sentIds.has(r.id));
      }
    }

    return { data: requests, count: count || 0 };
  },

  async fetchPrayerRequestById(id: string): Promise<PrayerRequest | null> {
    const { data, error } = await supabase
      .from('prayer_requests')
      .select(`
        *,
        profiles!requester_id (
          id, first_name, country, country_code, flag, denomination
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return mapRowToPrayerRequest(data as PrayerRequestRow);
  },

  async createPrayerRequest(request: {
    requestText: string;
    description?: string;
    profileImages?: string[];
    emergencyImages?: string[];
    autoDismissTime?: '1month' | '6months' | '1year';
  }): Promise<PrayerRequest> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('prayer_requests')
      .insert({
        requester_id: user.id,
        request_text: request.requestText,
        description: request.description,
        profile_images: request.profileImages || [],
        emergency_images: request.emergencyImages || [],
        auto_dismiss_time: request.autoDismissTime || '1month',
      })
      .select(`
        *,
        profiles!requester_id (
          id, first_name, country, country_code, flag, denomination
        )
      `)
      .single();

    if (error) throw error;
    return mapRowToPrayerRequest(data as PrayerRequestRow);
  },

  async dismissPrayerRequest(id: string): Promise<void> {
    const { error } = await supabase
      .from('prayer_requests')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
  },

  async sendPrayer(prayerRequestId: string, prayerText: string): Promise<SentPrayer> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('sent_prayers')
      .insert({
        prayer_request_id: prayerRequestId,
        sender_id: user.id,
        prayer_text: prayerText,
      })
      .select(`
        *,
        prayer_requests (
          *,
          profiles!requester_id (
            id, first_name, country, country_code, flag, denomination
          )
        )
      `)
      .single();

    if (error) throw error;

    const row = data as SentPrayerRow;
    return {
      id: row.id,
      requestId: row.prayer_request_id,
      requestSnapshot: mapRowToPrayerRequest(row.prayer_requests),
      prayerText: row.prayer_text,
      sentAt: row.sent_at,
    };
  },

  async fetchSentPrayers(userId: string): Promise<SentPrayer[]> {
    const { data, error } = await supabase
      .from('sent_prayers')
      .select(`
        *,
        prayer_requests (
          *,
          profiles!requester_id (
            id, first_name, country, country_code, flag, denomination
          )
        )
      `)
      .eq('sender_id', userId)
      .order('sent_at', { ascending: false });

    if (error) throw error;

    return (data as SentPrayerRow[]).map(row => ({
      id: row.id,
      requestId: row.prayer_request_id,
      requestSnapshot: mapRowToPrayerRequest(row.prayer_requests),
      prayerText: row.prayer_text,
      sentAt: row.sent_at,
    }));
  },

  async hasSentPrayer(userId: string, prayerRequestId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('sent_prayers')
      .select('id')
      .eq('sender_id', userId)
      .eq('prayer_request_id', prayerRequestId)
      .maybeSingle();

    if (error) throw error;
    return data !== null;
  },

  async getAutoAssignment(userId: string): Promise<{ requestId: string; expiresAt: string } | null> {
    const { data, error } = await supabase
      .from('auto_assignments')
      .select('prayer_request_id, expires_at')
      .eq('user_id', userId)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      requestId: data.prayer_request_id,
      expiresAt: data.expires_at,
    };
  },

  async createAutoAssignment(userId: string): Promise<PrayerRequest | null> {
    const existingAssignment = await this.getAutoAssignment(userId);
    if (existingAssignment) {
      return this.fetchPrayerRequestById(existingAssignment.requestId);
    }

    const { data: availableRequests, error: fetchError } = await supabase
      .from('prayer_requests')
      .select('id')
      .eq('is_active', true)
      .lt('prayers_sent_count', 3)
      .neq('requester_id', userId)
      .order('prayers_sent_count', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(10);

    if (fetchError) throw fetchError;
    if (!availableRequests || availableRequests.length === 0) return null;

    const randomRequest = availableRequests[Math.floor(Math.random() * availableRequests.length)];
    const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();

    const { error: insertError } = await supabase
      .from('auto_assignments')
      .upsert({
        user_id: userId,
        prayer_request_id: randomRequest.id,
        expires_at: expiresAt,
      }, { onConflict: 'user_id' });

    if (insertError) throw insertError;

    return this.fetchPrayerRequestById(randomRequest.id);
  },

  async clearAutoAssignment(userId: string): Promise<void> {
    const { error } = await supabase
      .from('auto_assignments')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  },

  async getPlannedPrayer(userId: string): Promise<{ requestId: string; expiresAt: string } | null> {
    const { data, error } = await supabase
      .from('planned_prayers')
      .select('prayer_request_id, expires_at')
      .eq('user_id', userId)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      requestId: data.prayer_request_id,
      expiresAt: data.expires_at,
    };
  },

  async setPlanPrayer(userId: string, prayerRequestId: string): Promise<void> {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from('planned_prayers')
      .upsert({
        user_id: userId,
        prayer_request_id: prayerRequestId,
        expires_at: expiresAt,
      }, { onConflict: 'user_id' });

    if (error) throw error;
  },

  async clearPlannedPrayer(userId: string): Promise<void> {
    const { error } = await supabase
      .from('planned_prayers')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  },

  async fetchCountryStats(): Promise<Array<{ countryCode: string; activeRequests: number }>> {
    const { data, error } = await supabase
      .from('country_prayer_stats')
      .select('country_code, active_requests')
      .gt('active_requests', 0)
      .order('active_requests', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => ({
      countryCode: row.country_code,
      activeRequests: row.active_requests,
    }));
  },
};
