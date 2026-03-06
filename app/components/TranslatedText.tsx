import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Languages, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../config/countries';
import { colors } from '../theme/colors';

interface TranslatedTextProps {
  text: string;
  contentId?: string;
  numberOfLines?: number;
  style?: object;
  showOriginalToggle?: boolean;
  forceTranslate?: boolean;
  targetLanguage?: LanguageCode;
}

export default function TranslatedText({
  text,
  contentId,
  numberOfLines,
  style,
  showOriginalToggle = true,
  forceTranslate = false,
  targetLanguage,
}: TranslatedTextProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  
  const { text: translatedText, isTranslated, originalLanguage, isLoading } = useTranslation(
    text,
    contentId,
    { autoTranslate: forceTranslate, targetLanguage }
  );

  const getLanguageName = (code: LanguageCode): string => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
    return lang?.name || code;
  };

  const displayText = showOriginal ? text : translatedText;

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.secondary.dark} />
          <Text style={[styles.text, style, styles.loadingText]}>Translating...</Text>
        </View>
      ) : (
        <>
          <Text style={[styles.text, style]} numberOfLines={numberOfLines}>
            {displayText}
          </Text>
          
          {isTranslated && showOriginalToggle && (
            <TouchableOpacity 
              style={styles.translationBadge}
              onPress={() => setShowOriginal(!showOriginal)}
              activeOpacity={0.7}
            >
              <Languages size={12} color={colors.accent.blue} />
              <Text style={styles.translationText}>
                {showOriginal 
                  ? `Original (${getLanguageName(originalLanguage)})` 
                  : `Translated from ${getLanguageName(originalLanguage)}`
                }
              </Text>
              {showOriginal ? (
                <ChevronUp size={12} color={colors.accent.blue} />
              ) : (
                <ChevronDown size={12} color={colors.accent.blue} />
              )}
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

interface TranslationIndicatorProps {
  originalLanguage: LanguageCode;
  isTranslated: boolean;
  compact?: boolean;
}

export function TranslationIndicator({ 
  originalLanguage, 
  isTranslated,
  compact = false 
}: TranslationIndicatorProps) {
  if (!isTranslated) return null;

  const getLanguageName = (code: LanguageCode): string => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
    return lang?.name || code;
  };

  return (
    <View style={[styles.indicatorBadge, compact && styles.indicatorCompact]}>
      <Languages size={compact ? 10 : 12} color={colors.accent.blue} />
      {!compact && (
        <Text style={styles.indicatorText}>
          from {getLanguageName(originalLanguage)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Removed flex: 1 - causes infinite expansion in ScrollView
  },
  text: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontStyle: 'italic',
    color: colors.text.muted,
  },
  translationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: `${colors.accent.blue}15`,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  translationText: {
    fontSize: 11,
    color: colors.accent.blue,
    fontWeight: '500',
  },
  indicatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 6,
    backgroundColor: `${colors.accent.blue}15`,
    borderRadius: 4,
  },
  indicatorCompact: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  indicatorText: {
    fontSize: 10,
    color: colors.accent.blue,
    fontWeight: '500',
  },
});
