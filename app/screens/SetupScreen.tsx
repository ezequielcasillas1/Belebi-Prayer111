import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, ChevronDown, Check } from 'lucide-react-native';
import { PrimaryButton } from '../components/Buttons';
import { useAppContext } from '../context/AppContext';
import { UNIQUE_COUNTRIES, DENOMINATIONS } from '../data/mockData';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const sortedCountries = [...UNIQUE_COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));

export default function SetupScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { login, showToast } = useAppContext();

  const [firstName, setFirstName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<typeof sortedCountries[0] | null>(null);
  const [selectedDenomination, setSelectedDenomination] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showDenominationPicker, setShowDenominationPicker] = useState(false);

  const isValid = firstName.trim().length > 0 && selectedCountry !== null;

  const handleSubmit = async () => {
    if (!isValid || !selectedCountry) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    login({
      id: `user_${Date.now()}`,
      firstName: firstName.trim(),
      country: selectedCountry.name,
      countryCode: selectedCountry.code,
      flag: selectedCountry.flag,
      denomination: selectedDenomination || 'Prefer not to say',
      email: '',
    });

    showToast('success', 'Welcome to Belebi Prayer!');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
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
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[styles.modalItem, selectedValue === item.value && styles.modalItemSelected]}
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
              >
                <Text
                  style={[styles.modalItemText, selectedValue === item.value && styles.modalItemTextSelected]}
                >
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={22} color="#1C0F0A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Set Up Your Profile</Text>
        <Text style={styles.subtitle}>Tell us a little about yourself</Text>

        <View style={styles.privacyCard}>
          <Text style={styles.privacyIcon}>🔒</Text>
          <Text style={styles.privacyText}>
            Only your first name and country are visible to others. Your email and other details remain
            private.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Your first name"
              placeholderTextColor="#9B7B6A"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Country *</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowCountryPicker(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.selectButtonText, !selectedCountry && styles.selectPlaceholder]}>
                {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : 'Select your country'}
              </Text>
              <ChevronDown size={20} color="#6B4F3E" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Denomination (Optional)</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowDenominationPicker(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.selectButtonText, !selectedDenomination && styles.selectPlaceholder]}>
                {selectedDenomination || 'Prefer not to say'}
              </Text>
              <ChevronDown size={20} color="#6B4F3E" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton fullWidth size="lg" onPress={handleSubmit} disabled={!isValid} loading={loading}>
            Finish — Join the Community
          </PrimaryButton>
        </View>
      </ScrollView>

      {renderPicker(
        showCountryPicker,
        () => setShowCountryPicker(false),
        'Select Country',
        sortedCountries.map((c) => ({ label: `${c.flag} ${c.name}`, value: c.code })),
        selectedCountry?.code || '',
        (code) => setSelectedCountry(sortedCountries.find((c) => c.code === code) || null)
      )}

      {renderPicker(
        showDenominationPicker,
        () => setShowDenominationPicker(false),
        'Select Denomination',
        DENOMINATIONS.map((d) => ({ label: d, value: d })),
        selectedDenomination,
        setSelectedDenomination
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF9F4',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1C0F0A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#5C3D2E',
    marginBottom: 24,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(107, 79, 62, 0.12)',
    marginBottom: 28,
    gap: 12,
  },
  privacyIcon: {
    fontSize: 20,
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 20,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C0F0A',
  },
  textInput: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D4C4B0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1C0F0A',
    backgroundColor: '#FDF9F4',
  },
  selectButton: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D4C4B0',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FDF9F4',
  },
  selectButtonText: {
    fontSize: 16,
    color: '#1C0F0A',
  },
  selectPlaceholder: {
    color: '#9B7B6A',
  },
  buttonContainer: {
    marginTop: 32,
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
  modalCloseText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B4F3E',
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
