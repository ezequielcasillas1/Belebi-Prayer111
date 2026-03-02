import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Globe, Users, MessageCircle, ChevronRight } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import { UNIQUE_COUNTRIES } from '../../../data/mockData';
import { RootStackParamList } from '../../../navigation/RootNavigator';

type DetailRouteProp = RouteProp<RootStackParamList, 'CountryDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CountryDetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { countryCode } = route.params;

  const country = UNIQUE_COUNTRIES.find((c) => c.code === countryCode);

  if (!country) {
    return (
      <View style={styles.container}>
        <AppHeader title="Country" showBack />
        <View style={styles.errorState}>
          <Text style={styles.errorText}>Country not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title={country.name} showBack />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.hero}>
            <Text style={styles.flag}>{country.flag}</Text>
            <Text style={styles.countryName}>{country.name}</Text>
            <Text style={styles.region}>{country.region}</Text>
          </View>

          <View style={styles.statsCard}>
            <View style={styles.statsIcon}>
              <Users size={22} color="#6B4F3E" />
            </View>
            <View style={styles.statsContent}>
              <Text style={styles.statsLabel}>Active Prayer Requests</Text>
              <Text style={styles.statsValue}>{country.activeRequests}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EXPLORE</Text>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Directory', { countryCode })}
              activeOpacity={0.7}
            >
              <View style={styles.actionIcon}>
                <Users size={20} color="#6B4F3E" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Browse People</Text>
                <Text style={styles.actionSubtitle}>View prayer requests from {country.name}</Text>
              </View>
              <ChevronRight size={18} color="#9B7B6A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('PrayForNation', { countryCode })}
              activeOpacity={0.7}
            >
              <View style={styles.actionIcon}>
                <Globe size={20} color="#6B4F3E" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Pray for {country.name}</Text>
                <Text style={styles.actionSubtitle}>Intercede for this nation as a whole</Text>
              </View>
              <ChevronRight size={18} color="#9B7B6A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('LivePrayerRoom', { countryCode })}
              activeOpacity={0.7}
            >
              <View style={styles.actionIcon}>
                <MessageCircle size={20} color="#6B4F3E" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Live Prayer Room</Text>
                <Text style={styles.actionSubtitle}>Join believers praying for {country.name}</Text>
              </View>
              <ChevronRight size={18} color="#9B7B6A" />
            </TouchableOpacity>
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
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#7A5C4A',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  flag: {
    fontSize: 72,
    marginBottom: 12,
  },
  countryName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1C0F0A',
    marginBottom: 4,
  },
  region: {
    fontSize: 15,
    color: '#7A5C4A',
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
    borderRadius: 14,
    marginBottom: 28,
    gap: 14,
  },
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(107, 79, 62, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContent: {
    flex: 1,
  },
  statsLabel: {
    fontSize: 13,
    color: '#7A5C4A',
    marginBottom: 2,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C0F0A',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7A5C4A',
    letterSpacing: 1,
    marginBottom: 14,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FDF9F4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    marginBottom: 12,
    gap: 14,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 3,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#7A5C4A',
  },
});
