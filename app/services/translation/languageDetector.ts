/**
 * Language Detection Utility
 * Automatically detects language of text using multiple strategies
 */

import { LanguageCode, SUPPORTED_LANGUAGES, getBaseLanguageCode } from '../../config/countries';
import { DetectedLanguage, LanguageDetectionResult } from './types';

const LANGUAGE_PATTERNS: Record<string, RegExp[]> = {
  ar: [/[\u0600-\u06FF]/g, /[\u0750-\u077F]/g],
  he: [/[\u0590-\u05FF]/g],
  zh: [/[\u4E00-\u9FFF]/g, /[\u3400-\u4DBF]/g],
  ja: [/[\u3040-\u309F]/g, /[\u30A0-\u30FF]/g],
  ko: [/[\uAC00-\uD7AF]/g, /[\u1100-\u11FF]/g],
  th: [/[\u0E00-\u0E7F]/g],
  hi: [/[\u0900-\u097F]/g],
  // Note: ru and uk handled specially below due to shared Cyrillic
  el: [/[\u0370-\u03FF]/g],
  vi: [/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/gi],
  pl: [/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g], // Polish diacritics
  fa: [/[\u0600-\u06FF]/g],
};

const LANGUAGE_WORDS: Record<string, string[]> = {
  es: ['el', 'la', 'de', 'que', 'y', 'en', 'los', 'del', 'se', 'las', 'por', 'un', 'para', 'con', 'una', 'su', 'oración', 'señor', 'dios', 'gracias', 'bendición', 'amen'],
  fr: ['le', 'la', 'de', 'et', 'en', 'un', 'que', 'est', 'pour', 'qui', 'dans', 'ce', 'il', 'une', 'prière', 'seigneur', 'dieu', 'merci', 'bénédiction', 'amen'],
  de: ['der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich', 'des', 'auf', 'für', 'ist', 'gebet', 'herr', 'gott', 'danke', 'segen', 'amen'],
  it: ['il', 'di', 'che', 'e', 'la', 'per', 'un', 'in', 'sono', 'del', 'preghiera', 'signore', 'dio', 'grazie', 'benedizione', 'amen'],
  pt: ['o', 'de', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'oração', 'senhor', 'deus', 'obrigado', 'bênção', 'amém'],
  nl: ['de', 'het', 'een', 'van', 'en', 'in', 'is', 'op', 'te', 'dat', 'gebed', 'heer', 'god', 'dank', 'zegen', 'amen'],
  pl: ['i', 'w', 'nie', 'na', 'do', 'to', 'że', 'się', 'z', 'co', 'za', 'o', 'jest', 'jak', 'ale', 'czy', 'tak', 'już', 'tylko', 'może', 'bardzo', 'proszę', 'modlitwa', 'modlitwę', 'rodzinę', 'rodzina', 'potrzebujemy', 'pan', 'bóg', 'bożego', 'dziękuję', 'błogosławieństwo', 'błogosławieństwa', 'amen'],
  sv: ['och', 'att', 'det', 'som', 'på', 'är', 'av', 'för', 'bön', 'herre', 'gud', 'tack', 'välsignelse', 'amen', 'jag', 'inte', 'med', 'har', 'var'],
  da: ['og', 'at', 'er', 'det', 'på', 'af', 'til', 'bøn', 'herre', 'gud', 'tak', 'velsignelse', 'amen', 'jeg', 'ikke', 'med', 'har', 'var', 'hvad'],
  no: ['og', 'er', 'det', 'på', 'å', 'som', 'til', 'av', 'bønn', 'herre', 'gud', 'takk', 'velsignelse', 'amen', 'jeg', 'ikke', 'med', 'har', 'hva'],
  fi: ['ja', 'on', 'ei', 'oli', 'että', 'se', 'hän', 'kun', 'niin', 'rukous', 'herra', 'jumala', 'kiitos', 'siunaus', 'aamen', 'minä', 'sinä', 'olla'],
  cs: ['a', 'je', 'v', 'na', 'se', 'že', 'to', 'z', 'do', 's', 'modlitba', 'pán', 'bůh', 'děkuji', 'požehnání', 'amen'],
  hu: ['a', 'az', 'és', 'van', 'nem', 'hogy', 'egy', 'ez', 'is', 'ima', 'úr', 'isten', 'köszönöm', 'áldás', 'ámen'],
  ro: ['și', 'în', 'de', 'la', 'cu', 'pe', 'este', 'că', 'un', 'rugăciune', 'domn', 'dumnezeu', 'mulțumesc', 'binecuvântare', 'amin'],
  tr: ['ve', 'bir', 'bu', 'için', 'da', 'de', 'ile', 'mi', 'dua', 'rab', 'tanrı', 'teşekkür', 'bereket', 'amin'],
  id: ['dan', 'yang', 'di', 'ini', 'dengan', 'untuk', 'dari', 'itu', 'doa', 'tuhan', 'allah', 'amin', 'saya', 'kami', 'mereka', 'bisa', 'harus', 'sudah', 'akan'],
  ms: ['dan', 'yang', 'di', 'ini', 'dengan', 'untuk', 'dari', 'itu', 'doa', 'tuhan', 'allah', 'amin', 'saya', 'kami', 'mereka', 'boleh', 'perlu', 'telah', 'akan'],
  ru: ['и', 'в', 'не', 'на', 'я', 'что', 'он', 'с', 'по', 'это', 'молитва', 'господь', 'бог', 'спасибо', 'благословение', 'аминь', 'быть', 'мы', 'они'],
  uk: ['і', 'в', 'не', 'на', 'я', 'що', 'він', 'з', 'по', 'це', 'молитва', 'господь', 'бог', 'дякую', 'благословення', 'амінь', 'бути', 'ми', 'вони'],
  en: ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'for', 'that', 'with', 'prayer', 'lord', 'god', 'thank', 'blessing', 'amen'],
};

export function detectLanguageByScript(text: string): DetectedLanguage | null {
  const textWithoutSpaces = text.replace(/\s/g, '');
  
  // #region agent log
  const fc = text.charCodeAt(0);
  const isKorean = fc >= 0xAC00 && fc <= 0xD7AF;
  const isArabic = fc >= 0x0600 && fc <= 0x06FF;
  const isThai = fc >= 0x0E00 && fc <= 0x0E7F;
  const isGreek = fc >= 0x0370 && fc <= 0x03FF;
  const isHebrew = fc >= 0x0590 && fc <= 0x05FF;
  const isHindi = fc >= 0x0900 && fc <= 0x097F;
  console.log('[DEBUG-d634a8] scriptByChar:', JSON.stringify({
    charCode: fc,
    ko: isKorean, ar: isArabic, th: isThai, el: isGreek, he: isHebrew, hi: isHindi
  }));
  // #endregion
  
  // Special handling for Japanese: check for Hiragana/Katakana presence
  // Japanese uses Kanji (shared with Chinese) + Hiragana/Katakana
  // If we find ANY Hiragana or Katakana, it's Japanese (not Chinese)
  const hiraganaPattern = /[\u3040-\u309F]/g;
  const katakanaPattern = /[\u30A0-\u30FF]/g;
  const kanjiPattern = /[\u4E00-\u9FFF]/g;
  
  const hiraganaMatches = text.match(hiraganaPattern) || [];
  const katakanaMatches = text.match(katakanaPattern) || [];
  const kanjiMatches = text.match(kanjiPattern) || [];
  
  // If text has Hiragana or Katakana, it's Japanese (these are unique to Japanese)
  if (hiraganaMatches.length > 0 || katakanaMatches.length > 0) {
    const japaneseCoverage = (hiraganaMatches.length + katakanaMatches.length + kanjiMatches.length) / textWithoutSpaces.length;
    if (japaneseCoverage > 0.3) {
      const language = SUPPORTED_LANGUAGES.find(l => getBaseLanguageCode(l.code) === 'ja');
      return {
        code: 'ja' as LanguageCode,
        confidence: Math.min(japaneseCoverage * 1.2, 0.98),
        name: language?.name || 'Japanese',
      };
    }
  }
  
  // If only Kanji (no Hiragana/Katakana), it's Chinese
  if (kanjiMatches.length > 0 && hiraganaMatches.length === 0 && katakanaMatches.length === 0) {
    const chineseCoverage = kanjiMatches.length / textWithoutSpaces.length;
    if (chineseCoverage > 0.3) {
      const language = SUPPORTED_LANGUAGES.find(l => getBaseLanguageCode(l.code) === 'zh');
      return {
        code: 'zh' as LanguageCode,
        confidence: Math.min(chineseCoverage * 1.2, 0.98),
        name: language?.name || 'Chinese',
      };
    }
  }

  // Special handling for Cyrillic languages (Russian vs Ukrainian)
  // Ukrainian unique: і, ї, є, ґ (U+0456, U+0457, U+0454, U+0491)
  // Russian unique: ё, ы, э, ъ (U+0451, U+044B, U+044D, U+044A)
  const cyrillicPattern = /[\u0400-\u04FF]/g;
  const cyrillicMatches = text.match(cyrillicPattern) || [];
  if (cyrillicMatches.length > 0) {
    const cyrillicCoverage = cyrillicMatches.length / textWithoutSpaces.length;
    if (cyrillicCoverage > 0.3) {
      // Check for Ukrainian-specific characters
      const ukrainianChars = /[іїєґІЇЄҐ]/g;
      const ukrainianMatches = text.match(ukrainianChars) || [];
      
      // Check for Russian-specific characters
      const russianChars = /[ёыэъЁЫЭЪ]/g;
      const russianMatches = text.match(russianChars) || [];
      
      let langCode: LanguageCode = 'ru'; // Default to Russian
      let langName = 'Russian';
      
      if (ukrainianMatches.length > russianMatches.length) {
        langCode = 'uk';
        langName = 'Ukrainian';
      } else if (ukrainianMatches.length > 0 && russianMatches.length === 0) {
        langCode = 'uk';
        langName = 'Ukrainian';
      }
      
      const language = SUPPORTED_LANGUAGES.find(l => getBaseLanguageCode(l.code) === langCode);
      return {
        code: langCode,
        confidence: Math.min(cyrillicCoverage * 1.2, 0.98),
        name: language?.name || langName,
      };
    }
  }

  // #region agent log
  const debugMatches: { lang: string, coverage: number, matchLen: number, textLen: number }[] = [];
  // #endregion
  
  for (const [langCode, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
    // Skip ja, zh as we handled them above, and skip cyrillic languages (handled above)
    if (langCode === 'ja' || langCode === 'zh') continue;
    
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        const matchLen = matches.join('').length;
        const coverage = matchLen / textWithoutSpaces.length;
        
        // #region agent log
        debugMatches.push({ lang: langCode, coverage, matchLen, textLen: textWithoutSpaces.length });
        // #endregion
        
        // Lower threshold for diacritic languages: Polish (0.05), Vietnamese (0.15), others (0.3)
        const threshold = langCode === 'pl' ? 0.05 : (langCode === 'vi' ? 0.15 : 0.3);
        if (coverage > threshold) {
          const language = SUPPORTED_LANGUAGES.find(l => getBaseLanguageCode(l.code) === langCode);
          
          // #region agent log
          console.log('[DEBUG-d634a8] scriptDetect MATCH:', JSON.stringify({
            lang: langCode,
            coverage: coverage.toFixed(2),
            threshold
          }));
          // #endregion
          
          return {
            code: (langCode as LanguageCode),
            confidence: Math.min(coverage * 1.2, 0.98),
            name: language?.name || langCode,
          };
        }
      }
    }
  }
  
  // #region agent log
  if (debugMatches.length > 0) {
    console.log('[DEBUG-d634a8] scriptDetect NO_MATCH (coverage too low):', JSON.stringify(debugMatches));
  }
  // #endregion
  
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
  
  // #region agent log
  const firstChar = normalizedText.charCodeAt(0);
  console.log('[DEBUG-d634a8] detectLanguage:', JSON.stringify({
    textPreview: normalizedText.substring(0, 20),
    firstCharCode: firstChar,
    scriptResult: scriptDetection ? { code: scriptDetection.code, conf: scriptDetection.confidence.toFixed(2) } : 'NULL'
  }));
  // #endregion
  
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
