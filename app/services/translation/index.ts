/**
 * Translation Service Exports
 * Universal translation system for automatic language detection and 1-to-1 translation
 */

export { translationService, translateContent, getTranslatedPrayerForUser } from './translationService';
export { detectLanguage, needsTranslation, getLanguageDirection } from './languageDetector';
export { supabaseEdgeProvider } from './providers/supabaseEdgeProvider';
export * from './types';
