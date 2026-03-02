export const AUTO_ASSIGNMENT_HOURS = 12;
export const PLAN_PRAYER_HOURS = 24;
export const STORAGE_KEY = 'belebi_app_state';

export const DENOMINATIONS = [
  'Prefer not to say',
  'Anglican',
  'Baptist',
  'Catholic',
  'Charismatic',
  'Lutheran',
  'Methodist',
  'Non-denominational',
  'Orthodox',
  'Pentecostal',
  'Presbyterian',
  'Protestant',
  'Reformed',
  'Other',
] as const;

export type Denomination = typeof DENOMINATIONS[number];

export const AUTO_DISMISS_OPTIONS = ['1month', '6months', '1year'] as const;
export type AutoDismissTime = typeof AUTO_DISMISS_OPTIONS[number];

export { 
  IOS_SUPPORTED_COUNTRIES, 
  SUPPORTED_LANGUAGES, 
  REGIONS,
  getCountryByCode,
  getCountriesByRegion,
  getCountriesByLanguage,
  searchCountries,
  getLanguageByCode,
  getBaseLanguageCode,
} from './countries';

export type { Country, LanguageCode, Language, Region } from './countries';
