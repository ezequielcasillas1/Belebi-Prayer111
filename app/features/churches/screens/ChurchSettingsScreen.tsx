import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Share } from 'react-native';
import { useRoute, RouteProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Copy, Share2, Trash2, LogOut, Crown, Check } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import { SecondaryButton, DestructiveButton } from '../../../components/Buttons';
import { useAuthStore } from '../../auth/stores/authStore';
import { useUIStore } from '../../../stores/uiStore';
import { churchService } from '../api/churchService';
import { ChurchWithMemberCount } from '../../../types/database';
import { RootStackParamList } from '../../../navigation/RootNavigator';

type ChurchSettingsRouteProp = RouteProp<RootStackParamList, 'ChurchSettings'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MemberWithProfile {
  user_id: string;
  joined_at: string;
  profile: {
    first_name: string;
    country: string;
    flag: string;
  };
}

export default function ChurchSettingsScreen() {
  const route = useRoute<ChurchSettingsRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { churchId } = route.params;
  const supabaseProfile = useAuthStore((state) => state.supabaseProfile);
  const currentUser = useAuthStore((state) => state.currentUser);
  const showToast = useUIStore((state) => state.showToast);

  const [church, setChurch] = useState<ChurchWithMemberCount | null>(null);
  const [members, setMembers] = useState<MemberWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [codeCopied, setCodeCopied] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [churchData, membersData] = await Promise.all([
        churchService.getChurchById(churchId),
        churchService.getChurchMembers(churchId),
      ]);
      setChurch(churchData);
      setMembers(membersData);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to load church');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [churchId])
  );

  const userId = supabaseProfile?.id || currentUser?.id;
  const isCreator = church?.creator_id === userId;

  const handleCopyCode = async () => {
    if (!church?.invite_code) return;
    try {
      const Clipboard = await import('expo-clipboard');
      await Clipboard.setStringAsync(church.invite_code);
      setCodeCopied(true);
      showToast('success', 'Invite code copied!');
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      showToast('error', 'Clipboard not available - rebuild dev client');
    }
  };

  const handleShareCode = async () => {
    if (!church) return;
    try {
      await Share.share({
        message: `Join ${church.name} on Belebi Prayer! Use invite code: ${church.invite_code}`,
      });
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const handleLeaveChurch = () => {
    Alert.alert(
      'Leave Church',
      `Are you sure you want to leave ${church?.name}? You'll need the invite code to rejoin.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLeaving(true);
              await churchService.leaveChurch(churchId, userId || '');
              showToast('success', 'You have left the church');
              navigation.navigate('ChurchList');
            } catch (err: any) {
              showToast('error', err.message || 'Failed to leave church');
            } finally {
              setIsLeaving(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteChurch = () => {
    Alert.alert(
      'Delete Church',
      `Are you sure you want to delete ${church?.name}? This action cannot be undone and all prayer requests will be lost.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await churchService.deleteChurch(churchId, userId || '');
              showToast('success', 'Church deleted');
              navigation.navigate('ChurchList');
            } catch (err: any) {
              showToast('error', err.message || 'Failed to delete church');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${memberName} from the church?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await churchService.removeMember(churchId, memberId, userId || '');
              showToast('success', `${memberName} has been removed`);
              loadData();
            } catch (err: any) {
              showToast('error', err.message || 'Failed to remove member');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <AppHeader title="Church Settings" showBack />
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#6B4F3E" />
        </View>
      </View>
    );
  }

  if (!church) {
    return (
      <View style={styles.container}>
        <AppHeader title="Church Settings" showBack />
        <View style={styles.errorState}>
          <Text style={styles.errorText}>Church not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Church Settings" showBack />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.churchHeader}>
            <Text style={styles.churchName}>{church.name}</Text>
            <Text style={styles.churchDenomination}>{church.denomination}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INVITE CODE</Text>
            <View style={styles.codeCard}>
              <Text style={styles.codeText}>{church.invite_code}</Text>
              <View style={styles.codeActions}>
                <TouchableOpacity style={styles.codeButton} onPress={handleCopyCode}>
                  {codeCopied ? (
                    <Check size={18} color="#1A4731" />
                  ) : (
                    <Copy size={18} color="#6B4F3E" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.codeButton} onPress={handleShareCode}>
                  <Share2 size={18} color="#6B4F3E" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.codeHint}>Share this code with your church members to invite them</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>MEMBERS ({members.length})</Text>
            </View>
            <View style={styles.memberList}>
              {members.map((member) => (
                <View key={member.user_id} style={styles.memberCard}>
                  <Text style={styles.memberFlag}>{member.profile.flag}</Text>
                  <View style={styles.memberInfo}>
                    <View style={styles.memberNameRow}>
                      <Text style={styles.memberName}>{member.profile.first_name}</Text>
                      {member.user_id === church.creator_id && (
                        <View style={styles.creatorBadge}>
                          <Crown size={12} color="#7A5000" />
                          <Text style={styles.creatorText}>Creator</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.memberCountry}>{member.profile.country}</Text>
                  </View>
                  {isCreator && member.user_id !== userId && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveMember(member.user_id, member.profile.first_name)}
                    >
                      <Trash2 size={16} color="#7A1E1E" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.dangerZone}>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
            {!isCreator && (
              <DestructiveButton
                fullWidth
                icon={<LogOut size={18} color="#7A1E1E" />}
                onPress={handleLeaveChurch}
                loading={isLeaving}
              >
                Leave Church
              </DestructiveButton>
            )}
            {isCreator && (
              <DestructiveButton
                fullWidth
                icon={<Trash2 size={18} color="#7A1E1E" />}
                onPress={handleDeleteChurch}
                loading={isDeleting}
              >
                Delete Church
              </DestructiveButton>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF9F4',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 15,
    color: '#7A1E1E',
  },
  churchHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  churchName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C0F0A',
    marginBottom: 6,
  },
  churchDenomination: {
    fontSize: 15,
    color: '#7A5C4A',
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5C3D2E',
    letterSpacing: 1,
    marginBottom: 12,
  },
  codeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E8D8C8',
    borderStyle: 'dashed',
  },
  codeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C0F0A',
    letterSpacing: 4,
  },
  codeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  codeButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FDF9F4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8D8C8',
  },
  codeHint: {
    fontSize: 13,
    color: '#7A5C4A',
    marginTop: 10,
    textAlign: 'center',
  },
  memberList: {
    gap: 10,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#FDF9F4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    gap: 12,
  },
  memberFlag: {
    fontSize: 24,
  },
  memberInfo: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C0F0A',
  },
  creatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    backgroundColor: '#FFF8E7',
    borderRadius: 6,
  },
  creatorText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7A5000',
  },
  memberCountry: {
    fontSize: 13,
    color: '#7A5C4A',
    marginTop: 2,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerZone: {
    padding: 16,
    backgroundColor: '#FFF0F0',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5AAAA',
    gap: 12,
  },
  dangerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7A1E1E',
    marginBottom: 4,
  },
});
