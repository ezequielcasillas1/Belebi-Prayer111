import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search, Filter, Zap, ChevronRight, ChevronDown, Check, X } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import PrayerRequestCard from '../../../components/PrayerRequestCard';
import { PrimaryButton, SecondaryButton, GhostButton } from '../../../components/Buttons';
import { usePrayerStore } from '../stores/prayerStore';
import { PRAYER_REQUESTS, UNIQUE_COUNTRIES, DENOMINATIONS } from '../../../data/mockData';
import { RootStackParamList } from '../../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PrayerListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const hasSentPrayer = usePrayerStore((state) => state.hasSentPrayer);

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [countryFilter, setCountryFilter] = useState('');
  const [denominationFilter, setDenominationFilter] = useState('');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showDenominationPicker, setShowDenominationPicker] = useState(false);

  const filteredRequests = useMemo(() => {
    return PRAYER_REQUESTS
      .filter((r) => !hasSentPrayer(r.id))
      .filter((r) => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            r.name.toLowerCase().includes(query) ||
            r.country.toLowerCase().includes(query) ||
            r.requestText.toLowerCase().includes(query)
          );
        }
        return true;
      })
      .filter((r) => !countryFilter || r.countryCode === countryFilter)
      .filter((r) => !denominationFilter || r.denomination === denominationFilter)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [searchQuery, countryFilter, denominationFilter, hasSentPrayer]);

  const clearFilters = () => {
    setCountryFilter('');
    setDenominationFilter('');
    setSearchQuery('');
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const renderPicker = (
    visible: boolean,
    onClose: () => void,
    title: string,
    items: { label: string; value: string }[],
    selectedValue: string,
    onSelect: (value: string) => void
  ) => (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <X size={20} color="#1C0F0A" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            <TouchableOpacity
              style={[styles.modalItem, !selectedValue && styles.modalItemSelected]}
              onPress={() => { onSelect(''); onClose(); }}
            >
              <Text style={[styles.modalItemText, !selectedValue && styles.modalItemTextSelected]}>All</Text>
              {!selectedValue && <Check size={20} color="#6B4F3E" />}
            </TouchableOpacity>
            {items.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[styles.modalItem, selectedValue === item.value && styles.modalItemSelected]}
                onPress={() => { onSelect(item.value); onClose(); }}
              >
                <Text style={[styles.modalItemText, selectedValue === item.value && styles.modalItemTextSelected]}>
                  {item.label}
                </Text>
                {selectedValue === item.value && <Check size={20} color="#6B4F3E" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Prayer List" subtitle="People in need" showMenu onMenuPress={openDrawer} />

      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Search size={18} color="#7A5C4A" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search prayers..."
            placeholderTextColor="#9B7B6A"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} color={showFilters ? '#FFF' : '#6B4F3E'} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filterSection}>
          <TouchableOpacity style={styles.filterChip} onPress={() => setShowCountryPicker(true)}>
            <Text style={styles.filterChipText}>
              {countryFilter ? UNIQUE_COUNTRIES.find(c => c.code === countryFilter)?.name : 'All Countries'}
            </Text>
            <ChevronDown size={14} color="#6B4F3E" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip} onPress={() => setShowDenominationPicker(true)}>
            <Text style={styles.filterChipText}>
              {denominationFilter || 'All Denominations'}
            </Text>
            <ChevronDown size={14} color="#6B4F3E" />
          </TouchableOpacity>
          {(countryFilter || denominationFilter) && (
            <GhostButton size="sm" onPress={clearFilters}>Clear</GhostButton>
          )}
        </View>
      )}

      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PrayerRequestCard
            request={item}
            onPress={() => navigation.navigate('PrayerProfile', { requestId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No prayers found</Text>
            <Text style={styles.emptyText}>Try adjusting your filters</Text>
          </View>
        }
      />

      {renderPicker(
        showCountryPicker,
        () => setShowCountryPicker(false),
        'Select Country',
        UNIQUE_COUNTRIES.map((c) => ({ label: `${c.flag} ${c.name}`, value: c.code })),
        countryFilter,
        setCountryFilter
      )}

      {renderPicker(
        showDenominationPicker,
        () => setShowDenominationPicker(false),
        'Select Denomination',
        DENOMINATIONS.map((d) => ({ label: d, value: d })),
        denominationFilter,
        setDenominationFilter
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF9F4',
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF9F4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: '#1C0F0A',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FDF9F4',
    borderWidth: 1,
    borderColor: '#E8D8C8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#6B4F3E',
    borderColor: '#6B4F3E',
  },
  filterSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
    borderRadius: 8,
    gap: 6,
  },
  filterChipText: {
    fontSize: 13,
    color: '#5C3D2E',
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#7A5C4A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FDF9F4',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE0D4',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C0F0A',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalScroll: {
    padding: 8,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  modalItemSelected: {
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
  },
  modalItemText: {
    fontSize: 16,
    color: '#1C0F0A',
  },
  modalItemTextSelected: {
    fontWeight: '600',
    color: '#6B4F3E',
  },
});
