import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, AlertTriangle, X } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import { PrimaryButton, SecondaryButton, GhostButton } from '../../../components/Buttons';
import { useCreatePrayerRequest, useDismissPrayerRequest } from '../hooks/usePrayerQueries';
import { IMG_LANDSCAPE, IMG_AFRICAN_WOMAN, IMG_ASIAN_MAN } from '../../../data/mockData';
import { RootStackParamList } from '../../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MOCK_IMAGES = [IMG_LANDSCAPE, IMG_AFRICAN_WOMAN, IMG_ASIAN_MAN];
const AUTO_DISMISS_OPTIONS = [
  { value: '1month' as const, label: '1 Month' },
  { value: '6months' as const, label: '6 Months' },
  { value: '1year' as const, label: '1 Year' },
];

export default function CreateRequestScreen() {
  const navigation = useNavigation<NavigationProp>();

  const createPrayerRequest = useCreatePrayerRequest();
  const dismissPrayerRequest = useDismissPrayerRequest();

  const [description, setDescription] = useState('');
  const [requestText, setRequestText] = useState('');
  const [profileImages, setProfileImages] = useState<string[]>([]);
  const [emergencyImages, setEmergencyImages] = useState<string[]>([]);
  const [autoDismiss, setAutoDismiss] = useState<'1month' | '6months' | '1year'>('1month');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

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
      return;
    }

    try {
      const result = await createPrayerRequest.mutateAsync({
        requestText: requestText.trim(),
        description: description.trim() || undefined,
        profileImages: profileImages.length > 0 ? profileImages : undefined,
        emergencyImages: emergencyImages.length > 0 ? emergencyImages : undefined,
        autoDismissTime: autoDismiss,
      });
      setCreatedRequestId(result.id);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleDismiss = async () => {
    if (createdRequestId) {
      await dismissPrayerRequest.mutateAsync(createdRequestId);
    }
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Prayer Request *</Text>
            <Text style={styles.sectionHint}>Share what you'd like the community to pray for</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Please pray for..."
              placeholderTextColor="#9B7B6A"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={requestText}
              onChangeText={setRequestText}
              maxLength={500}
            />
            <Text style={styles.charCount}>{requestText.length}/500</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Photos (Optional)</Text>
            <Text style={styles.sectionHint}>Add up to 3 photos to help personalize your request</Text>
            <View style={styles.imageGrid}>
              {profileImages.map((img, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: img }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveProfileImage(index)}
                  >
                    <X size={14} color="#FFF" />
                  </TouchableOpacity>
                </View>
              ))}
              {profileImages.length < 3 && (
                <TouchableOpacity style={styles.addImageButton} onPress={handleAddProfileImage}>
                  <Plus size={24} color="#6B4F3E" />
                  <Text style={styles.addImageText}>Add</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.emergencyHeader}>
              <AlertTriangle size={18} color="#7A5000" />
              <Text style={styles.emergencyTitle}>Emergency Photos (Optional)</Text>
            </View>
            <Text style={styles.sectionHint}>
              For urgent situations that may benefit from visual context
            </Text>
            <Text style={styles.exampleText}>
              Examples: hospital stays, car troubles, home damage, medical documents, or physical ailments you'd like prayed over
            </Text>
            <Text style={styles.warningText}>
              No graphic images (blood, gore, or visible injuries). Hospital photos are welcome if wounds are covered.
            </Text>
            <Text style={styles.moderationText}>
              Photos are automatically reviewed. Content violating guidelines will be removed.
            </Text>
            <View style={styles.imageGrid}>
              {emergencyImages.map((img, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: img }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveEmergencyImage(index)}
                  >
                    <X size={14} color="#FFF" />
                  </TouchableOpacity>
                </View>
              ))}
              {emergencyImages.length < 3 && (
                <TouchableOpacity
                  style={[styles.addImageButton, styles.addEmergencyButton]}
                  onPress={handleAddEmergencyImage}
                >
                  <Plus size={24} color="#7A5000" />
                  <Text style={[styles.addImageText, { color: '#7A5000' }]}>Add</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Auto-Dismiss</Text>
            <Text style={styles.sectionHint}>
              How long should this request remain active?
            </Text>
            <View style={styles.optionsRow}>
              {AUTO_DISMISS_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    autoDismiss === option.value && styles.optionButtonSelected,
                  ]}
                  onPress={() => setAutoDismiss(option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      autoDismiss === option.value && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.actions}>
            <PrimaryButton
              fullWidth
              size="lg"
              onPress={handleSubmit}
              loading={createPrayerRequest.isPending}
              disabled={!requestText.trim() || createPrayerRequest.isPending}
            >
              Submit Prayer Request
            </PrimaryButton>
            <SecondaryButton fullWidth onPress={() => navigation.goBack()} disabled={createPrayerRequest.isPending}>
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
    paddingBottom: 40,
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
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 6,
  },
  sectionHint: {
    fontSize: 13,
    color: '#7A5C4A',
    marginBottom: 12,
  },
  textArea: {
    minHeight: 140,
    padding: 14,
    backgroundColor: '#FDF9F4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4C4B0',
    fontSize: 15,
    color: '#1C0F0A',
    lineHeight: 22,
  },
  charCount: {
    fontSize: 12,
    color: '#9B7B6A',
    textAlign: 'right',
    marginTop: 6,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8D8C8',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addEmergencyButton: {
    borderColor: '#F5E6C8',
    backgroundColor: '#FFF8E7',
  },
  addImageText: {
    fontSize: 12,
    color: '#6B4F3E',
    fontWeight: '500',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A5000',
  },
  exampleText: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 6,
    lineHeight: 18,
  },
  warningText: {
    fontSize: 12,
    color: '#996600',
    marginBottom: 6,
    lineHeight: 18,
  },
  moderationText: {
    fontSize: 11,
    color: '#7A5000',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#FDF9F4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderColor: '#6B4F3E',
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
  },
  optionText: {
    fontSize: 14,
    color: '#5C3D2E',
  },
  optionTextSelected: {
    color: '#1C0F0A',
    fontWeight: '600',
  },
  actions: {
    gap: 12,
  },
});
