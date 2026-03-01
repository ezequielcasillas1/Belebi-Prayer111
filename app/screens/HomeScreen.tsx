import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search, Zap } from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import WorldMap from '../components/WorldMap';
import CountryActionModal from '../components/CountryActionModal';
import Badge from '../components/Badge';
import { PrimaryButton } from '../components/Buttons';
import { useAppContext } from '../context/AppContext';
import { UNIQUE_COUNTRIES, Country } from '../data/mockData';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { state } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const sortedCountries = [...UNIQUE_COUNTRIES]
    .sort((a, b) => b.activeRequests - a.activeRequests)
    .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const openDrawer = () => {
    // #region agent log
    const navState = (navigation as any).getState?.();
    const parentState = (navigation as any).getParent?.()?.getState?.();
    fetch('http://127.0.0.1:7300/ingest/57385e69-e00c-43a4-8874-7310b7792ce9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d1ade8'},body:JSON.stringify({sessionId:'d1ade8',runId:'fix-nav-structure',hypothesisId:'H3',location:'HomeScreen.tsx:openDrawer',message:'menu pressed - checking nav context',data:{navType:navState?.type,navRoutes:navState?.routeNames,parentType:parentState?.type,parentRoutes:parentState?.routeNames},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
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
          state.selectionMode === 'auto' ? (
            <Badge variant="success" size="sm">Auto</Badge>
          ) : null
        }
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>
              Welcome, {state.currentUser?.firstName || 'Friend'} 🌍
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

          {state.selectionMode === 'auto' && (
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

          <View style={styles.countriesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Countries</Text>
              <Text style={styles.sectionCount}>{UNIQUE_COUNTRIES.length} nations</Text>
            </View>

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

            <View style={styles.countryList}>
              {sortedCountries.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  style={styles.countryItem}
                  onPress={() => setSelectedCountry(country)}
                  activeOpacity={0.7}
                >
                  <View style={styles.countryLeft}>
                    <Text style={styles.countryFlag}>{country.flag}</Text>
                    <View>
                      <Text style={styles.countryName}>{country.name}</Text>
                      <Text style={styles.countryRegion}>{country.region}</Text>
                    </View>
                  </View>
                  <Badge variant="info" size="sm">{country.activeRequests}</Badge>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <CountryActionModal country={selectedCountry} onClose={() => setSelectedCountry(null)} />
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
  greeting: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
  },
  greetingSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  quickActionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    backgroundColor: colors.ui.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
  },
  quickActionIcon: {
    fontSize: 18,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  mapContainer: {
    marginBottom: 24,
    backgroundColor: colors.ui.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
    padding: 12,
    overflow: 'hidden',
  },
  autoCta: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.secondary.dark,
    borderRadius: 14,
    marginBottom: 24,
    gap: 12,
  },
  autoCtaIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoCtaContent: {
    flex: 1,
  },
  autoCtaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.light,
  },
  autoCtaSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  countriesSection: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  sectionCount: {
    fontSize: 13,
    color: colors.text.muted,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ui.card,
    borderWidth: 1,
    borderColor: colors.ui.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 46,
    fontSize: 15,
    color: colors.text.primary,
  },
  countryList: {
    gap: 8,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: colors.ui.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
  },
  countryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countryFlag: {
    fontSize: 28,
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
