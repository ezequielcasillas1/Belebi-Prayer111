/**
 * Language Detection Utility
 * Automatically detects language of text using multiple strategies
 */

import { LanguageCode, SUPPORTED_LANGUAGES, getBaseLanguageCode } from '../../config/countries';
import { DetectedLanguage, LanguageDetectionResult } from './types';

const LANGUAGE_PATTERNS: Record<string, RegExp[]> = {
  ar: [/[\u0600-\u06FF]/, /[\u0750-\u077F]/],
  he: [/[\u0590-\u05FF]/],
  zh: [/[\u4E00-\u9FFF]/, /[\u3400-\u4DBF]/],
  ja: [/[\u3040-\u309F]/, /[\u30A0-\u30FF]/],
  ko: [/[\uAC00-\uD7AF]/, /[\u1100-\u11FF]/],
  th: [/[\u0E00-\u0E7F]/],
  hi: [/[\u0900-\u097F]/],
  ru: [/[\u0400-\u04FF]/],
  uk: [/[\u0400-\u04FF]/],
  el: [/[\u0370-\u03FF]/],
  vi: [/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i],
};

const LANGUAGE_WORDS: Record<string, string[]> = {
  es: ['el', 'la', 'de', 'que', 'y', 'en', 'los', 'del', 'se', 'las', 'por', 'un', 'para', 'con', 'una', 'su', 'oración', 'señor', 'dios', 'gracias', 'bendición', 'amen'],
  fr: ['le', 'la', 'de', 'et', 'en', 'un', 'que', 'est', 'pour', 'qui', 'dans', 'ce', 'il', 'une', 'prière', 'seigneur', 'dieu', 'merci', 'bénédiction', 'amen'],
  de: ['der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich', 'des', 'auf', 'für', 'ist', 'gebet', 'herr', 'gott', 'danke', 'segen', 'amen'],
  it: ['il', 'di', 'che', 'e', 'la', 'per', 'un', 'in', 'sono', 'del', 'preghiera', 'signore', 'dio', 'grazie', 'benedizione', 'amen'],
  pt: ['o', 'de', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'oração', 'senhor', 'deus', 'obrigado', 'bênção', 'amém'],
  nl: ['de', 'het', 'een', 'van', 'en', 'in', 'is', 'op', 'te', 'dat', 'gebed', 'heer', 'god', 'dank', 'zegen', 'amen'],
  pl: ['i', 'w', 'nie', 'na', 'do', 'to', 'że', 'się', 'z', 'co', 'modlitwa', 'pan', 'bóg', 'dziękuję', 'błogosławieństwo', 'amen'],
  sv: ['och', 'i', 'att', 'det', 'som', 'en', 'på', 'är', 'av', 'för', 'bön', 'herre', 'gud', 'tack', 'välsignelse', 'amen'],
  da: ['og', 'i', 'at', 'er', 'en', 'det', 'på', 'de', 'af', 'til', 'bøn', 'herre', 'gud', 'tak', 'velsignelse', 'amen'],
  no: ['og', 'i', 'er', 'det', 'på', 'en', 'å', 'som', 'til', 'av', 'bønn', 'herre', 'gud', 'takk', 'velsignelse', 'amen'],
  fi: ['ja', 'on', 'ei', 'oli', 'että', 'se', 'hän', 'kun', 'niin', 'rukous', 'herra', 'jumala', 'kiitos', 'siunaus', 'aamen'],
  cs: ['a', 'je', 'v', 'na', 'se', 'že', 'to', 'z', 'do', 's', 'modlitba', 'pán', 'bůh', 'děkuji', 'požehnání', 'amen'],
  hu: ['a', 'az', 'és', 'van', 'nem', 'hogy', 'egy', 'ez', 'is', 'ima', 'úr', 'isten', 'köszönöm', 'áldás', 'ámen'],
  ro: ['și', 'în', 'de', 'la', 'cu', 'pe', 'este', 'că', 'un', 'rugăciune', 'domn', 'dumnezeu', 'mulțumesc', 'binecuvântare', 'amin'],
  tr: ['ve', 'bir', 'bu', 'için', 'da', 'de', 'ile', 'mi', 'dua', 'rab', 'tanrı', 'teşekkür', 'bereket', 'amin'],
  id: ['dan', 'yang', 'di', 'ini', 'dengan', 'untuk', 'dari', 'itu', 'doa', 'tuhan', 'allah', 'terima kasih', 'berkat', 'amin'],
  ms: ['dan', 'yang', 'di', 'ini', 'dengan', 'untuk', 'dari', 'itu', 'doa', 'tuhan', 'allah', 'terima kasih', 'berkat', 'amin'],
  en: ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'for', 'that', 'with', 'prayer', 'lord', 'god', 'thank', 'blessing', 'amen'],
};

export function detectLanguageByScript(text: string): DetectedLanguage | null {
  for (const [langCode, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        const coverage = matches.join('').length / text.replace(/\s/g, '').length;
        if (coverage > 0.3) {
          const language = SUPPORTED_LANGUAGES.find(l => getBaseLanguageCode(l.code) === langCode);
          return {
            code: (langCode as LanguageCode),
            confidence: Math.min(coverage * 1.2, 0.98),
            name: language?.name || langCode,
          };
        }
      }
    }
  }
  return null;
}

export function detectLanguageByWords(text: string): DetectedLanguage | null {
  const words = text.toLowerCase().split(/\s+/);
  const scores: Record<string, number> = {};
  
  for (const [langCode, langWords] of Object.entries(LANGUAGE_WORDS)) {
    scores[langCode] = 0;
    for (const word of words) {
      if (langWords.includes(word)) {
        scores[langCode]++;
      }
    }
  }
  
  const sortedScores = Object.entries(scores)
    .filter(([_, score]) => score > 0)
    .sort(([, a], [, b]) => b - a);
  
  if (sortedScores.length === 0) return null;
  
  const [topLang, topScore] = sortedScores[0];
  const confidence = Math.min(topScore / words.length * 2, 0.95);
  
  if (confidence < 0.1) return null;
  
  const language = SUPPORTED_LANGUAGES.find(l => getBaseLanguageCode(l.code) === topLang);
  return {
    code: topLang as LanguageCode,
    confidence,
    name: language?.name || topLang,
  };
}

export function detectLanguage(text: string): LanguageDetectionResult {
  const normalizedText = text.trim();
  
  if (!normalizedText) {
    return {
      detectedLanguage: { code: 'en', confidence: 0, name: 'English' },
      alternatives: [],
      isReliable: false,
    };
  }
  
  const scriptDetection = detectLanguageByScript(normalizedText);
  if (scriptDetection && scriptDetection.confidence > 0.5) {
    return {
      detectedLanguage: scriptDetection,
      alternatives: [],
      isReliable: scriptDetection.confidence > 0.7,
    };
  }
  
  const wordDetection = detectLanguageByWords(normalizedText);
  if (wordDetection) {
    const alternatives: DetectedLanguage[] = [];
    
    if (scriptDetection && scriptDetection.code !== wordDetection.code) {
      alternatives.push(scriptDetection);
    }
    
    return {
      detectedLanguage: wordDetection,
      alternatives,
      isReliable: wordDetection.confidence > 0.3,
    };
  }
  
  if (scriptDetection) {
    return {
      detectedLanguage: scriptDetection,
      alternatives: [],
      isReliable: false,
    };
  }
  
  return {
    detectedLanguage: { code: 'en', confidence: 0.5, name: 'English' },
    alternatives: [],
    isReliable: false,
  };
}

export function needsTranslation(
  sourceLanguage: LanguageCode,
  targetLanguage: LanguageCode
): boolean {
  if (sourceLanguage === targetLanguage) return false;
  
  const sourceBase = getBaseLanguageCode(sourceLanguage);
  const targetBase = getBaseLanguageCode(targetLanguage);
  
  return sourceBase !== targetBase;
}

export function getLanguageDirection(code: LanguageCode): 'ltr' | 'rtl' {
  const rtlLanguages = ['ar', 'he'];
  return rtlLanguages.includes(getBaseLanguageCode(code)) ? 'rtl' : 'ltr';
}
