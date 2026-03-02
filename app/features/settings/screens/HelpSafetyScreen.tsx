import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Shield, Lock, Flag, Heart, Phone, ChevronDown, ChevronUp } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';

const SAFETY_ITEMS = [
  { icon: Lock, title: 'Protect Your Information', body: 'Never share your phone number, email address, or home location in prayer rooms or profiles.' },
  { icon: Flag, title: 'Report Concerns', body: 'Use the flag icon to report inappropriate content or suspicious behavior. Our team reviews all reports.' },
  { icon: Heart, title: 'Pray with Respect', body: 'Be kind and supportive in all interactions. Remember that everyone is seeking connection and prayer.' },
  { icon: Phone, title: 'Emergency Services', body: 'For emergencies, contact your local authorities. This app is not a substitute for professional help.' },
];

const PRIVACY_ITEMS = [
  'Your country is visible to help connect you with global prayer partners',
  'Your prayers are private - requesters only know someone prayed for them',
  'You can dismiss your prayer request anytime using "Dismiss Supplication"',
];

const FAQ_ITEMS = [
  { q: 'Is my location shared with others?', a: 'No, only your country is visible. Your exact location, city, or address is never shared with other users.' },
  { q: 'How do I report inappropriate content?', a: 'Tap the flag icon next to any message or on a prayer profile to report concerns. Our team reviews all reports within 24 hours.' },
  { q: 'What should I never share in prayer rooms?', a: 'Never share phone numbers, email addresses, home addresses, or any personal contact information.' },
  { q: 'How does Auto Mode work?', a: 'Auto Mode assigns you a prayer request that has received fewer than 3 prayers. The assignment persists for 12 hours so you can come back and pray.' },
  { q: 'What is Plan Prayer?', a: 'Plan Prayer lets you save one prayer request to come back to within 24 hours. It\'s a single slot to remind yourself to pray.' },
  { q: 'Can the person I\'m praying for see my identity?', a: 'No, they only see that someone has prayed for them. Your name and personal details remain private.' },
  { q: 'What happens when a prayer request expires?', a: 'After the auto-dismiss period (1 month, 6 months, or 1 year), the request is automatically removed from the community.' },
  { q: 'How do I dismiss my own prayer request?', a: 'Go to your submitted request and tap the "Dismiss Supplication" button to remove it before the auto-dismiss date.' },
];

export default function HelpSafetyScreen() {
  const navigation = useNavigation();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Help & Safety" showMenu onMenuPress={openDrawer} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.warningCard}>
            <Shield size={24} color="#7A5000" />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Safety First</Text>
              <Text style={styles.warningText}>
                Belebi Prayer is a prayer community, not a crisis service. If you or someone you know is in immediate danger, please contact local emergency services.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SAFETY GUIDELINES</Text>
            <View style={styles.card}>
              {SAFETY_ITEMS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <View key={index}>
                    <View style={styles.safetyItem}>
                      <View style={styles.safetyIcon}>
                        <Icon size={18} color="#6B4F3E" />
                      </View>
                      <View style={styles.safetyContent}>
                        <Text style={styles.safetyTitle}>{item.title}</Text>
                        <Text style={styles.safetyBody}>{item.body}</Text>
                      </View>
                    </View>
                    {index < SAFETY_ITEMS.length - 1 && <View style={styles.divider} />}
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PRIVACY POLICY SUMMARY</Text>
            <View style={styles.card}>
              <View style={styles.privacyList}>
                {PRIVACY_ITEMS.map((item, index) => (
                  <View key={index} style={styles.privacyItem}>
                    <View style={styles.bulletDot} />
                    <Text style={styles.privacyText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>
            <View style={styles.card}>
              {FAQ_ITEMS.map((item, index) => (
                <View key={index}>
                  <TouchableOpacity
                    style={styles.faqItem}
                    onPress={() => toggleFaq(index)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.faqQuestion}>{item.q}</Text>
                    {expandedFaq === index ? (
                      <ChevronUp size={18} color="#7A5C4A" />
                    ) : (
                      <ChevronDown size={18} color="#7A5C4A" />
                    )}
                  </TouchableOpacity>
                  {expandedFaq === index && (
                    <View style={styles.faqAnswer}>
                      <Text style={styles.faqAnswerText}>{item.a}</Text>
                    </View>
                  )}
                  {index < FAQ_ITEMS.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>Belebi Prayer v1.0.0</Text>
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
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#FFF8E1',
    borderRadius: 14,
    marginBottom: 24,
    gap: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7A5000',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#8B6914',
    lineHeight: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7A5C4A',
    letterSpacing: 1,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FDF9F4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    overflow: 'hidden',
  },
  safetyItem: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  safetyIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyContent: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 4,
  },
  safetyBody: {
    fontSize: 13,
    color: '#7A5C4A',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#EDE0D4',
    marginHorizontal: 16,
  },
  privacyList: {
    padding: 16,
    gap: 12,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6B4F3E',
    marginTop: 6,
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    color: '#5C3D2E',
    lineHeight: 20,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1C0F0A',
    lineHeight: 20,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswerText: {
    fontSize: 13,
    color: '#7A5C4A',
    lineHeight: 20,
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#9B7B6A',
  },
});
