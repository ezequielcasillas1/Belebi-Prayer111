import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Send, Flag } from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import SafetyBanner from '../components/SafetyBanner';
import ReportModal from '../components/ReportModal';
import { useAppContext } from '../context/AppContext';
import { UNIQUE_COUNTRIES, CHAT_MESSAGES, ChatMessage } from '../data/mockData';
import { RootStackParamList } from '../navigation/RootNavigator';

type RoomRouteProp = RouteProp<RootStackParamList, 'LivePrayerRoom'>;

const SIMULATED_MESSAGES = [
  { name: 'Emmanuel', country: 'Nigeria', flag: '🇳🇬', text: 'Amen! God is faithful. 🙏' },
  { name: 'Sarah', country: 'United States', flag: '🇺🇸', text: 'Praying with you all from Texas!' },
  { name: 'David', country: 'Kenya', flag: '🇰🇪', text: 'Lord, hear our prayers for this nation.' },
];

const PHONE_EMAIL_REGEX = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|[\w.-]+@[\w.-]+\.\w+/gi;

export default function LivePrayerRoomScreen() {
  const route = useRoute<RoomRouteProp>();
  const { countryCode } = route.params;
  const { state, showToast } = useAppContext();
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
    }, 12000);

    const onlineInterval = setInterval(() => {
      setOnlineCount((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.max(5, Math.min(20, prev + change));
      });
    }, 8000);

    return () => {
      clearInterval(simulateInterval);
      clearInterval(onlineInterval);
    };
  }, [countryCode]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    if (PHONE_EMAIL_REGEX.test(inputText)) {
      showToast('error', 'Please do not share phone numbers or emails in the chat');
      return;
    }

    if (inputText.length > 300) {
      showToast('error', 'Message is too long (max 300 characters)');
      return;
    }

    const newMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      countryCode,
      senderId: state.currentUser?.id || 'guest',
      senderName: state.currentUser?.firstName || 'Guest',
      senderCountry: state.currentUser?.country || 'Worldwide',
      senderFlag: state.currentUser?.flag || '🌍',
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
  };

  const handleReport = (message: ChatMessage) => {
    setReportTarget(message.senderName);
    setShowReportModal(true);
  };

  const isMyMessage = (message: ChatMessage) => {
    return message.senderId === state.currentUser?.id || message.senderId === 'guest';
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMine = isMyMessage(item);

    if (item.removed) {
      return (
        <View style={styles.removedMessage}>
          <Text style={styles.removedText}>[Message removed for safety]</Text>
        </View>
      );
    }

    if (isMine) {
      return (
        <View style={styles.myMessageContainer}>
          <View style={styles.myMessage}>
            <Text style={styles.myMessageText}>{item.text}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.otherMessageContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarFlag}>{item.senderFlag}</Text>
        </View>
        <View style={styles.otherMessageContent}>
          <View style={styles.senderInfo}>
            <Text style={styles.senderName}>{item.senderName}</Text>
            <Text style={styles.senderCountry}>{item.senderCountry}</Text>
          </View>
          <View style={styles.otherMessage}>
            <Text style={styles.otherMessageText}>{item.text}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.reportButton} onPress={() => handleReport(item)}>
          <Flag size={14} color="#9B7B6A" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <AppHeader
        title={`${country?.flag || '🌍'} ${country?.name || 'Unknown'} Room`}
        subtitle="Live Prayer Room"
        showBack
      />

      <View style={styles.content}>
        <SafetyBanner />

        <View style={styles.roomIntro}>
          <Text style={styles.roomIntroText}>
            Join believers from around the world in real-time prayer for {country?.name || 'this nation'}. Share encouragements and pray together.
          </Text>
        </View>

        <View style={styles.onlineIndicator}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>{onlineCount} people praying together</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Be the first to pray in this room. 🙏</Text>
            </View>
          }
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Share a prayer or encouragement..."
            placeholderTextColor="#9B7B6A"
            value={inputText}
            onChangeText={setInputText}
            maxLength={300}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Send size={20} color={inputText.trim() ? '#FFF' : '#9B7B6A'} />
          </TouchableOpacity>
        </View>
      </View>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetType="message"
        targetName={reportTarget}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF9F4',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  roomIntro: {
    padding: 12,
    backgroundColor: 'rgba(107, 79, 62, 0.06)',
    borderRadius: 10,
    marginBottom: 8,
  },
  roomIntroText: {
    fontSize: 13,
    color: '#5C3D2E',
    lineHeight: 18,
    textAlign: 'center',
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    marginBottom: 12,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  onlineText: {
    fontSize: 13,
    color: '#5C3D2E',
    fontWeight: '500',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#7A5C4A',
  },
  myMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  myMessage: {
    maxWidth: '75%',
    backgroundColor: '#6B4F3E',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    padding: 12,
  },
  myMessageText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  otherMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(107, 79, 62, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFlag: {
    fontSize: 14,
  },
  otherMessageContent: {
    maxWidth: '65%',
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  senderName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C0F0A',
  },
  senderCountry: {
    fontSize: 11,
    color: '#7A5C4A',
  },
  otherMessage: {
    backgroundColor: '#FDF9F4',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E8D8C8',
    padding: 12,
  },
  otherMessageText: {
    fontSize: 15,
    color: '#1C0F0A',
    lineHeight: 20,
  },
  reportButton: {
    padding: 6,
    marginTop: 20,
  },
  removedMessage: {
    alignItems: 'center',
    marginVertical: 8,
  },
  removedText: {
    fontSize: 13,
    color: '#9B7B6A',
    fontStyle: 'italic',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D4C4B0',
    borderRadius: 8,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EDE0D4',
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FDF9F4',
    borderWidth: 1,
    borderColor: '#D4C4B0',
    borderRadius: 22,
    fontSize: 15,
    color: '#1C0F0A',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(107, 79, 62, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#6B4F3E',
  },
});
