import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight, MapPin, AlertTriangle } from 'lucide-react-native';
import Badge from './Badge';
import TranslatedText from './TranslatedText';
import { PrayerRequest } from '../data/mockData';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface PrayerRequestCardProps {
  request: PrayerRequest;
  showSnippet?: boolean;
  compact?: boolean;
  onPress?: () => void;
}

export default function PrayerRequestCard({
  request,
  showSnippet = true,
  compact = false,
  onPress,
}: PrayerRequestCardProps) {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('PrayerProfile', { requestId: request.id });
    }
  };

  const imageSize = compact ? 44 : 52;
  const hasEmergency = request.emergencyImages.length > 0;

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      <View style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
        {request.profileImages.length > 0 ? (
          <Image
            source={{ uri: request.profileImages[0] }}
            style={[styles.image, { width: imageSize, height: imageSize, borderRadius: imageSize / 2 }]}
          />
        ) : (
          <View style={[styles.placeholder, { width: imageSize, height: imageSize, borderRadius: imageSize / 2 }]}>
            <Text style={styles.placeholderText}>{request.letter}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{request.name}</Text>

        <View style={styles.locationRow}>
          <MapPin size={13} color={colors.text.muted} />
          <Text style={styles.location} numberOfLines={1}>
            {request.flag} {request.country}
          </Text>
        </View>

        <View style={styles.badges}>
          {request.denomination && <Badge variant="denomination" size="sm">{request.denomination}</Badge>}
          {hasEmergency && (
            <Badge variant="emergency" size="sm">
              <View style={styles.emergencyBadge}>
                <AlertTriangle size={11} color="#7A1E1E" />
                <Text style={styles.emergencyText}>Emergency</Text>
              </View>
            </Badge>
          )}
        </View>

        {showSnippet && !compact && (
          <TranslatedText
            text={request.requestText}
            contentId={request.id}
            numberOfLines={2}
            style={styles.snippet}
            showOriginalToggle={false}
            forceTranslate={true}
          />
        )}
      </View>

      <View style={styles.chevron}>
        <ChevronRight size={20} color={colors.text.muted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    backgroundColor: colors.ui.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
    marginBottom: 10,
    shadowColor: colors.secondary.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    borderWidth: 2,
    borderColor: colors.ui.borderLight,
  },
  placeholder: {
    backgroundColor: `${colors.secondary.dark}1A`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.ui.borderLight,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary.dark,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  location: {
    fontSize: 13,
    color: colors.text.muted,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emergencyText: {
    fontSize: 11,
    color: colors.error.text,
    fontWeight: '500',
  },
  snippet: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  chevron: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
});
