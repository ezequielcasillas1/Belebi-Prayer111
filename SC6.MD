// app/screens/PrayForNationScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CheckCircle, BookOpen } from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import { PrimaryButton } from '../components/Buttons';
import { COUNTRIES, NATION_PRAYER_POINTS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/RootNavigator';

type RouteProps = RouteProp<RootStackParamList, 'PrayForNation'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SCRIPTURES = [
  { ref: '1 Timothy 2:1-2', text: '"I urge, then, first of all, that petitions, prayers, intercession and thanksgiving be made for all people—for kings and all those in authority."' },
  { ref: 'Psalm 33:12', text: '"Blessed is the nation whose God is the LORD, the people he chose for his inheritance."' },
  { ref: 'Jeremiah 29:7', text: '"Also, seek the peace and prosperity of the city to which I have carried you into exile. Pray to the LORD for it, because if it prospers, you too will prosper."' },
];

export default function PrayForNationScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { showToast } = useApp();
  const [prayed, setPrayed] = useState(false);
  const { code } = route.params;
  const country = COUNTRIES.find(c => c.code === code);

  const prayerPoints = NATION_PRAYER_POINTS[code] || NATION_PRAYER_POINTS.default;
  const scripture = SCRIPTURES[Math.floor(Math.random() * SCRIPTURES.length)];

  const handlePrayed = () => {
    setPrayed(true);
    showToast('success', `Recorded: You prayed for ${country?.name}. 🙏`);
  };

  if (!country) {
    return (
      <View style={styles.container}>
        <AppHeader title="Pray for Nation" showBack />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Country not found.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title={`Pray for ${country.name}`} showBack />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Flag & Title */}
        <View style={styles.headerSection}>
          <Text style={styles.flag}>{country.flag}</Text>
          <Text style={styles.countryName}>{country.name}</Text>
          <Text style={styles.subtitle}>Interceding for this nation</Text>
        </View>

        {/* Prayer Focus */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🙏 Prayer Focus</Text>
          <View style={styles.prayerPointsContainer}>
            {prayerPoints.map((point, i) => (
              <View
                key={i}
                style={[
                  styles.prayerPointItem,
                  i < prayerPoints.length - 1 && styles.prayerPointBorder,
                ]}
              >
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.prayerPointText}>{point}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Scripture */}
        <View style={styles.scriptureContainer}>
          <BookOpen size={18} color="#8B6F5E" style={styles.scriptureIcon} />
          <View style={styles.scriptureContent}>
            <Text style={styles.scriptureText}>{scripture.text}</Text>
            <Text style={styles.scriptureRef}>— {scripture.ref}</Text>
          </View>
        </View>

        {/* CTA */}
        {!prayed ? (
          <PrimaryButton fullWidth size="lg" onPress={handlePrayed}>
            I Prayed for {country.name}
          </PrimaryButton>
        ) : (
          <View style={styles.successContainer}>
            <CheckCircle size={20} color="#1A4731" />
            <Text style={styles.successText}>Prayer recorded. Thank you!</Text>
          </View>
        )}

        <Text style={styles.footerText}>
          This is logged to your history. No public counts are shown.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfcfb' },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#7A5C4A' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 32 },
  headerSection: { alignItems: 'center', marginBottom: 24 },
  flag: { fontSize: 56, lineHeight: 56, marginBottom: 8 },
  countryName: { color: '#1C0F0A', fontSize: 20, fontWeight: '700', marginBottom: 2 },
  subtitle: { color: '#7A5C4A', fontSize: 13 },
  section: { marginBottom: 24 },
  sectionTitle: { color: '#1C0F0A', fontSize: 15.5, fontWeight: '700', marginBottom: 12 },
  prayerPointsContainer: {
    backgroundColor: 'rgba(253,249,244,0.9)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(139,111,94,0.18)',
    overflow: 'hidden',
  },
  prayerPointItem: { padding: 14, flexDirection: 'row', gap: 10 },
  prayerPointBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(139,111,94,0.1)' },
  bullet: { color: '#8B6F5E', marginTop: 2 },
  prayerPointText: { flex: 1, color: '#5C3D2E', fontSize: 14, lineHeight: 21 },
  scriptureContainer: {
    backgroundColor: 'rgba(107,79,62,0.07)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(107,79,62,0.15)',
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  scriptureIcon: { marginTop: 2 },
  scriptureContent: { flex: 1 },
  scriptureText: { color: '#5C3D2E', fontSize: 14, fontStyle: 'italic', lineHeight: 22, marginBottom: 6 },
  scriptureRef: { color: '#8B6F5E', fontSize: 12.5, fontWeight: '600' },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#E8F5EE',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A8D5BE',
  },
  successText: { color: '#1A4731', fontWeight: '600', fontSize: 15.5 },
  footerText: { textAlign: 'center', color: '#9B7B6A', fontSize: 12, marginTop: 12 },
});
📱 SCREEN 7/16: PrayerListScreen.tsx
// app/screens/PrayerListScreen.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Filter, Zap, Search } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import AppHeader from '../components/AppHeader';
import PrayerRequestCard from '../components/PrayerRequestCard';
import { PRAYER_REQUESTS, COUNTRIES } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { MainDrawerParamList, RootStackParamList } from '../navigation/RootNavigator';

type DrawerNavProp = DrawerNavigationProp<MainDrawerParamList>;
type StackNavProp = NativeStackNavigationProp<RootStackParamList>;

export default function PrayerListScreen() {
  const drawerNavigation = useNavigation<DrawerNavProp>();
  const stackNavigation = useNavigation<StackNavProp>();
  const { state, hasSentPrayer } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterDenom, setFilterDenom] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const denominations = useMemo(() => {
    const denoms = new Set(PRAYER_REQUESTS.map(r => r.denomination).filter(Boolean));
    return Array.from(denoms).sort();
  }, []);

  const filteredRequests = useMemo(() => {
    let requests = PRAYER_REQUESTS.filter(r => !hasSentPrayer(r.id));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      requests = requests.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.country.toLowerCase().includes(q) ||
        r.requestText.toLowerCase().includes(q)
      );
    }
    if (filterCountry) {
      requests = requests.filter(r => r.countryCode === filterCountry);
    }
    if (filterDenom) {
      requests = requests.filter(r => r.denomination === filterDenom);
    }
    return requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [searchQuery, filterCountry, filterDenom, hasSentPrayer]);

  const hasActiveFilters = filterCountry || filterDenom;

  return (
    <View style={styles.container}>
      <AppHeader
        title="Prayer List"
        subtitle="People in need"
        showMenu
        onMenuPress={() => drawerNavigation.openDrawer()}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.topSection}>
          {/* Auto Mode CTA */}
          {state.selectionMode === 'auto' ? (
            <TouchableOpacity
              onPress={() => stackNavigation.navigate('AutoMode')}
              style={styles.autoCTA}
            >
              <Zap size={22} color="#fff" />
              <View style={styles.autoCTAText}>
                <Text style={styles.autoCTATitle}>Pray Where Needed Most (Auto)</Text>
                <Text style={styles.autoCTASubtitle}>Get your next auto-assignment</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => stackNavigation.navigate('Directory')}
              style={styles.directoryCTA}
            >
              <Text style={styles.directoryCTAText}>Browse A–Z Directory →</Text>
            </TouchableOpacity>
          )}

          {/* Search */}
          <View style={styles.searchContainer}>
            <Search size={16} color="#9B7B6A" style={styles.searchIcon} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by name, country, or keyword…"
              placeholderTextColor="#9B7B6A"
              style={styles.searchInput}
            />
            <TouchableOpacity
              onPress={() => setShowFilters(f => !f)}
              style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
            >
              <Filter size={15} color={hasActiveFilters ? '#fff' : '#9B7B6A'} />
            </TouchableOpacity>
          </View>

          {/* Filters */}
          {showFilters && (
            <View style={styles.filtersContainer}>
              <View style={styles.filterRow}>
                <View style={styles.filterField}>
                  <Text style={styles.filterLabel}>Country</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={filterCountry}
                      onValueChange={setFilterCountry}
                      style={styles.picker}
                    >
                      <Picker.Item label="All countries" value="" />
                      {COUNTRIES.sort((a, b) => a.name.localeCompare(b.name)).map(c => (
                        <Picker.Item key={c.code} label={`${c.flag} ${c.name}`} value={c.code} />
                      ))}
                    </Picker>
                  </View>
                </View>
                <View style={styles.filterField}>
                  <Text style={styles.filterLabel}>Denomination</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={filterDenom}
                      onValueChange={setFilterDenom}
                      style={styles.picker}
                    >
                      <Picker.Item label="All denominations" value="" />
                      {denominations.map(d => (
                        <Picker.Item key={d} label={d} value={d} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
              {hasActiveFilters && (
                <TouchableOpacity
                  onPress={() => {
                    setFilterCountry('');
                    setFilterDenom('');
                  }}
                >
                  <Text style={styles.clearFiltersText}>× Clear filters</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Results Count */}
          <Text style={styles.resultsCount}>
            {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
            {hasActiveFilters || searchQuery ? ' (filtered)' : ' total'}
          </Text>
        </View>

        {/* Request List */}
        <View style={styles.listContainer}>
          {filteredRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>
                {state.sentPrayers.length > 0 && !searchQuery && !hasActiveFilters
                  ? "You've prayed for all available requests. More will be added soon!"
                  : 'No requests match your search. Try different terms.'}
              </Text>
            </View>
          ) : (
            filteredRequests.map(request => (
              <PrayerRequestCard key={request.id} request={request} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfcfb' },
  scrollView: { flex: 1 },
  topSection: { padding: 16, paddingTop: 14 },
  autoCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: '#6B4F3E',
    borderRadius: 14,
    marginBottom: 14,
  },
  autoCTAText: { flex: 1 },
  autoCTATitle: { color: '#fff', fontWeight: '700', fontSize: 15.5 },
  autoCTASubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12.5 },
  directoryCTA: {
    padding: 12,
    backgroundColor: 'rgba(107,79,62,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(107,79,62,0.2)',
    borderRadius: 12,
    marginBottom: 14,
  },
  directoryCTAText: { color: '#5C3D2E', fontWeight: '600', fontSize: 14 },
  searchContainer: { position: 'relative', marginBottom: 10 },
  searchIcon: { position: 'absolute', left: 12, top: 10, zIndex: 1 },
  searchInput: {
    paddingVertical: 10,
    paddingLeft: 36,
    paddingRight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(139,111,94,0.25)',
    backgroundColor: 'rgba(253,249,244,0.85)',
    color: '#1C0F0A',
    fontSize: 14,
  },
  filterButton: { position: 'absolute', right: 8, top: 10, padding: 4, borderRadius: 6 },
  filterButtonActive: { backgroundColor: '#6B4F3E' },
  filtersContainer: {
    backgroundColor: 'rgba(253,249,244,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(139,111,94,0.18)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  filterField: { flex: 1 },
  filterLabel: { color: '#5C3D2E', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  pickerContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139,111,94,0.25)',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: { color: '#1C0F0A' },
  clearFiltersText: { color: '#7A1E1E', fontSize: 12.5, fontWeight: '600' },
  resultsCount: { color: '#9B7B6A', fontSize: 12.5 },
  listContainer: { paddingHorizontal: 16, paddingBottom: 32 },
  emptyState: { alignItems: 'center', paddingVertical: 32, paddingHorizontal: 16 },
  emptyEmoji: { fontSize: 32, marginBottom: 8 },
  emptyText: { color: '#7A5C4A', fontSize: 14, textAlign: 'center' },
});
📱 SCREEN 8/16: PrayerProfileScreen.tsx
📱 SCREEN 10/16: PrayersSentScreen.tsx
// app/screens/PrayersSentScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Send, ChevronRight, Calendar } from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import { SecondaryButton } from '../components/Buttons';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PrayersSentScreen() {
  const { state } = useApp();
  const navigation = useNavigation<NavigationProp>();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sentPrayers = state.sentPrayers;

  return (
    <View style={styles.container}>
      <AppHeader title="Prayers Sent" subtitle={`${sentPrayers.length} submitted`} showBack />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {sentPrayers.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Send size={30} color="#8B6F5E" />
            </View>
            <Text style={styles.emptyTitle}>No Prayers Sent Yet</Text>
            <Text style={styles.emptyText}>
              When you submit a prayer for someone, it will appear here as your personal record.
            </Text>
            <SecondaryButton onPress={() => navigation.navigate('PrayerList')}>
              Find Someone to Pray For
            </SecondaryButton>
          </View>
        ) : (
          <View>
            <Text style={styles.noteText}>
              Your personal prayer history. Not visible to anyone else.
            </Text>
            {sentPrayers.map(prayer => {
              const isExpanded = expandedId === prayer.id;
              return (
                <TouchableOpacity
                  key={prayer.id}
                  onPress={() => setExpandedId(isExpanded ? null : prayer.id)}
                  style={styles.prayerCard}
                  activeOpacity={0.7}
                >
                  {/* Summary Row */}
                  <View style={styles.summaryRow}>
                    <View style={styles.summaryLeft}>
                      <Text style={styles.prayerName} numberOfLines={1}>
                        {prayer.requestSnapshot.name}
                      </Text>
                      <View style={styles.countryRow}>
                        <Text style={styles.flag}>{prayer.requestSnapshot.flag}</Text>
                        <Text style={styles.countryText}>{prayer.requestSnapshot.country}</Text>
                      </View>
                    </View>
                    <View style={styles.summaryRight}>
                      <View style={styles.dateRow}>
                        <Calendar size={11} color="#9B7B6A" />
                        <Text style={styles.dateText}>{formatDate(prayer.submittedAt)}</Text>
                      </View>
                      <View style={styles.sentBadge}>
                        <Text style={styles.sentText}>🙏 Sent</Text>
                      </View>
                    </View>
                    <ChevronRight
                      size={15}
                      color="#9B7B6A"
                      style={[
                        styles.chevron,
                        isExpanded && styles.chevronExpanded,
                      ]}
                    />
                  </View>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <View style={styles.expandedDetail}>
                      <View style={styles.detailSection}>
                        <Text style={styles.detailTitle}>THEIR REQUEST</Text>
                        <Text style={styles.detailRequestText}>
                          "{prayer.requestSnapshot.requestText}"
                        </Text>
                      </View>
                      <View style={styles.detailSection}>
                        <Text style={styles.detailTitle}>YOUR PRAYER</Text>
                        <Text style={styles.detailPrayerText}>{prayer.prayerText}</Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfcfb' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 16 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(107,79,62,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { color: '#1C0F0A', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptyText: { color: '#7A5C4A', fontSize: 13.5, lineHeight: 20, textAlign: 'center', marginBottom: 16 },
  noteText: { color: '#9B7B6A', fontSize: 12.5, marginBottom: 14 },
  prayerCard: {
    backgroundColor: 'rgba(253,249,244,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(139,111,94,0.18)',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  summaryLeft: { flex: 1, minWidth: 0 },
  prayerName: { color: '#1C0F0A', fontWeight: '600', fontSize: 15, marginBottom: 2 },
  countryRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  flag: { fontSize: 13.5 },
  countryText: { color: '#7A5C4A', fontSize: 12.5 },
  summaryRight: { alignItems: 'flex-end' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  dateText: { color: '#9B7B6A', fontSize: 11.5 },
  sentBadge: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    backgroundColor: '#E8F5EE',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A8D5BE',
  },
  sentText: { color: '#1A4731', fontSize: 11, fontWeight: '600' },
  chevron: {},
  chevronExpanded: { transform: [{ rotate: '90deg' }] },
  expandedDetail: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(139,111,94,0.12)',
    padding: 14,
  },
  detailSection: { marginBottom: 14 },
  detailTitle: { color: '#5C3D2E', fontSize: 12.5, fontWeight: '600', marginBottom: 6, letterSpacing: 0.5 },
  detailRequestText: { color: '#5C3D2E', fontSize: 13.5, lineHeight: 21, fontStyle: 'italic' },
  detailPrayerText: { color: '#1C0F0A', fontSize: 13.5, lineHeight: 22 },
});