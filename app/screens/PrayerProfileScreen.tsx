import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MapPin, Eye, BookmarkPlus, Pencil, Sparkles, X, Flag, AlertTriangle, CheckCircle } from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import ImageCarousel from '../components/ImageCarousel';
import ReportModal from '../components/ReportModal';
import Badge from '../components/Badge';
import { PrimaryButton, SecondaryButton, GhostButton, IconButton } from '../components/Buttons';
import { useAppContext } from '../context/AppContext';
import { PRAYER_REQUESTS, AI_PRAYER_DRAFTS } from '../data/mockData';
import { RootStackParamList } from '../navigation/RootNavigator';

type ProfileRouteProp = RouteProp<RootStackParamList, 'PrayerProfile'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PrayerProfileScreen() {
  const route = useRoute<ProfileRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { requestId } = route.params;

  const {
    state,
    getViewerCount,
    setPlanPrayer,
    hasSentPrayer,
    submitPrayer,
    showToast,
    getPlannedRequest,
  } = useAppContext();

  const [viewerCount, setViewerCount] = useState(0);
  const [isComposing, setIsComposing] = useState(false);
  const [prayerText, setPrayerText] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const request = PRAYER_REQUESTS.find((r) => r.id === requestId);
  const alreadySent = hasSentPrayer(requestId);
  const plannedRequest = getPlannedRequest();
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
    if (plannedRequest && plannedRequest.id !== requestId) {
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

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const randomDraft = AI_PRAYER_DRAFTS[Math.floor(Math.random() * AI_PRAYER_DRAFTS.length)];
    setPrayerText(randomDraft);
    setIsGeneratingAI(false);
    setIsComposing(true);
  };

  const handleSubmitPrayer = async () => {
    if (!prayerText.trim()) {
      showToast('error', 'Please write a prayer before submitting');
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    submitPrayer(requestId, prayerText.trim());
    showToast('success', 'Prayer submitted! Thank you for interceding.');
    setIsSubmitting(false);
    setPrayerText('');
    setIsComposing(false);
  };

  const getAutoDismissLabel = () => {
    switch (request.autoDismissTime) {
      case '1month': return '1 month';
      case '6months': return '6 months';
      case '1year': return '1 year';
      default: return '1 month';
    }
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.sectionText}>{request.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prayer Request</Text>
            <View style={styles.requestCard}>
              <Text style={styles.requestText}>"{request.requestText}"</Text>
            </View>
          </View>

          {hasEmergency && (
            <View style={styles.section}>
              <View style={styles.emergencyHeader}>
                <AlertTriangle size={18} color="#7A1E1E" />
                <Text style={styles.emergencySectionTitle}>Emergency Images</Text>
              </View>
              <ImageCarousel images={request.emergencyImages} height={160} />
            </View>
          )}

          <Text style={styles.autoDismiss}>Auto-dismisses in: {getAutoDismissLabel()}</Text>

          {alreadySent ? (
            <View style={styles.successCard}>
              <CheckCircle size={24} color="#1A4731" />
              <View style={styles.successContent}>
                <Text style={styles.successTitle}>Prayer Submitted</Text>
                <Text style={styles.successText}>You can view this in Prayers Sent</Text>
              </View>
            </View>
          ) : (
            <View style={styles.actions}>
              {!isComposing ? (
                <>
                  <View style={styles.actionRow}>
                    <SecondaryButton
                      size="md"
                      icon={<BookmarkPlus size={18} color="#6B4F3E" />}
                      onPress={handlePlanPrayer}
                    >
                      Plan Prayer
                    </SecondaryButton>
                    <PrimaryButton
                      size="md"
                      icon={<Pencil size={18} color="#FFF" />}
                      onPress={() => setIsComposing(true)}
                    >
                      Write Prayer
                    </PrimaryButton>
                  </View>
                  <GhostButton
                    icon={<Sparkles size={18} color="#6B4F3E" />}
                    onPress={handleGenerateAI}
                    loading={isGeneratingAI}
                  >
                    Generate AI Prayer Draft Now
                  </GhostButton>
                </>
              ) : (
                <View style={styles.composeSection}>
                  <View style={styles.composeHeader}>
                    <Text style={styles.composeTitle}>Write Your Prayer</Text>
                    <TouchableOpacity onPress={() => { setIsComposing(false); setPrayerText(''); }}>
                      <X size={20} color="#5C3D2E" />
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={styles.textArea}
                    placeholder="Write your prayer here..."
                    placeholderTextColor="#9B7B6A"
                    value={prayerText}
                    onChangeText={setPrayerText}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                  <View style={styles.composeActions}>
                    <GhostButton
                      size="sm"
                      icon={<Sparkles size={16} color="#6B4F3E" />}
                      onPress={handleGenerateAI}
                      loading={isGeneratingAI}
                    >
                      AI Draft
                    </GhostButton>
                    <PrimaryButton
                      size="md"
                      onPress={handleSubmitPrayer}
                      loading={isSubmitting}
                      disabled={!prayerText.trim()}
                    >
                      Submit Prayer
                    </PrimaryButton>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetType="profile"
        targetName={request.name}
      />

      <Modal visible={showReplaceModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Replace Planned Prayer?</Text>
            <Text style={styles.modalText}>
              You already have "{plannedRequest?.name}" in your Plan Prayer slot. Replace it with "{request.name}"?
            </Text>
            <View style={styles.modalActions}>
              <SecondaryButton size="md" onPress={() => setShowReplaceModal(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton size="md" onPress={handleReplacePlan}>
                Replace
              </PrimaryButton>
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
    fontSize: 16,
    color: '#5C3D2E',
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
    fontSize: 15,
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
    fontSize: 13,
    color: '#7A1E1E',
    fontWeight: '500',
  },
  viewerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  viewerText: {
    fontSize: 13,
    color: '#5C3D2E',
    fontWeight: '500',
  },
  needyBanner: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFF8E7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F5D98A',
  },
  needyBannerText: {
    fontSize: 13,
    color: '#7A5000',
    textAlign: 'center',
    lineHeight: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 15,
    color: '#5C3D2E',
    lineHeight: 22,
  },
  requestCard: {
    padding: 16,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#6B4F3E',
  },
  requestText: {
    fontSize: 15,
    color: '#5C3D2E',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  emergencySectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A1E1E',
  },
  autoDismiss: {
    fontSize: 13,
    color: '#9B7B6A',
    textAlign: 'center',
    marginBottom: 24,
  },
  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: '#E8F5EE',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A8D5BE',
  },
  successContent: {
    flex: 1,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A4731',
  },
  successText: {
    fontSize: 14,
    color: '#1A4731',
    marginTop: 2,
  },
  actions: {
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  composeSection: {
    padding: 16,
    backgroundColor: 'rgba(107, 79, 62, 0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8D8C8',
  },
  composeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  composeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C0F0A',
  },
  textArea: {
    minHeight: 120,
    padding: 14,
    backgroundColor: '#FDF9F4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4C4B0',
    fontSize: 15,
    color: '#1C0F0A',
    lineHeight: 22,
  },
  composeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
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
    fontSize: 15,
    color: '#5C3D2E',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
