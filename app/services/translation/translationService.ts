/**
 * Universal Translation Service
 * Handles automatic language detection and 1-to-1 translation operations
 * Designed for prayer app context with proper caching and provider abstraction
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageCode, getBaseLanguageCode, SUPPORTED_LANGUAGES } from '../../config/countries';
import { supabase } from '../../lib/supabase';
import { 
  TranslationRequest, 
  TranslationResult, 
  TranslationCacheEntry,
  ContentTranslation,
  TranslationProvider,
  LanguageDetectionResult,
  UserLanguagePreference,
} from './types';
import { detectLanguage, needsTranslation } from './languageDetector';

const CACHE_KEY_PREFIX = 'translation_cache_';
const PREF_KEY_PREFIX = 'language_pref_';
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_CACHE_ENTRIES = 500;

class TranslationService {
  private cache: Map<string, TranslationCacheEntry> = new Map();
  private provider: TranslationProvider | null = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    await this.loadCacheFromStorage();
    this.initialized = true;
  }

  setProvider(provider: TranslationProvider): void {
    this.provider = provider;
  }

  private generateCacheKey(text: string, source: LanguageCode, target: LanguageCode): string {
    const hash = this.simpleHash(text);
    return `${getBaseLanguageCode(source)}_${getBaseLanguageCode(target)}_${hash}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  private async loadCacheFromStorage(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith(CACHE_KEY_PREFIX));
      
      if (cacheKeys.length === 0) return;

      const entries = await AsyncStorage.multiGet(cacheKeys);
      const now = Date.now();

      for (const [key, value] of entries) {
        if (!value) continue;
        
        try {
          const entry: TranslationCacheEntry = JSON.parse(value);
          
          // Skip and remove bad cache entries where translation failed (same as original)
          const isBadCache = entry.translatedText === entry.originalText;
          if (isBadCache) {
            await AsyncStorage.removeItem(key);
            continue;
          }
          
          if (entry.expiresAt > now) {
            this.cache.set(entry.key, entry);
          } else {
            await AsyncStorage.removeItem(key);
          }
        } catch {
          await AsyncStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Failed to load translation cache:', error);
    }
  }

  private async saveCacheEntry(entry: TranslationCacheEntry): Promise<void> {
    this.cache.set(entry.key, entry);
    
    if (this.cache.size > MAX_CACHE_ENTRIES) {
      const entries = Array.from(this.cache.entries());
      entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);
      
      const toRemove = entries.slice(0, entries.length - MAX_CACHE_ENTRIES);
      for (const [key] of toRemove) {
        this.cache.delete(key);
        await AsyncStorage.removeItem(`${CACHE_KEY_PREFIX}${key}`);
      }
    }

    try {
      await AsyncStorage.setItem(
        `${CACHE_KEY_PREFIX}${entry.key}`,
        JSON.stringify(entry)
      );
    } catch (error) {
      console.error('Failed to save translation cache:', error);
    }
  }

  async detectLanguage(text: string): Promise<LanguageDetectionResult> {
    if (this.provider) {
      try {
        return await this.provider.detectLanguage(text);
      } catch {
        return detectLanguage(text);
      }
    }
    return detectLanguage(text);
  }

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    await this.initialize();

    const detectionResult = await this.detectLanguage(request.text);
    const sourceLanguage = request.sourceLanguage || detectionResult.detectedLanguage.code;

    if (!needsTranslation(sourceLanguage, request.targetLanguage)) {
      return {
        originalText: request.text,
        translatedText: request.text,
        sourceLanguage,
        targetLanguage: request.targetLanguage,
        confidence: 1,
        cached: false,
      };
    }

    const cacheKey = this.generateCacheKey(request.text, sourceLanguage, request.targetLanguage);
    const cachedEntry = this.cache.get(cacheKey);
    
    if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
      const isBadCache = cachedEntry.translatedText === cachedEntry.originalText;
      
      // Don't return bad cache entries where translation failed (same as original)
      if (!isBadCache) {
        return {
          originalText: cachedEntry.originalText,
          translatedText: cachedEntry.translatedText,
          sourceLanguage: cachedEntry.sourceLanguage,
          targetLanguage: cachedEntry.targetLanguage,
          confidence: 1,
          cached: true,
        };
      }
      // Bad cache - invalidate and continue to provider
      this.cache.delete(cacheKey);
      AsyncStorage.removeItem(`${CACHE_KEY_PREFIX}${cacheKey}`).catch(() => {});
    }

    if (this.provider) {
      try {
        const result = await this.provider.translate({
          ...request,
          sourceLanguage,
        });

        const translationFailed = result.translatedText === request.text;

        // Only cache successful translations (translated text differs from original)
        if (!translationFailed) {
          await this.saveCacheEntry({
            key: cacheKey,
            originalText: request.text,
            translatedText: result.translatedText,
            sourceLanguage,
            targetLanguage: request.targetLanguage,
            timestamp: Date.now(),
            expiresAt: Date.now() + CACHE_EXPIRY_MS,
          });
        }

        return result;
      } catch (error) {
        console.error('Translation provider error:', error);
      }
    }

    return {
      originalText: request.text,
      translatedText: request.text,
      sourceLanguage,
      targetLanguage: request.targetLanguage,
      confidence: 0,
      cached: false,
    };
  }

  async translateForUser(
    text: string,
    sourceLanguage: LanguageCode,
    userId: string
  ): Promise<TranslationResult> {
    const userPref = await this.getUserLanguagePreference(userId);
    
    if (!userPref || !userPref.autoTranslate) {
      return {
        originalText: text,
        translatedText: text,
        sourceLanguage,
        targetLanguage: sourceLanguage,
        confidence: 1,
        cached: false,
      };
    }

    return this.translate({
      text,
      sourceLanguage,
      targetLanguage: userPref.preferredLanguage,
    });
  }

  async getContentTranslation(
    contentId: string,
    contentType: 'prayer_request' | 'prayer_response' | 'chat_message',
    targetLanguage: LanguageCode
  ): Promise<string | null> {
    try {
      const { data } = await supabase
        .from('content_translations')
        .select('translations')
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .single();

      if (data?.translations?.[targetLanguage]) {
        return data.translations[targetLanguage];
      }
    } catch {
      // Translation not found in database
    }
    return null;
  }

  async storeContentTranslation(
    contentId: string,
    contentType: 'prayer_request' | 'prayer_response' | 'chat_message',
    originalText: string,
    originalLanguage: LanguageCode,
    translatedText: string,
    targetLanguage: LanguageCode
  ): Promise<void> {
    try {
      const { data: existing } = await supabase
        .from('content_translations')
        .select('*')
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .single();

      if (existing) {
        await supabase
          .from('content_translations')
          .update({
            translations: {
              ...existing.translations,
              [targetLanguage]: translatedText,
            },
            last_updated: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('content_translations')
          .insert({
            content_id: contentId,
            content_type: contentType,
            original_text: originalText,
            original_language: originalLanguage,
            translations: { [targetLanguage]: translatedText },
            detected_at: new Date().toISOString(),
            last_updated: new Date().toISOString(),
          });
      }
    } catch (error) {
      console.error('Failed to store content translation:', error);
    }
  }

  async getUserLanguagePreference(userId: string): Promise<UserLanguagePreference | null> {
    // Check local storage first (faster, works offline)
    try {
      const localData = await AsyncStorage.getItem(`${PREF_KEY_PREFIX}${userId}`);
      if (localData) {
        return JSON.parse(localData) as UserLanguagePreference;
      }
    } catch {
      // Local storage failed, try Supabase
    }

    // Try Supabase as backup
    try {
      const { data } = await supabase
        .from('user_language_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        const pref: UserLanguagePreference = {
          userId: data.user_id,
          preferredLanguage: data.preferred_language,
          autoTranslate: data.auto_translate,
          fallbackLanguage: data.fallback_language || 'en',
        };
        // Cache locally for next time
        await AsyncStorage.setItem(`${PREF_KEY_PREFIX}${userId}`, JSON.stringify(pref));
        return pref;
      }
    } catch {
      // Supabase failed too
    }
    return null;
  }

  async setUserLanguagePreference(preference: UserLanguagePreference): Promise<void> {
    // Always save to local storage first (instant, works offline)
    try {
      await AsyncStorage.setItem(
        `${PREF_KEY_PREFIX}${preference.userId}`,
        JSON.stringify(preference)
      );
    } catch (localError) {
      console.error('Failed to save preference locally:', localError);
    }

    // Only sync to Supabase if there's an active session with matching user
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Skip sync if no active session or user ID mismatch
      if (!session?.user?.id || session.user.id !== preference.userId) {
        return;
      }

      const { error } = await supabase
        .from('user_language_preferences')
        .upsert({
          user_id: preference.userId,
          preferred_language: preference.preferredLanguage,
          auto_translate: preference.autoTranslate,
          fallback_language: preference.fallbackLanguage,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });

      if (error) {
        console.warn('Supabase sync failed (using local storage):', error.message);
      }
    } catch (error) {
      console.warn('Supabase sync failed (using local storage):', error);
    }
  }

  async translatePrayerRequest(
    requestId: string,
    requestText: string,
    targetUserId: string
  ): Promise<string> {
    const detection = await this.detectLanguage(requestText);
    const userPref = await this.getUserLanguagePreference(targetUserId);

    if (!userPref || !userPref.autoTranslate) {
      return requestText;
    }

    if (!needsTranslation(detection.detectedLanguage.code, userPref.preferredLanguage)) {
      return requestText;
    }

    const existing = await this.getContentTranslation(
      requestId,
      'prayer_request',
      userPref.preferredLanguage
    );

    if (existing) {
      return existing;
    }

    const result = await this.translate({
      text: requestText,
      sourceLanguage: detection.detectedLanguage.code,
      targetLanguage: userPref.preferredLanguage,
      context: 'prayer',
    });

    if (result.translatedText !== requestText) {
      await this.storeContentTranslation(
        requestId,
        'prayer_request',
        requestText,
        detection.detectedLanguage.code,
        result.translatedText,
        userPref.preferredLanguage
      );
    }

    return result.translatedText;
  }

  async translatePrayerResponse(
    responseId: string,
    responseText: string,
    targetUserId: string
  ): Promise<string> {
    const detection = await this.detectLanguage(responseText);
    const userPref = await this.getUserLanguagePreference(targetUserId);

    if (!userPref || !userPref.autoTranslate) {
      return responseText;
    }

    if (!needsTranslation(detection.detectedLanguage.code, userPref.preferredLanguage)) {
      return responseText;
    }

    const result = await this.translate({
      text: responseText,
      sourceLanguage: detection.detectedLanguage.code,
      targetLanguage: userPref.preferredLanguage,
      context: 'prayer',
    });

    return result.translatedText;
  }

  async clearCache(): Promise<void> {
    this.cache.clear();
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_KEY_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
  }

  getSupportedLanguages(): typeof SUPPORTED_LANGUAGES {
    return SUPPORTED_LANGUAGES;
  }
}

export const translationService = new TranslationService();

export async function translateContent(
  text: string,
  targetLanguage: LanguageCode,
  sourceLanguage?: LanguageCode
): Promise<string> {
  const result = await translationService.translate({
    text,
    sourceLanguage,
    targetLanguage,
  });
  return result.translatedText;
}

export async function getTranslatedPrayerForUser(
  requestId: string,
  requestText: string,
  viewerId: string
): Promise<{ text: string; isTranslated: boolean; originalLanguage: LanguageCode }> {
  const detection = await translationService.detectLanguage(requestText);
  const userPref = await translationService.getUserLanguagePreference(viewerId);

  if (!userPref || !userPref.autoTranslate) {
    return {
      text: requestText,
      isTranslated: false,
      originalLanguage: detection.detectedLanguage.code,
    };
  }

  const translatedText = await translationService.translatePrayerRequest(
    requestId,
    requestText,
    viewerId
  );

  return {
    text: translatedText,
    isTranslated: translatedText !== requestText,
    originalLanguage: detection.detectedLanguage.code,
  };
}
