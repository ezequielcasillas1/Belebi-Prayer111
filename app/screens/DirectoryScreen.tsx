import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import AtoZTabs from '../components/AtoZTabs';
import PrayerRequestCard from '../components/PrayerRequestCard';
import { useAppContext } from '../context/AppContext';
import { PRAYER_REQUESTS, UNIQUE_COUNTRIES } from '../data/mockData';
import { RootStackParamList } from '../navigation/RootNavigator';

type DirectoryRouteProp = RouteProp<RootStackParamList, 'Directory'>;

export default function DirectoryScreen() {
  const route = useRoute<DirectoryRouteProp>();
  const countryCode = route.params?.countryCode;
  const { hasSentPrayer } = useAppContext();

  const filteredByCountry = useMemo(() => {
    return PRAYER_REQUESTS
      .filter((r) => !hasSentPrayer(r.id))
      .filter((r) => !countryCode || r.countryCode === countryCode);
  }, [countryCode, hasSentPrayer]);

  const availableLetters = useMemo(() => {
    return new Set(filteredByCountry.map((r) => r.letter));
  }, [filteredByCountry]);

  const [selectedLetter, setSelectedLetter] = useState(() => {
    const letters = Array.from(availableLetters).sort();
    return letters[0] || 'A';
  });

  useEffect(() => {
    if (!availableLetters.has(selectedLetter)) {
      const letters = Array.from(availableLetters).sort();
      if (letters.length > 0) {
        setSelectedLetter(letters[0]);
      }
    }
  }, [availableLetters, selectedLetter]);

  const filteredRequests = useMemo(() => {
    return filteredByCountry
      .filter((r) => r.letter === selectedLetter)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [filteredByCountry, selectedLetter]);

  const country = countryCode ? UNIQUE_COUNTRIES.find((c) => c.code === countryCode) : null;
  const title = country ? `People in ${country.name}` : 'Prayer Directory';
  const subtitle = country ? `${country.flag} ${filteredByCountry.length} requests` : 'Browse A-Z';

  return (
    <View style={styles.container}>
      <AppHeader title={title} subtitle={subtitle} showBack />

      <View style={styles.content}>
        {!countryCode && (
          <View style={styles.introCard}>
            <Text style={styles.introText}>
              Browse prayer requests by first name from believers around the world. Choose a letter to begin.
            </Text>
          </View>
        )}

        <AtoZTabs
          selected={selectedLetter}
          onChange={setSelectedLetter}
          availableLetters={availableLetters}
        />

        <View style={styles.letterHeader}>
          <View style={styles.letterBox}>
            <Text style={styles.letterText}>{selectedLetter}</Text>
          </View>
          <Text style={styles.letterCount}>
            {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} · Sorted by newest first
          </Text>
        </View>

        <FlatList
          data={filteredRequests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PrayerRequestCard request={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyTitle}>No requests starting with "{selectedLetter}"</Text>
              <Text style={styles.emptySubtitle}>Try selecting a different letter</Text>
            </View>
          }
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  introCard: {
    padding: 14,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#6B4F3E',
  },
  introText: {
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 20,
  },
  letterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  letterBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#6B4F3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  letterCount: {
    fontSize: 13,
    color: '#7A5C4A',
  },
  list: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C0F0A',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#5C3D2E',
    textAlign: 'center',
  },
});
