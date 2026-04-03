import { supabase } from '../../../lib/supabase';
import { AnsweredPrayer, UserMilestone, MilestoneKey, PublicTestimony } from '../../../types/database';

export interface ProfileStats {
  totalPrayersSent: number;
  uniquePeopleCount: number;
  nationsCount: number;
  churchesJoined: number;
  churchPrayersPosted: number;
  answeredPrayersCount: number;
  currentStreak: number;
  longestStreak: number;
  thisWeekCount: number;
  thisMonthCount: number;
}

export interface PrayerActivity {
  date: string;
  count: number;
}

export const profileService = {
  async getProfileStats(userId: string): Promise<ProfileStats> {
    const [
      sentPrayersResult,
      churchMembersResult,
      churchPrayersResult,
      answeredPrayersResult,
    ] = await Promise.all([
      supabase
        .from('sent_prayers')
        .select('id, sent_at, prayer_request_id')
        .eq('sender_id', userId),
      supabase
        .from('church_members')
        .select('id')
        .eq('user_id', userId),
      supabase
        .from('church_prayers')
        .select('id')
        .eq('author_id', userId),
      supabase
        .from('answered_prayers')
        .select('id')
        .eq('user_id', userId),
    ]);

    const sentPrayers = sentPrayersResult.data || [];
    const totalPrayersSent = sentPrayers.length;
    const uniquePeopleCount = new Set(sentPrayers.map(p => p.prayer_request_id)).size;
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const thisWeekCount = sentPrayers.filter(
      p => new Date(p.sent_at) >= weekAgo
    ).length;
    
    const thisMonthCount = sentPrayers.filter(
      p => new Date(p.sent_at) >= monthAgo
    ).length;

    const { currentStreak, longestStreak } = calculateStreaks(
      sentPrayers.map(p => p.sent_at)
    );

    const nationsResult = await supabase
      .from('sent_prayers')
      .select('prayer_request_id, prayer_requests!inner(requester_id, profiles!inner(country_code))')
      .eq('sender_id', userId);
    
    const countryCodes = new Set<string>();
    (nationsResult.data || []).forEach((item: any) => {
      if (item.prayer_requests?.profiles?.country_code) {
        countryCodes.add(item.prayer_requests.profiles.country_code);
      }
    });

    return {
      totalPrayersSent,
      uniquePeopleCount,
      nationsCount: countryCodes.size,
      churchesJoined: (churchMembersResult.data || []).length,
      churchPrayersPosted: (churchPrayersResult.data || []).length,
      answeredPrayersCount: (answeredPrayersResult.data || []).length,
      currentStreak,
      longestStreak,
      thisWeekCount,
      thisMonthCount,
    };
  },

  async getMilestones(userId: string): Promise<UserMilestone[]> {
    const { data, error } = await supabase
      .from('user_milestones')
      .select('*')
      .eq('user_id', userId)
      .order('achieved_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async checkAndAwardMilestones(userId: string, stats: ProfileStats): Promise<MilestoneKey[]> {
    const newMilestones: MilestoneKey[] = [];
    const existingMilestones = await this.getMilestones(userId);
    const existingKeys = new Set(existingMilestones.map(m => m.milestone_key));

    const milestoneChecks: { key: MilestoneKey; condition: boolean }[] = [
      { key: 'faithful_intercessor', condition: stats.totalPrayersSent >= 10 },
      { key: 'steadfast_in_prayer', condition: stats.currentStreak >= 7 },
      { key: 'nations_advocate', condition: stats.nationsCount >= 10 },
      { key: 'church_pillar', condition: stats.churchesJoined >= 3 },
      { key: 'prayer_warrior', condition: stats.totalPrayersSent >= 50 },
      { key: 'intercessor_100', condition: stats.totalPrayersSent >= 100 },
      { key: 'daily_devoted', condition: stats.longestStreak >= 30 },
    ];

    for (const check of milestoneChecks) {
      if (check.condition && !existingKeys.has(check.key)) {
        const { error } = await supabase
          .from('user_milestones')
          .insert({ user_id: userId, milestone_key: check.key });
        
        if (!error) {
          newMilestones.push(check.key);
        }
      }
    }

    return newMilestones;
  },

  async getAnsweredPrayers(userId: string): Promise<AnsweredPrayer[]> {
    const { data, error } = await supabase
      .from('answered_prayers')
      .select('*')
      .eq('user_id', userId)
      .order('answered_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addAnsweredPrayer(
    userId: string,
    testimonyText: string,
    prayerRequestId?: string,
    isPublic: boolean = false
  ): Promise<AnsweredPrayer> {
    const { data, error } = await supabase
      .from('answered_prayers')
      .insert({
        user_id: userId,
        prayer_request_id: prayerRequestId || null,
        testimony_text: testimonyText,
        is_public: isPublic,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAnsweredPrayer(
    id: string,
    updates: Partial<Pick<AnsweredPrayer, 'testimony_text' | 'is_public'>>
  ): Promise<AnsweredPrayer> {
    const { data, error } = await supabase
      .from('answered_prayers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAnsweredPrayer(id: string): Promise<void> {
    const { error } = await supabase
      .from('answered_prayers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getPrayerActivity(userId: string, days: number = 30): Promise<PrayerActivity[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('sent_prayers')
      .select('sent_at')
      .eq('sender_id', userId)
      .gte('sent_at', startDate.toISOString());

    if (error) throw error;

    const activityMap = new Map<string, number>();
    (data || []).forEach(prayer => {
      const date = prayer.sent_at.split('T')[0];
      activityMap.set(date, (activityMap.get(date) || 0) + 1);
    });

    return Array.from(activityMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },

  async getPublicTestimonies(year: number, month: number): Promise<PublicTestimony[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const { data, error } = await supabase
      .from('answered_prayers')
      .select(`
        *,
        profiles!answered_prayers_user_id_fkey (
          first_name,
          flag
        )
      `)
      .eq('is_public', true)
      .gte('answered_at', startDate.toISOString())
      .lte('answered_at', endDate.toISOString())
      .order('answered_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((item: any) => ({
      id: item.id,
      user_id: item.user_id,
      prayer_request_id: item.prayer_request_id,
      testimony_text: item.testimony_text,
      is_public: item.is_public,
      answered_at: item.answered_at,
      created_at: item.created_at,
      author: {
        first_name: item.profiles?.first_name || 'Anonymous',
        flag: item.profiles?.flag || '🌍',
      },
    }));
  },

  async getAvailableTestimonyYears(): Promise<number[]> {
    const startYear = 2026;
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let y = startYear; y <= currentYear; y++) {
      years.push(y);
    }
    return years;
  },
};

function calculateStreaks(dates: string[]): { currentStreak: number; longestStreak: number } {
  if (dates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const uniqueDates = [...new Set(dates.map(d => d.split('T')[0]))].sort().reverse();
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const allDates = [...new Set(dates.map(d => d.split('T')[0]))].sort();
  
  for (let i = 0; i < allDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(allDates[i - 1]);
      const currDate = new Date(allDates[i]);
      const diffDays = (currDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000);
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    
    if (allDates[i] === today || allDates[i] === yesterday) {
      currentStreak = tempStreak;
    }
  }

  if (!uniqueDates.includes(today) && !uniqueDates.includes(yesterday)) {
    currentStreak = 0;
  }

  return { currentStreak, longestStreak };
}
