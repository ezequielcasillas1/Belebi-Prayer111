import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, ShieldCheck, Mail, Phone } from 'lucide-react-native';
import { PrimaryButton } from '../components/Buttons';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Step = 'email' | 'otp-email' | 'phone' | 'otp-phone';

const STEPS: Step[] = ['email', 'otp-email', 'phone', 'otp-phone'];
const STEP_LABELS: Record<Step, string> = {
  email: 'Enter your email',
  'otp-email': 'Verify your email',
  phone: 'Enter your phone number',
  'otp-phone': 'Verify your phone',
};

export default function VerifyScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const otpRefs = useRef<(TextInput | null)[]>([]);

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = ((stepIndex + 1) / 4) * 100;

  const handleBack = () => {
    if (stepIndex === 0) {
      navigation.goBack();
    } else {
      setCurrentStep(STEPS[stepIndex - 1]);
      setOtp(['', '', '', '', '', '']);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);

    if (stepIndex < 3) {
      setCurrentStep(STEPS[stepIndex + 1]);
      setOtp(['', '', '', '', '', '']);
    } else {
      navigation.navigate('Setup');
    }
  };

  const handleResendCode = () => {
    setOtp(['', '', '', '', '', '']);
  };

  const isValid = () => {
    if (currentStep === 'email') return email.includes('@') && email.includes('.');
    if (currentStep === 'phone') return phone.length >= 10;
    if (currentStep === 'otp-email' || currentStep === 'otp-phone') {
      return otp.every((digit) => digit !== '');
    }
    return false;
  };

  const renderStepContent = () => {
    if (currentStep === 'email') {
      return (
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
      );
    }

    if (currentStep === 'phone') {
      return (
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Phone size={20} color="#6B4F3E" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="+1 (555) 123-4567"
              placeholderTextColor="#9B7B6A"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.otpContainer}>
        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (otpRefs.current[index] = ref)}
              style={[styles.otpInput, digit && styles.otpInputFilled]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleResendCode} style={styles.resendButton}>
          <Text style={styles.resendText}>Resend code</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={22} color="#1C0F0A" />
        </TouchableOpacity>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <ShieldCheck size={32} color="#6B4F3E" />
        </View>

        <Text style={styles.stepCounter}>Step {stepIndex + 1} of 4</Text>
        <Text style={styles.stepLabel}>{STEP_LABELS[currentStep]}</Text>
        <Text style={styles.privacyNote}>
          Your information is securely encrypted and never shared.
        </Text>

        {renderStepContent()}

        <View style={styles.buttonContainer}>
          <PrimaryButton fullWidth size="lg" onPress={handleContinue} disabled={!isValid()} loading={loading}>
            {stepIndex === 3 ? 'Complete Verification' : 'Continue'}
          </PrimaryButton>
        </View>
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
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(107, 79, 62, 0.1)',
    marginHorizontal: 24,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6B4F3E',
    borderRadius: 2,
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
  stepCounter: {
    fontSize: 13,
    color: '#7A5C4A',
    fontWeight: '500',
  },
  stepLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C0F0A',
    marginTop: 8,
    marginBottom: 8,
  },
  privacyNote: {
    fontSize: 14,
    color: '#5C3D2E',
    textAlign: 'center',
    marginBottom: 32,
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
  otpContainer: {
    width: '100%',
    alignItems: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  otpInput: {
    width: 46,
    height: 56,
    borderWidth: 1,
    borderColor: '#D4C4B0',
    borderRadius: 12,
    backgroundColor: '#FDF9F4',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1C0F0A',
  },
  otpInputFilled: {
    borderColor: '#6B4F3E',
    backgroundColor: 'rgba(107, 79, 62, 0.05)',
  },
  resendButton: {
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#6B4F3E',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 40,
  },
});
