📱 SCREEN 2/16: SetupScreen.tsx
// app/screens/SetupScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { PrimaryButton } from '../components/Buttons';
import { useApp } from '../context/AppContext';
import { COUNTRIES } from '../data/mockData';
import { RootStackParamList } from '../navigation/RootNavigator';

const DENOMINATIONS = [
  'Prefer not to say',
  'Anglican',
  'Baptist',
  'Catholic',
  'Charismatic',
  'Lutheran',
  'Methodist',
  'Non-denominational',
  'Orthodox',
  'Pentecostal',
  'Presbyterian',
  'Protestant',
  'Reformed',
  'Other',
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SetupScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { login } = useApp();
  const [firstName, setFirstName] = useState('');
  const [country, setCountry] = useState('');
  const [denomination, setDenomination] = useState('Prefer not to say');
  const [loading, setLoading] = useState(false);

  const selectedCountry = COUNTRIES.find(c => c.code === country);

  const handleFinish = async () => {
    if (!firstName.trim() || !country) return;
    setLoading(true);
    await new Promise(res => setTimeout(res, 600));
    login({
      id: `user-${Date.now()}`,
      firstName: firstName.trim(),
      country: selectedCountry?.name || country,
      countryCode: country,
      flag: selectedCountry?.flag || '🌍',
      denomination: denomination || 'Prefer not to say',
      email: 'user@example.com',
    });
  };

  const isValid = firstName.trim().length > 0 && country.length > 0;

  return (
    <LinearGradient colors={['#fdfcfb', '#e2d1c3']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={18} color="#6B4F3E" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Set Up Your Profile</Text>
          <Text style={styles.headerSubtitle}>Tell us a little about yourself</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Privacy Note */}
        <View style={styles.privacyNote}>
          <Text style={styles.privacyText}>
            🔒 <Text style={styles.boldText}>Privacy:</Text> Only your first name and country are visible to others.
            No city, address, or contact details are ever shared.
          </Text>
        </View>

        {/* First Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            First Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Your first name"
            placeholderTextColor="#9B7B6A"
            style={styles.input}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        {/* Country */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Country <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={country}
              onValueChange={setCountry}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Select your country" value="" />
              {COUNTRIES.sort((a, b) => a.name.localeCompare(b.name)).map(c => (
                <Picker.Item key={c.code} label={`${c.flag} ${c.name}`} value={c.code} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Denomination */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Denomination <Text style={styles.optionalText}>(optional)</Text>
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={denomination}
              onValueChange={setDenomination}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {DENOMINATIONS.map(d => (
                <Picker.Item key={d} label={d} value={d} />
              ))}
            </Picker>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton fullWidth size="lg" onPress={handleFinish} disabled={!isValid || loading}>
          {loading ? 'Setting up…' : 'Finish – Join the Community'}
        </PrimaryButton>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 48, paddingBottom: 24, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(107,79,62,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#1C0F0A', fontSize: 19, fontWeight: '700' },
  headerSubtitle: { color: '#9B7B6A', fontSize: 12.5 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, gap: 24 },
  privacyNote: {
    padding: 12,
    backgroundColor: 'rgba(107,79,62,0.07)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(107,79,62,0.15)',
  },
  privacyText: { color: '#5C3D2E', fontSize: 13, lineHeight: 19.5 },
  boldText: { fontWeight: '700' },
  fieldContainer: { gap: 8 },
  label: { color: '#5C3D2E', fontSize: 14.5, fontWeight: '600' },
  required: { color: '#7A1E1E' },
  optionalText: { color: '#9B7B6A', fontSize: 12.5, fontWeight: '400' },
  input: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(139,111,94,0.3)',
    backgroundColor: 'rgba(253,249,244,0.9)',
    color: '#1C0F0A',
    fontSize: 16,
  },
  pickerContainer: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(139,111,94,0.3)',
    backgroundColor: 'rgba(253,249,244,0.9)',
    overflow: 'hidden',
  },
  picker: { color: '#1C0F0A' },
  pickerItem: { fontSize: 16 },
  footer: { padding: 32, paddingBottom: 24 },
});
NOTE: Install Picker:

npx expo install @react-native-picker/picker