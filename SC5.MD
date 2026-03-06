📱 SCREEN 5/16: AutoModeScreen.tsx
// app/screens/AutoModeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Zap, RefreshCw, Clock } from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import PrayerRequestCard from '../components/PrayerRequestCard';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import Badge from '../components/Badge';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function formatTimeLeft(expiresAt: number): string {
  const msLeft = expiresAt - Date.now();
  if (msLeft <= 0) return 'Expired';
  const hours = Math.floor(msLeft / (1000 * 60 * 60));
  const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}

export default function AutoModeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { state, assignAuto, getAutoRequest, checkAutoExpiry, getAvailableRequests } = useApp();
  const [timeLeft, setTimeLeft] = useState('');
  const [assignedRequest, setAssignedRequest] = useState(getAutoRequest());
  const [loading, setLoading] = useState(false);
  const [noRequestsAvailable, setNoRequestsAvailable] = useState(false);

  useEffect(() => {
    const expired = checkAutoExpiry();
    if (expired || !getAutoRequest()) {
      handleAutoAssign(false);
    } else {
      setAssignedRequest(getAutoRequest());
    }
  }, []);

  useEffect(() => {
    if (!state.autoAssignment) return;
    const update = () => setTimeLeft(formatTimeLeft(state.autoAssignment!.expiresAt));
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [state.autoAssignment]);

  const handleAutoAssign = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    await new Promise(res => setTimeout(res, 600));
    const available = getAvailableRequests().filter(r => r.prayersSentCount <= 2);
    if (available.length === 0) {
      setNoRequestsAvailable(true);
      setAssignedRequest(null);
      if (showLoading) setLoading(false);
      return;
    }
    const assigned = assignAuto();
    setAssignedRequest(assigned);
    setNoRequestsAvailable(false);
    if (showLoading) setLoading(false);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Auto Prayer Mode" showBack />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Mode Header */}
        <View style={styles.modeHeader}>
          <View style={styles.modeIcon}>
            <Zap size={22} color="#fff" />
          </View>
          <View style={styles.modeInfo}>
            <View style={styles.modeTitleRow}>
              <Text style={styles.modeTitle}>Pray Where Needed Most</Text>
              <Badge variant="success">Auto</Badge>
            </View>
            <Text style={styles.modeDescription}>
              We assign you to someone who needs prayer most. Assignments skip requests with 3+ prayers already sent.
            </Text>
          </View>
        </View>

        {/* Timer */}
        {state.autoAssignment && !noRequestsAvailable && (
          <View style={styles.timerContainer}>
            <Clock size={13} color="#8B6F5E" />
            <Text style={styles.timerText}>Auto assignment: {timeLeft}</Text>
          </View>
        )}

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingEmoji}>🙏</Text>
            <Text style={styles.loadingText}>Finding someone who needs prayer…</Text>
          </View>
        )}

        {/* No Requests */}
        {!loading && noRequestsAvailable && (
          <View style={styles.noRequestsContainer}>
            <Text style={styles.noRequestsEmoji}>🌟</Text>
            <Text style={styles.noRequestsTitle}>All Covered for Now!</Text>
            <Text style={styles.noRequestsText}>
              No under-covered requests available right now. Every request has received sufficient prayer. Check back soon!
            </Text>
            <SecondaryButton onPress={() => navigation.navigate('PrayerList')}>
              Browse All Requests
            </SecondaryButton>
          </View>
        )}

        {/* Assigned Request */}
        {!loading && assignedRequest && !noRequestsAvailable && (
          <View>
            <View style={styles.assignedHeader}>
              <Text style={styles.assignedTitle}>Your Assignment</Text>
              <TouchableOpacity onPress={() => handleAutoAssign(true)} style={styles.reassignButton}>
                <RefreshCw size={13} color="#6B4F3E" />
                <Text style={styles.reassignText}>Reassign</Text>
              </TouchableOpacity>
            </View>

            <PrayerRequestCard request={assignedRequest} />

            <PrimaryButton
              fullWidth
              size="lg"
              onPress={() => navigation.navigate('PrayerProfile', { id: assignedRequest.id })}
              style={styles.openButton}
            >
              Open & Pray
            </PrimaryButton>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfcfb' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  modeHeader: {
    backgroundColor: 'rgba(107,79,62,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(107,79,62,0.18)',
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  modeIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#6B4F3E', alignItems: 'center', justifyContent: 'center' },
  modeInfo: { flex: 1 },
  modeTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  modeTitle: { color: '#1C0F0A', fontWeight: '700', fontSize: 15.5 },
  modeDescription: { color: '#7A5C4A', fontSize: 13, lineHeight: 18.5 },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(253,249,244,0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139,111,94,0.2)',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  timerText: { color: '#6B4F3E', fontSize: 12.5, fontWeight: '600' },
  loadingContainer: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 16 },
  loadingEmoji: { fontSize: 40, marginBottom: 12 },
  loadingText: { color: '#7A5C4A', fontWeight: '600', fontSize: 14.5 },
  noRequestsContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(253,249,244,0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139,111,94,0.15)',
  },
  noRequestsEmoji: { fontSize: 40, marginBottom: 12 },
  noRequestsTitle: { color: '#1C0F0A', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  noRequestsText: { color: '#7A5C4A', fontSize: 13.5, lineHeight: 20, textAlign: 'center', marginBottom: 20 },
  assignedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  assignedTitle: { color: '#1C0F0A', fontSize: 15.5, fontWeight: '700' },
  reassignButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  reassignText: { color: '#6B4F3E', fontSize: 12.5, fontWeight: '600' },
  openButton: { marginTop: 12 },
});

