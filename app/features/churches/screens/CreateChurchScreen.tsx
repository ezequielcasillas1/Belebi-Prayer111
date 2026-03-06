import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Church, CheckCircle } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import { PrimaryButton, SecondaryButton } from '../../../components/Buttons';
import { useAuthStore } from '../../auth/stores/authStore';
import { useUIStore } from '../../../stores/uiStore';
import { churchService } from '../api/churchService';
import { DENOMINATIONS } from '../../../config/constants';
import { RootStackParamList } from '../../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CreateChurchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const supabaseProfile = useAuthStore((state) => state.supabaseProfile);
  const currentUser = useAuthStore((state) => state.currentUser);
  const showToast = useUIStore((state) => state.showToast);
  const [name, setName] = useState('');
  const [denomination, setDenomination] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = supabaseProfile?.id || currentUser?.id;

  const handleCreate = async () => {
    if (!name.trim() || !denomination || !userId) return;

    try {
      setIsCreating(true);
      setError(null);
      const church = await churchService.createChurch(name.trim(), denomination, userId);
      showToast('success', `${church.name} created successfully!`);
      navigation.navigate('ChurchSettings', { churchId: church.id });
    } catch (err: any) {
      setError(err.message || 'Failed to create church');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Create Church" showBack />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Church size={40} color="#6B4F3E" />
            </View>
          </View>

          <Text style={styles.title}>Create a Church Community</Text>
          <Text style={styles.subtitle}>
            Set up a private prayer space for your congregation. Members will be able to share and respond to prayer requests.
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Church Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Grace Community Church"
                placeholderTextColor="#9B7B6A"
                value={name}
                onChangeText={setName}
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Denomination *</Text>
              <View style={styles.denominationGrid}>
                {DENOMINATIONS.filter(d => d !== 'Prefer not to say').map((denom) => (
                  <TouchableOpacity
                    key={denom}
                    style={[
                      styles.denominationOption,
                      denomination === denom && styles.denominationOptionSelected,
                    ]}
                    onPress={() => setDenomination(denom)}
                    activeOpacity={0.7}
                  >
                    {denomination === denom && (
                      <CheckCircle size={14} color="#6B4F3E" style={styles.checkIcon} />
                    )}
                    <Text
                      style={[
                        styles.denominationText,
                        denomination === denom && styles.denominationTextSelected,
                      ]}
                    >
                      {denom}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {error && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>After creating your church:</Text>
            <Text style={styles.noteText}>• You'll receive a unique invite code to share</Text>
            <Text style={styles.noteText}>• Members can join using this code</Text>
            <Text style={styles.noteText}>• You can manage members in Church Settings</Text>
          </View>

          <View style={styles.actions}>
            <PrimaryButton
              fullWidth
              size="lg"
              onPress={handleCreate}
              loading={isCreating}
              disabled={!name.trim() || !denomination}
            >
              Create Church
            </PrimaryButton>
            <SecondaryButton fullWidth onPress={() => navigation.goBack()}>
              Cancel
            </SecondaryButton>
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
    padding: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(107, 79, 62, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C0F0A',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  form: {
    gap: 20,
    marginBottom: 20,
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
  denominationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  denominationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    backgroundColor: '#FDF9F4',
  },
  denominationOptionSelected: {
    borderColor: '#6B4F3E',
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
  },
  checkIcon: {
    marginRight: 6,
  },
  denominationText: {
    fontSize: 14,
    color: '#5C3D2E',
  },
  denominationTextSelected: {
    color: '#1C0F0A',
    fontWeight: '600',
  },
  errorCard: {
    padding: 14,
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5AAAA',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#7A1E1E',
    textAlign: 'center',
  },
  noteCard: {
    padding: 16,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
    borderRadius: 14,
    marginBottom: 24,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 10,
  },
  noteText: {
    fontSize: 13,
    color: '#5C3D2E',
    lineHeight: 20,
  },
  actions: {
    gap: 12,
  },
});
