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
  { code: 'AF', code3: 'AFG', name: 'Afghanistan', flag: '🇦🇫', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+93' },
  { code: 'AL', code3: 'ALB', name: 'Albania', flag: '🇦🇱', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+355' },
  { code: 'DZ', code3: 'DZA', name: 'Algeria', flag: '🇩🇿', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar', 'fr'], callingCode: '+213' },
  { code: 'AO', code3: 'AGO', name: 'Angola', flag: '🇦🇴', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+244' },
  { code: 'AI', code3: 'AIA', name: 'Anguilla', flag: '🇦🇮', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1264' },
  { code: 'AG', code3: 'ATG', name: 'Antigua and Barbuda', flag: '🇦🇬', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1268' },
  { code: 'AR', code3: 'ARG', name: 'Argentina', flag: '🇦🇷', region: 'South America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+54' },
  { code: 'AM', code3: 'ARM', name: 'Armenia', flag: '🇦🇲', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+374' },
  { code: 'AU', code3: 'AUS', name: 'Australia', flag: '🇦🇺', region: 'Oceania', defaultLanguage: 'en-AU', supportedLanguages: ['en-AU', 'en-GB'], callingCode: '+61' },
  { code: 'AT', code3: 'AUT', name: 'Austria', flag: '🇦🇹', region: 'Europe', defaultLanguage: 'de', supportedLanguages: ['de', 'en-GB'], callingCode: '+43' },
  { code: 'AZ', code3: 'AZE', name: 'Azerbaijan', flag: '🇦🇿', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+994' },
  { code: 'BS', code3: 'BHS', name: 'Bahamas', flag: '🇧🇸', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1242' },
  { code: 'BH', code3: 'BHR', name: 'Bahrain', flag: '🇧🇭', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+973' },
  { code: 'BD', code3: 'BGD', name: 'Bangladesh', flag: '🇧🇩', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+880' },
  { code: 'BB', code3: 'BRB', name: 'Barbados', flag: '🇧🇧', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1246' },
  { code: 'BY', code3: 'BLR', name: 'Belarus', flag: '🇧🇾', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+375' },
  { code: 'BE', code3: 'BEL', name: 'Belgium', flag: '🇧🇪', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'nl', 'fr'], callingCode: '+32' },
  { code: 'BZ', code3: 'BLZ', name: 'Belize', flag: '🇧🇿', region: 'Central America', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'es-MX'], callingCode: '+501' },
  { code: 'BJ', code3: 'BEN', name: 'Benin', flag: '🇧🇯', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+229' },
  { code: 'BM', code3: 'BMU', name: 'Bermuda', flag: '🇧🇲', region: 'North America', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1441' },
  { code: 'BT', code3: 'BTN', name: 'Bhutan', flag: '🇧🇹', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+975' },
  { code: 'BO', code3: 'BOL', name: 'Bolivia', flag: '🇧🇴', region: 'South America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+591' },
  { code: 'BA', code3: 'BIH', name: 'Bosnia and Herzegovina', flag: '🇧🇦', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'hr'], callingCode: '+387' },
  { code: 'BW', code3: 'BWA', name: 'Botswana', flag: '🇧🇼', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+267' },
  { code: 'BR', code3: 'BRA', name: 'Brazil', flag: '🇧🇷', region: 'South America', defaultLanguage: 'pt-BR', supportedLanguages: ['pt-BR', 'en-GB'], callingCode: '+55' },
  { code: 'VG', code3: 'VGB', name: 'British Virgin Islands', flag: '🇻🇬', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1284' },
  { code: 'BN', code3: 'BRN', name: 'Brunei', flag: '🇧🇳', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+673' },
  { code: 'BG', code3: 'BGR', name: 'Bulgaria', flag: '🇧🇬', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+359' },
  { code: 'BF', code3: 'BFA', name: 'Burkina Faso', flag: '🇧🇫', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+226' },
  { code: 'KH', code3: 'KHM', name: 'Cambodia', flag: '🇰🇭', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+855' },
  { code: 'CM', code3: 'CMR', name: 'Cameroon', flag: '🇨🇲', region: 'Africa', defaultLanguage: 'fr', supportedLanguages: ['fr', 'en-GB'], callingCode: '+237' },
  { code: 'CA', code3: 'CAN', name: 'Canada', flag: '🇨🇦', region: 'North America', defaultLanguage: 'en-CA', supportedLanguages: ['en-CA', 'fr-CA'], callingCode: '+1' },
  { code: 'CV', code3: 'CPV', name: 'Cape Verde', flag: '🇨🇻', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+238' },
  { code: 'KY', code3: 'CYM', name: 'Cayman Islands', flag: '🇰🇾', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1345' },
  { code: 'TD', code3: 'TCD', name: 'Chad', flag: '🇹🇩', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+235' },
  { code: 'CL', code3: 'CHL', name: 'Chile', flag: '🇨🇱', region: 'South America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+56' },
  { code: 'CN', code3: 'CHN', name: 'China', flag: '🇨🇳', region: 'Asia', defaultLanguage: 'zh-Hans', supportedLanguages: ['zh-Hans', 'en-GB'], callingCode: '+86' },
  { code: 'CO', code3: 'COL', name: 'Colombia', flag: '🇨🇴', region: 'South America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+57' },
  { code: 'CD', code3: 'COD', name: 'Congo (DRC)', flag: '🇨🇩', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+243' },
  { code: 'CG', code3: 'COG', name: 'Congo (Republic)', flag: '🇨🇬', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+242' },
  { code: 'CR', code3: 'CRI', name: 'Costa Rica', flag: '🇨🇷', region: 'Central America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+506' },
  { code: 'CI', code3: 'CIV', name: "Côte d'Ivoire", flag: '🇨🇮', region: 'Africa', defaultLanguage: 'fr', supportedLanguages: ['fr', 'en-GB'], callingCode: '+225' },
  { code: 'HR', code3: 'HRV', name: 'Croatia', flag: '🇭🇷', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'hr'], callingCode: '+385' },
  { code: 'CY', code3: 'CYP', name: 'Cyprus', flag: '🇨🇾', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'el', 'tr'], callingCode: '+357' },
  { code: 'CZ', code3: 'CZE', name: 'Czech Republic', flag: '🇨🇿', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'cs'], callingCode: '+420' },
  { code: 'DK', code3: 'DNK', name: 'Denmark', flag: '🇩🇰', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'da'], callingCode: '+45' },
  { code: 'DM', code3: 'DMA', name: 'Dominica', flag: '🇩🇲', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1767' },
  { code: 'DO', code3: 'DOM', name: 'Dominican Republic', flag: '🇩🇴', region: 'Caribbean', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+1809' },
  { code: 'EC', code3: 'ECU', name: 'Ecuador', flag: '🇪🇨', region: 'South America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+593' },
  { code: 'EG', code3: 'EGY', name: 'Egypt', flag: '🇪🇬', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar', 'fr'], callingCode: '+20' },
  { code: 'SV', code3: 'SLV', name: 'El Salvador', flag: '🇸🇻', region: 'Central America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+503' },
  { code: 'EE', code3: 'EST', name: 'Estonia', flag: '🇪🇪', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+372' },
  { code: 'SZ', code3: 'SWZ', name: 'Eswatini', flag: '🇸🇿', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+268' },
  { code: 'FJ', code3: 'FJI', name: 'Fiji', flag: '🇫🇯', region: 'Oceania', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+679' },
  { code: 'FI', code3: 'FIN', name: 'Finland', flag: '🇫🇮', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fi'], callingCode: '+358' },
  { code: 'FR', code3: 'FRA', name: 'France', flag: '🇫🇷', region: 'Europe', defaultLanguage: 'fr', supportedLanguages: ['fr', 'en-GB'], callingCode: '+33' },
  { code: 'GA', code3: 'GAB', name: 'Gabon', flag: '🇬🇦', region: 'Africa', defaultLanguage: 'fr', supportedLanguages: ['fr', 'en-GB'], callingCode: '+241' },
  { code: 'GM', code3: 'GMB', name: 'Gambia', flag: '🇬🇲', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+220' },
  { code: 'GE', code3: 'GEO', name: 'Georgia', flag: '🇬🇪', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+995' },
  { code: 'DE', code3: 'DEU', name: 'Germany', flag: '🇩🇪', region: 'Europe', defaultLanguage: 'de', supportedLanguages: ['de', 'en-GB'], callingCode: '+49' },
  { code: 'GH', code3: 'GHA', name: 'Ghana', flag: '🇬🇭', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+233' },
  { code: 'GR', code3: 'GRC', name: 'Greece', flag: '🇬🇷', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'el'], callingCode: '+30' },
  { code: 'GD', code3: 'GRD', name: 'Grenada', flag: '🇬🇩', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1473' },
  { code: 'GT', code3: 'GTM', name: 'Guatemala', flag: '🇬🇹', region: 'Central America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+502' },
  { code: 'GW', code3: 'GNB', name: 'Guinea-Bissau', flag: '🇬🇼', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+245' },
  { code: 'GY', code3: 'GUY', name: 'Guyana', flag: '🇬🇾', region: 'South America', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+592' },
  { code: 'HN', code3: 'HND', name: 'Honduras', flag: '🇭🇳', region: 'Central America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+504' },
  { code: 'HK', code3: 'HKG', name: 'Hong Kong', flag: '🇭🇰', region: 'Asia', defaultLanguage: 'zh-Hant', supportedLanguages: ['zh-Hant', 'en-GB'], callingCode: '+852' },
  { code: 'HU', code3: 'HUN', name: 'Hungary', flag: '🇭🇺', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'hu'], callingCode: '+36' },
  { code: 'IS', code3: 'ISL', name: 'Iceland', flag: '🇮🇸', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+354' },
  { code: 'IN', code3: 'IND', name: 'India', flag: '🇮🇳', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'hi'], callingCode: '+91' },
  { code: 'ID', code3: 'IDN', name: 'Indonesia', flag: '🇮🇩', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'id'], callingCode: '+62' },
  { code: 'IQ', code3: 'IRQ', name: 'Iraq', flag: '🇮🇶', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+964' },
  { code: 'IE', code3: 'IRL', name: 'Ireland', flag: '🇮🇪', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+353' },
  { code: 'IL', code3: 'ISR', name: 'Israel', flag: '🇮🇱', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'he'], callingCode: '+972' },
  { code: 'IT', code3: 'ITA', name: 'Italy', flag: '🇮🇹', region: 'Europe', defaultLanguage: 'it', supportedLanguages: ['it', 'en-GB'], callingCode: '+39' },
  { code: 'JM', code3: 'JAM', name: 'Jamaica', flag: '🇯🇲', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1876' },
  { code: 'JP', code3: 'JPN', name: 'Japan', flag: '🇯🇵', region: 'Asia', defaultLanguage: 'ja', supportedLanguages: ['ja', 'en-US'], callingCode: '+81' },
  { code: 'JO', code3: 'JOR', name: 'Jordan', flag: '🇯🇴', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+962' },
  { code: 'KZ', code3: 'KAZ', name: 'Kazakhstan', flag: '🇰🇿', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+7' },
  { code: 'KE', code3: 'KEN', name: 'Kenya', flag: '🇰🇪', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+254' },
  { code: 'XK', code3: 'XKS', name: 'Kosovo', flag: '🇽🇰', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+383' },
  { code: 'KW', code3: 'KWT', name: 'Kuwait', flag: '🇰🇼', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+965' },
  { code: 'KG', code3: 'KGZ', name: 'Kyrgyzstan', flag: '🇰🇬', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+996' },
  { code: 'LA', code3: 'LAO', name: 'Laos', flag: '🇱🇦', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+856' },
  { code: 'LV', code3: 'LVA', name: 'Latvia', flag: '🇱🇻', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+371' },
  { code: 'LB', code3: 'LBN', name: 'Lebanon', flag: '🇱🇧', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar', 'fr'], callingCode: '+961' },
  { code: 'LR', code3: 'LBR', name: 'Liberia', flag: '🇱🇷', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+231' },
  { code: 'LY', code3: 'LBY', name: 'Libya', flag: '🇱🇾', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+218' },
  { code: 'LT', code3: 'LTU', name: 'Lithuania', flag: '🇱🇹', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+370' },
  { code: 'LU', code3: 'LUX', name: 'Luxembourg', flag: '🇱🇺', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr', 'de'], callingCode: '+352' },
  { code: 'MO', code3: 'MAC', name: 'Macau', flag: '🇲🇴', region: 'Asia', defaultLanguage: 'zh-Hant', supportedLanguages: ['zh-Hant', 'en-GB'], callingCode: '+853' },
  { code: 'MG', code3: 'MDG', name: 'Madagascar', flag: '🇲🇬', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+261' },
  { code: 'MW', code3: 'MWI', name: 'Malawi', flag: '🇲🇼', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+265' },
  { code: 'MY', code3: 'MYS', name: 'Malaysia', flag: '🇲🇾', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ms'], callingCode: '+60' },
  { code: 'MV', code3: 'MDV', name: 'Maldives', flag: '🇲🇻', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+960' },
  { code: 'ML', code3: 'MLI', name: 'Mali', flag: '🇲🇱', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+223' },
  { code: 'MT', code3: 'MLT', name: 'Malta', flag: '🇲🇹', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+356' },
  { code: 'MR', code3: 'MRT', name: 'Mauritania', flag: '🇲🇷', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar', 'fr'], callingCode: '+222' },
  { code: 'MU', code3: 'MUS', name: 'Mauritius', flag: '🇲🇺', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+230' },
  { code: 'MX', code3: 'MEX', name: 'Mexico', flag: '🇲🇽', region: 'North America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+52' },
  { code: 'FM', code3: 'FSM', name: 'Micronesia', flag: '🇫🇲', region: 'Oceania', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+691' },
  { code: 'MD', code3: 'MDA', name: 'Moldova', flag: '🇲🇩', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+373' },
  { code: 'MN', code3: 'MNG', name: 'Mongolia', flag: '🇲🇳', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+976' },
  { code: 'ME', code3: 'MNE', name: 'Montenegro', flag: '🇲🇪', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'hr'], callingCode: '+382' },
  { code: 'MS', code3: 'MSR', name: 'Montserrat', flag: '🇲🇸', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1664' },
  { code: 'MA', code3: 'MAR', name: 'Morocco', flag: '🇲🇦', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar', 'fr'], callingCode: '+212' },
  { code: 'MZ', code3: 'MOZ', name: 'Mozambique', flag: '🇲🇿', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+258' },
  { code: 'MM', code3: 'MMR', name: 'Myanmar', flag: '🇲🇲', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+95' },
  { code: 'NA', code3: 'NAM', name: 'Namibia', flag: '🇳🇦', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+264' },
  { code: 'NR', code3: 'NRU', name: 'Nauru', flag: '🇳🇷', region: 'Oceania', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+674' },
  { code: 'NP', code3: 'NPL', name: 'Nepal', flag: '🇳🇵', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+977' },
  { code: 'NL', code3: 'NLD', name: 'Netherlands', flag: '🇳🇱', region: 'Europe', defaultLanguage: 'nl', supportedLanguages: ['nl', 'en-GB'], callingCode: '+31' },
  { code: 'NZ', code3: 'NZL', name: 'New Zealand', flag: '🇳🇿', region: 'Oceania', defaultLanguage: 'en-AU', supportedLanguages: ['en-AU', 'en-GB'], callingCode: '+64' },
  { code: 'NI', code3: 'NIC', name: 'Nicaragua', flag: '🇳🇮', region: 'Central America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+505' },
  { code: 'NE', code3: 'NER', name: 'Niger', flag: '🇳🇪', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+227' },
  { code: 'NG', code3: 'NGA', name: 'Nigeria', flag: '🇳🇬', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+234' },
  { code: 'MK', code3: 'MKD', name: 'North Macedonia', flag: '🇲🇰', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+389' },
  { code: 'NO', code3: 'NOR', name: 'Norway', flag: '🇳🇴', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'no'], callingCode: '+47' },
  { code: 'OM', code3: 'OMN', name: 'Oman', flag: '🇴🇲', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+968' },
  { code: 'PK', code3: 'PAK', name: 'Pakistan', flag: '🇵🇰', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+92' },
  { code: 'PW', code3: 'PLW', name: 'Palau', flag: '🇵🇼', region: 'Oceania', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+680' },
  { code: 'PA', code3: 'PAN', name: 'Panama', flag: '🇵🇦', region: 'Central America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+507' },
  { code: 'PG', code3: 'PNG', name: 'Papua New Guinea', flag: '🇵🇬', region: 'Oceania', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+675' },
  { code: 'PY', code3: 'PRY', name: 'Paraguay', flag: '🇵🇾', region: 'South America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+595' },
  { code: 'PE', code3: 'PER', name: 'Peru', flag: '🇵🇪', region: 'South America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+51' },
  { code: 'PH', code3: 'PHL', name: 'Philippines', flag: '🇵🇭', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+63' },
  { code: 'PL', code3: 'POL', name: 'Poland', flag: '🇵🇱', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'pl'], callingCode: '+48' },
  { code: 'PT', code3: 'PRT', name: 'Portugal', flag: '🇵🇹', region: 'Europe', defaultLanguage: 'pt-PT', supportedLanguages: ['pt-PT', 'en-GB'], callingCode: '+351' },
  { code: 'QA', code3: 'QAT', name: 'Qatar', flag: '🇶🇦', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+974' },
  { code: 'KR', code3: 'KOR', name: 'South Korea', flag: '🇰🇷', region: 'Asia', defaultLanguage: 'ko', supportedLanguages: ['ko', 'en-GB'], callingCode: '+82' },
  { code: 'RO', code3: 'ROU', name: 'Romania', flag: '🇷🇴', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ro'], callingCode: '+40' },
  { code: 'RU', code3: 'RUS', name: 'Russia', flag: '🇷🇺', region: 'Europe', defaultLanguage: 'ru', supportedLanguages: ['ru', 'en-GB', 'uk'], callingCode: '+7' },
  { code: 'RW', code3: 'RWA', name: 'Rwanda', flag: '🇷🇼', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+250' },
  { code: 'ST', code3: 'STP', name: 'São Tomé and Príncipe', flag: '🇸🇹', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+239' },
  { code: 'SA', code3: 'SAU', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+966' },
  { code: 'SN', code3: 'SEN', name: 'Senegal', flag: '🇸🇳', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+221' },
  { code: 'RS', code3: 'SRB', name: 'Serbia', flag: '🇷🇸', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'hr'], callingCode: '+381' },
  { code: 'SC', code3: 'SYC', name: 'Seychelles', flag: '🇸🇨', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+248' },
  { code: 'SL', code3: 'SLE', name: 'Sierra Leone', flag: '🇸🇱', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+232' },
  { code: 'SG', code3: 'SGP', name: 'Singapore', flag: '🇸🇬', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'zh-Hans'], callingCode: '+65' },
  { code: 'SK', code3: 'SVK', name: 'Slovakia', flag: '🇸🇰', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'sk'], callingCode: '+421' },
  { code: 'SI', code3: 'SVN', name: 'Slovenia', flag: '🇸🇮', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+386' },
  { code: 'SB', code3: 'SLB', name: 'Solomon Islands', flag: '🇸🇧', region: 'Oceania', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+677' },
  { code: 'ZA', code3: 'ZAF', name: 'South Africa', flag: '🇿🇦', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+27' },
  { code: 'ES', code3: 'ESP', name: 'Spain', flag: '🇪🇸', region: 'Europe', defaultLanguage: 'es-ES', supportedLanguages: ['es-ES', 'ca', 'en-GB'], callingCode: '+34' },
  { code: 'LK', code3: 'LKA', name: 'Sri Lanka', flag: '🇱🇰', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+94' },
  { code: 'KN', code3: 'KNA', name: 'St. Kitts and Nevis', flag: '🇰🇳', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1869' },
  { code: 'LC', code3: 'LCA', name: 'St. Lucia', flag: '🇱🇨', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1758' },
  { code: 'VC', code3: 'VCT', name: 'St. Vincent and the Grenadines', flag: '🇻🇨', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1784' },
  { code: 'SR', code3: 'SUR', name: 'Suriname', flag: '🇸🇷', region: 'South America', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'nl'], callingCode: '+597' },
  { code: 'SE', code3: 'SWE', name: 'Sweden', flag: '🇸🇪', region: 'Europe', defaultLanguage: 'sv', supportedLanguages: ['sv', 'en-GB'], callingCode: '+46' },
  { code: 'CH', code3: 'CHE', name: 'Switzerland', flag: '🇨🇭', region: 'Europe', defaultLanguage: 'de', supportedLanguages: ['de', 'en-GB', 'fr', 'it'], callingCode: '+41' },
  { code: 'TW', code3: 'TWN', name: 'Taiwan', flag: '🇹🇼', region: 'Asia', defaultLanguage: 'zh-Hant', supportedLanguages: ['zh-Hant', 'en-GB'], callingCode: '+886' },
  { code: 'TJ', code3: 'TJK', name: 'Tajikistan', flag: '🇹🇯', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+992' },
  { code: 'TZ', code3: 'TZA', name: 'Tanzania', flag: '🇹🇿', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+255' },
  { code: 'TH', code3: 'THA', name: 'Thailand', flag: '🇹🇭', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'th'], callingCode: '+66' },
  { code: 'TO', code3: 'TON', name: 'Tonga', flag: '🇹🇴', region: 'Oceania', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+676' },
  { code: 'TT', code3: 'TTO', name: 'Trinidad and Tobago', flag: '🇹🇹', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+1868' },
  { code: 'TN', code3: 'TUN', name: 'Tunisia', flag: '🇹🇳', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar', 'fr'], callingCode: '+216' },
  { code: 'TR', code3: 'TUR', name: 'Türkiye', flag: '🇹🇷', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'tr'], callingCode: '+90' },
  { code: 'TM', code3: 'TKM', name: 'Turkmenistan', flag: '🇹🇲', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+993' },
  { code: 'TC', code3: 'TCA', name: 'Turks and Caicos Islands', flag: '🇹🇨', region: 'Caribbean', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+1649' },
  { code: 'UG', code3: 'UGA', name: 'Uganda', flag: '🇺🇬', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+256' },
  { code: 'UA', code3: 'UKR', name: 'Ukraine', flag: '🇺🇦', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ru', 'uk'], callingCode: '+380' },
  { code: 'AE', code3: 'ARE', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+971' },
  { code: 'GB', code3: 'GBR', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+44' },
  { code: 'US', code3: 'USA', name: 'United States', flag: '🇺🇸', region: 'North America', defaultLanguage: 'en-US', supportedLanguages: ['en-US', 'ar', 'zh-Hans', 'zh-Hant', 'fr', 'ko', 'pt-BR', 'ru', 'es-MX', 'vi'], callingCode: '+1' },
  { code: 'UY', code3: 'URY', name: 'Uruguay', flag: '🇺🇾', region: 'South America', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'es-MX'], callingCode: '+598' },
  { code: 'UZ', code3: 'UZB', name: 'Uzbekistan', flag: '🇺🇿', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+998' },
  { code: 'VU', code3: 'VUT', name: 'Vanuatu', flag: '🇻🇺', region: 'Oceania', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'fr'], callingCode: '+678' },
  { code: 'VE', code3: 'VEN', name: 'Venezuela', flag: '🇻🇪', region: 'South America', defaultLanguage: 'es-MX', supportedLanguages: ['es-MX', 'en-GB'], callingCode: '+58' },
  { code: 'VN', code3: 'VNM', name: 'Vietnam', flag: '🇻🇳', region: 'Asia', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'vi'], callingCode: '+84' },
  { code: 'YE', code3: 'YEM', name: 'Yemen', flag: '🇾🇪', region: 'Middle East', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB', 'ar'], callingCode: '+967' },
  { code: 'ZM', code3: 'ZMB', name: 'Zambia', flag: '🇿🇲', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+260' },
  { code: 'ZW', code3: 'ZWE', name: 'Zimbabwe', flag: '🇿🇼', region: 'Africa', defaultLanguage: 'en-GB', supportedLanguages: ['en-GB'], callingCode: '+263' },
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
