import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BookmarkPlus, Clock, X, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import ImageCarousel from '../components/ImageCarousel';
import Badge from '../components/Badge';
import { PrimaryButton, SecondaryButton, GhostButton } from '../components/Buttons';
import { useAppContext } from '../context/AppContext';
import { AI_PRAYER_DRAFTS } from '../data/mockData';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PlanPrayerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    state,
    getPlannedRequest,
    checkPlanExpiry,
    clearPlanPrayer,
    submitPrayer,
    hasSentPrayer,
    showToast,
  } = useAppContext();

  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [prayerText, setPrayerText] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const plannedRequest = getPlannedRequest();

  useEffect(() => {
    if (state.plannedPrayer) {
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
  }, [state.plannedPrayer]);

  useEffect(() => {
    if (plannedRequest) {
      setIsSubmitted(hasSentPrayer(plannedRequest.id));
    }
  }, [plannedRequest, hasSentPrayer]);

  const updateTimeRemaining = () => {
    if (!state.plannedPrayer) return;
    const now = new Date();
    const expiresAt = new Date(state.plannedPrayer.expiresAt);
    const diff = expiresAt.getTime() - now.getTime();
    if (diff <= 0) {
      setIsExpired(true);
      return;
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    setTimeRemaining({ hours, minutes });
  };

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const randomDraft = AI_PRAYER_DRAFTS[Math.floor(Math.random() * AI_PRAYER_DRAFTS.length)];
    setPrayerText(randomDraft);
    setIsGeneratingAI(false);
    setIsComposing(true);
  };

  const handleSubmitPrayer = async () => {
    if (!prayerText.trim() || !plannedRequest) {
      showToast('error', 'Please write a prayer before submitting');
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    submitPrayer(plannedRequest.id, prayerText.trim());
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
              Thank you for praying for {plannedRequest.name}. Your prayer has been recorded.
            </Text>
          </View>
          <PrimaryButton onPress={() => (navigation as any).navigate('PrayersSentDrawer')}>
            View Prayers Sent
          </PrimaryButton>
          <GhostButton onPress={handleClear}>Clear Slot</GhostButton>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Plan Prayer" subtitle="Single prayer slot" showMenu showBack />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Planned Prayer</Text>
            <View style={styles.timerPill}>
              <Clock size={14} color="#5C3D2E" />
              <Text style={styles.timerText}>
                Expires in {timeRemaining.hours}h {timeRemaining.minutes}m
              </Text>
            </View>
          </View>

          <View style={styles.profileCard}>
            <ImageCarousel images={plannedRequest.profileImages} height={160} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{plannedRequest.name}</Text>
              <View style={styles.profileBadges}>
                {plannedRequest.denomination && (
                  <Badge variant="denomination" size="sm">{plannedRequest.denomination}</Badge>
                )}
              </View>
              <Text style={styles.profileLocation}>
                {plannedRequest.flag} {plannedRequest.country}
              </Text>
              <Text style={styles.profileRequest} numberOfLines={3}>
                "{plannedRequest.requestText}"
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.removeButton} onPress={handleClear}>
            <X size={16} color="#7A1E1E" />
            <Text style={styles.removeText}>Remove from Plan Prayer</Text>
          </TouchableOpacity>

          <View style={styles.composeSection}>
            {!isComposing ? (
              <>
                <PrimaryButton
                  fullWidth
                  size="lg"
                  icon={<Sparkles size={18} color="#FFF" />}
                  onPress={() => setIsComposing(true)}
                >
                  Write Prayer
                </PrimaryButton>
                <GhostButton
                  icon={<Sparkles size={18} color="#6B4F3E" />}
                  onPress={handleGenerateAI}
                  loading={isGeneratingAI}
                >
                  Generate AI Prayer Draft
                </GhostButton>
              </>
            ) : (
              <View style={styles.composeCard}>
                <View style={styles.composeHeader}>
                  <Text style={styles.composeTitle}>Write Your Prayer</Text>
                  <TouchableOpacity onPress={() => { setIsComposing(false); setPrayerText(''); }}>
                    <X size={20} color="#5C3D2E" />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.textArea}
                  placeholder="Write your prayer here..."
                  placeholderTextColor="#9B7B6A"
                  value={prayerText}
                  onChangeText={setPrayerText}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
                <View style={styles.composeActions}>
                  <GhostButton
                    size="sm"
                    icon={<Sparkles size={16} color="#6B4F3E" />}
                    onPress={handleGenerateAI}
                    loading={isGeneratingAI}
                  >
                    AI Draft
                  </GhostButton>
                  <PrimaryButton
                    size="md"
                    onPress={handleSubmitPrayer}
                    loading={isSubmitting}
                    disabled={!prayerText.trim()}
                  >
                    Submit Prayer
                  </PrimaryButton>
                </View>
              </View>
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
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  emptyFeatures: {
    alignSelf: 'stretch',
    padding: 16,
    backgroundColor: 'rgba(107, 79, 62, 0.04)',
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  emptyFeatureItem: {
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 20,
  },
  expiredState: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  expiredCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 16,
    backgroundColor: '#FFF0F0',
    borderRadius: 14,
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
    marginBottom: 4,
  },
  expiredText: {
    fontSize: 14,
    color: '#7A1E1E',
    lineHeight: 20,
  },
  submittedState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 16,
  },
  submittedCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#E8F5EE',
    borderRadius: 16,
    marginBottom: 8,
  },
  submittedEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  submittedTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A4731',
    marginBottom: 8,
  },
  submittedText: {
    fontSize: 15,
    color: '#1A4731',
    textAlign: 'center',
    lineHeight: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C0F0A',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
    borderRadius: 20,
  },
  timerText: {
    fontSize: 13,
    color: '#5C3D2E',
    fontWeight: '500',
  },
  profileCard: {
    backgroundColor: '#FDF9F4',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    overflow: 'hidden',
    marginBottom: 16,
  },
  profileInfo: {
    padding: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 8,
  },
  profileBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  profileLocation: {
    fontSize: 14,
    color: '#7A5C4A',
    marginBottom: 12,
  },
  profileRequest: {
    fontSize: 14,
    color: '#5C3D2E',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  removeText: {
    fontSize: 14,
    color: '#7A1E1E',
    fontWeight: '500',
  },
  composeSection: {
    marginTop: 8,
    gap: 12,
  },
  composeCard: {
    padding: 16,
    backgroundColor: 'rgba(107, 79, 62, 0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8D8C8',
  },
  composeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  composeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C0F0A',
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
  composeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});
