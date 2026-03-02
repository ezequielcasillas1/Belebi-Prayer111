import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, ShieldCheck, Mail, Lock } from 'lucide-react-native';
import { PrimaryButton } from '../../../components/Buttons';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../../../stores/uiStore';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { supabase } from '../../../lib/supabase';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function VerifyScreen() {
  const navigation = useNavigation<NavigationProp>();
  const login = useAuthStore((state) => state.login);
  const showToast = useUIStore((state) => state.showToast);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = email.includes('@') && email.includes('.');
  const isValidPassword = password.length >= 6;
  const isValid = isValidEmail && isValidPassword;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSignIn = async () => {
    if (!isValid) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        showToast('error', error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        const metadata = data.user.user_metadata;
        
        login({
          id: data.user.id,
          firstName: metadata?.first_name || 'User',
          country: metadata?.country || 'Unknown',
          countryCode: metadata?.country_code || 'XX',
          flag: metadata?.flag || '🌍',
          denomination: metadata?.denomination || 'Prefer not to say',
          email: data.user.email || '',
        });

        showToast('success', 'Welcome back!');
      }
    } catch (err) {
      showToast('error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={22} color="#1C0F0A" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <ShieldCheck size={32} color="#6B4F3E" />
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue praying</Text>
        <Text style={styles.privacyNote}>
          Your information is securely encrypted and never shared.
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Mail size={20} color="#6B4F3E" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="your@email.com"
                placeholderTextColor="#9B7B6A"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#6B4F3E" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor="#9B7B6A"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton fullWidth size="lg" onPress={handleSignIn} disabled={!isValid} loading={loading}>
            Sign In
          </PrimaryButton>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Setup')} style={styles.createAccountLink}>
          <Text style={styles.createAccountText}>
            Don't have an account? <Text style={styles.createAccountTextBold}>Create one</Text>
          </Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(107, 79, 62, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1C0F0A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#5C3D2E',
    marginBottom: 8,
  },
  privacyNote: {
    fontSize: 13,
    color: '#7A5C4A',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    width: '100%',
    gap: 16,
  },
  inputContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF9F4',
    borderWidth: 1,
    borderColor: '#D4C4B0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C0F0A',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 32,
  },
  createAccountLink: {
    marginTop: 24,
  },
  createAccountText: {
    fontSize: 14,
    color: '#5C3D2E',
  },
  createAccountTextBold: {
    fontWeight: '600',
    color: '#6B4F3E',
  },
});
