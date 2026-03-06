import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, ActivityIndicator } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Hand, Zap, Shield, MessageCircle, User, ChevronRight, HelpCircle, Languages, ChevronDown, Check, X, FlaskConical } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import { usePlanStore } from '../../planning/stores/planStore';
import { useUIStore } from '../../../stores/uiStore';
import { useUserLanguagePreference } from '../../../hooks/useTranslation';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../../../config/countries';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { colors } from '../../../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const selectionMode = usePlanStore((state) => state.selectionMode);
  const setSelectionMode = usePlanStore((state) => state.setSelectionMode);
  const showToast = useUIStore((state) => state.showToast);
  
  const { preference, isLoading: isLoadingPref, updatePreference } = useUserLanguagePreference();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleModeChange = (mode: 'manual' | 'auto') => {
    setSelectionMode(mode);
    showToast('success', `Switched to ${mode === 'auto' ? 'Auto' : 'Manual'} Mode`);
  };

  const handleAutoTranslateToggle = async (value: boolean) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await updatePreference(preference?.preferredLanguage || 'en', value);
      showToast('success', value ? 'Auto-translate enabled' : 'Auto-translate disabled');
    } catch {
      showToast('error', 'Failed to update setting');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLanguageChange = async (langCode: LanguageCode) => {
    if (isUpdating) return;
    setIsUpdating(true);
    setShowLanguagePicker(false);
    try {
      await updatePreference(langCode, preference?.autoTranslate ?? false);
      const langName = SUPPORTED_LANGUAGES.find(l => l.code === langCode)?.name || langCode;
      showToast('success', `Language set to ${langName}`);
    } catch {
      showToast('error', 'Failed to update language');
    } finally {
      setIsUpdating(false);
    }
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find(
    l => l.code === (preference?.preferredLanguage || 'en')
  );

  const getLanguageEmoji = (langCode: LanguageCode): string => {
    const langToFlag: Record<string, string> = {
      'en': '🇺🇸', 'en-US': '🇺🇸', 'en-GB': '🇬🇧', 'en-AU': '🇦🇺', 'en-CA': '🇨🇦',
      'es': '🇪🇸', 'es-ES': '🇪🇸', 'es-MX': '🇲🇽',
      'fr': '🇫🇷', 'fr-FR': '🇫🇷', 'fr-CA': '🇨🇦',
      'de': '🇩🇪', 'it': '🇮🇹', 'pt': '🇵🇹', 'pt-BR': '🇧🇷', 'pt-PT': '🇵🇹',
      'zh': '🇨🇳', 'zh-Hans': '🇨🇳', 'zh-Hant': '🇹🇼',
      'ja': '🇯🇵', 'ko': '🇰🇷', 'ar': '🇸🇦', 'he': '🇮🇱', 'hi': '🇮🇳',
      'ru': '🇷🇺', 'uk': '🇺🇦', 'pl': '🇵🇱', 'nl': '🇳🇱', 'sv': '🇸🇪',
      'da': '🇩🇰', 'fi': '🇫🇮', 'no': '🇳🇴', 'cs': '🇨🇿', 'sk': '🇸🇰',
      'hu': '🇭🇺', 'ro': '🇷🇴', 'el': '🇬🇷', 'tr': '🇹🇷', 'th': '🇹🇭',
      'vi': '🇻🇳', 'id': '🇮🇩', 'ms': '🇲🇾', 'hr': '🇭🇷', 'ca': '🇪🇸', 'fa': '🇮🇷',
    };
    return langToFlag[langCode] || '🌐';
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Settings" showMenu onMenuPress={openDrawer} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PRAYER SELECTION MODE</Text>
            <Text style={styles.sectionIntro}>
              Choose how you want to find people to pray for — browse yourself or let us match you with those in greatest need.
            </Text>
            <View style={styles.card}>
              <TouchableOpacity
                style={[styles.modeOption, selectionMode === 'manual' && styles.modeOptionActive]}
                onPress={() => handleModeChange('manual')}
                activeOpacity={0.7}
              >
                <View style={[styles.modeIcon, selectionMode === 'manual' && styles.modeIconActive]}>
                  <Hand size={22} color={selectionMode === 'manual' ? '#6B4F3E' : '#7A5C4A'} />
                </View>
                <View style={styles.modeContent}>
                  <Text style={[styles.modeTitle, selectionMode === 'manual' && styles.modeTitleActive]}>
                    Manual Mode
                  </Text>
                  <Text style={styles.modeDescription}>
                    Browse and select prayer requests yourself
                  </Text>
                </View>
                <View style={[styles.radioCircle, selectionMode === 'manual' && styles.radioCircleSelected]}>
                  {selectionMode === 'manual' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={[styles.modeOption, selectionMode === 'auto' && styles.modeOptionActive]}
                onPress={() => handleModeChange('auto')}
                activeOpacity={0.7}
              >
                <View style={[styles.modeIcon, selectionMode === 'auto' && styles.modeIconActive]}>
                  <Zap size={22} color={selectionMode === 'auto' ? '#6B4F3E' : '#7A5C4A'} fill={selectionMode === 'auto' ? '#6B4F3E' : 'transparent'} />
                </View>
                <View style={styles.modeContent}>
                  <Text style={[styles.modeTitle, selectionMode === 'auto' && styles.modeTitleActive]}>
                    Auto Mode
                  </Text>
                  <Text style={styles.modeDescription}>
                    We'll select someone who needs prayer most (skips requests with 3+ prayers)
                  </Text>
                </View>
                <View style={[styles.radioCircle, selectionMode === 'auto' && styles.radioCircleSelected]}>
                  {selectionMode === 'auto' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TRANSLATION</Text>
            <Text style={styles.sectionIntro}>
              Automatically translate prayers from other languages into your preferred language.
            </Text>
            <View style={styles.card}>
              <View style={styles.translationRow}>
                <View style={styles.translationIcon}>
                  <Languages size={20} color={colors.secondary.dark} />
                </View>
                <View style={styles.translationContent}>
                  <Text style={styles.translationTitle}>Auto-Translate</Text>
                  <Text style={styles.translationDescription}>
                    Translate foreign prayers automatically
                  </Text>
                </View>
                {isLoadingPref ? (
                  <ActivityIndicator size="small" color={colors.secondary.dark} />
                ) : (
                  <Switch
                    value={preference?.autoTranslate ?? false}
                    onValueChange={handleAutoTranslateToggle}
                    trackColor={{ false: '#D4C4B0', true: colors.secondary.dark }}
                    thumbColor="#FFF"
                    disabled={isUpdating}
                  />
                )}
              </View>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.translationRow}
                onPress={() => setShowLanguagePicker(true)}
                activeOpacity={0.7}
                disabled={isUpdating || isLoadingPref}
              >
                <View style={styles.translationIcon}>
                  <Text style={styles.languageFlag}>{getLanguageEmoji(preference?.preferredLanguage || 'en')}</Text>
                </View>
                <View style={styles.translationContent}>
                  <Text style={styles.translationTitle}>Preferred Language</Text>
                  <Text style={styles.translationDescription}>
                    {currentLanguage?.name || 'English'}
                  </Text>
                </View>
                <ChevronRight size={18} color="#9B7B6A" />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.translationRow}
                onPress={() => navigation.navigate('TranslationTest' as never)}
                activeOpacity={0.7}
              >
                <View style={[styles.translationIcon, { backgroundColor: `${colors.accent.purple}15` }]}>
                  <FlaskConical size={20} color={colors.accent.purple} />
                </View>
                <View style={styles.translationContent}>
                  <Text style={styles.translationTitle}>Test Translation</Text>
                  <Text style={styles.translationDescription}>
                    Demo with foreign prayer requests
                  </Text>
                </View>
                <ChevronRight size={18} color="#9B7B6A" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PRIVACY</Text>
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Shield size={18} color="#6B4F3E" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>What Others See</Text>
                  <Text style={styles.infoText}>Only your first name and country flag are visible to other users.</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SUPPORT</Text>
            <TouchableOpacity
              style={styles.linkCard}
              onPress={() => navigation.navigate('HelpSafetyDrawer' as never)}
              activeOpacity={0.7}
            >
              <View style={styles.linkIcon}>
                <HelpCircle size={20} color="#6B4F3E" />
              </View>
              <Text style={styles.linkText}>Help & Safety Guidelines</Text>
              <ChevronRight size={18} color="#9B7B6A" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showLanguagePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setShowLanguagePicker(false)} style={styles.modalClose}>
                <X size={20} color="#1C0F0A" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    preference?.preferredLanguage === lang.code && styles.languageOptionSelected
                  ]}
                  onPress={() => handleLanguageChange(lang.code)}
                >
                  <Text style={styles.languageOptionFlag}>{getLanguageEmoji(lang.code)}</Text>
                  <Text style={[
                    styles.languageOptionText,
                    preference?.preferredLanguage === lang.code && styles.languageOptionTextSelected
                  ]}>
                    {lang.name}
                  </Text>
                  {preference?.preferredLanguage === lang.code && (
                    <Check size={18} color={colors.secondary.dark} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7A5C4A',
    letterSpacing: 1,
    marginBottom: 12,
  },
  sectionIntro: {
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 20,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FDF9F4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    overflow: 'hidden',
  },
  modeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  modeOptionActive: {
    backgroundColor: 'rgba(107, 79, 62, 0.04)',
  },
  modeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeIconActive: {
    backgroundColor: 'rgba(107, 79, 62, 0.15)',
  },
  modeContent: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5C3D2E',
    marginBottom: 4,
  },
  modeTitleActive: {
    color: '#1C0F0A',
  },
  modeDescription: {
    fontSize: 13,
    color: '#7A5C4A',
    lineHeight: 18,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#C4A89A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#6B4F3E',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6B4F3E',
  },
  divider: {
    height: 1,
    backgroundColor: '#EDE0D4',
    marginHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 14,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#7A5C4A',
    lineHeight: 18,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FDF9F4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    gap: 12,
  },
  linkIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1C0F0A',
  },
  translationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  translationIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  translationContent: {
    flex: 1,
  },
  translationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 2,
  },
  translationDescription: {
    fontSize: 13,
    color: '#7A5C4A',
  },
  languageFlag: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FDF9F4',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE0D4',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C0F0A',
  },
  modalClose: {
    padding: 8,
  },
  modalScroll: {
    padding: 8,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 12,
  },
  languageOptionSelected: {
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
  },
  languageOptionFlag: {
    fontSize: 22,
  },
  languageOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#1C0F0A',
  },
  languageOptionTextSelected: {
    fontWeight: '600',
    color: '#6B4F3E',
  },
});
