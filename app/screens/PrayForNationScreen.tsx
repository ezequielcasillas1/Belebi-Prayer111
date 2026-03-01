import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { BookOpen, CheckCircle } from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import { PrimaryButton } from '../components/Buttons';
import { useAppContext } from '../context/AppContext';
import { UNIQUE_COUNTRIES, NATION_PRAYER_POINTS } from '../data/mockData';
import { RootStackParamList } from '../navigation/RootNavigator';

type NationRouteProp = RouteProp<RootStackParamList, 'PrayForNation'>;

const SCRIPTURES = [
  {
    text: '"I urge, then, first of all, that petitions, prayers, intercession and thanksgiving be made for all people—for kings and all those in authority, that we may live peaceful and quiet lives in all godliness and holiness."',
    reference: '1 Timothy 2:1-2',
  },
  {
    text: '"Blessed is the nation whose God is the Lord, the people he chose for his inheritance."',
    reference: 'Psalm 33:12',
  },
  {
    text: '"Seek the peace and prosperity of the city to which I have carried you into exile. Pray to the Lord for it, because if it prospers, you too will prosper."',
    reference: 'Jeremiah 29:7',
  },
];

export default function PrayForNationScreen() {
  const route = useRoute<NationRouteProp>();
  const { countryCode } = route.params;
  const { showToast } = useAppContext();

  const [hasPrayed, setHasPrayed] = useState(false);

  const country = UNIQUE_COUNTRIES.find((c) => c.code === countryCode);
  const prayerPoints = NATION_PRAYER_POINTS[countryCode] || NATION_PRAYER_POINTS.default;
  const scripture = SCRIPTURES[Math.floor(Math.random() * SCRIPTURES.length)];

  const handlePray = () => {
    setHasPrayed(true);
    showToast('success', `Thank you for praying for ${country?.name || 'this nation'}!`);
  };

  if (!country) {
    return (
      <View style={styles.container}>
        <AppHeader title="Pray for Nation" showBack />
        <View style={styles.errorState}>
          <Text style={styles.errorText}>Country not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title={`Pray for ${country.name}`} showBack />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.flag}>{country.flag}</Text>
            <Text style={styles.countryName}>{country.name}</Text>
            <Text style={styles.subtitle}>Interceding for this nation</Text>
          </View>

          <View style={styles.contextCard}>
            <Text style={styles.contextText}>
              Beyond praying for individuals, Belebi invites you to lift up entire nations. Use these prayer points to guide your intercession for {country.name} and its people.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prayer Focus</Text>
            <View style={styles.pointsList}>
              {prayerPoints.map((point, index) => (
                <View key={index} style={styles.pointItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.pointText}>{point}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.scriptureCard}>
              <View style={styles.scriptureIcon}>
                <BookOpen size={20} color="#6B4F3E" />
              </View>
              <Text style={styles.scriptureText}>{scripture.text}</Text>
              <Text style={styles.scriptureRef}>— {scripture.reference}</Text>
            </View>
          </View>

          {hasPrayed ? (
            <View style={styles.successCard}>
              <CheckCircle size={24} color="#1A4731" />
              <View style={styles.successContent}>
                <Text style={styles.successTitle}>Prayer recorded</Text>
                <Text style={styles.successText}>Thank you for interceding for {country.name}!</Text>
              </View>
            </View>
          ) : (
            <PrimaryButton fullWidth size="lg" onPress={handlePray}>
              I Prayed for {country.name}
            </PrimaryButton>
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
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#5C3D2E',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  flag: {
    fontSize: 56,
    marginBottom: 12,
  },
  countryName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1C0F0A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#5C3D2E',
  },
  contextCard: {
    padding: 14,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
    borderRadius: 12,
    marginBottom: 8,
  },
  contextText: {
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 14,
  },
  pointsList: {
    gap: 12,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6B4F3E',
    marginTop: 6,
  },
  pointText: {
    flex: 1,
    fontSize: 15,
    color: '#5C3D2E',
    lineHeight: 22,
  },
  scriptureCard: {
    padding: 20,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#6B4F3E',
  },
  scriptureIcon: {
    marginBottom: 12,
  },
  scriptureText: {
    fontSize: 15,
    color: '#5C3D2E',
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 12,
  },
  scriptureRef: {
    fontSize: 13,
    color: '#7A5C4A',
    fontWeight: '500',
  },
  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: '#E8F5EE',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A8D5BE',
  },
  successContent: {
    flex: 1,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A4731',
  },
  successText: {
    fontSize: 14,
    color: '#1A4731',
    marginTop: 2,
  },
});
