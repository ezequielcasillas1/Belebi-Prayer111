import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton, SecondaryButton } from '../../../components/Buttons';
import { useAuthStore } from '../stores/authStore';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { colors, gradients } from '../../../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WelcomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const login = useAuthStore((state) => state.login);

  const handleGuestLogin = () => {
    login({
      id: 'guest',
      firstName: 'Guest',
      country: 'Worldwide',
      countryCode: 'WW',
      flag: '🌍',
      denomination: '',
      email: '',
    });
  };

  return (
    <LinearGradient
      colors={gradients.primary.colors}
      locations={gradients.primary.locations}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconEmoji}>🙏</Text>
          </View>

          <View style={styles.heroSection}>
            <Text style={styles.title}>Belebi</Text>
            <Text style={styles.subtitle}>Prayer</Text>
            <View style={styles.divider} />
            <Text style={styles.description}>
              A global prayer community where believers intercede for one another across borders.
              Pray for individuals, nations, or join live prayer rooms.
            </Text>

            <View style={styles.featuresCard}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🌍</Text>
                <Text style={styles.featureText}>Pray for people & nations worldwide</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>💬</Text>
                <Text style={styles.featureText}>Join live prayer rooms by country</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🔒</Text>
                <Text style={styles.featureText}>Privacy-first: only name & country visible</Text>
              </View>
              <View style={[styles.featureItem, { marginBottom: 0 }]}>
                <Text style={styles.featureIcon}>⚡</Text>
                <Text style={styles.featureText}>Auto Mode finds who needs prayer most</Text>
              </View>
            </View>

            <View style={styles.statsCard}>
              <Text style={styles.statsText}>25+ Countries · Global Community</Text>
            </View>
          </View>

          <View style={styles.actionSection}>
            <PrimaryButton fullWidth size="lg" onPress={() => navigation.navigate('Setup')}>
              Create Account
            </PrimaryButton>

            <SecondaryButton fullWidth size="lg" onPress={() => navigation.navigate('Verify')}>
              Sign In
            </SecondaryButton>

            <View style={styles.orDivider}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.orLine} />
            </View>

            <TouchableOpacity onPress={handleGuestLogin}>
              <Text style={styles.guestLink}>Skip — explore as guest</Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: `${colors.secondary.dark}1F`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconEmoji: {
    fontSize: 36,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 17,
    color: colors.secondary.dark,
    letterSpacing: 2,
    marginTop: 4,
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: colors.secondary.medium,
    borderRadius: 2,
    marginVertical: 16,
  },
  description: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  featuresCard: {
    marginTop: 20,
    padding: 16,
    backgroundColor: colors.ui.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 16,
  },
  featureText: {
    fontSize: 13,
    color: colors.text.secondary,
    flex: 1,
  },
  statsCard: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: `${colors.secondary.dark}14`,
    borderRadius: 20,
  },
  statsText: {
    fontSize: 13,
    color: colors.secondary.dark,
    fontWeight: '600',
  },
  actionSection: {
    width: '100%',
    gap: 12,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.ui.border,
  },
  orText: {
    marginHorizontal: 16,
    fontSize: 13,
    color: colors.text.muted,
  },
  guestLink: {
    fontSize: 15,
    color: colors.secondary.dark,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  termsText: {
    fontSize: 12,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
  },
});
