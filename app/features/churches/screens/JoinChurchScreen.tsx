import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Church, KeyRound } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import { PrimaryButton, SecondaryButton } from '../../../components/Buttons';
import { useAuthStore } from '../../auth/stores/authStore';
import { useUIStore } from '../../../stores/uiStore';
import { churchService } from '../api/churchService';
import { RootStackParamList } from '../../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function JoinChurchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const supabaseProfile = useAuthStore((state) => state.supabaseProfile);
  const currentUser = useAuthStore((state) => state.currentUser);
  const showToast = useUIStore((state) => state.showToast);
  const [inviteCode, setInviteCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = supabaseProfile?.id || currentUser?.id;

  const handleJoin = async () => {
    if (!inviteCode.trim() || !userId) return;

    try {
      setIsJoining(true);
      setError(null);
      const church = await churchService.joinChurchByCode(inviteCode.trim(), userId);
      showToast('success', `Welcome to ${church.name}!`);
      navigation.navigate('ChurchDetail', { churchId: church.id });
    } catch (err: any) {
      setError(err.message || 'Failed to join church');
    } finally {
      setIsJoining(false);
    }
  };

  const formatCode = (text: string) => {
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    return cleaned.slice(0, 8);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Join Church" showBack />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Church size={40} color="#6B4F3E" />
            </View>
          </View>

          <Text style={styles.title}>Join a Church Community</Text>
          <Text style={styles.subtitle}>
            Enter the invite code shared by your church leader to join their prayer community.
          </Text>

          <View style={styles.inputSection}>
            <View style={styles.inputLabel}>
              <KeyRound size={16} color="#5C3D2E" />
              <Text style={styles.labelText}>Invite Code</Text>
            </View>
            <TextInput
              style={styles.codeInput}
              placeholder="Enter 8-character code"
              placeholderTextColor="#9B7B6A"
              value={inviteCode}
              onChangeText={(text) => setInviteCode(formatCode(text))}
              autoCapitalize="characters"
              maxLength={8}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>How to get an invite code:</Text>
            <Text style={styles.infoText}>1. Ask your church leader for the code</Text>
            <Text style={styles.infoText}>2. They can find it in Church Settings</Text>
            <Text style={styles.infoText}>3. The code is 8 characters (letters & numbers)</Text>
          </View>

          <View style={styles.actions}>
            <PrimaryButton
              fullWidth
              size="lg"
              onPress={handleJoin}
              loading={isJoining}
              disabled={inviteCode.length !== 8}
            >
              Join Church
            </PrimaryButton>
            <SecondaryButton fullWidth onPress={() => navigation.goBack()}>
              Cancel
            </SecondaryButton>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF9F4',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
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
    fontSize: 24,
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
    marginBottom: 32,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C3D2E',
  },
  codeInput: {
    height: 56,
    borderWidth: 2,
    borderColor: '#D4C4B0',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 20,
    fontWeight: '600',
    color: '#1C0F0A',
    textAlign: 'center',
    letterSpacing: 4,
    backgroundColor: '#FDF9F4',
  },
  errorText: {
    fontSize: 13,
    color: '#7A1E1E',
    marginTop: 8,
    textAlign: 'center',
  },
  infoCard: {
    padding: 16,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
    borderRadius: 14,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#5C3D2E',
    lineHeight: 20,
  },
  actions: {
    gap: 12,
  },
});
