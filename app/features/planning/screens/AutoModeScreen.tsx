import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Zap, Clock, RefreshCw } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import PrayerRequestCard from '../../../components/PrayerRequestCard';
import Badge from '../../../components/Badge';
import { PrimaryButton, SecondaryButton, IconButton } from '../../../components/Buttons';
import { usePlanStore } from '../stores/planStore';
import { usePrayerStore } from '../../prayers/stores/prayerStore';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { colors } from '../../../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AutoModeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const autoAssignment = usePlanStore((state) => state.autoAssignment);
  const assignAuto = usePlanStore((state) => state.assignAuto);
  const checkAutoExpiry = usePlanStore((state) => state.checkAutoExpiry);
  const getAutoRequest = usePlanStore((state) => state.getAutoRequest);
  const sentPrayers = usePrayerStore((state) => state.sentPrayers);

  const [isLoading, setIsLoading] = useState(true);
  const [isReassigning, setIsReassigning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0 });

  const autoRequest = getAutoRequest();

  useEffect(() => {
    initializeAuto();
  }, []);

  useEffect(() => {
    if (autoAssignment) {
      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 30000);
      return () => clearInterval(interval);
    }
  }, [autoAssignment]);

  const initializeAuto = async () => {
    const expired = checkAutoExpiry();
    if (expired || !autoAssignment) {
      const sentIds = sentPrayers.map((p) => p.requestId);
      assignAuto(sentIds);
    }
    setIsLoading(false);
  };

  const updateTimeRemaining = () => {
    if (!autoAssignment) return;
    const now = new Date();
    const expiresAt = new Date(autoAssignment.expiresAt);
    const diff = expiresAt.getTime() - now.getTime();
    if (diff <= 0) {
      checkAutoExpiry();
      return;
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    setTimeRemaining({ hours, minutes });
  };

  const handleReassign = async () => {
    setIsReassigning(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const sentIds = sentPrayers.map((p) => p.requestId);
    assignAuto(sentIds);
    setIsReassigning(false);
  };

  const handleOpenPray = () => {
    if (autoRequest) {
      navigation.navigate('PrayerProfile', { requestId: autoRequest.id });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <AppHeader title="Auto Prayer Mode" showBack />
        <View style={styles.loadingState}>
          <Text style={styles.loadingEmoji}>🙏</Text>
          <ActivityIndicator size="large" color={colors.secondary.dark} />
          <Text style={styles.loadingText}>Finding someone who needs prayer...</Text>
        </View>
      </View>
    );
  }

  if (!autoRequest) {
    return (
      <View style={styles.container}>
        <AppHeader title="Auto Prayer Mode" showBack />
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🌟</Text>
          <Text style={styles.emptyTitle}>All Covered for Now!</Text>
          <Text style={styles.emptySubtitle}>
            All urgent prayer requests have been prayed for. Check back later or browse all requests.
          </Text>
          <SecondaryButton onPress={() => (navigation as any).navigate('PrayerListDrawer')}>
            Browse All Requests
          </SecondaryButton>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Auto Prayer Mode" showBack />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Zap size={24} color="#6B4F3E" fill="#6B4F3E" />
            </View>
            <View style={styles.infoContent}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoTitle}>Pray Where Needed Most</Text>
                <Badge variant="success" size="sm">Auto</Badge>
              </View>
              <Text style={styles.infoText}>
                Don't know who to pray for? Auto Mode removes the burden of choice. We find someone who truly needs intercession — prioritizing requests with fewer than 3 prayers.
              </Text>
            </View>
          </View>

          <View style={styles.howItWorks}>
            <Text style={styles.howItWorksTitle}>How it works:</Text>
            <Text style={styles.howItWorksItem}>1. We assign you someone in need</Text>
            <Text style={styles.howItWorksItem}>2. You have 12 hours to pray for them</Text>
            <Text style={styles.howItWorksItem}>3. Same person shown until you pray or time expires</Text>
            <Text style={styles.howItWorksItem}>4. Reassign anytime for a new request</Text>
          </View>

          <View style={styles.timerPill}>
            <Clock size={16} color="#5C3D2E" />
            <Text style={styles.timerText}>
              Auto assignment: {timeRemaining.hours}h {timeRemaining.minutes}m remaining
            </Text>
          </View>

          <View style={styles.assignmentSection}>
            <View style={styles.assignmentHeader}>
              <Text style={styles.assignmentTitle}>Your Assignment</Text>
              <IconButton
                icon={<RefreshCw size={18} color={isReassigning ? '#C4A89A' : '#6B4F3E'} />}
                onPress={handleReassign}
                disabled={isReassigning}
              />
            </View>

            <PrayerRequestCard
              request={autoRequest}
              onPress={handleOpenPray}
            />

            <PrimaryButton
              fullWidth
              size="lg"
              onPress={handleOpenPray}
            >
              Open & Pray
            </PrimaryButton>
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
    gap: 16,
  },
  loadingEmoji: {
    fontSize: 48,
  },
  loadingText: {
    fontSize: 15,
    color: '#5C3D2E',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 16,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C0F0A',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
    borderRadius: 16,
    gap: 14,
    marginBottom: 20,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(107, 79, 62, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C0F0A',
  },
  infoText: {
    fontSize: 13,
    color: '#5C3D2E',
    lineHeight: 19,
  },
  howItWorks: {
    padding: 16,
    backgroundColor: '#FDF9F4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    marginBottom: 20,
  },
  howItWorksTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 10,
  },
  howItWorksItem: {
    fontSize: 13,
    color: '#7A5C4A',
    lineHeight: 22,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
    borderRadius: 8,
    marginBottom: 24,
  },
  timerText: {
    fontSize: 14,
    color: '#5C3D2E',
    fontWeight: '500',
  },
  assignmentSection: {
    gap: 16,
  },
  assignmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  assignmentTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C0F0A',
  },
});
