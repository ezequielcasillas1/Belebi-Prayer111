/**
 * Translation Service Types
 * Universal types for language detection and translation operations
 */

import { LanguageCode } from '../../config/countries';

export interface DetectedLanguage {
  code: LanguageCode;
  confidence: number;
  name: string;
}

export interface TranslationRequest {
  text: string;
  sourceLanguage?: LanguageCode;
  targetLanguage: LanguageCode;
  context?: 'prayer' | 'message' | 'profile';
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  confidence: number;
  cached: boolean;
}

export interface LanguageDetectionResult {
  detectedLanguage: DetectedLanguage;
  alternatives: DetectedLanguage[];
  isReliable: boolean;
}

export interface TranslationCacheEntry {
  key: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  timestamp: number;
  expiresAt: number;
}

export interface TranslationProvider {
  name: string;
  detectLanguage: (text: string) => Promise<LanguageDetectionResult>;
  translate: (request: TranslationRequest) => Promise<TranslationResult>;
  getSupportedLanguages: () => Promise<LanguageCode[]>;
}

export interface UserLanguagePreference {
  userId: string;
  preferredLanguage: LanguageCode;
  autoTranslate: boolean;
  fallbackLanguage: LanguageCode;
}

export interface TranslationPair {
  senderId: string;
  senderLanguage: LanguageCode;
  receiverId: string;
  receiverLanguage: LanguageCode;
}

export interface ContentTranslation {
  id: string;
  contentType: 'prayer_request' | 'prayer_response' | 'chat_message';
  contentId: string;
  originalText: string;
  originalLanguage: LanguageCode;
  translations: Record<LanguageCode, string>;
  detectedAt: string;
  lastUpdated: string;
}

export type TranslationStatus = 'pending' | 'translating' | 'completed' | 'failed' | 'cached';

export interface TranslationJob {
  id: string;
  contentId: string;
  contentType: string;
  sourceLanguage: LanguageCode;
  targetLanguages: LanguageCode[];
  status: TranslationStatus;
  priority: number;
  createdAt: string;
  completedAt?: string;
  error?: string;
}
