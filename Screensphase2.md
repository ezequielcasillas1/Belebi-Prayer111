📱 SCREEN 4/16: HomeScreen.tsx
// app/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Zap, Search } from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import WorldMap from '../components/WorldMap';
import CountryActionModal from '../components/CountryActionModal';
import { PrimaryButton } from '../components/Buttons';
import Badge from '../components/Badge';
import { COUNTRIES, Country } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { MainDrawerParamList } from '../navigation/RootNavigator';

type NavigationProp = DrawerNavigationProp<MainDrawerParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { state } = useApp();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title="Belebi – Prayer"
        showMenu
        onMenuPress={() => navigation.openDrawer()}
        showSettings
        rightElement={
          state.selectionMode === 'auto' ? <Badge variant="success" size="sm">Auto</Badge> : undefined
        }
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>
            Welcome{state.currentUser ? `, ${state.currentUser.firstName}` : ''} 🌍
          </Text>
          <Text style={styles.greetingSubtitle}>Tap a country on the map to begin praying</Text>
        </View>

        {/* World Map */}
        <View style={styles.mapContainer}>
          <WorldMap countries={COUNTRIES} onCountrySelect={setSelectedCountry} />
        </View>

        {/* Auto Mode CTA */}
        {state.selectionMode === 'auto' && (
          <View style={styles.autoModeCTA}>
            <View style={styles.autoModeIcon}>
              <Zap size={22} color="#fff" />
            </View>
            <View style={styles.autoModeText}>
              <Text style={styles.autoModeTitle}>Auto Mode Active</Text>
              <Text style={styles.autoModeSubtitle}>We'll assign you someone who needs prayer most</Text>
            </View>
            <PrimaryButton size="sm" onPress={() => navigation.navigate('AutoMode')}>
              Pray Now
            </PrimaryButton>
          </View>
        )}

        {/* Countries Section */}
        <View style={styles.countriesSection}>
          <View style={styles.countriesHeader}>
            <Text style={styles.countriesTitle}>Countries</Text>
            <Text style={styles.countriesCount}>{COUNTRIES.length} nations</Text>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Search size={16} color="#9B7B6A" style={styles.searchIcon} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search countries…"
              placeholderTextColor="#9B7B6A"
              style={styles.searchInput}
            />
          </View>

          {/* Country List */}
          {filteredCountries
            .sort((a, b) => b.activeRequests - a.activeRequests)
            .map(country => (
              <TouchableOpacity
                key={country.code}
                onPress={() => setSelectedCountry(country)}
                style={styles.countryItem}
              >
                <Text style={styles.countryFlag}>{country.flag}</Text>
                <View style={styles.countryInfo}>
                  <Text style={styles.countryName}>{country.name}</Text>
                  <Text style={styles.countryRegion}>{country.region}</Text>
                </View>
                <Badge variant="neutral" size="sm">
                  {country.activeRequests}
                </Badge>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>

      {selectedCountry && (
        <CountryActionModal country={selectedCountry} onClose={() => setSelectedCountry(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfcfb' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  greetingContainer: { marginBottom: 16 },
  greetingTitle: { color: '#1C0F0A', fontSize: 17, fontWeight: '700', marginBottom: 3 },
  greetingSubtitle: { color: '#7A5C4A', fontSize: 13.5 },
  mapContainer: { marginBottom: 20 },
  autoModeCTA: {
    backgroundColor: 'rgba(107,79,62,0.1)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(107,79,62,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  autoModeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#6B4F3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoModeText: { flex: 1 },
  autoModeTitle: { color: '#1C0F0A', fontWeight: '600', fontSize: 14.5, marginBottom: 2 },
  autoModeSubtitle: { color: '#7A5C4A', fontSize: 12.5 },
  countriesSection: {},
  countriesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  countriesTitle: { color: '#1C0F0A', fontSize: 15.5, fontWeight: '700' },
  countriesCount: { color: '#9B7B6A', fontSize: 12.5 },
  searchContainer: { position: 'relative', marginBottom: 14 },
  searchIcon: { position: 'absolute', left: 12, top: 12, zIndex: 1 },
  searchInput: {
    paddingVertical: 10,
    paddingLeft: 36,
    paddingRight: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(139,111,94,0.25)',
    backgroundColor: 'rgba(253,249,244,0.85)',
    color: '#1C0F0A',
    fontSize: 14,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139,111,94,0.15)',
    marginBottom: 8,
  },
  countryFlag: { fontSize: 26, marginRight: 12 },
  countryInfo: { flex: 1 },
  countryName: { color: '#1C0F0A', fontSize: 15, fontWeight: '600', marginBottom: 2 },
  countryRegion: { color: '#9B7B6A', fontSize: 12 },
});
ok