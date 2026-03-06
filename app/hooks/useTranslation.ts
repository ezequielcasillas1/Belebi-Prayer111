/**
 * Translation Hook
 * React hook for automatic translation of prayer content
 */

import { useState, useEffect, useCallback } from 'react';
import { LanguageCode } from '../config/countries';
import { 
  translationService, 
  detectLanguage, 
  needsTranslation,
  TranslationResult,
  LanguageDetectionResult 
} from '../services/translation';
import { useAuthStore } from '../features/auth/stores/authStore';

interface UseTranslationOptions {
  autoTranslate?: boolean;
  targetLanguage?: LanguageCode;
}

interface TranslatedContent {
  text: string;
  isTranslated: boolean;
  originalLanguage: LanguageCode;
  isLoading: boolean;
  error: string | null;
}

export function useTranslation(
  originalText: string,
  contentId?: string,
  options: UseTranslationOptions = {}
): TranslatedContent {
  const [result, setResult] = useState<TranslatedContent>({
    text: originalText,
    isTranslated: false,
    originalLanguage: 'en',
    isLoading: true,
    error: null,
  });

  const currentUser = useAuthStore((state) => state.currentUser);

  useEffect(() => {
    let mounted = true;

    async function translateIfNeeded() {
      if (!originalText || !currentUser) {
        setResult({
          text: originalText,
          isTranslated: false,
          originalLanguage: 'en',
          isLoading: false,
          error: null,
        });
        return;
      }

      try {
        const detection = await detectLanguage(originalText);
        const sourceLanguage = detection.detectedLanguage.code;

        const userPref = await translationService.getUserLanguagePreference(currentUser.id);
        const targetLang = options.targetLanguage || userPref?.preferredLanguage || 'en';
        const shouldTranslate = options.autoTranslate ?? userPref?.autoTranslate ?? false;

        if (!shouldTranslate || !needsTranslation(sourceLanguage, targetLang)) {
          if (mounted) {
            setResult({
              text: originalText,
              isTranslated: false,
              originalLanguage: sourceLanguage,
              isLoading: false,
              error: null,
            });
          }
          return;
        }

        const translated = await translationService.translate({
          text: originalText,
          sourceLanguage,
          targetLanguage: targetLang,
          context: 'prayer',
        });

        if (mounted) {
          setResult({
            text: translated.translatedText,
            isTranslated: translated.translatedText !== originalText,
            originalLanguage: sourceLanguage,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (mounted) {
          setResult({
            text: originalText,
            isTranslated: false,
            originalLanguage: 'en',
            isLoading: false,
            error: error instanceof Error ? error.message : 'Translation failed',
          });
        }
      }
    }

    translateIfNeeded();

    return () => {
      mounted = false;
    };
  }, [originalText, currentUser, options.autoTranslate, options.targetLanguage, contentId]);

  return result;
}

export function useLanguageDetection(text: string): LanguageDetectionResult | null {
  const [detection, setDetection] = useState<LanguageDetectionResult | null>(null);

  useEffect(() => {
    if (!text) {
      setDetection(null);
      return;
    }

    const result = detectLanguage(text);
    setDetection(result);
  }, [text]);

  return detection;
}

export function useUserLanguagePreference() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [preference, setPreference] = useState<{
    preferredLanguage: LanguageCode;
    autoTranslate: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPreference() {
      if (!currentUser) {
        setPreference(null);
        setIsLoading(false);
        return;
      }

      try {
        const pref = await translationService.getUserLanguagePreference(currentUser.id);
        setPreference(pref ? {
          preferredLanguage: pref.preferredLanguage,
          autoTranslate: pref.autoTranslate,
        } : null);
      } catch {
        setPreference(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadPreference();
  }, [currentUser]);

  const updatePreference = useCallback(async (
    preferredLanguage: LanguageCode,
    autoTranslate: boolean
  ) => {
    if (!currentUser) return;

    await translationService.setUserLanguagePreference({
      userId: currentUser.id,
      preferredLanguage,
      autoTranslate,
      fallbackLanguage: 'en',
    });
    setPreference({ preferredLanguage, autoTranslate });
  }, [currentUser]);

  return { preference, isLoading, updatePreference };
}
