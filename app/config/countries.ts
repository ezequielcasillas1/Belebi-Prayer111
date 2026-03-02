/**
 * iOS App Store Supported Countries
 * Complete list of all 175 countries/regions supported by iOS App Store
 * Includes ISO codes, default languages, and supported languages for each region
 */

export interface Country {
  code: string;      // ISO 3166-1 alpha-2 code
  code3: string;     // ISO 3166-1 alpha-3 code
  name: string;
  flag: string;
  region: string;
  defaultLanguage: LanguageCode;
  supportedLanguages: LanguageCode[];
  callingCode: string;
  lat: number;       // Latitude (center point)
  lon: number;       // Longitude (center point)
}

export type LanguageCode = 
  | 'en' | 'en-US' | 'en-GB' | 'en-AU' | 'en-CA'
  | 'es' | 'es-ES' | 'es-MX'
  | 'fr' | 'fr-FR' | 'fr-CA'
  | 'de' | 'it' | 'pt' | 'pt-BR' | 'pt-PT'
  | 'zh' | 'zh-Hans' | 'zh-Hant'
  | 'ja' | 'ko' | 'ar' | 'he' | 'hi'
  | 'ru' | 'uk' | 'pl' | 'nl' | 'sv'
  | 'da' | 'fi' | 'no' | 'cs' | 'sk'
  | 'hu' | 'ro' | 'el' | 'tr' | 'th'
  | 'vi' | 'id' | 'ms' | 'hr' | 'ca';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  rtl: boolean;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', rtl: false },
  { code: 'en-US', name: 'English (US)', nativeName: 'English (US)', rtl: false },
  { code: 'en-GB', name: 'English (UK)', nativeName: 'English (UK)', rtl: false },
  { code: 'en-AU', name: 'English (Australia)', nativeName: 'English (Australia)', rtl: false },
  { code: 'en-CA', name: 'English (Canada)', nativeName: 'English (Canada)', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false },
  { code: 'es-ES', name: 'Spanish (Spain)', nativeName: 'Español (España)', rtl: false },
  { code: 'es-MX', name: 'Spanish (Mexico)', nativeName: 'Español (México)', rtl: false },
  { code: 'fr', name: 'French', nativeName: 'Français', rtl: false },
  { code: 'fr-FR', name: 'French (France)', nativeName: 'Français (France)', rtl: false },
  { code: 'fr-CA', name: 'French (Canada)', nativeName: 'Français (Canada)', rtl: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', rtl: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', rtl: false },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', rtl: false },
  { code: 'pt-PT', name: 'Portuguese (Portugal)', nativeName: 'Português (Portugal)', rtl: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', rtl: false },
  { code: 'zh-Hans', name: 'Chinese (Simplified)', nativeName: '简体中文', rtl: false },
  { code: 'zh-Hant', name: 'Chinese (Traditional)', nativeName: '繁體中文', rtl: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', rtl: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', rtl: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', rtl: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', rtl: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', rtl: false },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', rtl: false },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', rtl: false },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', rtl: false },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', rtl: false },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', rtl: false },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', rtl: false },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', rtl: false },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', rtl: false },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', rtl: false },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', rtl: false },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', rtl: false },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', rtl: false },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', rtl: false },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', rtl: false },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', rtl: false },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', rtl: false },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', rtl: false },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', rtl: false },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', rtl: false },
];

export const IOS_SUPPORTED_COUNTRIES: Country[] = [
  { code: 'AF', code3: 'AFG', name: 'Afghanistan', flag: '🇦🇫', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+93', lat: 33.9391, lon: 67.7100 },
  { code: 'AL', code3: 'ALB', name: 'Albania', flag: '🇦🇱', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+355', lat: 41.1533, lon: 20.1683 },
  { code: 'DZ', code3: 'DZA', name: 'Algeria', flag: '🇩🇿', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar', 'fr'], callingCode: '+213', lat: 28.0339, lon: 1.6596 },
  { code: 'AO', code3: 'AGO', name: 'Angola', flag: '🇦🇴', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+244', lat: -11.2027, lon: 17.8739 },
  { code: 'AI', code3: 'AIA', name: 'Anguilla', flag: '🇦🇮', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1264', lat: 18.2206, lon: -63.0686 },
  { code: 'AG', code3: 'ATG', name: 'Antigua and Barbuda', flag: '🇦🇬', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1268', lat: 17.0608, lon: -61.7964 },
  { code: 'AR', code3: 'ARG', name: 'Argentina', flag: '🇦🇷', region: 'South America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+54', lat: -38.4161, lon: -63.6167 },
  { code: 'AM', code3: 'ARM', name: 'Armenia', flag: '🇦🇲', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+374', lat: 40.0691, lon: 45.0382 },
  { code: 'AU', code3: 'AUS', name: 'Australia', flag: '🇦🇺', region: 'Oceania', defaultLanguage: 'en-AU', supportedLanguages: ['en-AU', 'en-GB'], callingCode: '+61', lat: -25.2744, lon: 133.7751 },
  { code: 'AT', code3: 'AUT', name: 'Austria', flag: '🇦🇹', region: 'Europe', defaultLanguage: 'de', supportedLanguages: ['de', 'en-GB'], callingCode: '+43', lat: 47.5162, lon: 14.5501 },
  { code: 'AZ', code3: 'AZE', name: 'Azerbaijan', flag: '🇦🇿', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+994', lat: 40.1431, lon: 47.5769 },
  { code: 'BS', code3: 'BHS', name: 'Bahamas', flag: '🇧🇸', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1242', lat: 25.0343, lon: -77.3963 },
  { code: 'BH', code3: 'BHR', name: 'Bahrain', flag: '🇧🇭', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+973', lat: 26.0667, lon: 50.5577 },
  { code: 'BD', code3: 'BGD', name: 'Bangladesh', flag: '🇧🇩', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+880', lat: 23.6850, lon: 90.3563 },
  { code: 'BB', code3: 'BRB', name: 'Barbados', flag: '🇧🇧', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1246', lat: 13.1939, lon: -59.5432 },
  { code: 'BY', code3: 'BLR', name: 'Belarus', flag: '🇧🇾', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+375', lat: 53.7098, lon: 27.9534 },
  { code: 'BE', code3: 'BEL', name: 'Belgium', flag: '🇧🇪', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'nl', 'fr'], callingCode: '+32', lat: 50.5039, lon: 4.4699 },
  { code: 'BZ', code3: 'BLZ', name: 'Belize', flag: '🇧🇿', region: 'Central America', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'es-MX'], callingCode: '+501', lat: 17.1899, lon: -88.4976 },
  { code: 'BJ', code3: 'BEN', name: 'Benin', flag: '🇧🇯', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+229', lat: 9.3077, lon: 2.3158 },
  { code: 'BM', code3: 'BMU', name: 'Bermuda', flag: '🇧🇲', region: 'North America', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1441', lat: 32.3078, lon: -64.7505 },
  { code: 'BT', code3: 'BTN', name: 'Bhutan', flag: '🇧🇹', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+975', lat: 27.5142, lon: 90.4336 },
  { code: 'BO', code3: 'BOL', name: 'Bolivia', flag: '🇧🇴', region: 'South America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+591', lat: -16.2902, lon: -63.5887 },
  { code: 'BA', code3: 'BIH', name: 'Bosnia and Herzegovina', flag: '🇧🇦', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'hr'], callingCode: '+387', lat: 43.9159, lon: 17.6791 },
  { code: 'BW', code3: 'BWA', name: 'Botswana', flag: '🇧🇼', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+267', lat: -22.3285, lon: 24.6849 },
  { code: 'BR', code3: 'BRA', name: 'Brazil', flag: '🇧🇷', region: 'South America', defaultLanguage: 'pt-BR', supportedLanguages: ['pt-BR', 'en-GB'], callingCode: '+55', lat: -14.235, lon: -51.9253 },
  { code: 'VG', code3: 'VGB', name: 'British Virgin Islands', flag: '🇻🇬', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1284', lat: 18.4207, lon: -64.6400 },
  { code: 'BN', code3: 'BRN', name: 'Brunei', flag: '🇧🇳', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+673', lat: 4.5353, lon: 114.7277 },
  { code: 'BG', code3: 'BGR', name: 'Bulgaria', flag: '🇧🇬', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+359', lat: 42.7339, lon: 25.4858 },
  { code: 'BF', code3: 'BFA', name: 'Burkina Faso', flag: '🇧🇫', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+226', lat: 12.2383, lon: -1.5616 },
  { code: 'KH', code3: 'KHM', name: 'Cambodia', flag: '🇰🇭', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+855', lat: 12.5657, lon: 104.9910 },
  { code: 'CM', code3: 'CMR', name: 'Cameroon', flag: '🇨🇲', region: 'Africa', defaultLanguage: 'fr', supportedLanguages: ['fr', 'en-GB'], callingCode: '+237', lat: 7.3697, lon: 12.3547 },
  { code: 'CA', code3: 'CAN', name: 'Canada', flag: '🇨🇦', region: 'North America', defaultLanguage: 'en-CA', supportedLanguages: ['en-CA', 'fr-CA'], callingCode: '+1', lat: 56.1304, lon: -106.3468 },
  { code: 'CV', code3: 'CPV', name: 'Cape Verde', flag: '🇨🇻', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+238', lat: 16.5388, lon: -23.0418 },
  { code: 'KY', code3: 'CYM', name: 'Cayman Islands', flag: '🇰🇾', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1345', lat: 19.3133, lon: -81.2546 },
  { code: 'TD', code3: 'TCD', name: 'Chad', flag: '🇹🇩', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+235', lat: 15.4542, lon: 18.7322 },
  { code: 'CL', code3: 'CHL', name: 'Chile', flag: '🇨🇱', region: 'South America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+56', lat: -35.6751, lon: -71.5430 },
  { code: 'CN', code3: 'CHN', name: 'China', flag: '🇨🇳', region: 'Asia', defaultLanguage: 'zh-Hans', supportedLanguages: ['zh-Hans', 'en-GB'], callingCode: '+86', lat: 35.8617, lon: 104.1954 },
  { code: 'CO', code3: 'COL', name: 'Colombia', flag: '🇨🇴', region: 'South America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+57', lat: 4.5709, lon: -74.2973 },
  { code: 'CD', code3: 'COD', name: 'Congo (DRC)', flag: '🇨🇩', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+243', lat: -4.0383, lon: 21.7587 },
  { code: 'CG', code3: 'COG', name: 'Congo (Republic)', flag: '🇨🇬', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+242', lat: -0.2280, lon: 15.8277 },
  { code: 'CR', code3: 'CRI', name: 'Costa Rica', flag: '🇨🇷', region: 'Central America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+506', lat: 9.7489, lon: -83.7534 },
  { code: 'CI', code3: 'CIV', name: "Côte d'Ivoire", flag: '🇨🇮', region: 'Africa', defaultLanguage: 'fr', supportedLanguages: ['fr', 'en-GB'], callingCode: '+225', lat: 7.5400, lon: -5.5471 },
  { code: 'HR', code3: 'HRV', name: 'Croatia', flag: '🇭🇷', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'hr'], callingCode: '+385', lat: 45.1000, lon: 15.2000 },
  { code: 'CY', code3: 'CYP', name: 'Cyprus', flag: '🇨🇾', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'el', 'tr'], callingCode: '+357', lat: 35.1264, lon: 33.4299 },
  { code: 'CZ', code3: 'CZE', name: 'Czech Republic', flag: '🇨🇿', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'cs'], callingCode: '+420', lat: 49.8175, lon: 15.4730 },
  { code: 'DK', code3: 'DNK', name: 'Denmark', flag: '🇩🇰', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'da'], callingCode: '+45', lat: 56.2639, lon: 9.5018 },
  { code: 'DM', code3: 'DMA', name: 'Dominica', flag: '🇩🇲', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1767', lat: 15.4150, lon: -61.3710 },
  { code: 'DO', code3: 'DOM', name: 'Dominican Republic', flag: '🇩🇴', region: 'Caribbean', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+1809', lat: 18.7357, lon: -70.1627 },
  { code: 'EC', code3: 'ECU', name: 'Ecuador', flag: '🇪🇨', region: 'South America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+593', lat: -1.8312, lon: -78.1834 },
  { code: 'EG', code3: 'EGY', name: 'Egypt', flag: '🇪🇬', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar', 'fr'], callingCode: '+20', lat: 26.8206, lon: 30.8025 },
  { code: 'SV', code3: 'SLV', name: 'El Salvador', flag: '🇸🇻', region: 'Central America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+503', lat: 13.7942, lon: -88.8965 },
  { code: 'EE', code3: 'EST', name: 'Estonia', flag: '🇪🇪', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+372', lat: 58.5953, lon: 25.0136 },
  { code: 'SZ', code3: 'SWZ', name: 'Eswatini', flag: '🇸🇿', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+268', lat: -26.5225, lon: 31.4659 },
  { code: 'FJ', code3: 'FJI', name: 'Fiji', flag: '🇫🇯', region: 'Oceania', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+679', lat: -17.7134, lon: 178.0650 },
  { code: 'FI', code3: 'FIN', name: 'Finland', flag: '🇫🇮', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fi'], callingCode: '+358', lat: 61.9241, lon: 25.7482 },
  { code: 'FR', code3: 'FRA', name: 'France', flag: '🇫🇷', region: 'Europe', defaultLanguage: 'fr', supportedLanguages: ['fr', 'en-GB'], callingCode: '+33', lat: 46.2276, lon: 2.2137 },
  { code: 'GA', code3: 'GAB', name: 'Gabon', flag: '🇬🇦', region: 'Africa', defaultLanguage: 'fr', supportedLanguages: ['fr', 'en-GB'], callingCode: '+241', lat: -0.8037, lon: 11.6094 },
  { code: 'GM', code3: 'GMB', name: 'Gambia', flag: '🇬🇲', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+220', lat: 13.4432, lon: -15.3101 },
  { code: 'GE', code3: 'GEO', name: 'Georgia', flag: '🇬🇪', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+995', lat: 42.3154, lon: 43.3569 },
  { code: 'DE', code3: 'DEU', name: 'Germany', flag: '🇩🇪', region: 'Europe', defaultLanguage: 'de', supportedLanguages: ['de', 'en-GB'], callingCode: '+49', lat: 51.1657, lon: 10.4515 },
  { code: 'GH', code3: 'GHA', name: 'Ghana', flag: '🇬🇭', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+233', lat: 7.9465, lon: -1.0232 },
  { code: 'GR', code3: 'GRC', name: 'Greece', flag: '🇬🇷', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'el'], callingCode: '+30', lat: 39.0742, lon: 21.8243 },
  { code: 'GD', code3: 'GRD', name: 'Grenada', flag: '🇬🇩', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1473', lat: 12.1165, lon: -61.6790 },
  { code: 'GT', code3: 'GTM', name: 'Guatemala', flag: '🇬🇹', region: 'Central America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+502', lat: 15.7835, lon: -90.2308 },
  { code: 'GW', code3: 'GNB', name: 'Guinea-Bissau', flag: '🇬🇼', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+245', lat: 11.8037, lon: -15.1804 },
  { code: 'GY', code3: 'GUY', name: 'Guyana', flag: '🇬🇾', region: 'South America', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+592', lat: 4.8604, lon: -58.9302 },
  { code: 'HN', code3: 'HND', name: 'Honduras', flag: '🇭🇳', region: 'Central America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+504', lat: 15.2000, lon: -86.2419 },
  { code: 'HK', code3: 'HKG', name: 'Hong Kong', flag: '🇭🇰', region: 'Asia', defaultLanguage: 'zh-Hant', supportedLanguages: ['zh-Hant', 'en-GB'], callingCode: '+852', lat: 22.3193, lon: 114.1694 },
  { code: 'HU', code3: 'HUN', name: 'Hungary', flag: '🇭🇺', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'hu'], callingCode: '+36', lat: 47.1625, lon: 19.5033 },
  { code: 'IS', code3: 'ISL', name: 'Iceland', flag: '🇮🇸', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+354', lat: 64.9631, lon: -19.0208 },
  { code: 'IN', code3: 'IND', name: 'India', flag: '🇮🇳', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'hi'], callingCode: '+91', lat: 20.5937, lon: 78.9629 },
  { code: 'ID', code3: 'IDN', name: 'Indonesia', flag: '🇮🇩', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'id'], callingCode: '+62', lat: -0.7893, lon: 113.9213 },
  { code: 'IQ', code3: 'IRQ', name: 'Iraq', flag: '🇮🇶', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+964', lat: 33.2232, lon: 43.6793 },
  { code: 'IE', code3: 'IRL', name: 'Ireland', flag: '🇮🇪', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+353', lat: 53.1424, lon: -7.6921 },
  { code: 'IL', code3: 'ISR', name: 'Israel', flag: '🇮🇱', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'he'], callingCode: '+972', lat: 31.0461, lon: 34.8516 },
  { code: 'IT', code3: 'ITA', name: 'Italy', flag: '🇮🇹', region: 'Europe', defaultLanguage: 'it', supportedLanguages: ['it', 'en-GB'], callingCode: '+39', lat: 41.8719, lon: 12.5674 },
  { code: 'JM', code3: 'JAM', name: 'Jamaica', flag: '🇯🇲', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1876', lat: 18.1096, lon: -77.2975 },
  { code: 'JP', code3: 'JPN', name: 'Japan', flag: '🇯🇵', region: 'Asia', defaultLanguage: 'ja', supportedLanguages: ['ja', 'en-US'], callingCode: '+81', lat: 36.2048, lon: 138.2529 },
  { code: 'JO', code3: 'JOR', name: 'Jordan', flag: '🇯🇴', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+962', lat: 30.5852, lon: 36.2384 },
  { code: 'KZ', code3: 'KAZ', name: 'Kazakhstan', flag: '🇰🇿', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+7', lat: 48.0196, lon: 66.9237 },
  { code: 'KE', code3: 'KEN', name: 'Kenya', flag: '🇰🇪', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+254', lat: -0.0236, lon: 37.9062 },
  { code: 'XK', code3: 'XKS', name: 'Kosovo', flag: '🇽🇰', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+383', lat: 42.6026, lon: 20.9030 },
  { code: 'KW', code3: 'KWT', name: 'Kuwait', flag: '🇰🇼', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+965', lat: 29.3117, lon: 47.4818 },
  { code: 'KG', code3: 'KGZ', name: 'Kyrgyzstan', flag: '🇰🇬', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+996', lat: 41.2044, lon: 74.7661 },
  { code: 'LA', code3: 'LAO', name: 'Laos', flag: '🇱🇦', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+856', lat: 19.8563, lon: 102.4955 },
  { code: 'LV', code3: 'LVA', name: 'Latvia', flag: '🇱🇻', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+371', lat: 56.8796, lon: 24.6032 },
  { code: 'LB', code3: 'LBN', name: 'Lebanon', flag: '🇱🇧', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar', 'fr'], callingCode: '+961', lat: 33.8547, lon: 35.8623 },
  { code: 'LR', code3: 'LBR', name: 'Liberia', flag: '🇱🇷', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+231', lat: 6.4281, lon: -9.4295 },
  { code: 'LY', code3: 'LBY', name: 'Libya', flag: '🇱🇾', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+218', lat: 26.3351, lon: 17.2283 },
  { code: 'LT', code3: 'LTU', name: 'Lithuania', flag: '🇱🇹', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+370', lat: 55.1694, lon: 23.8813 },
  { code: 'LU', code3: 'LUX', name: 'Luxembourg', flag: '🇱🇺', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr', 'de'], callingCode: '+352', lat: 49.8153, lon: 6.1296 },
  { code: 'MO', code3: 'MAC', name: 'Macau', flag: '🇲🇴', region: 'Asia', defaultLanguage: 'zh-Hant', supportedLanguages: ['zh-Hant', 'en-GB'], callingCode: '+853', lat: 22.1987, lon: 113.5439 },
  { code: 'MG', code3: 'MDG', name: 'Madagascar', flag: '🇲🇬', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+261', lat: -18.7669, lon: 46.8691 },
  { code: 'MW', code3: 'MWI', name: 'Malawi', flag: '🇲🇼', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+265', lat: -13.2543, lon: 34.3015 },
  { code: 'MY', code3: 'MYS', name: 'Malaysia', flag: '🇲🇾', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ms'], callingCode: '+60', lat: 4.2105, lon: 101.9758 },
  { code: 'MV', code3: 'MDV', name: 'Maldives', flag: '🇲🇻', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+960', lat: 3.2028, lon: 73.2207 },
  { code: 'ML', code3: 'MLI', name: 'Mali', flag: '🇲🇱', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+223', lat: 17.5707, lon: -3.9962 },
  { code: 'MT', code3: 'MLT', name: 'Malta', flag: '🇲🇹', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+356', lat: 35.9375, lon: 14.3754 },
  { code: 'MR', code3: 'MRT', name: 'Mauritania', flag: '🇲🇷', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar', 'fr'], callingCode: '+222', lat: 21.0079, lon: -10.9408 },
  { code: 'MU', code3: 'MUS', name: 'Mauritius', flag: '🇲🇺', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+230', lat: -20.3484, lon: 57.5522 },
  { code: 'MX', code3: 'MEX', name: 'Mexico', flag: '🇲🇽', region: 'North America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+52', lat: 23.6345, lon: -102.5528 },
  { code: 'FM', code3: 'FSM', name: 'Micronesia', flag: '🇫🇲', region: 'Oceania', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+691', lat: 7.4256, lon: 150.5508 },
  { code: 'MD', code3: 'MDA', name: 'Moldova', flag: '🇲🇩', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+373', lat: 47.4116, lon: 28.3699 },
  { code: 'MN', code3: 'MNG', name: 'Mongolia', flag: '🇲🇳', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+976', lat: 46.8625, lon: 103.8467 },
  { code: 'ME', code3: 'MNE', name: 'Montenegro', flag: '🇲🇪', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'hr'], callingCode: '+382', lat: 42.7087, lon: 19.3744 },
  { code: 'MS', code3: 'MSR', name: 'Montserrat', flag: '🇲🇸', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1664', lat: 16.7425, lon: -62.1874 },
  { code: 'MA', code3: 'MAR', name: 'Morocco', flag: '🇲🇦', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar', 'fr'], callingCode: '+212', lat: 31.7917, lon: -7.0926 },
  { code: 'MZ', code3: 'MOZ', name: 'Mozambique', flag: '🇲🇿', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+258', lat: -18.6657, lon: 35.5296 },
  { code: 'MM', code3: 'MMR', name: 'Myanmar', flag: '🇲🇲', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+95', lat: 21.9162, lon: 95.9560 },
  { code: 'NA', code3: 'NAM', name: 'Namibia', flag: '🇳🇦', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+264', lat: -22.9576, lon: 18.4904 },
  { code: 'NR', code3: 'NRU', name: 'Nauru', flag: '🇳🇷', region: 'Oceania', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+674', lat: -0.5228, lon: 166.9315 },
  { code: 'NP', code3: 'NPL', name: 'Nepal', flag: '🇳🇵', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+977', lat: 28.3949, lon: 84.1240 },
  { code: 'NL', code3: 'NLD', name: 'Netherlands', flag: '🇳🇱', region: 'Europe', defaultLanguage: 'nl', supportedLanguages: ['nl', 'en-GB'], callingCode: '+31', lat: 52.1326, lon: 5.2913 },
  { code: 'NZ', code3: 'NZL', name: 'New Zealand', flag: '🇳🇿', region: 'Oceania', defaultLanguage: 'en-AU', supportedLanguages: ['en-AU', 'en-GB'], callingCode: '+64', lat: -40.9006, lon: 174.8860 },
  { code: 'NI', code3: 'NIC', name: 'Nicaragua', flag: '🇳🇮', region: 'Central America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+505', lat: 12.8654, lon: -85.2072 },
  { code: 'NE', code3: 'NER', name: 'Niger', flag: '🇳🇪', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+227', lat: 17.6078, lon: 8.0817 },
  { code: 'NG', code3: 'NGA', name: 'Nigeria', flag: '🇳🇬', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+234', lat: 9.0820, lon: 8.6753 },
  { code: 'MK', code3: 'MKD', name: 'North Macedonia', flag: '🇲🇰', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+389', lat: 41.5124, lon: 21.7453 },
  { code: 'NO', code3: 'NOR', name: 'Norway', flag: '🇳🇴', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'no'], callingCode: '+47', lat: 60.4720, lon: 8.4689 },
  { code: 'OM', code3: 'OMN', name: 'Oman', flag: '🇴🇲', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+968', lat: 21.4735, lon: 55.9754 },
  { code: 'PK', code3: 'PAK', name: 'Pakistan', flag: '🇵🇰', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+92', lat: 30.3753, lon: 69.3451 },
  { code: 'PW', code3: 'PLW', name: 'Palau', flag: '🇵🇼', region: 'Oceania', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+680', lat: 7.5150, lon: 134.5825 },
  { code: 'PA', code3: 'PAN', name: 'Panama', flag: '🇵🇦', region: 'Central America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+507', lat: 8.5380, lon: -80.7821 },
  { code: 'PG', code3: 'PNG', name: 'Papua New Guinea', flag: '🇵🇬', region: 'Oceania', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+675', lat: -6.3150, lon: 143.9555 },
  { code: 'PY', code3: 'PRY', name: 'Paraguay', flag: '🇵🇾', region: 'South America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+595', lat: -23.4425, lon: -58.4438 },
  { code: 'PE', code3: 'PER', name: 'Peru', flag: '🇵🇪', region: 'South America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+51', lat: -9.1900, lon: -75.0152 },
  { code: 'PH', code3: 'PHL', name: 'Philippines', flag: '🇵🇭', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+63', lat: 12.8797, lon: 121.7740 },
  { code: 'PL', code3: 'POL', name: 'Poland', flag: '🇵🇱', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'pl'], callingCode: '+48', lat: 51.9194, lon: 19.1451 },
  { code: 'PT', code3: 'PRT', name: 'Portugal', flag: '🇵🇹', region: 'Europe', defaultLanguage: 'pt-PT', supportedLanguages: ['pt-PT', 'en-GB'], callingCode: '+351', lat: 39.3999, lon: -8.2245 },
  { code: 'QA', code3: 'QAT', name: 'Qatar', flag: '🇶🇦', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+974', lat: 25.3548, lon: 51.1839 },
  { code: 'KR', code3: 'KOR', name: 'South Korea', flag: '🇰🇷', region: 'Asia', defaultLanguage: 'ko', supportedLanguages: ['ko', 'en-GB'], callingCode: '+82', lat: 35.9078, lon: 127.7669 },
  { code: 'RO', code3: 'ROU', name: 'Romania', flag: '🇷🇴', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ro'], callingCode: '+40', lat: 45.9432, lon: 24.9668 },
  { code: 'RU', code3: 'RUS', name: 'Russia', flag: '🇷🇺', region: 'Europe', defaultLanguage: 'ru', supportedLanguages: ['ru', 'en-GB', 'uk'], callingCode: '+7', lat: 61.5240, lon: 105.3188 },
  { code: 'RW', code3: 'RWA', name: 'Rwanda', flag: '🇷🇼', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+250', lat: -1.9403, lon: 29.8739 },
  { code: 'ST', code3: 'STP', name: 'São Tomé and Príncipe', flag: '🇸🇹', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+239', lat: 0.1864, lon: 6.6131 },
  { code: 'SA', code3: 'SAU', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+966', lat: 23.8859, lon: 45.0792 },
  { code: 'SN', code3: 'SEN', name: 'Senegal', flag: '🇸🇳', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+221', lat: 14.4974, lon: -14.4524 },
  { code: 'RS', code3: 'SRB', name: 'Serbia', flag: '🇷🇸', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'hr'], callingCode: '+381', lat: 44.0165, lon: 21.0059 },
  { code: 'SC', code3: 'SYC', name: 'Seychelles', flag: '🇸🇨', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+248', lat: -4.6796, lon: 55.4920 },
  { code: 'SL', code3: 'SLE', name: 'Sierra Leone', flag: '🇸🇱', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+232', lat: 8.4606, lon: -11.7799 },
  { code: 'SG', code3: 'SGP', name: 'Singapore', flag: '🇸🇬', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'zh-Hans'], callingCode: '+65', lat: 1.3521, lon: 103.8198 },
  { code: 'SK', code3: 'SVK', name: 'Slovakia', flag: '🇸🇰', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'sk'], callingCode: '+421', lat: 48.6690, lon: 19.6990 },
  { code: 'SI', code3: 'SVN', name: 'Slovenia', flag: '🇸🇮', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+386', lat: 46.1512, lon: 14.9955 },
  { code: 'SB', code3: 'SLB', name: 'Solomon Islands', flag: '🇸🇧', region: 'Oceania', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+677', lat: -9.6457, lon: 160.1562 },
  { code: 'ZA', code3: 'ZAF', name: 'South Africa', flag: '🇿🇦', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+27', lat: -30.5595, lon: 22.9375 },
  { code: 'ES', code3: 'ESP', name: 'Spain', flag: '🇪🇸', region: 'Europe', defaultLanguage: 'es-ES', supportedLanguages: ['es-ES', 'ca', 'en-GB'], callingCode: '+34', lat: 40.4637, lon: -3.7492 },
  { code: 'LK', code3: 'LKA', name: 'Sri Lanka', flag: '🇱🇰', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+94', lat: 7.8731, lon: 80.7718 },
  { code: 'KN', code3: 'KNA', name: 'St. Kitts and Nevis', flag: '🇰🇳', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1869', lat: 17.3578, lon: -62.7830 },
  { code: 'LC', code3: 'LCA', name: 'St. Lucia', flag: '🇱🇨', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1758', lat: 13.9094, lon: -60.9789 },
  { code: 'VC', code3: 'VCT', name: 'St. Vincent and the Grenadines', flag: '🇻🇨', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1784', lat: 12.9843, lon: -61.2872 },
  { code: 'SR', code3: 'SUR', name: 'Suriname', flag: '🇸🇷', region: 'South America', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'nl'], callingCode: '+597', lat: 3.9193, lon: -56.0278 },
  { code: 'SE', code3: 'SWE', name: 'Sweden', flag: '🇸🇪', region: 'Europe', defaultLanguage: 'sv', supportedLanguages: ['sv', 'en-GB'], callingCode: '+46', lat: 60.1282, lon: 18.6435 },
  { code: 'CH', code3: 'CHE', name: 'Switzerland', flag: '🇨🇭', region: 'Europe', defaultLanguage: 'de', supportedLanguages: ['de', 'en-GB', 'fr', 'it'], callingCode: '+41', lat: 46.8182, lon: 8.2275 },
  { code: 'TW', code3: 'TWN', name: 'Taiwan', flag: '🇹🇼', region: 'Asia', defaultLanguage: 'zh-Hant', supportedLanguages: ['zh-Hant', 'en-GB'], callingCode: '+886', lat: 23.6978, lon: 120.9605 },
  { code: 'TJ', code3: 'TJK', name: 'Tajikistan', flag: '🇹🇯', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+992', lat: 38.8610, lon: 71.2761 },
  { code: 'TZ', code3: 'TZA', name: 'Tanzania', flag: '🇹🇿', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+255', lat: -6.3690, lon: 34.8888 },
  { code: 'TH', code3: 'THA', name: 'Thailand', flag: '🇹🇭', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'th'], callingCode: '+66', lat: 15.8700, lon: 100.9925 },
  { code: 'TO', code3: 'TON', name: 'Tonga', flag: '🇹🇴', region: 'Oceania', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+676', lat: -21.1790, lon: -175.1982 },
  { code: 'TT', code3: 'TTO', name: 'Trinidad and Tobago', flag: '🇹🇹', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+1868', lat: 10.6918, lon: -61.2225 },
  { code: 'TN', code3: 'TUN', name: 'Tunisia', flag: '🇹🇳', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar', 'fr'], callingCode: '+216', lat: 33.8869, lon: 9.5375 },
  { code: 'TR', code3: 'TUR', name: 'Türkiye', flag: '🇹🇷', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'tr'], callingCode: '+90', lat: 38.9637, lon: 35.2433 },
  { code: 'TM', code3: 'TKM', name: 'Turkmenistan', flag: '🇹🇲', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+993', lat: 38.9697, lon: 59.5563 },
  { code: 'TC', code3: 'TCA', name: 'Turks and Caicos Islands', flag: '🇹🇨', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1649', lat: 21.6940, lon: -71.7979 },
  { code: 'UG', code3: 'UGA', name: 'Uganda', flag: '🇺🇬', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+256', lat: 1.3733, lon: 32.2903 },
  { code: 'UA', code3: 'UKR', name: 'Ukraine', flag: '🇺🇦', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ru', 'uk'], callingCode: '+380', lat: 48.3794, lon: 31.1656 },
  { code: 'AE', code3: 'ARE', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+971', lat: 23.4241, lon: 53.8478 },
  { code: 'GB', code3: 'GBR', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+44', lat: 55.3781, lon: -3.4360 },
  { code: 'US', code3: 'USA', name: 'United States', flag: '🇺🇸', region: 'North America', defaultLanguage: 'en-US', supportedLanguages: ['en-US', 'ar', 'zh-Hans', 'zh-Hant', 'fr', 'ko', 'pt-BR', 'ru', 'es-MX', 'vi'], callingCode: '+1', lat: 37.0902, lon: -95.7129 },
  { code: 'UY', code3: 'URY', name: 'Uruguay', flag: '🇺🇾', region: 'South America', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'es-MX'], callingCode: '+598', lat: -32.5228, lon: -55.7658 },
  { code: 'UZ', code3: 'UZB', name: 'Uzbekistan', flag: '🇺🇿', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+998', lat: 41.3775, lon: 64.5853 },
  { code: 'VU', code3: 'VUT', name: 'Vanuatu', flag: '🇻🇺', region: 'Oceania', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+678', lat: -15.3767, lon: 166.9592 },
  { code: 'VE', code3: 'VEN', name: 'Venezuela', flag: '🇻🇪', region: 'South America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+58', lat: 6.4238, lon: -66.5897 },
  { code: 'VN', code3: 'VNM', name: 'Vietnam', flag: '🇻🇳', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'vi'], callingCode: '+84', lat: 14.0583, lon: 108.2772 },
  { code: 'YE', code3: 'YEM', name: 'Yemen', flag: '🇾🇪', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+967', lat: 15.5527, lon: 48.5164 },
  { code: 'ZM', code3: 'ZMB', name: 'Zambia', flag: '🇿🇲', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+260', lat: -13.1339, lon: 27.8493 },
  { code: 'ZW', code3: 'ZWE', name: 'Zimbabwe', flag: '🇿🇼', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+263', lat: -19.0154, lon: 29.1549 },
];

export const REGIONS = [
  'Africa',
  'Asia',
  'Caribbean',
  'Central America',
  'Europe',
  'Middle East',
  'North America',
  'Oceania',
  'South America',
] as const;

export type Region = typeof REGIONS[number];

export function getCountryByCode(code: string): Country | undefined {
  return IOS_SUPPORTED_COUNTRIES.find(c => c.code === code || c.code3 === code);
}

export function getCountriesByRegion(region: Region): Country[] {
  return IOS_SUPPORTED_COUNTRIES.filter(c => c.region === region);
}

export function getCountriesByLanguage(languageCode: LanguageCode): Country[] {
  return IOS_SUPPORTED_COUNTRIES.filter(c => 
    c.supportedLanguages.includes(languageCode) || c.defaultLanguage === languageCode
  );
}

export function searchCountries(query: string): Country[] {
  const lowerQuery = query.toLowerCase();
  return IOS_SUPPORTED_COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(lowerQuery) ||
    c.code.toLowerCase() === lowerQuery ||
    c.code3.toLowerCase() === lowerQuery
  );
}

export function getLanguageByCode(code: LanguageCode): Language | undefined {
  return SUPPORTED_LANGUAGES.find(l => l.code === code);
}

export function getBaseLanguageCode(code: LanguageCode): string {
  return code.split('-')[0];
}
