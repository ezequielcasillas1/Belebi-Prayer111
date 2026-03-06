import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MapPin, Eye, BookmarkPlus, Pencil, X, Flag, AlertTriangle, CheckCircle } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import ImageCarousel from '../../../components/ImageCarousel';
import ReportModal from '../../../components/ReportModal';
import Badge from '../../../components/Badge';
import TranslatedText from '../../../components/TranslatedText';
import { PrimaryButton, SecondaryButton, GhostButton, IconButton } from '../../../components/Buttons';
import { usePrayerStore } from '../stores/prayerStore';
import { usePlanStore } from '../../planning/stores/planStore';
import { useUIStore } from '../../../stores/uiStore';
import { PRAYER_REQUESTS } from '../../../data/mockData';
import { RootStackParamList } from '../../../navigation/RootNavigator';

type ProfileRouteProp = RouteProp<RootStackParamList, 'PrayerProfile'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PrayerProfileScreen() {
  const route = useRoute<ProfileRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { requestId } = route.params;

  const hasSentPrayer = usePrayerStore((state) => state.hasSentPrayer);
  const submitPrayer = usePrayerStore((state) => state.submitPrayer);
  const setPlanPrayer = usePlanStore((state) => state.setPlanPrayer);
  const plannedPrayer = usePlanStore((state) => state.plannedPrayer);
  const showToast = useUIStore((state) => state.showToast);
  const getViewerCount = useUIStore((state) => state.getViewerCount);

  const [viewerCount, setViewerCount] = useState(0);
  const [isComposing, setIsComposing] = useState(false);
  const [prayerText, setPrayerText] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const request = PRAYER_REQUESTS.find((r) => r.id === requestId);
  const alreadySent = hasSentPrayer(requestId);
  const hasEmergency = request?.emergencyImages && request.emergencyImages.length > 0;

  useEffect(() => {
    setViewerCount(getViewerCount(requestId));
    const interval = setInterval(() => {
      setViewerCount(getViewerCount(requestId));
    }, 3000);
    return () => clearInterval(interval);
  }, [requestId, getViewerCount]);

  if (!request) {
    return (
      <View style={styles.container}>
        <AppHeader title="Prayer Request" showBack />
        <View style={styles.errorState}>
          <Text style={styles.errorText}>Request not found</Text>
        </View>
      </View>
    );
  }

  const handlePlanPrayer = () => {
    if (plannedPrayer && plannedPrayer.requestId !== requestId) {
      setShowReplaceModal(true);
    } else {
      setPlanPrayer(requestId);
      showToast('success', 'Added to Plan Prayer');
      (navigation as any).navigate('PlanPrayerDrawer');
    }
  };

  const handleReplacePlan = () => {
    setShowReplaceModal(false);
    setPlanPrayer(requestId);
    showToast('success', 'Plan Prayer updated');
    (navigation as any).navigate('PlanPrayerDrawer');
  };

  const handleSubmitPrayer = async () => {
    if (!prayerText.trim()) {
      showToast('error', 'Please write a prayer before submitting');
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    submitPrayer(request, prayerText.trim());
    showToast('success', 'Prayer submitted! Thank you for interceding.');
    setIsSubmitting(false);
    setPrayerText('');
    setIsComposing(false);
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Prayer Request"
        showBack
        rightElement={
          <IconButton
            icon={<Flag size={18} color="#6B4F3E" />}
            onPress={() => setShowReportModal(true)}
          />
        }
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ImageCarousel images={request.profileImages} height={210} />

        <View style={styles.content}>
          <View style={styles.infoSection}>
            <Text style={styles.name}>{request.name}</Text>
            <View style={styles.locationRow}>
              <MapPin size={14} color="#7A5C4A" />
              <Text style={styles.location}>{request.flag} {request.country}</Text>
            </View>

            <View style={styles.badges}>
              {request.denomination && <Badge variant="denomination">{request.denomination}</Badge>}
              {hasEmergency && (
                <Badge variant="emergency">
                  <View style={styles.emergencyBadge}>
                    <AlertTriangle size={12} color="#7A1E1E" />
                    <Text style={styles.emergencyText}>Emergency</Text>
                  </View>
                </Badge>
              )}
            </View>

            <View style={styles.viewerPill}>
              <Eye size={14} color="#5C3D2E" />
              <Text style={styles.viewerText}>{viewerCount} people currently in consideration</Text>
            </View>

            {request.prayersSentCount < 3 && (
              <View style={styles.needyBanner}>
                <Text style={styles.needyBannerText}>
                  🙏 This request has received few prayers — your intercession will make a real difference.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.requestSection}>
            <Text style={styles.sectionTitle}>Prayer Request</Text>
            <View style={styles.requestTextContainer}>
              <Text style={styles.quoteOpen}>"</Text>
              <TranslatedText
                text={request.requestText}
                contentId={request.id}
                style={styles.requestTextInner}
                showOriginalToggle={true}
                forceTranslate={true}
              />
              <Text style={styles.quoteClose}>"</Text>
            </View>
            {request.description && (
              <TranslatedText
                text={request.description}
                contentId={`${request.id}-desc`}
                style={styles.descriptionText}
                showOriginalToggle={false}
                forceTranslate={true}
              />
            )}
          </View>

          {hasEmergency && (
            <View style={styles.emergencySection}>
              <View style={styles.emergencyHeader}>
                <AlertTriangle size={16} color="#7A1E1E" />
                <Text style={styles.emergencyTitle}>Emergency Photos</Text>
              </View>
              <ImageCarousel images={request.emergencyImages} height={160} />
            </View>
          )}

          {alreadySent ? (
            <View style={styles.alreadySentBanner}>
              <CheckCircle size={20} color="#1A4731" />
              <Text style={styles.alreadySentText}>You've already prayed for this request</Text>
            </View>
          ) : isComposing ? (
            <View style={styles.composeSection}>
              <Text style={styles.sectionTitle}>Write Your Prayer</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Lord, I lift up this person to You..."
                placeholderTextColor="#9B7B6A"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={prayerText}
                onChangeText={setPrayerText}
              />
              <View style={styles.composeActions}>
                <SecondaryButton onPress={() => { setIsComposing(false); setPrayerText(''); }}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  onPress={handleSubmitPrayer}
                  loading={isSubmitting}
                  disabled={!prayerText.trim()}
                >
                  Submit Prayer
                </PrimaryButton>
              </View>
            </View>
          ) : (
            <View style={styles.actions}>
              <PrimaryButton
                fullWidth
                size="lg"
                icon={<Pencil size={18} color="#FFF" />}
                onPress={() => setIsComposing(true)}
              >
                Pray Now
              </PrimaryButton>
              <SecondaryButton
                fullWidth
                icon={<BookmarkPlus size={18} color="#6B4F3E" />}
                onPress={handlePlanPrayer}
              >
                Plan Prayer for Later
              </SecondaryButton>
            </View>
          )}
        </View>
      </ScrollView>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetType="profile"
      />

      <Modal visible={showReplaceModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Replace Planned Prayer?</Text>
            <Text style={styles.modalText}>
              You already have a prayer planned. Would you like to replace it with this one?
            </Text>
            <View style={styles.modalActions}>
              <SecondaryButton onPress={() => setShowReplaceModal(false)}>Keep Current</SecondaryButton>
              <PrimaryButton onPress={handleReplacePlan}>Replace</PrimaryButton>
            </View>
          </View>
        </View>
      </Modal>
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
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 15,
    color: '#7A1E1E',
  },
  infoSection: {
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C0F0A',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: '#7A5C4A',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emergencyText: {
    fontSize: 12,
    color: '#7A1E1E',
    fontWeight: '600',
  },
  viewerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
    borderRadius: 8,
    marginBottom: 12,
  },
  viewerText: {
    fontSize: 13,
    color: '#5C3D2E',
  },
  needyBanner: {
    padding: 12,
    backgroundColor: '#FFF8E7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F5E6C8',
  },
  needyBannerText: {
    fontSize: 13,
    color: '#7A5000',
    lineHeight: 19,
  },
  requestSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 12,
  },
  requestTextContainer: {
    marginBottom: 12,
  },
  requestTextInner: {
    fontSize: 16,
    color: '#5C3D2E',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  quoteOpen: {
    fontSize: 24,
    color: '#5C3D2E',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  quoteClose: {
    fontSize: 24,
    color: '#5C3D2E',
    fontStyle: 'italic',
    lineHeight: 24,
    alignSelf: 'flex-end',
  },
  descriptionText: {
    fontSize: 14,
    color: '#7A5C4A',
    lineHeight: 21,
  },
  emergencySection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FFF0F0',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F5AAAA',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7A1E1E',
  },
  alreadySentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
  },
  alreadySentText: {
    fontSize: 14,
    color: '#1A4731',
    fontWeight: '500',
  },
  composeSection: {
    marginBottom: 20,
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
    marginBottom: 16,
  },
  composeActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  actions: {
    gap: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FDF9F4',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C0F0A',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 21,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
});
