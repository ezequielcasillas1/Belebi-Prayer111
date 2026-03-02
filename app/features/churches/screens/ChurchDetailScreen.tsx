import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, TextInput, Modal } from 'react-native';
import { useRoute, RouteProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Users, Settings, Plus, X, MessageCircle, Clock, Send } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import { PrimaryButton, SecondaryButton, GhostButton, IconButton } from '../../../components/Buttons';
import { useAuthStore } from '../../auth/stores/authStore';
import { useUIStore } from '../../../stores/uiStore';
import { churchService, churchPrayerService } from '../api/churchService';
import { ChurchWithMemberCount, ChurchPrayerWithAuthor } from '../../../types/database';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { formatDistanceToNow } from 'date-fns';

type ChurchDetailRouteProp = RouteProp<RootStackParamList, 'ChurchDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ChurchDetailScreen() {
  const route = useRoute<ChurchDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { churchId } = route.params;
  const supabaseProfile = useAuthStore((state) => state.supabaseProfile);
  const currentUser = useAuthStore((state) => state.currentUser);
  const showToast = useUIStore((state) => state.showToast);

  const [church, setChurch] = useState<ChurchWithMemberCount | null>(null);
  const [prayers, setPrayers] = useState<ChurchPrayerWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPrayerText, setNewPrayerText] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showRespondModal, setShowRespondModal] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState<ChurchPrayerWithAuthor | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isResponding, setIsResponding] = useState(false);

  const loadData = async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);

      const [churchData, prayersData] = await Promise.all([
        churchService.getChurchById(churchId),
        churchPrayerService.getChurchPrayers(churchId),
      ]);

      setChurch(churchData);
      setPrayers(prayersData);
    } catch (err: any) {
      setError(err.message || 'Failed to load church');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [churchId])
  );

  const userId = supabaseProfile?.id || currentUser?.id;

  const handleCreatePrayer = async () => {
    if (!newPrayerText.trim() || !userId) return;

    try {
      setIsCreating(true);
      await churchPrayerService.createPrayer(churchId, userId, newPrayerText.trim());
      showToast('success', 'Prayer request shared with your church');
      setNewPrayerText('');
      setShowCreateModal(false);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to create prayer');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRespondToPrayer = async () => {
    if (!responseText.trim() || !selectedPrayer || !userId) return;

    try {
      setIsResponding(true);
      await churchPrayerService.respondToPrayer(selectedPrayer.id, userId, responseText.trim());
      showToast('success', 'Prayer sent! Thank you for interceding.');
      setResponseText('');
      setShowRespondModal(false);
      setSelectedPrayer(null);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to send prayer');
    } finally {
      setIsResponding(false);
    }
  };

  const openRespondModal = (prayer: ChurchPrayerWithAuthor) => {
    setSelectedPrayer(prayer);
    setResponseText('');
    setShowRespondModal(true);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <AppHeader title="Church" showBack />
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#6B4F3E" />
        </View>
      </View>
    );
  }

  if (error || !church) {
    return (
      <View style={styles.container}>
        <AppHeader title="Church" showBack />
        <View style={styles.errorState}>
          <Text style={styles.errorText}>{error || 'Church not found'}</Text>
          <SecondaryButton onPress={() => loadData()}>Try Again</SecondaryButton>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title={church.name}
        subtitle={church.denomination}
        showBack
        rightElement={
          <IconButton
            icon={<Settings size={18} color="#6B4F3E" />}
            onPress={() => navigation.navigate('ChurchSettings', { churchId })}
          />
        }
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => loadData(true)} tintColor="#6B4F3E" />
        }
      >
        <View style={styles.content}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Users size={18} color="#6B4F3E" />
              <Text style={styles.statValue}>{church.member_count}</Text>
              <Text style={styles.statLabel}>Members</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MessageCircle size={18} color="#6B4F3E" />
              <Text style={styles.statValue}>{prayers.length}</Text>
              <Text style={styles.statLabel}>Prayers</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.createButton} onPress={() => setShowCreateModal(true)} activeOpacity={0.8}>
            <Plus size={20} color="#FFF" />
            <Text style={styles.createButtonText}>Share Prayer Request</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Prayer Requests</Text>

          {prayers.length === 0 ? (
            <View style={styles.emptyPrayers}>
              <Text style={styles.emptyPrayersText}>No prayer requests yet. Be the first to share!</Text>
            </View>
          ) : (
            <View style={styles.prayerList}>
              {prayers.map((prayer) => (
                <View key={prayer.id} style={styles.prayerCard}>
                  <View style={styles.prayerHeader}>
                    <View style={styles.authorInfo}>
                      <Text style={styles.authorFlag}>{prayer.author.flag}</Text>
                      <Text style={styles.authorName}>{prayer.author.first_name}</Text>
                    </View>
                    <View style={styles.timeInfo}>
                      <Clock size={12} color="#9B7B6A" />
                      <Text style={styles.timeText}>
                        {formatDistanceToNow(new Date(prayer.created_at), { addSuffix: true })}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.prayerText}>"{prayer.request_text}"</Text>
                  <View style={styles.prayerFooter}>
                    <Text style={styles.responsesCount}>
                      {prayer.responses_count} {prayer.responses_count === 1 ? 'prayer' : 'prayers'} received
                    </Text>
                    {prayer.author_id !== userId && (
                      <GhostButton
                        size="sm"
                        icon={<Send size={14} color="#6B4F3E" />}
                        onPress={() => openRespondModal(prayer)}
                      >
                        Pray
                      </GhostButton>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={showCreateModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share Prayer Request</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <X size={24} color="#5C3D2E" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
              Share your prayer need with your church family. Only members of {church.name} will see this.
            </Text>
            <TextInput
              style={styles.textArea}
              placeholder="What would you like prayer for?"
              placeholderTextColor="#9B7B6A"
              value={newPrayerText}
              onChangeText={setNewPrayerText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={800}
            />
            <Text style={styles.charCount}>{newPrayerText.length}/800</Text>
            <View style={styles.modalActions}>
              <SecondaryButton onPress={() => setShowCreateModal(false)}>Cancel</SecondaryButton>
              <PrimaryButton
                onPress={handleCreatePrayer}
                loading={isCreating}
                disabled={!newPrayerText.trim()}
              >
                Share Request
              </PrimaryButton>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showRespondModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pray for {selectedPrayer?.author.first_name}</Text>
              <TouchableOpacity onPress={() => setShowRespondModal(false)}>
                <X size={24} color="#5C3D2E" />
              </TouchableOpacity>
            </View>
            {selectedPrayer && (
              <View style={styles.requestPreview}>
                <Text style={styles.requestPreviewText}>"{selectedPrayer.request_text}"</Text>
              </View>
            )}
            <TextInput
              style={styles.textArea}
              placeholder="Write your prayer..."
              placeholderTextColor="#9B7B6A"
              value={responseText}
              onChangeText={setResponseText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <SecondaryButton onPress={() => setShowRespondModal(false)}>Cancel</SecondaryButton>
              <PrimaryButton
                onPress={handleRespondToPrayer}
                loading={isResponding}
                disabled={!responseText.trim()}
              >
                Send Prayer
              </PrimaryButton>
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 40,
    gap: 16,
  },
  errorText: {
    fontSize: 15,
    color: '#7A1E1E',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
    borderRadius: 16,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C0F0A',
  },
  statLabel: {
    fontSize: 13,
    color: '#7A5C4A',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E8D8C8',
    marginHorizontal: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#6B4F3E',
    borderRadius: 14,
    marginBottom: 24,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 16,
  },
  emptyPrayers: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(107, 79, 62, 0.04)',
    borderRadius: 12,
  },
  emptyPrayersText: {
    fontSize: 14,
    color: '#7A5C4A',
    textAlign: 'center',
  },
  prayerList: {
    gap: 16,
  },
  prayerCard: {
    padding: 16,
    backgroundColor: '#FDF9F4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8D8C8',
  },
  prayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorFlag: {
    fontSize: 18,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C0F0A',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#9B7B6A',
  },
  prayerText: {
    fontSize: 15,
    color: '#5C3D2E',
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 12,
  },
  prayerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  responsesCount: {
    fontSize: 13,
    color: '#7A5C4A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FDF9F4',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C0F0A',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#7A5C4A',
    lineHeight: 20,
    marginBottom: 16,
  },
  requestPreview: {
    padding: 12,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
    borderRadius: 10,
    marginBottom: 16,
  },
  requestPreviewText: {
    fontSize: 14,
    color: '#5C3D2E',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  textArea: {
    minHeight: 120,
    padding: 14,
    backgroundColor: '#FDF9F4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4C4B0',
    fontSize: 15,
    color: '#1C0F0A',
    lineHeight: 22,
  },
  charCount: {
    fontSize: 12,
    color: '#9B7B6A',
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
});
