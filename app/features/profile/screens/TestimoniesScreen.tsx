import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  Modal, TextInput, ActivityIndicator, ScrollView 
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { 
  Heart, Calendar, Eye, EyeOff, Trash2, Plus, X, Check,
  ChevronDown, ChevronUp, Globe, Lock, Pencil
} from 'lucide-react-native';
import { format } from 'date-fns';
import AppHeader from '../../../components/AppHeader';
import Badge from '../../../components/Badge';
import { PrimaryButton, SecondaryButton } from '../../../components/Buttons';
import { 
  useAnsweredPrayers, 
  usePublicTestimonies, 
  useAddAnsweredPrayer,
  useDeleteAnsweredPrayer,
  useUpdateTestimony
} from '../hooks/useProfileStats';
import { AnsweredPrayer, PublicTestimony } from '../../../types/database';
import { colors } from '../../../theme/colors';

const MONTHS = [
  { num: 1, name: 'Jan' },
  { num: 2, name: 'Feb' },
  { num: 3, name: 'Mar' },
  { num: 4, name: 'Apr' },
  { num: 5, name: 'May' },
  { num: 6, name: 'Jun' },
  { num: 7, name: 'Jul' },
  { num: 8, name: 'Aug' },
  { num: 9, name: 'Sep' },
  { num: 10, name: 'Oct' },
  { num: 11, name: 'Nov' },
  { num: 12, name: 'Dec' },
];

const START_YEAR = 2026;

function getAvailableYears(): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = START_YEAR; y <= currentYear; y++) {
    years.push(y);
  }
  return years;
}

function PrivateTestimonyCard({ 
  testimony, 
  onDelete,
  onTogglePublic
}: { 
  testimony: AnsweredPrayer; 
  onDelete: (id: string) => void;
  onTogglePublic: (id: string, isPublic: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.card, expanded && styles.cardExpanded]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <View style={styles.dateRow}>
            <Calendar size={14} color={colors.text.muted} />
            <Text style={styles.dateText}>
              {format(new Date(testimony.answered_at), 'MMM d, yyyy')}
            </Text>
          </View>
          <Text style={styles.testimonyPreview} numberOfLines={expanded ? undefined : 2}>
            {testimony.testimony_text}
          </Text>
        </View>
        <View style={styles.cardRight}>
          <View style={[
            styles.visibilityBadge, 
            testimony.is_public ? styles.publicBadge : styles.privateBadge
          ]}>
            {testimony.is_public ? (
              <Eye size={12} color={colors.accent.green} />
            ) : (
              <Lock size={12} color={colors.text.muted} />
            )}
            <Text style={[
              styles.visibilityText,
              testimony.is_public && styles.publicText
            ]}>
              {testimony.is_public ? 'Public' : 'Private'}
            </Text>
          </View>
          {expanded ? (
            <ChevronUp size={18} color={colors.text.muted} />
          ) : (
            <ChevronDown size={18} color={colors.text.muted} />
          )}
        </View>
      </View>

      {expanded && (
        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onTogglePublic(testimony.id, !testimony.is_public)}
          >
            {testimony.is_public ? (
              <>
                <Lock size={16} color={colors.secondary.dark} />
                <Text style={styles.actionText}>Make Private</Text>
              </>
            ) : (
              <>
                <Globe size={16} color={colors.secondary.dark} />
                <Text style={styles.actionText}>Make Public</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete(testimony.id)}
          >
            <Trash2 size={16} color={colors.error.text} />
            <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

function PublicTestimonyCard({ testimony }: { testimony: PublicTestimony }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.card, styles.publicCard]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.publicHeader}>
        <View style={styles.authorRow}>
          <Text style={styles.authorFlag}>{testimony.author.flag}</Text>
          <Text style={styles.authorName}>{testimony.author.first_name}</Text>
        </View>
        <Text style={styles.publicDate}>
          {format(new Date(testimony.answered_at), 'MMM d, yyyy')}
        </Text>
      </View>
      <Text style={styles.publicTestimony} numberOfLines={expanded ? undefined : 3}>
        "{testimony.testimony_text}"
      </Text>
      {!expanded && testimony.testimony_text.length > 150 && (
        <Text style={styles.readMore}>Tap to read more...</Text>
      )}
    </TouchableOpacity>
  );
}

export default function TestimoniesScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'private' | 'public'>('private');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTestimony, setNewTestimony] = useState('');
  const [newIsPublic, setNewIsPublic] = useState(false);

  const { data: myTestimonies, isLoading: myLoading } = useAnsweredPrayers();
  const { data: publicTestimonies, isLoading: publicLoading } = usePublicTestimonies(selectedYear, selectedMonth);
  const { mutate: addTestimony, isPending: isAdding } = useAddAnsweredPrayer();
  const { mutate: deleteTestimony } = useDeleteAnsweredPrayer();
  const { mutate: updateTestimony } = useUpdateTestimony();

  const availableYears = getAvailableYears();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleAddTestimony = () => {
    if (!newTestimony.trim()) return;
    addTestimony(
      { testimonyText: newTestimony.trim(), isPublic: newIsPublic },
      {
        onSuccess: () => {
          setShowAddModal(false);
          setNewTestimony('');
          setNewIsPublic(false);
        },
      }
    );
  };

  const handleTogglePublic = (id: string, isPublic: boolean) => {
    updateTestimony({ id, updates: { is_public: isPublic } });
  };

  const renderPrivateTab = () => {
    if (myLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.secondary.dark} />
        </View>
      );
    }

    if (!myTestimonies || myTestimonies.length === 0) {
      return (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Heart size={36} color={colors.secondary.dark} />
          </View>
          <Text style={styles.emptyTitle}>No Testimonies Yet</Text>
          <Text style={styles.emptySubtitle}>
            Record how God has answered your prayers to remember His faithfulness
          </Text>
          <PrimaryButton 
            icon={<Plus size={18} color="#FFF" />}
            onPress={() => setShowAddModal(true)}
          >
            Add Your First Testimony
          </PrimaryButton>
        </View>
      );
    }

    return (
      <FlatList
        data={myTestimonies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PrivateTestimonyCard 
            testimony={item} 
            onDelete={deleteTestimony}
            onTogglePublic={handleTogglePublic}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <TouchableOpacity 
            style={styles.addCardButton}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.7}
          >
            <Plus size={20} color={colors.secondary.dark} />
            <Text style={styles.addCardText}>Add New Testimony</Text>
          </TouchableOpacity>
        }
      />
    );
  };

  const renderPublicTab = () => {
    const monthName = MONTHS.find(m => m.num === selectedMonth)?.name || '';

    return (
      <View style={styles.publicContainer}>
        {/* Year Selector */}
        <TouchableOpacity 
          style={styles.yearSelector}
          onPress={() => setShowYearPicker(true)}
        >
          <Calendar size={18} color={colors.secondary.dark} />
          <Text style={styles.yearText}>{selectedYear}</Text>
          <ChevronDown size={18} color={colors.secondary.dark} />
        </TouchableOpacity>

        {/* Month Pills */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.monthScroll}
          contentContainerStyle={styles.monthScrollContent}
        >
          {MONTHS.map((month) => (
            <TouchableOpacity
              key={month.num}
              style={[
                styles.monthPill,
                selectedMonth === month.num && styles.monthPillActive
              ]}
              onPress={() => setSelectedMonth(month.num)}
            >
              <Text style={[
                styles.monthPillText,
                selectedMonth === month.num && styles.monthPillTextActive
              ]}>
                {month.num}
              </Text>
              <Text style={[
                styles.monthPillName,
                selectedMonth === month.num && styles.monthPillNameActive
              ]}>
                {month.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Testimonies List */}
        {publicLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.secondary.dark} />
          </View>
        ) : !publicTestimonies || publicTestimonies.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Globe size={36} color={colors.text.muted} />
            </View>
            <Text style={styles.emptyTitle}>No Testimonies</Text>
            <Text style={styles.emptySubtitle}>
              No public testimonies for {monthName} {selectedYear}
            </Text>
          </View>
        ) : (
          <FlatList
            data={publicTestimonies}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PublicTestimonyCard testimony={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text style={styles.resultsCount}>
                {publicTestimonies.length} {publicTestimonies.length === 1 ? 'testimony' : 'testimonies'} in {monthName} {selectedYear}
              </Text>
            }
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader 
        title="Testimonies" 
        subtitle="Answered Prayers"
        showMenu 
        onMenuPress={openDrawer} 
      />

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'private' && styles.tabActive]}
          onPress={() => setActiveTab('private')}
        >
          <Lock size={16} color={activeTab === 'private' ? colors.secondary.dark : colors.text.muted} />
          <Text style={[styles.tabText, activeTab === 'private' && styles.tabTextActive]}>
            My Testimonies
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'public' && styles.tabActive]}
          onPress={() => setActiveTab('public')}
        >
          <Globe size={16} color={activeTab === 'public' ? colors.secondary.dark : colors.text.muted} />
          <Text style={[styles.tabText, activeTab === 'public' && styles.tabTextActive]}>
            Public Feed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'private' ? renderPrivateTab() : renderPublicTab()}

      {/* Add Testimony Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Testimony</Text>
              <TouchableOpacity 
                onPress={() => setShowAddModal(false)} 
                style={styles.modalClose}
              >
                <X size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Share how God answered your prayer</Text>
              <TextInput
                style={styles.textArea}
                placeholder="God answered my prayer when..."
                placeholderTextColor={colors.text.muted}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                value={newTestimony}
                onChangeText={setNewTestimony}
              />
              <TouchableOpacity 
                style={styles.publicToggle}
                onPress={() => setNewIsPublic(!newIsPublic)}
              >
                <View style={[styles.checkbox, newIsPublic && styles.checkboxChecked]}>
                  {newIsPublic && <Check size={14} color="#FFF" />}
                </View>
                <View style={styles.toggleContent}>
                  <Text style={styles.toggleLabel}>Share publicly</Text>
                  <Text style={styles.toggleHint}>Encourage others with your testimony</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              <SecondaryButton onPress={() => setShowAddModal(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton 
                onPress={handleAddTestimony}
                loading={isAdding}
                disabled={!newTestimony.trim()}
              >
                Save
              </PrimaryButton>
            </View>
          </View>
        </View>
      </Modal>

      {/* Year Picker Modal */}
      <Modal visible={showYearPicker} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowYearPicker(false)}
        >
          <View style={styles.yearPickerContent}>
            <Text style={styles.yearPickerTitle}>Select Year</Text>
            {availableYears.map((year) => (
              <TouchableOpacity
                key={year}
                style={[
                  styles.yearOption,
                  selectedYear === year && styles.yearOptionActive
                ]}
                onPress={() => {
                  setSelectedYear(year);
                  setShowYearPicker(false);
                }}
              >
                <Text style={[
                  styles.yearOptionText,
                  selectedYear === year && styles.yearOptionTextActive
                ]}>
                  {year}
                </Text>
                {selectedYear === year && (
                  <Check size={18} color={colors.secondary.dark} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ui.background,
  },
  tabBar: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 0,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.ui.background,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
  },
  tabActive: {
    backgroundColor: `${colors.secondary.dark}10`,
    borderColor: colors.secondary.dark,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.muted,
  },
  tabTextActive: {
    color: colors.secondary.dark,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: `${colors.secondary.dark}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: `${colors.secondary.dark}08`,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.secondary.dark,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  addCardText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondary.dark,
  },
  card: {
    backgroundColor: colors.ui.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardExpanded: {
    borderColor: colors.secondary.dark,
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  cardLeft: {
    flex: 1,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: colors.text.muted,
  },
  testimonyPreview: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  visibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  privateBadge: {
    backgroundColor: colors.ui.borderLight,
  },
  publicBadge: {
    backgroundColor: `${colors.accent.green}15`,
  },
  visibilityText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.muted,
  },
  publicText: {
    color: colors.accent.green,
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.ui.borderLight,
    padding: 12,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: `${colors.secondary.dark}10`,
  },
  deleteButton: {
    backgroundColor: `${colors.error.text}10`,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondary.dark,
  },
  deleteText: {
    color: colors.error.text,
  },
  publicContainer: {
    flex: 1,
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: `${colors.secondary.dark}08`,
    borderRadius: 10,
  },
  yearText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary.dark,
  },
  monthScroll: {
    maxHeight: 70,
    marginTop: 12,
  },
  monthScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  monthPill: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.ui.background,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
    minWidth: 50,
  },
  monthPillActive: {
    backgroundColor: colors.secondary.dark,
    borderColor: colors.secondary.dark,
  },
  monthPillText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  monthPillTextActive: {
    color: '#FFF',
  },
  monthPillName: {
    fontSize: 10,
    color: colors.text.muted,
    marginTop: 2,
  },
  monthPillNameActive: {
    color: 'rgba(255,255,255,0.8)',
  },
  resultsCount: {
    fontSize: 13,
    color: colors.text.muted,
    marginBottom: 12,
  },
  publicCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.green,
  },
  publicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorFlag: {
    fontSize: 20,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  publicDate: {
    fontSize: 12,
    color: colors.text.muted,
  },
  publicTestimony: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 21,
    fontStyle: 'italic',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  readMore: {
    fontSize: 12,
    color: colors.secondary.dark,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.ui.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.borderLight,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
  },
  modalClose: {
    padding: 8,
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 120,
    padding: 14,
    backgroundColor: colors.ui.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.ui.border,
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 22,
    marginBottom: 16,
  },
  publicToggle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.secondary.dark,
    borderColor: colors.secondary.dark,
  },
  toggleContent: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
  },
  toggleHint: {
    fontSize: 13,
    color: colors.text.muted,
    marginTop: 2,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingTop: 0,
    justifyContent: 'flex-end',
  },
  yearPickerContent: {
    backgroundColor: colors.ui.background,
    marginHorizontal: 40,
    marginTop: 'auto',
    marginBottom: 'auto',
    borderRadius: 16,
    padding: 8,
  },
  yearPickerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.borderLight,
    marginBottom: 8,
  },
  yearOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  yearOptionActive: {
    backgroundColor: `${colors.secondary.dark}10`,
  },
  yearOptionText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  yearOptionTextActive: {
    fontWeight: '600',
    color: colors.secondary.dark,
  },
});
