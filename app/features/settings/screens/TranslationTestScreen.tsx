import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MapPin, MessageCircle, Clock, Globe } from 'lucide-react-native';
import AppHeader from '../../../components/AppHeader';
import TranslatedText from '../../../components/TranslatedText';
import Badge from '../../../components/Badge';
import { colors } from '../../../theme/colors';

interface MockPrayerRequest {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  language: string;
  languageCode: string;
  requestText: string;
  timestamp: string;
  profileImage?: string;
}

interface MockChatMessage {
  id: string;
  name: string;
  flag: string;
  language: string;
  message: string;
  timestamp: string;
}

const MOCK_FOREIGN_REQUESTS: MockPrayerRequest[] = [
  // Portuguese (Brazil)
  {
    id: 'pt-1',
    name: 'Maria Silva',
    country: 'Brazil',
    countryCode: 'BR',
    flag: '🇧🇷',
    language: 'Portuguese',
    languageCode: 'pt',
    requestText: 'Por favor, orem pela minha mãe que está no hospital. Ela precisa de uma cirurgia urgente. Deus é fiel.',
    timestamp: '2 hours ago',
  },
  // Spanish (Mexico)
  {
    id: 'es-1',
    name: 'Carlos García',
    country: 'Mexico',
    countryCode: 'MX',
    flag: '🇲🇽',
    language: 'Spanish',
    languageCode: 'es',
    requestText: 'Por favor oren por mi familia. Estamos pasando por momentos difíciles y necesitamos la bendición de Dios.',
    timestamp: '1 hour ago',
  },
  // French
  {
    id: 'fr-1',
    name: 'Marie Dubois',
    country: 'France',
    countryCode: 'FR',
    flag: '🇫🇷',
    language: 'French',
    languageCode: 'fr',
    requestText: 'S\'il vous plaît, priez pour ma santé. Je traverse une période difficile et j\'ai besoin de la grâce de Dieu.',
    timestamp: '3 hours ago',
  },
  // German
  {
    id: 'de-1',
    name: 'Hans Müller',
    country: 'Germany',
    countryCode: 'DE',
    flag: '🇩🇪',
    language: 'German',
    languageCode: 'de',
    requestText: 'Bitte betet für meine Familie. Wir brauchen Gottes Führung und Segen in dieser schwierigen Zeit.',
    timestamp: '4 hours ago',
  },
  // Italian
  {
    id: 'it-1',
    name: 'Marco Rossi',
    country: 'Italy',
    countryCode: 'IT',
    flag: '🇮🇹',
    language: 'Italian',
    languageCode: 'it',
    requestText: 'Per favore pregate per mio padre. È malato e ha bisogno della guarigione di Dio. Grazie per le vostre preghiere.',
    timestamp: '2 hours ago',
  },
  // Japanese
  {
    id: 'ja-1',
    name: 'Yuki Tanaka',
    country: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    language: 'Japanese',
    languageCode: 'ja',
    requestText: '私の息子は大学受験を控えています。彼が神様の導きを受けて、正しい道を見つけられるようにお祈りください。',
    timestamp: '1 hour ago',
  },
  // Chinese
  {
    id: 'zh-1',
    name: '李明',
    country: 'China',
    countryCode: 'CN',
    flag: '🇨🇳',
    language: 'Chinese',
    languageCode: 'zh',
    requestText: '请为我的家人祷告。我的母亲生病了，需要上帝的医治。感谢你们的代祷。',
    timestamp: '2 hours ago',
  },
  // Korean
  {
    id: 'ko-1',
    name: '김민준',
    country: 'South Korea',
    countryCode: 'KR',
    flag: '🇰🇷',
    language: 'Korean',
    languageCode: 'ko',
    requestText: '제 가족을 위해 기도해 주세요. 아버지가 새 직장을 찾고 계시는데 하나님의 인도하심이 필요합니다.',
    timestamp: '1 hour ago',
  },
  // Arabic
  {
    id: 'ar-1',
    name: 'أحمد محمد',
    country: 'Egypt',
    countryCode: 'EG',
    flag: '🇪🇬',
    language: 'Arabic',
    languageCode: 'ar',
    requestText: 'أطلب منكم الصلاة من أجل عائلتي. نحن نمر بظروف صعبة ونحتاج إلى دعمكم وصلواتكم.',
    timestamp: '3 hours ago',
  },
  // Hebrew
  {
    id: 'he-1',
    name: 'דוד כהן',
    country: 'Israel',
    countryCode: 'IL',
    flag: '🇮🇱',
    language: 'Hebrew',
    languageCode: 'he',
    requestText: 'אנא התפללו עבור המשפחה שלי. אנחנו עוברים תקופה קשה וזקוקים לברכת האל.',
    timestamp: '2 hours ago',
  },
  // Hindi
  {
    id: 'hi-1',
    name: 'राज शर्मा',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    language: 'Hindi',
    languageCode: 'hi',
    requestText: 'कृपया मेरे परिवार के लिए प्रार्थना करें। हम कठिन समय से गुजर रहे हैं और हमें भगवान की कृपा चाहिए।',
    timestamp: '4 hours ago',
  },
  // Thai
  {
    id: 'th-1',
    name: 'สมชาย',
    country: 'Thailand',
    countryCode: 'TH',
    flag: '🇹🇭',
    language: 'Thai',
    languageCode: 'th',
    requestText: 'กรุณาอธิษฐานเผื่อครอบครัวของฉัน พ่อของฉันป่วยและต้องการการรักษา ขอบคุณสำหรับคำอธิษฐาน',
    timestamp: '5 hours ago',
  },
  // Russian
  {
    id: 'ru-1',
    name: 'Анна Петрова',
    country: 'Russia',
    countryCode: 'RU',
    flag: '🇷🇺',
    language: 'Russian',
    languageCode: 'ru',
    requestText: 'Прошу молитв за моего отца. Он болен и врачи говорят, что нужна операция. Мы верим в Божью помощь.',
    timestamp: '4 hours ago',
  },
  // Ukrainian
  {
    id: 'uk-1',
    name: 'Олена Коваленко',
    country: 'Ukraine',
    countryCode: 'UA',
    flag: '🇺🇦',
    language: 'Ukrainian',
    languageCode: 'uk',
    requestText: 'Будь ласка, моліться за мою родину. Ми живемо в складний час і потребуємо Божої підтримки та захисту.',
    timestamp: '30 minutes ago',
  },
  // Polish
  {
    id: 'pl-1',
    name: 'Anna Kowalska',
    country: 'Poland',
    countryCode: 'PL',
    flag: '🇵🇱',
    language: 'Polish',
    languageCode: 'pl',
    requestText: 'Proszę o modlitwę za moją rodzinę. Przechodzimy trudny czas i potrzebujemy Bożego błogosławieństwa.',
    timestamp: '2 hours ago',
  },
  // Dutch
  {
    id: 'nl-1',
    name: 'Jan de Vries',
    country: 'Netherlands',
    countryCode: 'NL',
    flag: '🇳🇱',
    language: 'Dutch',
    languageCode: 'nl',
    requestText: 'Bid alstublieft voor mijn gezin. We maken een moeilijke tijd door en hebben Gods zegen nodig.',
    timestamp: '3 hours ago',
  },
  // Greek
  {
    id: 'el-1',
    name: 'Νίκος Παπαδόπουλος',
    country: 'Greece',
    countryCode: 'GR',
    flag: '🇬🇷',
    language: 'Greek',
    languageCode: 'el',
    requestText: 'Παρακαλώ προσευχηθείτε για την οικογένειά μου. Περνάμε δύσκολες στιγμές και χρειαζόμαστε την ευλογία του Θεού.',
    timestamp: '1 hour ago',
  },
  // Turkish
  {
    id: 'tr-1',
    name: 'Mehmet Yılmaz',
    country: 'Turkey',
    countryCode: 'TR',
    flag: '🇹🇷',
    language: 'Turkish',
    languageCode: 'tr',
    requestText: 'Lütfen ailem için dua edin. Zor zamanlardan geçiyoruz ve Tanrının bereketine ihtiyacımız var.',
    timestamp: '2 hours ago',
  },
  // Vietnamese
  {
    id: 'vi-1',
    name: 'Nguyễn Văn An',
    country: 'Vietnam',
    countryCode: 'VN',
    flag: '🇻🇳',
    language: 'Vietnamese',
    languageCode: 'vi',
    requestText: 'Xin hãy cầu nguyện cho gia đình tôi. Chúng tôi đang trải qua thời kỳ khó khăn và cần ơn phước của Chúa.',
    timestamp: '4 hours ago',
  },
  // Indonesian
  {
    id: 'id-1',
    name: 'Budi Santoso',
    country: 'Indonesia',
    countryCode: 'ID',
    flag: '🇮🇩',
    language: 'Indonesian',
    languageCode: 'id',
    requestText: 'Tolong doakan keluarga saya. Kami sedang melewati masa sulit dan membutuhkan berkat Tuhan.',
    timestamp: '3 hours ago',
  },
];

const MOCK_CHAT_MESSAGES: MockChatMessage[] = [
  {
    id: 'chat-1',
    name: 'Maria',
    flag: '🇧🇷',
    language: 'Portuguese',
    message: 'Olá a todos! Que Deus abençoe vocês.',
    timestamp: '12:45 PM',
  },
  {
    id: 'chat-2',
    name: 'Yuki',
    flag: '🇯🇵',
    language: 'Japanese',
    message: 'こんにちは！今日も一緒にお祈りしましょう。',
    timestamp: '12:46 PM',
  },
  {
    id: 'chat-3',
    name: '김민준',
    flag: '🇰🇷',
    language: 'Korean',
    message: '안녕하세요! 함께 기도합시다.',
    timestamp: '12:47 PM',
  },
  {
    id: 'chat-4',
    name: 'أحمد',
    flag: '🇪🇬',
    language: 'Arabic',
    message: 'مرحبا بالجميع! بارك الله فيكم.',
    timestamp: '12:48 PM',
  },
  {
    id: 'chat-5',
    name: 'สมชาย',
    flag: '🇹🇭',
    language: 'Thai',
    message: 'สวัสดีครับ! ขอพระเจ้าอวยพรทุกคน',
    timestamp: '12:49 PM',
  },
  {
    id: 'chat-6',
    name: 'राज',
    flag: '🇮🇳',
    language: 'Hindi',
    message: 'नमस्ते! भगवान आप सभी को आशीर्वाद दें।',
    timestamp: '12:50 PM',
  },
  {
    id: 'chat-7',
    name: 'דוד',
    flag: '🇮🇱',
    language: 'Hebrew',
    message: 'שלום לכולם! ה׳ יברך אתכם.',
    timestamp: '12:51 PM',
  },
  {
    id: 'chat-8',
    name: 'Νίκος',
    flag: '🇬🇷',
    language: 'Greek',
    message: 'Γεια σε όλους! Ο Θεός να σας ευλογεί.',
    timestamp: '12:52 PM',
  },
  {
    id: 'chat-9',
    name: 'Nguyễn',
    flag: '🇻🇳',
    language: 'Vietnamese',
    message: 'Xin chào mọi người! Cầu Chúa ban phước cho các bạn.',
    timestamp: '12:53 PM',
  },
  {
    id: 'chat-10',
    name: 'Олена',
    flag: '🇺🇦',
    language: 'Ukrainian',
    message: 'Привіт усім! Нехай Бог благословить вас.',
    timestamp: '12:54 PM',
  },
  {
    id: 'chat-11',
    name: 'Анна',
    flag: '🇷🇺',
    language: 'Russian',
    message: 'Всем привет! Молюсь за каждого из вас.',
    timestamp: '12:55 PM',
  },
];

export default function TranslationTestScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'requests' | 'chat'>('requests');

  const renderPrayerCard = (request: MockPrayerRequest) => (
    <View key={request.id} style={styles.prayerCard}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{request.name[0]}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{request.name}</Text>
          <View style={styles.locationRow}>
            <MapPin size={12} color={colors.text.muted} />
            <Text style={styles.location}>{request.flag} {request.country}</Text>
          </View>
        </View>
        <View style={styles.languageBadge}>
          <Globe size={12} color={colors.accent.blue} />
          <Text style={styles.languageText}>{request.language}</Text>
        </View>
      </View>

      <View style={styles.originalSection}>
        <Text style={styles.originalLabel}>Original:</Text>
        <Text style={styles.originalText}>"{request.requestText}"</Text>
      </View>

      <View style={styles.translatedSection}>
        <Text style={styles.translatedLabel}>Translated:</Text>
        <TranslatedText
          text={request.requestText}
          contentId={request.id}
          style={styles.translatedText}
          showOriginalToggle={true}
          forceTranslate={true}
        />
      </View>

      <View style={styles.cardFooter}>
        <Clock size={12} color={colors.text.muted} />
        <Text style={styles.timestamp}>{request.timestamp}</Text>
      </View>
    </View>
  );

  const renderChatMessage = (msg: MockChatMessage, index: number) => (
    <View key={msg.id} style={[styles.chatBubble, index % 2 === 0 ? styles.chatLeft : styles.chatRight]}>
      <View style={styles.chatHeader}>
        <Text style={styles.chatFlag}>{msg.flag}</Text>
        <Text style={styles.chatName}>{msg.name}</Text>
        <Text style={styles.chatTime}>{msg.timestamp}</Text>
      </View>
      
      <View style={styles.chatOriginal}>
        <Text style={styles.chatOriginalText}>{msg.message}</Text>
      </View>
      
      <View style={styles.chatTranslated}>
        <TranslatedText
          text={msg.message}
          contentId={msg.id}
          style={styles.chatTranslatedText}
          showOriginalToggle={false}
          forceTranslate={true}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Translation Test" subtitle="Live demo with foreign languages" showBack />

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
            Prayer Requests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chat' && styles.tabActive]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={[styles.tabText, activeTab === 'chat' && styles.tabTextActive]}>
            Live Chat Room
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBar}>
        <Globe size={14} color={colors.accent.blue} />
        <Text style={styles.infoText}>
          Testing 20 languages - scroll to see all
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'requests' ? (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Foreign Prayer Requests</Text>
            <Text style={styles.sectionSubtitle}>
              Each card shows the original text and auto-translated version
            </Text>
            {MOCK_FOREIGN_REQUESTS.map(renderPrayerCard)}
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Global Prayer Room</Text>
            <Text style={styles.sectionSubtitle}>
              Simulated live chat with automatic translation
            </Text>
            <View style={styles.chatContainer}>
              {MOCK_CHAT_MESSAGES.map(renderChatMessage)}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ui.background,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(107, 79, 62, 0.08)',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.secondary.dark,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: '#FFF',
  },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 12,
    padding: 10,
    backgroundColor: `${colors.accent.blue}15`,
    borderRadius: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.accent.blue,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.text.muted,
    marginBottom: 16,
  },
  prayerCard: {
    backgroundColor: colors.ui.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
    shadowColor: colors.secondary.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${colors.secondary.dark}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary.dark,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  location: {
    fontSize: 13,
    color: colors.text.muted,
  },
  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: `${colors.accent.blue}15`,
    borderRadius: 6,
  },
  languageText: {
    fontSize: 11,
    color: colors.accent.blue,
    fontWeight: '500',
  },
  originalSection: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 10,
  },
  originalLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.muted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  originalText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  translatedSection: {
    padding: 12,
    backgroundColor: `${colors.accent.blue}08`,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${colors.accent.blue}20`,
  },
  translatedLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.accent.blue,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  translatedText: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.ui.borderLight,
  },
  timestamp: {
    fontSize: 12,
    color: colors.text.muted,
  },
  chatContainer: {
    gap: 12,
  },
  chatBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.ui.card,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
  },
  chatLeft: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  chatRight: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  chatFlag: {
    fontSize: 14,
  },
  chatName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  chatTime: {
    fontSize: 11,
    color: colors.text.muted,
  },
  chatOriginal: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.borderLight,
  },
  chatOriginalText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  chatTranslated: {
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: colors.accent.blue,
  },
  chatTranslatedText: {
    fontSize: 14,
    color: colors.text.primary,
  },
});
