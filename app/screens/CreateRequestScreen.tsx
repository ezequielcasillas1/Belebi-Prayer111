import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Sparkles, Plus, AlertTriangle, X } from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import { PrimaryButton, SecondaryButton, GhostButton } from '../components/Buttons';
import { useAppContext } from '../context/AppContext';
import { AI_REQUEST_DRAFTS, IMG_LANDSCAPE, IMG_AFRICAN_WOMAN, IMG_ASIAN_MAN } from '../data/mockData';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MOCK_IMAGES = [IMG_LANDSCAPE, IMG_AFRICAN_WOMAN, IMG_ASIAN_MAN];
const AUTO_DISMISS_OPTIONS = [
  { value: '1month', label: '1 Month' },
  { value: '6months', label: '6 Months' },
  { value: '1year', label: '1 Year' },
];

export default function CreateRequestScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { state, showToast } = useAppContext();

  const [denomination, setDenomination] = useState('');
  const [requestText, setRequestText] = useState('');
  const [profileImages, setProfileImages] = useState<string[]>([]);
  const [emergencyImages, setEmergencyImages] = useState<string[]>([]);
  const [autoDismiss, setAutoDismiss] = useState('1month');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const randomDraft = AI_REQUEST_DRAFTS[Math.floor(Math.random() * AI_REQUEST_DRAFTS.length)];
    setRequestText(randomDraft);
    setIsGeneratingAI(false);
  };

  const handleAddProfileImage = () => {
    if (profileImages.length < 3) {
      const availableImages = MOCK_IMAGES.filter((img) => !profileImages.includes(img));
      if (availableImages.length > 0) {
        setProfileImages([...profileImages, availableImages[0]]);
      }
    }
  };

  const handleAddEmergencyImage = () => {
    if (emergencyImages.length < 3) {
      const availableImages = MOCK_IMAGES.filter((img) => !emergencyImages.includes(img));
      if (availableImages.length > 0) {
        setEmergencyImages([...emergencyImages, availableImages[0]]);
      }
    }
  };

  const handleRemoveProfileImage = (index: number) => {
    setProfileImages(profileImages.filter((_, i) => i !== index));
  };

  const handleRemoveEmergencyImage = (index: number) => {
    setEmergencyImages(emergencyImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!requestText.trim()) {
      showToast('error', 'Please write your prayer request');
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSubmitted(true);
    showToast('success', 'Prayer request submitted!');
  };

  const handleDismiss = () => {
    showToast('info', 'Request dismissed');
    navigation.goBack();
  };

  if (isSubmitted) {
    return (
      <View style={styles.container}>
        <AppHeader title="Ask for Prayer" showMenu showBack />
        <View style={styles.submittedState}>
          <Text style={styles.submittedEmoji}>🙏</Text>
          <Text style={styles.submittedTitle}>Request Submitted!</Text>
          <Text style={styles.submittedText}>
            Your prayer request has been shared with the community. Believers around the world will be praying for you.
          </Text>
          <PrimaryButton onPress={() => (navigation as any).navigate('HomeDrawer')}>Back to Home</PrimaryButton>
          <GhostButton onPress={handleDismiss} icon={<X size={16} color="#7A1E1E" />}>
            <Text style={{ color: '#7A1E1E' }}>Dismiss Supplication</Text>
          </GhostButton>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Ask for Prayer" subtitle="Submit a prayer request" showMenu showBack />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>How it works</Text>
            <Text style={styles.introText}>
              Share your prayer need with the global community. Believers worldwide will intercede for you — you'll be notified when someone prays.
            </Text>
          </View>

          <View style={styles.privacyNote}>
            <Text style={styles.privacyText}>
              🔒 <Text style={styles.privacyBold}>Privacy-first:</Text> Only your first name and country are visible. Your identity is never shared with those who pray for you.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Name</Text>
              <View style={styles.readonlyInput}>
                <Text style={styles.readonlyText}>{state.currentUser?.firstName || 'Guest'}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Denomination (Optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Baptist, Catholic, Non-denominational"
                placeholderTextColor="#9B7B6A"
                value={denomination}
                onChangeText={setDenomination}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Prayer Request *</Text>
                <TouchableOpacity onPress={handleGenerateAI} disabled={isGeneratingAI}>
                  <View style={styles.aiButton}>
                    <Sparkles size={14} color="#6B4F3E" />
                    <Text style={styles.aiButtonText}>AI Draft</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.textArea}
                placeholder="Share what you'd like prayer for..."
                placeholderTextColor="#9B7B6A"
                value={requestText}
                onChangeText={setRequestText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                maxLength={800}
              />
              <Text style={styles.charCount}>{requestText.length}/800</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Profile Images (up to 3)</Text>
              <View style={styles.imageGrid}>
                {profileImages.map((img, index) => (
                  <View key={index} style={styles.imageThumb}>
                    <Image source={{ uri: img }} style={styles.thumbImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => handleRemoveProfileImage(index)}
                    >
                      <X size={12} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                ))}
                {profileImages.length < 3 && (
                  <TouchableOpacity style={styles.addImageButton} onPress={handleAddProfileImage}>
                    <Plus size={24} color="#6B4F3E" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.emergencyLabel}>
                <AlertTriangle size={16} color="#7A1E1E" />
                <Text style={[styles.label, { color: '#7A1E1E' }]}>Emergency Images (up to 3)</Text>
              </View>
              <Text style={styles.helperText}>
                For urgent situations only. These images help convey the urgency of your request.
              </Text>
              <View style={styles.imageGrid}>
                {emergencyImages.map((img, index) => (
                  <View key={index} style={styles.imageThumb}>
                    <Image source={{ uri: img }} style={[styles.thumbImage, styles.emergencyThumb]} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => handleRemoveEmergencyImage(index)}
                    >
                      <X size={12} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                ))}
                {emergencyImages.length < 3 && (
                  <TouchableOpacity
                    style={[styles.addImageButton, styles.addEmergencyButton]}
                    onPress={handleAddEmergencyImage}
                  >
                    <AlertTriangle size={20} color="#7A1E1E" />
                    <Plus size={16} color="#7A1E1E" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Auto-Dismiss After</Text>
              <View style={styles.radioGroup}>
                {AUTO_DISMISS_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.radioOption, autoDismiss === option.value && styles.radioOptionSelected]}
                    onPress={() => setAutoDismiss(option.value)}
                  >
                    <View style={[styles.radioCircle, autoDismiss === option.value && styles.radioCircleSelected]}>
                      {autoDismiss === option.value && <View style={styles.radioInner} />}
                    </View>
                    <Text style={[styles.radioLabel, autoDismiss === option.value && styles.radioLabelSelected]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <PrimaryButton fullWidth size="lg" onPress={handleSubmit} loading={isSubmitting}>
              Submit Prayer Request
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
    padding: 20,
  },
  submittedState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 16,
  },
  submittedEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  submittedTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C0F0A',
  },
  submittedText: {
    fontSize: 15,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  introCard: {
    padding: 16,
    backgroundColor: 'rgba(107, 79, 62, 0.04)',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#6B4F3E',
  },
  introTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 6,
  },
  introText: {
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 20,
  },
  privacyNote: {
    padding: 14,
    backgroundColor: '#E8F5EE',
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#A8D5BE',
  },
  privacyText: {
    fontSize: 13,
    color: '#1A4731',
    lineHeight: 18,
  },
  privacyBold: {
    fontWeight: '600',
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 6,
  },
  aiButtonText: {
    fontSize: 13,
    color: '#6B4F3E',
    fontWeight: '500',
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D4C4B0',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1C0F0A',
    backgroundColor: '#FDF9F4',
  },
  readonlyInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: 'rgba(107, 79, 62, 0.04)',
  },
  readonlyText: {
    fontSize: 15,
    color: '#5C3D2E',
  },
  textArea: {
    minHeight: 140,
    padding: 14,
    borderWidth: 1,
    borderColor: '#D4C4B0',
    borderRadius: 12,
    fontSize: 15,
    color: '#1C0F0A',
    backgroundColor: '#FDF9F4',
    lineHeight: 22,
  },
  charCount: {
    fontSize: 12,
    color: '#9B7B6A',
    textAlign: 'right',
  },
  helperText: {
    fontSize: 13,
    color: '#7A5C4A',
    lineHeight: 18,
  },
  emergencyLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  emergencyThumb: {
    borderWidth: 2,
    borderColor: '#F5AAAA',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D4C4B0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addEmergencyButton: {
    borderColor: '#F5AAAA',
    gap: 4,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    flex: 1,
  },
  radioOptionSelected: {
    borderColor: '#6B4F3E',
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#D4C4B0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#6B4F3E',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6B4F3E',
  },
  radioLabel: {
    fontSize: 13,
    color: '#5C3D2E',
    fontWeight: '500',
  },
  radioLabelSelected: {
    color: '#1C0F0A',
  },
  actions: {
    marginTop: 32,
    gap: 12,
  },
});
