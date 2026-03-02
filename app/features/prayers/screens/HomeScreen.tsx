import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search, Zap } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import WorldMap from '../../../components/WorldMap';
import CountryActionModal from '../../../components/CountryActionModal';
import Badge from '../../../components/Badge';
import { PrimaryButton } from '../../../components/Buttons';
import { useAuthStore } from '../../auth/stores/authStore';
import { usePlanStore } from '../../planning/stores/planStore';
import { UNIQUE_COUNTRIES, Country } from '../../../data/mockData';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { colors } from '../../../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const currentUser = useAuthStore((state) => state.currentUser);
  const selectionMode = usePlanStore((state) => state.selectionMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const sortedCountries = [...UNIQUE_COUNTRIES]
    .sort((a, b) => b.activeRequests - a.activeRequests)
    .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Belebi – Prayer"
        showMenu
        showSettings
        onMenuPress={openDrawer}
        rightElement={
          selectionMode === 'auto' ? (
            <Badge variant="success" size="sm">Auto</Badge>
          ) : null
        }
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>
              Welcome, {currentUser?.firstName || 'Friend'} 🌍
            </Text>
            <Text style={styles.greetingSubtext}>
              Tap a country to pray for its people and nation
            </Text>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => (navigation as any).navigate('PrayerListDrawer')}
              activeOpacity={0.7}
            >
              <Text style={styles.quickActionIcon}>👥</Text>
              <Text style={styles.quickActionText}>Pray for People</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => (navigation as any).navigate('CreateRequestDrawer')}
              activeOpacity={0.7}
            >
              <Text style={styles.quickActionIcon}>✍️</Text>
              <Text style={styles.quickActionText}>Ask for Prayer</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mapContainer}>
            <WorldMap countries={UNIQUE_COUNTRIES} onCountrySelect={setSelectedCountry} />
          </View>

          {selectionMode === 'auto' && (
            <TouchableOpacity
              style={styles.autoCta}
              onPress={() => navigation.navigate('AutoMode')}
              activeOpacity={0.8}
            >
              <View style={styles.autoCtaIcon}>
                <Zap size={24} color="#FFF" fill="#FFF" />
              </View>
              <View style={styles.autoCtaContent}>
                <Text style={styles.autoCtaTitle}>Auto Mode Active</Text>
                <Text style={styles.autoCtaSubtitle}>We've selected someone who needs prayer</Text>
              </View>
              <PrimaryButton size="sm" onPress={() => navigation.navigate('AutoMode')}>
                Pray Now
              </PrimaryButton>
            </TouchableOpacity>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Browse by Country</Text>
            <View style={styles.searchContainer}>
              <Search size={18} color="#7A5C4A" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search countries..."
                placeholderTextColor="#9B7B6A"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          <FlatList
            data={sortedCountries}
            keyExtractor={(item) => item.code}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.countryItem}
                onPress={() => setSelectedCountry(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.countryFlag}>{item.flag}</Text>
                <View style={styles.countryInfo}>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryRegion}>{item.region}</Text>
                </View>
                <Badge variant="country">{item.activeRequests}</Badge>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>

      <CountryActionModal
        country={selectedCountry}
        onClose={() => setSelectedCountry(null)}
      />
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
    paddingBottom: 40,
  },
  greeting: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 6,
  },
  greetingSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickActionCard: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.ui.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    fontSize: 28,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  mapContainer: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.ui.card,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
  },
  autoCta: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.secondary.dark,
    borderRadius: 16,
    marginBottom: 24,
    gap: 12,
  },
  autoCtaIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoCtaContent: {
    flex: 1,
  },
  autoCtaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
  autoCtaSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ui.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.ui.border,
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 46,
    fontSize: 15,
    color: colors.text.primary,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.ui.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
    marginBottom: 8,
    gap: 12,
  },
  countryFlag: {
    fontSize: 24,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  countryRegion: {
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 2,
  },
});
