/**
 * Supabase Edge Function Translation Provider
 * Uses Supabase Edge Functions to handle translation via external APIs
 * This keeps API keys secure on the server side
 */

import { supabase } from '../../../lib/supabase';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../../../config/countries';
import {
  TranslationProvider,
  TranslationRequest,
  TranslationResult,
  LanguageDetectionResult,
} from '../types';
import { detectLanguage } from '../languageDetector';

export class SupabaseEdgeTranslationProvider implements TranslationProvider {
  name = 'supabase-edge';

  async detectLanguage(text: string): Promise<LanguageDetectionResult> {
    try {
      const { data, error } = await supabase.functions.invoke('detect-language', {
        body: { text },
      });

      if (error) throw error;

      return {
        detectedLanguage: {
          code: data.languageCode as LanguageCode,
          confidence: data.confidence,
          name: data.languageName,
        },
        alternatives: data.alternatives || [],
        isReliable: data.confidence > 0.8,
      };
    } catch {
      return detectLanguage(text);
    }
  }

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('translate-text', {
        body: {
          text: request.text,
          sourceLanguage: request.sourceLanguage,
          targetLanguage: request.targetLanguage,
          context: request.context,
        },
      });

      if (error) throw error;

      return {
        originalText: request.text,
        translatedText: data.translatedText,
        sourceLanguage: data.sourceLanguage || request.sourceLanguage!,
        targetLanguage: request.targetLanguage,
        confidence: data.confidence || 0.95,
        cached: false,
      };
    } catch (error) {
      console.error('Supabase Edge translation error:', error);
      
      return {
        originalText: request.text,
        translatedText: request.text,
        sourceLanguage: request.sourceLanguage || 'en',
        targetLanguage: request.targetLanguage,
        confidence: 0,
        cached: false,
      };
    }
  }

  async getSupportedLanguages(): Promise<LanguageCode[]> {
    return SUPPORTED_LANGUAGES.map(l => l.code);
  }
}

export const supabaseEdgeProvider = new SupabaseEdgeTranslationProvider();
