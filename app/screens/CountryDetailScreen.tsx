import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Globe, Users, MessageCircle, ChevronRight } from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import { UNIQUE_COUNTRIES } from '../data/mockData';
import { RootStackParamList } from '../navigation/RootNavigator';

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
            <Text style={styles.sectionTitle}>How would you like to pray?</Text>

            <View style={styles.actionCards}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('PrayForNation', { countryCode: country.code })}
                activeOpacity={0.7}
              >
                <View style={styles.actionIconBox}>
                  <Globe size={24} color="#6B4F3E" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Pray for the Nation</Text>
                  <Text style={styles.actionSubtitle}>Intercede for {country.name}</Text>
                </View>
                <ChevronRight size={20} color="#9B7B6A" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('Directory', { countryCode: country.code })}
                activeOpacity={0.7}
              >
                <View style={styles.actionIconBox}>
                  <Users size={24} color="#6B4F3E" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Pray for the People</Text>
                  <Text style={styles.actionSubtitle}>{country.activeRequests} active requests</Text>
                </View>
                <ChevronRight size={20} color="#9B7B6A" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('LivePrayerRoom', { countryCode: country.code })}
                activeOpacity={0.7}
              >
                <View style={styles.actionIconBox}>
                  <MessageCircle size={24} color="#6B4F3E" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Live Prayer Room</Text>
                  <Text style={styles.actionSubtitle}>Join believers praying together</Text>
                </View>
                <ChevronRight size={20} color="#9B7B6A" />
              </TouchableOpacity>
            </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#5C3D2E',
  },
  hero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  flag: {
    fontSize: 64,
    marginBottom: 12,
  },
  countryName: {
    fontSize: 28,
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
    gap: 14,
    padding: 18,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    marginBottom: 28,
  },
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(107, 79, 62, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContent: {
    flex: 1,
  },
  statsLabel: {
    fontSize: 14,
    color: '#7A5C4A',
    marginBottom: 2,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C0F0A',
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C0F0A',
  },
  actionCards: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: '#FDF9F4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8D8C8',
  },
  actionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(107, 79, 62, 0.1)',
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
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#7A5C4A',
    marginTop: 2,
  },
});
