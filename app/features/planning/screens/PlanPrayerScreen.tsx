import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BookmarkPlus, Clock, Pencil, CheckCircle } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import ImageCarousel from '../../../components/ImageCarousel';
import Badge from '../../../components/Badge';
import { PrimaryButton, SecondaryButton, GhostButton } from '../../../components/Buttons';
import { usePlanStore } from '../stores/planStore';
import { usePrayerStore } from '../../prayers/stores/prayerStore';
import { useUIStore } from '../../../stores/uiStore';
import { PRAYER_REQUESTS } from '../../../data/mockData';
import { RootStackParamList } from '../../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PlanPrayerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const plannedPrayer = usePlanStore((state) => state.plannedPrayer);
  const getPlannedRequest = usePlanStore((state) => state.getPlannedRequest);
  const checkPlanExpiry = usePlanStore((state) => state.checkPlanExpiry);
  const clearPlanPrayer = usePlanStore((state) => state.clearPlanPrayer);
  const hasSentPrayer = usePrayerStore((state) => state.hasSentPrayer);
  const submitPrayer = usePrayerStore((state) => state.submitPrayer);
  const showToast = useUIStore((state) => state.showToast);

  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [prayerText, setPrayerText] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const plannedRequest = getPlannedRequest();

  useEffect(() => {
    if (plannedPrayer) {
      const expired = checkPlanExpiry();
      setIsExpired(expired);
      if (!expired) {
        updateTimeRemaining();
        const interval = setInterval(() => {
          const expired = checkPlanExpiry();
          if (expired) {
            setIsExpired(true);
          } else {
            updateTimeRemaining();
          }
        }, 30000);
        return () => clearInterval(interval);
      }
    }
  }, [plannedPrayer]);

  useEffect(() => {
    if (plannedRequest) {
      setIsSubmitted(hasSentPrayer(plannedRequest.id));
    }
  }, [plannedRequest, hasSentPrayer]);

  const updateTimeRemaining = () => {
    if (!plannedPrayer) return;
    const now = new Date();
    const expiresAt = new Date(plannedPrayer.expiresAt);
    const diff = expiresAt.getTime() - now.getTime();
    if (diff <= 0) {
      setIsExpired(true);
      return;
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    setTimeRemaining({ hours, minutes });
  };

  const handleSubmitPrayer = async () => {
    if (!prayerText.trim() || !plannedRequest) {
      showToast('error', 'Please write a prayer before submitting');
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    submitPrayer(plannedRequest, prayerText.trim());
    showToast('success', 'Prayer submitted! Thank you for interceding.');
    setIsSubmitting(false);
    setIsSubmitted(true);
    setPrayerText('');
    setIsComposing(false);
  };

  const handleClear = () => {
    clearPlanPrayer();
    setIsExpired(false);
    setIsSubmitted(false);
  };

  if (!plannedRequest) {
    return (
      <View style={styles.container}>
        <AppHeader title="Plan Prayer" subtitle="Single prayer slot" showMenu showBack />
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <BookmarkPlus size={36} color="#6B4F3E" />
          </View>
          <Text style={styles.emptyTitle}>Plan Your Prayer</Text>
          <Text style={styles.emptySubtitle}>
            Not ready to pray right now? Save one request here as a commitment to intercede within 24 hours.
          </Text>
          
          <View style={styles.emptyFeatures}>
            <Text style={styles.emptyFeatureItem}>📌 One slot at a time — focused intention</Text>
            <Text style={styles.emptyFeatureItem}>⏰ 24-hour window — gentle accountability</Text>
            <Text style={styles.emptyFeatureItem}>🙏 Come back when you're ready to pray</Text>
          </View>

          <PrimaryButton onPress={() => (navigation as any).navigate('PrayerListDrawer')}>
            Find Someone to Pray For
          </PrimaryButton>
        </View>
      </View>
    );
  }

  if (isExpired && !isSubmitted) {
    return (
      <View style={styles.container}>
        <AppHeader title="Plan Prayer" subtitle="Single prayer slot" showMenu showBack />
        <View style={styles.expiredState}>
          <View style={styles.expiredCard}>
            <Clock size={24} color="#7A1E1E" />
            <View style={styles.expiredContent}>
              <Text style={styles.expiredTitle}>Plan Prayer Expired</Text>
              <Text style={styles.expiredText}>
                The 24-hour window has passed. Clear this slot to plan a new prayer.
              </Text>
            </View>
          </View>
          <SecondaryButton onPress={handleClear}>Clear & Start Fresh</SecondaryButton>
        </View>
      </View>
    );
  }

  if (isSubmitted) {
    return (
      <View style={styles.container}>
        <AppHeader title="Plan Prayer" subtitle="Single prayer slot" showMenu showBack />
        <View style={styles.submittedState}>
          <View style={styles.submittedCard}>
            <Text style={styles.submittedEmoji}>🙏</Text>
            <Text style={styles.submittedTitle}>Prayer Submitted!</Text>
            <Text style={styles.submittedText}>
              You faithfully prayed for {plannedRequest.name}. Clear this slot when ready to plan another.
            </Text>
          </View>
          <GhostButton onPress={handleClear}>Clear Slot</GhostButton>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Plan Prayer" subtitle="Single prayer slot" showMenu showBack />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.timerBar}>
          <Clock size={16} color="#5C3D2E" />
          <Text style={styles.timerText}>
            {timeRemaining.hours}h {timeRemaining.minutes}m remaining
          </Text>
        </View>

        <ImageCarousel images={plannedRequest.profileImages} height={180} />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{plannedRequest.name}</Text>
            <Text style={styles.location}>{plannedRequest.flag} {plannedRequest.country}</Text>
            {plannedRequest.denomination && (
              <Badge variant="denomination">{plannedRequest.denomination}</Badge>
            )}
          </View>

          <View style={styles.requestSection}>
            <Text style={styles.sectionTitle}>Prayer Request</Text>
            <Text style={styles.requestText}>"{plannedRequest.requestText}"</Text>
          </View>

          {isComposing ? (
            <View style={styles.composeSection}>
              <Text style={styles.sectionTitle}>Write Your Prayer</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Lord, I lift up this person to You..."
                placeholderTextColor="#9B7B6A"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={prayerText}
                onChangeText={setPrayerText}
              />
              <View style={styles.composeActions}>
                <SecondaryButton onPress={() => { setIsComposing(false); setPrayerText(''); }}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  onPress={handleSubmitPrayer}
                  loading={isSubmitting}
                  disabled={!prayerText.trim()}
                >
                  Submit Prayer
                </PrimaryButton>
              </View>
            </View>
          ) : (
            <View style={styles.actions}>
              <PrimaryButton
                fullWidth
                size="lg"
                icon={<Pencil size={18} color="#FFF" />}
                onPress={() => setIsComposing(true)}
              >
                Pray Now
              </PrimaryButton>
              <GhostButton onPress={handleClear}>
                Clear Slot
              </GhostButton>
            </View>
          )}
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(107, 79, 62, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C0F0A',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyFeatures: {
    marginBottom: 24,
    gap: 8,
  },
  emptyFeatureItem: {
    fontSize: 14,
    color: '#7A5C4A',
  },
  expiredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 24,
  },
  expiredCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#FFF0F0',
    borderRadius: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F5AAAA',
  },
  expiredContent: {
    flex: 1,
  },
  expiredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A1E1E',
    marginBottom: 6,
  },
  expiredText: {
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 20,
  },
  submittedState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 24,
  },
  submittedCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  submittedEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  submittedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A4731',
    marginBottom: 8,
  },
  submittedText: {
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'center',
    lineHeight: 20,
  },
  timerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
  },
  timerText: {
    fontSize: 14,
    color: '#5C3D2E',
    fontWeight: '500',
  },
  header: {
    marginBottom: 20,
    gap: 6,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C0F0A',
  },
  location: {
    fontSize: 14,
    color: '#7A5C4A',
  },
  requestSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 10,
  },
  requestText: {
    fontSize: 16,
    color: '#5C3D2E',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  composeSection: {
    marginBottom: 20,
  },
  textArea: {
    minHeight: 140,
    padding: 14,
    backgroundColor: '#FDF9F4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4C4B0',
    fontSize: 15,
    color: '#1C0F0A',
    lineHeight: 22,
    marginBottom: 16,
  },
  composeActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  actions: {
    gap: 12,
    alignItems: 'center',
  },
});
