import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Send, Calendar, ChevronRight, ChevronDown } from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import Badge from '../components/Badge';
import { PrimaryButton } from '../components/Buttons';
import { useAppContext } from '../context/AppContext';
import { SentPrayer } from '../data/mockData';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function PrayerSentCard({ prayer }: { prayer: SentPrayer }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={[styles.card, expanded && styles.cardExpanded]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardName}>{prayer.requestSnapshot.name}</Text>
          <View style={styles.cardMeta}>
            <Text style={styles.cardCountry}>
              {prayer.requestSnapshot.flag} {prayer.requestSnapshot.country}
            </Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View style={styles.dateRow}>
            <Calendar size={12} color="#7A5C4A" />
            <Text style={styles.dateText}>{formatDate(prayer.sentAt)}</Text>
          </View>
          <Badge variant="success" size="sm">🙏 Sent</Badge>
        </View>
        <View style={[styles.chevron, expanded && styles.chevronExpanded]}>
          {expanded ? (
            <ChevronDown size={20} color="#6B4F3E" />
          ) : (
            <ChevronRight size={20} color="#9B7B6A" />
          )}
        </View>
      </View>

      {expanded && (
        <View style={styles.cardContent}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Their Request</Text>
            <Text style={styles.requestText}>"{prayer.requestSnapshot.requestText}"</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Your Prayer</Text>
            <Text style={styles.prayerText}>{prayer.prayerText}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function PrayersSentScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { state } = useAppContext();

  const sortedPrayers = [...state.sentPrayers].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );

  if (sortedPrayers.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeader title="Prayers Sent" subtitle="0 submitted" showMenu showBack />
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Send size={36} color="#6B4F3E" />
          </View>
          <Text style={styles.emptyTitle}>Your Prayer Journey</Text>
          <Text style={styles.emptySubtitle}>
            Every prayer you submit is recorded here. Watch your intercession impact grow as you lift up believers around the world.
          </Text>
          
          <View style={styles.emptyImpact}>
            <Text style={styles.emptyImpactText}>
              Each prayer notifies the requester that someone cared enough to intercede for them.
            </Text>
          </View>

          <PrimaryButton onPress={() => (navigation as any).navigate('PrayerListDrawer')}>
            Start Interceding
          </PrimaryButton>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Prayers Sent" subtitle={`${sortedPrayers.length} submitted`} showMenu showBack />

      <View style={styles.content}>
        <View style={styles.privacyNote}>
          <Text style={styles.privacyText}>
            🔒 Your prayers are private. The person you prayed for only knows that someone prayed for them.
          </Text>
        </View>

        <FlatList
          data={sortedPrayers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PrayerSentCard prayer={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF9F4',
  },
  content: {
    flex: 1,
    padding: 16,
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
    marginBottom: 16,
  },
  emptyImpact: {
    padding: 14,
    backgroundColor: '#FFF8E7',
    borderRadius: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F5D98A',
  },
  emptyImpactText: {
    fontSize: 13,
    color: '#7A5000',
    textAlign: 'center',
    lineHeight: 18,
  },
  privacyNote: {
    padding: 14,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
    borderRadius: 12,
    marginBottom: 16,
  },
  privacyText: {
    fontSize: 13,
    color: '#5C3D2E',
    lineHeight: 18,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FDF9F4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    marginBottom: 10,
    overflow: 'hidden',
  },
  cardExpanded: {
    borderColor: '#6B4F3E',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  cardLeft: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardCountry: {
    fontSize: 13,
    color: '#7A5C4A',
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 6,
    marginRight: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#7A5C4A',
  },
  chevron: {
    padding: 4,
  },
  chevronExpanded: {
    transform: [{ rotate: '0deg' }],
  },
  cardContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#EDE0D4',
    paddingTop: 14,
    gap: 16,
  },
  section: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7A5C4A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  requestText: {
    fontSize: 14,
    color: '#5C3D2E',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  prayerText: {
    fontSize: 14,
    color: '#1C0F0A',
    lineHeight: 20,
  },
});
