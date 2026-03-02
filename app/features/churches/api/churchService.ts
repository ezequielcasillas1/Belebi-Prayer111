import { supabase } from '../../../lib/supabase';
import { Church, ChurchPrayer, ChurchWithMemberCount, ChurchPrayerWithAuthor } from '../../../types/database';

export const churchService = {
  async getUserChurches(userId: string): Promise<ChurchWithMemberCount[]> {
    const { data: memberships, error: memberError } = await supabase
      .from('church_members')
      .select('church_id')
      .eq('user_id', userId);

    if (memberError) throw memberError;
    if (!memberships || memberships.length === 0) return [];

    const churchIds = memberships.map(m => m.church_id);

    const { data: churches, error: churchError } = await supabase
      .from('churches')
      .select('*')
      .in('id', churchIds);

    if (churchError) throw churchError;

    const churchesWithCounts = await Promise.all(
      (churches || []).map(async (church) => {
        const { count } = await supabase
          .from('church_members')
          .select('*', { count: 'exact', head: true })
          .eq('church_id', church.id);

        return {
          ...church,
          member_count: count || 0,
        };
      })
    );

    return churchesWithCounts;
  },

  async getChurchById(churchId: string): Promise<ChurchWithMemberCount | null> {
    const { data: church, error } = await supabase
      .from('churches')
      .select('*')
      .eq('id', churchId)
      .single();

    if (error) throw error;
    if (!church) return null;

    const { count } = await supabase
      .from('church_members')
      .select('*', { count: 'exact', head: true })
      .eq('church_id', churchId);

    return {
      ...church,
      member_count: count || 0,
    };
  },

  async createChurch(name: string, denomination: string, creatorId: string): Promise<Church> {
    const { data, error } = await supabase
      .from('churches')
      .insert({
        name,
        denomination,
        creator_id: creatorId,
        invite_code: '',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async joinChurchByCode(inviteCode: string, userId: string): Promise<Church> {
    const { data: church, error: findError } = await supabase
      .from('churches')
      .select('*')
      .eq('invite_code', inviteCode.toUpperCase())
      .single();

    if (findError || !church) {
      throw new Error('Invalid invite code');
    }

    const { data: existing } = await supabase
      .from('church_members')
      .select('id')
      .eq('church_id', church.id)
      .eq('user_id', userId)
      .single();

    if (existing) {
      throw new Error('You are already a member of this church');
    }

    const { error: joinError } = await supabase
      .from('church_members')
      .insert({
        church_id: church.id,
        user_id: userId,
      });

    if (joinError) throw joinError;
    return church;
  },

  async leaveChurch(churchId: string, userId: string): Promise<void> {
    const { data: church } = await supabase
      .from('churches')
      .select('creator_id')
      .eq('id', churchId)
      .single();

    if (church?.creator_id === userId) {
      throw new Error('Church creators cannot leave their church. Delete the church instead.');
    }

    const { error } = await supabase
      .from('church_members')
      .delete()
      .eq('church_id', churchId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async deleteChurch(churchId: string, userId: string): Promise<void> {
    const { data: church } = await supabase
      .from('churches')
      .select('creator_id')
      .eq('id', churchId)
      .single();

    if (church?.creator_id !== userId) {
      throw new Error('Only the church creator can delete the church');
    }

    const { error } = await supabase
      .from('churches')
      .delete()
      .eq('id', churchId);

    if (error) throw error;
  },

  async removeMember(churchId: string, memberId: string, creatorId: string): Promise<void> {
    const { data: church } = await supabase
      .from('churches')
      .select('creator_id')
      .eq('id', churchId)
      .single();

    if (church?.creator_id !== creatorId) {
      throw new Error('Only the church creator can remove members');
    }

    if (memberId === creatorId) {
      throw new Error('Cannot remove yourself as the church creator');
    }

    const { error } = await supabase
      .from('church_members')
      .delete()
      .eq('church_id', churchId)
      .eq('user_id', memberId);

    if (error) throw error;
  },

  async getChurchMembers(churchId: string): Promise<Array<{ user_id: string; joined_at: string; profile: { first_name: string; country: string; flag: string } }>> {
    const { data, error } = await supabase
      .from('church_members')
      .select(`
        user_id,
        joined_at,
        profiles:user_id (
          first_name,
          country,
          flag
        )
      `)
      .eq('church_id', churchId);

    if (error) throw error;
    return (data || []).map(member => ({
      user_id: member.user_id,
      joined_at: member.joined_at,
      profile: member.profiles as any,
    }));
  },
};

export const churchPrayerService = {
  async getChurchPrayers(churchId: string): Promise<ChurchPrayerWithAuthor[]> {
    const { data, error } = await supabase
      .from('church_prayers')
      .select(`
        *,
        profiles:author_id (
          first_name,
          country,
          flag
        )
      `)
      .eq('church_id', churchId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const prayersWithCounts = await Promise.all(
      (data || []).map(async (prayer) => {
        const { count } = await supabase
          .from('prayer_responses')
          .select('*', { count: 'exact', head: true })
          .eq('prayer_id', prayer.id);

        return {
          ...prayer,
          author: prayer.profiles as any,
          responses_count: count || 0,
        };
      })
    );

    return prayersWithCounts;
  },

  async createPrayer(churchId: string, authorId: string, requestText: string, expiresAt?: string): Promise<ChurchPrayer> {
    const { data, error } = await supabase
      .from('church_prayers')
      .insert({
        church_id: churchId,
        author_id: authorId,
        request_text: requestText,
        expires_at: expiresAt || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async respondToPrayer(prayerId: string, authorId: string, prayerText: string): Promise<void> {
    const { error } = await supabase
      .from('prayer_responses')
      .insert({
        prayer_id: prayerId,
        author_id: authorId,
        prayer_text: prayerText,
      });

    if (error) throw error;
  },

  async getPrayerResponses(prayerId: string): Promise<Array<{ id: string; prayer_text: string; sent_at: string; author: { first_name: string; flag: string } }>> {
    const { data, error } = await supabase
      .from('prayer_responses')
      .select(`
        id,
        prayer_text,
        sent_at,
        profiles:author_id (
          first_name,
          flag
        )
      `)
      .eq('prayer_id', prayerId)
      .order('sent_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(response => ({
      id: response.id,
      prayer_text: response.prayer_text,
      sent_at: response.sent_at,
      author: response.profiles as any,
    }));
  },

  async deletePrayer(prayerId: string, authorId: string): Promise<void> {
    const { error } = await supabase
      .from('church_prayers')
      .delete()
      .eq('id', prayerId)
      .eq('author_id', authorId);

    if (error) throw error;
  },
};
