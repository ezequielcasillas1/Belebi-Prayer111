import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { 
  MapPin, Calendar, Award, Flame, Globe, Church, Heart, 
  ChevronRight, Pencil, Users, Send
} from 'lucide-react-native';
import { format } from 'date-fns';
import AppHeader from '../../../components/AppHeader';
import Badge from '../../../components/Badge';
import { useAuthStore } from '../../auth/stores/authStore';
import { useCurrentProfile } from '../../auth/hooks/useProfileQueries';
import { 
  useProfileStats, 
  useMilestones, 
  useCheckMilestones
} from '../hooks/useProfileStats';
import { MilestoneKey } from '../../../types/database';
import { colors } from '../../../theme/colors';

const MILESTONE_INFO: Record<MilestoneKey, { title: string; description: string; icon: string }> = {
  faithful_intercessor: { 
    title: 'Faithful Intercessor', 
    description: 'Sent 10 prayers', 
    icon: '🙏' 
  },
  steadfast_in_prayer: { 
    title: 'Steadfast in Prayer', 
    description: '7-day prayer streak (Col 4:2)', 
    icon: '📿' 
  },
  nations_advocate: { 
    title: 'Nations Advocate', 
    description: 'Prayed for 10+ countries', 
    icon: '🌍' 
  },
  church_pillar: { 
    title: 'Church Pillar', 
    description: 'Active in 3+ church groups', 
    icon: '⛪' 
  },
  emergency_responder: { 
    title: 'Emergency Responder', 
    description: 'Answered emergency prayers', 
    icon: '🚨' 
  },
  prayer_warrior: { 
    title: 'Prayer Warrior', 
    description: 'Sent 50 prayers', 
    icon: '⚔️' 
  },
  intercessor_100: { 
    title: 'Intercessor 100', 
    description: 'Sent 100 prayers', 
    icon: '💯' 
  },
  daily_devoted: { 
    title: 'Daily Devoted', 
    description: '30-day prayer streak', 
    icon: '🔥' 
  },
};

export default function ProfileScreen() {
  const navigation = useNavigation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const { data: stats, isLoading: statsLoading } = useProfileStats();
  const { data: milestones, isLoading: milestonesLoading } = useMilestones();
  const { mutate: checkMilestones } = useCheckMilestones();

  useEffect(() => {
    if (stats) {
      checkMilestones(stats);
    }
  }, [stats]);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const isLoading = profileLoading || statsLoading;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <AppHeader title="My Profile" showMenu onMenuPress={openDrawer} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.secondary.dark} />
        </View>
      </View>
    );
  }

  const memberSince = profile?.created_at 
    ? format(new Date(profile.created_at), 'MMMM yyyy')
    : 'Recently';

  return (
    <View style={styles.container}>
      <AppHeader title="My Profile" showMenu onMenuPress={openDrawer} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarFlag}>{currentUser?.flag || '🌍'}</Text>
            </View>
            <Text style={styles.profileName}>{profile?.first_name || currentUser?.firstName || 'User'}</Text>
            <View style={styles.locationRow}>
              <MapPin size={14} color={colors.text.muted} />
              <Text style={styles.locationText}>{profile?.country || currentUser?.country || 'Worldwide'}</Text>
            </View>
            <View style={styles.badgeRow}>
              {profile?.denomination && profile.denomination !== 'Prefer not to say' && (
                <Badge variant="denomination">{profile.denomination}</Badge>
              )}
              {profile?.is_verified_leader && (
                <Badge variant="success">Verified Leader</Badge>
              )}
            </View>
            <View style={styles.memberSince}>
              <Calendar size={14} color={colors.text.muted} />
              <Text style={styles.memberSinceText}>Member since {memberSince}</Text>
            </View>
          </View>

          {/* Prayer Journey Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PRAYER JOURNEY</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${colors.accent.blue}15` }]}>
                  <Send size={18} color={colors.accent.blue} />
                </View>
                <Text style={styles.statValue}>{stats?.totalPrayersSent || 0}</Text>
                <Text style={styles.statLabel}>Prayers Sent</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${colors.accent.purple}15` }]}>
                  <Users size={18} color={colors.accent.purple} />
                </View>
                <Text style={styles.statValue}>{stats?.uniquePeopleCount || 0}</Text>
                <Text style={styles.statLabel}>People Prayed For</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${colors.accent.orange}15` }]}>
                  <Flame size={18} color={colors.accent.orange} />
                </View>
                <Text style={styles.statValue}>{stats?.currentStreak || 0}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${colors.accent.green}15` }]}>
                  <Globe size={18} color={colors.accent.green} />
                </View>
                <Text style={styles.statValue}>{stats?.nationsCount || 0}</Text>
                <Text style={styles.statLabel}>Nations</Text>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
            <View style={styles.activityCard}>
              <View style={styles.activityRow}>
                <View style={styles.activityItem}>
                  <Text style={styles.activityValue}>{stats?.thisWeekCount || 0}</Text>
                  <Text style={styles.activityLabel}>This Week</Text>
                </View>
                <View style={styles.activityDivider} />
                <View style={styles.activityItem}>
                  <Text style={styles.activityValue}>{stats?.thisMonthCount || 0}</Text>
                  <Text style={styles.activityLabel}>This Month</Text>
                </View>
                <View style={styles.activityDivider} />
                <View style={styles.activityItem}>
                  <Text style={styles.activityValue}>{stats?.longestStreak || 0}</Text>
                  <Text style={styles.activityLabel}>Best Streak</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Community */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>COMMUNITY</Text>
            <View style={styles.communityCard}>
              <TouchableOpacity 
                style={styles.communityRow}
                onPress={() => (navigation as any).navigate('ChurchList')}
                activeOpacity={0.7}
              >
                <View style={[styles.communityIcon, { backgroundColor: `${colors.accent.purple}15` }]}>
                  <Church size={18} color={colors.accent.purple} />
                </View>
                <View style={styles.communityContent}>
                  <Text style={styles.communityLabel}>Churches Joined</Text>
                  <Text style={styles.communityValue}>{stats?.churchesJoined || 0}</Text>
                </View>
                <ChevronRight size={18} color={colors.text.muted} />
              </TouchableOpacity>
              <View style={styles.divider} />
              <View style={styles.communityRow}>
                <View style={[styles.communityIcon, { backgroundColor: `${colors.accent.green}15` }]}>
                  <Heart size={18} color={colors.accent.green} />
                </View>
                <View style={styles.communityContent}>
                  <Text style={styles.communityLabel}>Church Prayers Posted</Text>
                  <Text style={styles.communityValue}>{stats?.churchPrayersPosted || 0}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Milestones */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SPIRITUAL MILESTONES</Text>
            {milestonesLoading ? (
              <ActivityIndicator size="small" color={colors.secondary.dark} />
            ) : milestones && milestones.length > 0 ? (
              <View style={styles.milestonesGrid}>
                {milestones.map((milestone) => {
                  const info = MILESTONE_INFO[milestone.milestone_key as MilestoneKey];
                  if (!info) return null;
                  return (
                    <View key={milestone.id} style={styles.milestoneCard}>
                      <Text style={styles.milestoneIcon}>{info.icon}</Text>
                      <Text style={styles.milestoneTitle}>{info.title}</Text>
                      <Text style={styles.milestoneDate}>
                        {format(new Date(milestone.achieved_at), 'MMM d, yyyy')}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyMilestones}>
                <Award size={32} color={colors.text.muted} />
                <Text style={styles.emptyText}>Keep praying to earn milestones!</Text>
                <Text style={styles.emptySubtext}>
                  Send 10 prayers to earn your first milestone
                </Text>
              </View>
            )}
          </View>

          {/* Quick Links */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>QUICK LINKS</Text>
            <View style={styles.linksCard}>
              <TouchableOpacity 
                style={styles.linkRow}
                onPress={() => (navigation as any).navigate('TestimoniesDrawer')}
                activeOpacity={0.7}
              >
                <View style={[styles.linkIcon, { backgroundColor: `${colors.accent.green}15` }]}>
                  <Heart size={18} color={colors.accent.green} />
                </View>
                <View style={styles.linkContent}>
                  <Text style={styles.linkText}>Testimonies</Text>
                  <Text style={styles.linkSubtext}>{stats?.answeredPrayersCount || 0} answered prayers</Text>
                </View>
                <ChevronRight size={18} color={colors.text.muted} />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity 
                style={styles.linkRow}
                onPress={() => (navigation as any).navigate('PrayersSentDrawer')}
                activeOpacity={0.7}
              >
                <View style={styles.linkIcon}>
                  <Send size={18} color={colors.secondary.dark} />
                </View>
                <Text style={styles.linkText}>My Sent Prayers</Text>
                <ChevronRight size={18} color={colors.text.muted} />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity 
                style={styles.linkRow}
                onPress={() => (navigation as any).navigate('SettingsDrawer')}
                activeOpacity={0.7}
              >
                <View style={styles.linkIcon}>
                  <Pencil size={18} color={colors.secondary.dark} />
                </View>
                <Text style={styles.linkText}>Edit Profile</Text>
                <ChevronRight size={18} color={colors.text.muted} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ui.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 8,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.secondary.dark}1A`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarFlag: {
    fontSize: 40,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: colors.text.muted,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  memberSince: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberSinceText: {
    fontSize: 13,
    color: colors.text.muted,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.muted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.ui.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.muted,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: colors.ui.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
    padding: 16,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityItem: {
    flex: 1,
    alignItems: 'center',
  },
  activityValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  activityLabel: {
    fontSize: 12,
    color: colors.text.muted,
  },
  activityDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.ui.borderLight,
  },
  communityCard: {
    backgroundColor: colors.ui.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
    overflow: 'hidden',
  },
  communityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  communityIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityContent: {
    flex: 1,
  },
  communityLabel: {
    fontSize: 14,
    color: colors.text.muted,
    marginBottom: 2,
  },
  communityValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.ui.borderLight,
    marginHorizontal: 16,
  },
  milestonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  milestoneCard: {
    width: '47%',
    backgroundColor: colors.ui.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
    padding: 16,
    alignItems: 'center',
  },
  milestoneIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  milestoneTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  milestoneDate: {
    fontSize: 11,
    color: colors.text.muted,
  },
  emptyMilestones: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.ui.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.secondary,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: 16,
  },
  linksCard: {
    backgroundColor: colors.ui.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
    overflow: 'hidden',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  linkIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${colors.secondary.dark}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkContent: {
    flex: 1,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
  },
  linkSubtext: {
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 2,
  },
});
