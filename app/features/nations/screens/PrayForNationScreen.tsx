import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { BookOpen, CheckCircle } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import { PrimaryButton } from '../../../components/Buttons';
import { useUIStore } from '../../../stores/uiStore';
import { UNIQUE_COUNTRIES, NATION_PRAYER_POINTS } from '../../../data/mockData';
import { RootStackParamList } from '../../../navigation/RootNavigator';

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
  const showToast = useUIStore((state) => state.showToast);

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
      <AppHeader title={`Pray for ${country.name}`} subtitle={country.flag} showBack />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.heroCard}>
            <Text style={styles.heroFlag}>{country.flag}</Text>
            <Text style={styles.heroTitle}>Intercede for {country.name}</Text>
            <Text style={styles.heroSubtitle}>
              Join believers worldwide in lifting up this nation in prayer
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BookOpen size={18} color="#6B4F3E" />
              <Text style={styles.sectionTitle}>Scripture to Guide Your Prayer</Text>
            </View>
            <View style={styles.scriptureCard}>
              <Text style={styles.scriptureText}>{scripture.text}</Text>
              <Text style={styles.scriptureRef}>— {scripture.reference}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prayer Points for {country.name}</Text>
            <View style={styles.pointsList}>
              {prayerPoints.map((point, index) => (
                <View key={index} style={styles.pointItem}>
                  <View style={styles.pointNumber}>
                    <Text style={styles.pointNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.pointText}>{point}</Text>
                </View>
              ))}
            </View>
          </View>

          {hasPrayed ? (
            <View style={styles.prayedCard}>
              <CheckCircle size={32} color="#4A7C59" />
              <Text style={styles.prayedTitle}>Thank You for Praying!</Text>
              <Text style={styles.prayedSubtitle}>
                Your prayers are a blessing to {country.name}
              </Text>
            </View>
          ) : (
            <View style={styles.actionSection}>
              <PrimaryButton onPress={handlePray}>I Have Prayed</PrimaryButton>
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
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#7A5C4A',
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(107, 79, 62, 0.04)',
    borderRadius: 16,
    marginBottom: 24,
  },
  heroFlag: {
    fontSize: 64,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C0F0A',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#7A5C4A',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C3D2E',
  },
  scriptureCard: {
    padding: 20,
    backgroundColor: '#FDF9F4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8D8C8',
  },
  scriptureText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#5C3D2E',
    lineHeight: 24,
    marginBottom: 12,
  },
  scriptureRef: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B4F3E',
    textAlign: 'right',
  },
  pointsList: {
    gap: 12,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    backgroundColor: '#FDF9F4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8D8C8',
  },
  pointNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#6B4F3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointNumberText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
  },
  pointText: {
    flex: 1,
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 20,
  },
  actionSection: {
    marginTop: 8,
    marginBottom: 40,
  },
  prayedCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(74, 124, 89, 0.08)',
    borderRadius: 14,
    marginBottom: 40,
  },
  prayedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A7C59',
    marginTop: 12,
    marginBottom: 6,
  },
  prayedSubtitle: {
    fontSize: 14,
    color: '#5C3D2E',
  },
});
