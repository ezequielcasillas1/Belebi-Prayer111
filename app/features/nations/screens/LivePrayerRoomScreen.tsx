import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Send, Flag } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import SafetyBanner from '../../../components/SafetyBanner';
import ReportModal from '../../../components/ReportModal';
import { useAuthStore } from '../../auth/stores/authStore';
import { useUIStore } from '../../../stores/uiStore';
import { UNIQUE_COUNTRIES, CHAT_MESSAGES, ChatMessage } from '../../../data/mockData';
import { RootStackParamList } from '../../../navigation/RootNavigator';

type RoomRouteProp = RouteProp<RootStackParamList, 'LivePrayerRoom'>;

const SIMULATED_MESSAGES = [
  { name: 'Emmanuel', country: 'Nigeria', flag: '🇳🇬', text: 'Amen! God is faithful.' },
  { name: 'Sarah', country: 'United States', flag: '🇺🇸', text: 'Praying with you all from Texas!' },
  { name: 'David', country: 'Kenya', flag: '🇰🇪', text: 'Lord, hear our prayers for this nation.' },
];

const PHONE_EMAIL_REGEX = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|[\w.-]+@[\w.-]+\.\w+/gi;

export default function LivePrayerRoomScreen() {
  const route = useRoute<RoomRouteProp>();
  const { countryCode } = route.params;
  const currentUser = useAuthStore((state) => state.currentUser);
  const showToast = useUIStore((state) => state.showToast);
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [onlineCount, setOnlineCount] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState<string | undefined>();

  const country = UNIQUE_COUNTRIES.find((c) => c.code === countryCode);

  useEffect(() => {
    const countryMessages = CHAT_MESSAGES.filter((m) => m.countryCode === countryCode);
    setMessages(countryMessages);
    setOnlineCount(Math.floor(Math.random() * 16) + 5);

    const simulateInterval = setInterval(() => {
      const randomMsg = SIMULATED_MESSAGES[Math.floor(Math.random() * SIMULATED_MESSAGES.length)];
      const newMessage: ChatMessage = {
        id: `sim_${Date.now()}`,
        countryCode,
        senderId: `sim_${Math.random()}`,
        senderName: randomMsg.name,
        senderCountry: randomMsg.country,
        senderFlag: randomMsg.flag,
        text: randomMsg.text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
    }, 15000 + Math.random() * 10000);

    return () => clearInterval(simulateInterval);
  }, [countryCode]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || !currentUser) return;

    if (PHONE_EMAIL_REGEX.test(inputText)) {
      showToast('error', 'Please do not share personal contact information');
      return;
    }

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      countryCode,
      senderId: currentUser.id,
      senderName: currentUser.firstName,
      senderCountry: currentUser.country,
      senderFlag: currentUser.flag,
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
  };

  const handleReport = (senderId?: string) => {
    setReportTarget(senderId);
    setShowReportModal(true);
  };


  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isOwnMessage = item.senderId === currentUser?.id;

    return (
      <View style={[styles.messageBubble, isOwnMessage && styles.ownMessage]}>
        <View style={styles.messageHeader}>
          <Text style={styles.senderFlag}>{item.senderFlag}</Text>
          <Text style={styles.senderName}>{item.senderName}</Text>
          {!isOwnMessage && (
            <TouchableOpacity onPress={() => handleReport(item.senderId)} style={styles.flagButton}>
              <Flag size={14} color="#9B7B6A" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  if (!country) {
    return (
      <View style={styles.container}>
        <AppHeader title="Prayer Room" showBack />
        <View style={styles.errorState}>
          <Text style={styles.errorText}>Country not found</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader
        title={`${country.flag} ${country.name}`}
        subtitle={`${onlineCount} online`}
        showBack
      />

      <SafetyBanner />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🙏</Text>
            <Text style={styles.emptyTitle}>Be the first to pray!</Text>
            <Text style={styles.emptySubtitle}>Share a prayer for {country.name}</Text>
          </View>
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your prayer..."
          placeholderTextColor="#9B7B6A"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim()}
          activeOpacity={0.7}
        >
          <Send size={20} color={inputText.trim() ? '#FFF' : '#C4A89A'} />
        </TouchableOpacity>
      </View>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetType="message"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF9F4',
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#7A5C4A',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    maxWidth: '85%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    alignSelf: 'flex-start',
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  senderFlag: {
    fontSize: 14,
  },
  senderName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5C3D2E',
    flex: 1,
  },
  flagButton: {
    padding: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#1C0F0A',
    lineHeight: 22,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C0F0A',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#7A5C4A',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: 24,
    backgroundColor: '#FDF9F4',
    borderTopWidth: 1,
    borderTopColor: '#E8D8C8',
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: '#FFF',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1C0F0A',
    borderWidth: 1,
    borderColor: '#E8D8C8',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6B4F3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E8D8C8',
  },
});
