import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Zap, Clock, RefreshCw, Star } from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import PrayerRequestCard from '../components/PrayerRequestCard';
import Badge from '../components/Badge';
import { PrimaryButton, SecondaryButton, IconButton } from '../components/Buttons';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AutoModeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    state,
    assignAuto,
    checkAutoExpiry,
    getAutoRequest,
  } = useAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isReassigning, setIsReassigning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0 });

  const autoRequest = getAutoRequest();

  useEffect(() => {
    initializeAuto();
  }, []);

  useEffect(() => {
    if (state.autoAssignment) {
      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 30000);
      return () => clearInterval(interval);
    }
  }, [state.autoAssignment]);

  const initializeAuto = async () => {
    const expired = checkAutoExpiry();
    if (expired || !state.autoAssignment) {
      assignAuto();
    }
    setIsLoading(false);
  };

  const updateTimeRemaining = () => {
    if (!state.autoAssignment) return;
    const now = new Date();
    const expiresAt = new Date(state.autoAssignment.expiresAt);
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
    assignAuto();
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

            <PrayerRequestCard request={autoRequest} />

            <PrimaryButton fullWidth size="lg" onPress={handleOpenPray}>
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
    backgroundColor: colors.ui.background,
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
    padding: 40,
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 16,
    backgroundColor: colors.ui.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
    marginBottom: 16,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${colors.secondary.dark}1A`,
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
    marginBottom: 6,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  howItWorks: {
    padding: 14,
    backgroundColor: colors.primary.medium,
    borderRadius: 12,
    marginBottom: 8,
  },
  howItWorksTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  howItWorksItem: {
    fontSize: 13,
    color: '#5C3D2E',
    lineHeight: 20,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
    borderRadius: 24,
    alignSelf: 'center',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1C0F0A',
  },
});
