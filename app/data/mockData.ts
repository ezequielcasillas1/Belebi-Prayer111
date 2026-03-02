/**
 * LEGACY MOCK DATA
 * For comprehensive iOS countries with language support, use:
 * import { IOS_SUPPORTED_COUNTRIES } from '../config/countries';
 * 
 * For translation services, use:
 * import { translationService } from '../services/translation';
 */

// Legacy Interfaces (for backward compatibility during migration)
export interface Country {
  code: string;
  name: string;
  flag: string;
  activeRequests: number;
  lat: number;
  lon: number;
  region: string;
  isRestricted?: boolean;
}

export interface PrayerRequest {
  id: string;
  name: string;
  letter: string;
  country: string;
  countryCode: string;
  flag: string;
  denomination: string;
  requestText: string;
  description: string;
  profileImages: string[];
  emergencyImages: string[];
  prayersSentCount: number;
  createdAt: string;
  expiresAt: string;
  autoDismissTime: '1month' | '6months' | '1year';
  requesterId: string;
}

export interface ChatMessage {
  id: string;
  countryCode: string;
  senderId: string;
  senderName: string;
  senderCountry: string;
  senderFlag: string;
  text: string;
  timestamp: string;
  removed?: boolean;
}

export interface User {
  id: string;
  firstName: string;
  country: string;
  countryCode: string;
  flag: string;
  denomination: string;
  email: string;
}

export interface AutoAssignment {
  requestId: string;
  assignedAt: string;
  expiresAt: string;
}

export interface PlannedPrayer {
  requestId: string;
  addedAt: string;
  expiresAt: string;
}

export interface SentPrayer {
  id: string;
  requestId: string;
  requestSnapshot: PrayerRequest;
  prayerText: string;
  sentAt: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

// Image Constants (Unsplash URLs)
export const IMG_AFRICAN_WOMAN = 'https://images.unsplash.com/photo-1710117045399-0fab00350f4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
export const IMG_ASIAN_MAN = 'https://images.unsplash.com/photo-1714746643386-b0b145e9cdd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
export const IMG_LATIN_WOMAN = 'https://images.unsplash.com/photo-1635697299066-5986469dd072?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
export const IMG_MIDEAST_MAN = 'https://images.unsplash.com/photo-1766334079470-7f36e9c78311?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
export const IMG_ASIAN_WOMAN = 'https://images.unsplash.com/photo-1764216069652-fbff0e0337f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
export const IMG_EURO_MAN = 'https://images.unsplash.com/photo-1763913086998-ef72958e93ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
export const IMG_LANDSCAPE = 'https://images.unsplash.com/photo-1764714648804-bc8efdaafb1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';

// Countries Data
export const COUNTRIES: Country[] = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', activeRequests: 8, lat: 9.082, lon: 8.6753, region: 'Africa' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', activeRequests: 6, lat: 48.3794, lon: 31.1656, region: 'Europe' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', activeRequests: 5, lat: -0.0236, lon: 37.9062, region: 'Africa' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', activeRequests: 4, lat: 12.8797, lon: 121.774, region: 'Asia' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', activeRequests: 4, lat: -14.235, lon: -51.9253, region: 'South America' },
  { code: 'IN', name: 'India', flag: '🇮🇳', activeRequests: 4, lat: 20.5937, lon: 78.9629, region: 'Asia' },
  { code: 'US', name: 'United States', flag: '🇺🇸', activeRequests: 3, lat: 37.0902, lon: -95.7129, region: 'North America' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', activeRequests: 3, lat: 55.3781, lon: -3.436, region: 'Europe' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', activeRequests: 3, lat: -30.5595, lon: 22.9375, region: 'Africa' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', activeRequests: 2, lat: 23.6345, lon: -102.5528, region: 'North America' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', activeRequests: 2, lat: 51.1657, lon: 10.4515, region: 'Europe' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', activeRequests: 2, lat: 51.9194, lon: 19.1451, region: 'Europe' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', activeRequests: 2, lat: 56.1304, lon: -106.3468, region: 'North America' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', activeRequests: 2, lat: -25.2744, lon: 133.7751, region: 'Oceania' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', activeRequests: 2, lat: 7.9465, lon: -1.0232, region: 'Africa' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', activeRequests: 2, lat: -0.7893, lon: 113.9213, region: 'Asia' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', activeRequests: 1, lat: 36.2048, lon: 138.2529, region: 'Asia' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', activeRequests: 1, lat: 35.9078, lon: 127.7669, region: 'Asia' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', activeRequests: 8, lat: 9.082, lon: 8.6753, region: 'Africa' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', activeRequests: 1, lat: 26.8206, lon: 30.8025, region: 'Africa' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', activeRequests: 1, lat: -38.4161, lon: -63.6167, region: 'South America' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', activeRequests: 1, lat: -35.6751, lon: -71.543, region: 'South America' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', activeRequests: 1, lat: 4.5709, lon: -74.2973, region: 'South America' },
  { code: 'FR', name: 'France', flag: '🇫🇷', activeRequests: 1, lat: 46.2276, lon: 2.2137, region: 'Europe' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', activeRequests: 1, lat: 41.8719, lon: 12.5674, region: 'Europe' },
];

// Remove duplicate Nigeria entry
export const UNIQUE_COUNTRIES = COUNTRIES.filter((country, index, self) =>
  index === self.findIndex((c) => c.code === country.code)
);

// Prayer Requests Data
export const PRAYER_REQUESTS: PrayerRequest[] = [
  {
    id: '1',
    name: 'Adaeze',
    letter: 'A',
    country: 'Nigeria',
    countryCode: 'NG',
    flag: '🇳🇬',
    denomination: 'Pentecostal',
    requestText: 'Please pray for my family\'s safety during the current unrest in our region. We need God\'s protection and peace.',
    description: 'I am a mother of three from Lagos. My husband works as a teacher and we are trying to raise our children in faith despite the challenges we face.',
    profileImages: [IMG_AFRICAN_WOMAN],
    emergencyImages: [],
    prayersSentCount: 2,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1month',
    requesterId: 'user1',
  },
  {
    id: '2',
    name: 'Boris',
    letter: 'B',
    country: 'Ukraine',
    countryCode: 'UA',
    flag: '🇺🇦',
    denomination: 'Orthodox',
    requestText: 'Pray for peace in my homeland. We are enduring so much hardship and need the Lord\'s strength to persevere.',
    description: 'I am from Kyiv and have been displaced from my home. I work remotely as a software developer while caring for my elderly parents.',
    profileImages: [IMG_EURO_MAN],
    emergencyImages: [IMG_LANDSCAPE],
    prayersSentCount: 5,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '6months',
    requesterId: 'user2',
  },
  {
    id: '3',
    name: 'Chen',
    letter: 'C',
    country: 'Philippines',
    countryCode: 'PH',
    flag: '🇵🇭',
    denomination: 'Catholic',
    requestText: 'Please pray for healing for my grandmother who is battling cancer. She has been a pillar of faith in our family.',
    description: 'I am a nurse from Manila working abroad to support my family. Faith keeps me going every day.',
    profileImages: [IMG_ASIAN_WOMAN],
    emergencyImages: [],
    prayersSentCount: 1,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1month',
    requesterId: 'user3',
  },
  {
    id: '4',
    name: 'Diana',
    letter: 'D',
    country: 'Brazil',
    countryCode: 'BR',
    flag: '🇧🇷',
    denomination: 'Baptist',
    requestText: 'I ask for prayers for my son who has strayed from the faith. May God soften his heart and bring him back.',
    description: 'I am a teacher and mother from São Paulo. I lead a small Bible study group in my community.',
    profileImages: [IMG_LATIN_WOMAN],
    emergencyImages: [],
    prayersSentCount: 3,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1year',
    requesterId: 'user4',
  },
  {
    id: '5',
    name: 'Emmanuel',
    letter: 'E',
    country: 'Kenya',
    countryCode: 'KE',
    flag: '🇰🇪',
    denomination: 'Anglican',
    requestText: 'Pray for our church community as we build a new school for underprivileged children. We need resources and wisdom.',
    description: 'I am a pastor in Nairobi, serving a growing congregation. Education is my passion alongside ministry.',
    profileImages: [IMG_AFRICAN_WOMAN],
    emergencyImages: [],
    prayersSentCount: 0,
    createdAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '6months',
    requesterId: 'user5',
  },
  {
    id: '6',
    name: 'Fatima',
    letter: 'F',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    denomination: 'Catholic',
    requestText: 'Please pray for my husband\'s job situation. He was laid off and we have two young children to support.',
    description: 'I am from Mumbai, working as a healthcare worker while my husband searches for new employment.',
    profileImages: [IMG_ASIAN_WOMAN],
    emergencyImages: [],
    prayersSentCount: 1,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1month',
    requesterId: 'user6',
  },
  {
    id: '7',
    name: 'Grace',
    letter: 'G',
    country: 'Ghana',
    countryCode: 'GH',
    flag: '🇬🇭',
    denomination: 'Methodist',
    requestText: 'Pray for wisdom as I navigate a difficult decision about relocating for work. I want to follow God\'s plan.',
    description: 'I am a young professional from Accra, trying to balance career ambitions with family responsibilities.',
    profileImages: [IMG_AFRICAN_WOMAN],
    emergencyImages: [],
    prayersSentCount: 2,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1month',
    requesterId: 'user7',
  },
  {
    id: '8',
    name: 'Hassan',
    letter: 'H',
    country: 'Egypt',
    countryCode: 'EG',
    flag: '🇪🇬',
    denomination: 'Orthodox',
    requestText: 'Please pray for Christians facing persecution in our area. We need courage and protection to continue worshipping.',
    description: 'I am a Coptic Christian from Cairo, working as an engineer while serving in my local church.',
    profileImages: [IMG_MIDEAST_MAN],
    emergencyImages: [IMG_LANDSCAPE],
    prayersSentCount: 4,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '6months',
    requesterId: 'user8',
  },
  {
    id: '9',
    name: 'Isabella',
    letter: 'I',
    country: 'Argentina',
    countryCode: 'AR',
    flag: '🇦🇷',
    denomination: 'Catholic',
    requestText: 'Pray for my daughter who is struggling with anxiety and depression. She needs God\'s peace and healing.',
    description: 'I am a mother from Buenos Aires, working in education and actively involved in church activities.',
    profileImages: [IMG_LATIN_WOMAN],
    emergencyImages: [],
    prayersSentCount: 2,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1month',
    requesterId: 'user9',
  },
  {
    id: '10',
    name: 'James',
    letter: 'J',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    denomination: 'Baptist',
    requestText: 'Please pray for healing from addiction. I\'ve been sober for 6 months but the struggle continues daily.',
    description: 'I am from Texas, rebuilding my life after years of substance abuse. God has been my anchor.',
    profileImages: [IMG_EURO_MAN],
    emergencyImages: [],
    prayersSentCount: 1,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1year',
    requesterId: 'user10',
  },
  {
    id: '11',
    name: 'Kenji',
    letter: 'K',
    country: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    denomination: 'Non-denominational',
    requestText: 'Pray for my coworkers to come to know Christ. I am often the only Christian in my workplace.',
    description: 'I am a Christian businessman from Tokyo, trying to be a light in a very secular environment.',
    profileImages: [IMG_ASIAN_MAN],
    emergencyImages: [],
    prayersSentCount: 0,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '6months',
    requesterId: 'user11',
  },
  {
    id: '12',
    name: 'Lucia',
    letter: 'L',
    country: 'Mexico',
    countryCode: 'MX',
    flag: '🇲🇽',
    denomination: 'Catholic',
    requestText: 'Please pray for safety for my brother who is a missionary in a dangerous region. He needs protection.',
    description: 'I am from Guadalajara, supporting my family\'s missionary work through prayer and finances.',
    profileImages: [IMG_LATIN_WOMAN],
    emergencyImages: [],
    prayersSentCount: 3,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1month',
    requesterId: 'user12',
  },
  {
    id: '13',
    name: 'Maria',
    letter: 'M',
    country: 'Colombia',
    countryCode: 'CO',
    flag: '🇨🇴',
    denomination: 'Pentecostal',
    requestText: 'Pray for reconciliation in my marriage. My husband and I have been separated for months.',
    description: 'I am from Bogotá, working as a nurse while hoping for restoration in my family.',
    profileImages: [IMG_LATIN_WOMAN],
    emergencyImages: [],
    prayersSentCount: 2,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '6months',
    requesterId: 'user13',
  },
  {
    id: '14',
    name: 'Nathan',
    letter: 'N',
    country: 'South Africa',
    countryCode: 'ZA',
    flag: '🇿🇦',
    denomination: 'Reformed',
    requestText: 'Please pray for our community dealing with crime and violence. We need God\'s peace and justice.',
    description: 'I am a youth pastor from Johannesburg, working to provide hope and direction for young people.',
    profileImages: [IMG_AFRICAN_WOMAN],
    emergencyImages: [],
    prayersSentCount: 1,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1month',
    requesterId: 'user14',
  },
  {
    id: '15',
    name: 'Olga',
    letter: 'O',
    country: 'Poland',
    countryCode: 'PL',
    flag: '🇵🇱',
    denomination: 'Catholic',
    requestText: 'Pray for my elderly mother\'s health. She has been in the hospital for weeks.',
    description: 'I am from Warsaw, working as an accountant while caring for my aging parents.',
    profileImages: [IMG_EURO_MAN],
    emergencyImages: [],
    prayersSentCount: 0,
    createdAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1month',
    requesterId: 'user15',
  },
  {
    id: '16',
    name: 'Paul',
    letter: 'P',
    country: 'Germany',
    countryCode: 'DE',
    flag: '🇩🇪',
    denomination: 'Lutheran',
    requestText: 'Please pray for guidance in my career transition. I feel called to ministry but have doubts.',
    description: 'I am an engineer from Berlin, exploring whether God is calling me to full-time ministry.',
    profileImages: [IMG_EURO_MAN],
    emergencyImages: [],
    prayersSentCount: 2,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '6months',
    requesterId: 'user16',
  },
  {
    id: '17',
    name: 'Qiang',
    letter: 'Q',
    country: 'Indonesia',
    countryCode: 'ID',
    flag: '🇮🇩',
    denomination: 'Protestant',
    requestText: 'Pray for boldness to share my faith with my neighbors who follow a different religion.',
    description: 'I am from Jakarta, working as a teacher and trying to be a witness in my community.',
    profileImages: [IMG_ASIAN_MAN],
    emergencyImages: [],
    prayersSentCount: 1,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1month',
    requesterId: 'user17',
  },
  {
    id: '18',
    name: 'Rachel',
    letter: 'R',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    denomination: 'Anglican',
    requestText: 'Please pray for my teenage son who is being bullied at school. He needs confidence and friends.',
    description: 'I am a single mother from London, working in healthcare while raising two children.',
    profileImages: [IMG_EURO_MAN],
    emergencyImages: [],
    prayersSentCount: 3,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1month',
    requesterId: 'user18',
  },
  {
    id: '19',
    name: 'Samuel',
    letter: 'S',
    country: 'Nigeria',
    countryCode: 'NG',
    flag: '🇳🇬',
    denomination: 'Charismatic',
    requestText: 'Pray for provision as I start a small business to support my family. We need God\'s favor.',
    description: 'I am an entrepreneur from Abuja, stepping out in faith to start a new venture.',
    profileImages: [IMG_AFRICAN_WOMAN],
    emergencyImages: [],
    prayersSentCount: 0,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '6months',
    requesterId: 'user19',
  },
  {
    id: '20',
    name: 'Teresa',
    letter: 'T',
    country: 'Philippines',
    countryCode: 'PH',
    flag: '🇵🇭',
    denomination: 'Catholic',
    requestText: 'Please pray for my family as we prepare for a typhoon season. We need protection and provision.',
    description: 'I am from Cebu, working as a teacher while supporting my extended family.',
    profileImages: [IMG_ASIAN_WOMAN],
    emergencyImages: [IMG_LANDSCAPE],
    prayersSentCount: 2,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1month',
    requesterId: 'user20',
  },
  {
    id: '21',
    name: 'Uche',
    letter: 'U',
    country: 'Nigeria',
    countryCode: 'NG',
    flag: '🇳🇬',
    denomination: 'Baptist',
    requestText: 'Pray for my studies as I prepare for exams. I need focus and wisdom to succeed.',
    description: 'I am a university student from Port Harcourt, studying medicine to serve my community.',
    profileImages: [IMG_AFRICAN_WOMAN],
    emergencyImages: [],
    prayersSentCount: 1,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1month',
    requesterId: 'user21',
  },
  {
    id: '22',
    name: 'Victor',
    letter: 'V',
    country: 'Ukraine',
    countryCode: 'UA',
    flag: '🇺🇦',
    denomination: 'Orthodox',
    requestText: 'Please pray for my friends who are serving in the military. They need courage and protection.',
    description: 'I am from Lviv, working to support refugees while praying for peace in my homeland.',
    profileImages: [IMG_EURO_MAN],
    emergencyImages: [],
    prayersSentCount: 4,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1year',
    requesterId: 'user22',
  },
  {
    id: '23',
    name: 'William',
    letter: 'W',
    country: 'Canada',
    countryCode: 'CA',
    flag: '🇨🇦',
    denomination: 'Presbyterian',
    requestText: 'Pray for my church\'s outreach to homeless community. We need volunteers and resources.',
    description: 'I am a deacon from Toronto, passionate about serving the marginalized in our city.',
    profileImages: [IMG_EURO_MAN],
    emergencyImages: [],
    prayersSentCount: 2,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '6months',
    requesterId: 'user23',
  },
  {
    id: '24',
    name: 'Xiang',
    letter: 'X',
    country: 'South Korea',
    countryCode: 'KR',
    flag: '🇰🇷',
    denomination: 'Presbyterian',
    requestText: 'Please pray for my parents to accept my faith. They follow traditional beliefs and don\'t understand.',
    description: 'I am a new believer from Seoul, navigating family expectations while growing in faith.',
    profileImages: [IMG_ASIAN_MAN],
    emergencyImages: [],
    prayersSentCount: 1,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1month',
    requesterId: 'user24',
  },
  {
    id: '25',
    name: 'Yolanda',
    letter: 'Y',
    country: 'Chile',
    countryCode: 'CL',
    flag: '🇨🇱',
    denomination: 'Pentecostal',
    requestText: 'Pray for healing from chronic illness. I\'ve been battling this condition for years.',
    description: 'I am from Santiago, working part-time while managing health challenges.',
    profileImages: [IMG_LATIN_WOMAN],
    emergencyImages: [],
    prayersSentCount: 3,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1year',
    requesterId: 'user25',
  },
  {
    id: '26',
    name: 'Zara',
    letter: 'Z',
    country: 'Kenya',
    countryCode: 'KE',
    flag: '🇰🇪',
    denomination: 'Anglican',
    requestText: 'Please pray for clean water access in our village. Many children are getting sick.',
    description: 'I am a community health worker from rural Kenya, advocating for better sanitation.',
    profileImages: [IMG_AFRICAN_WOMAN],
    emergencyImages: [IMG_LANDSCAPE],
    prayersSentCount: 0,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1month',
    requesterId: 'user26',
  },
  {
    id: '27',
    name: 'Abraham',
    letter: 'A',
    country: 'Nigeria',
    countryCode: 'NG',
    flag: '🇳🇬',
    denomination: 'Methodist',
    requestText: 'Pray for my family\'s immigration process. We are waiting on important documents.',
    description: 'I am from Lagos, hoping to reunite with family members abroad.',
    profileImages: [IMG_AFRICAN_WOMAN],
    emergencyImages: [],
    prayersSentCount: 1,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '6months',
    requesterId: 'user27',
  },
  {
    id: '28',
    name: 'Beatrice',
    letter: 'B',
    country: 'Italy',
    countryCode: 'IT',
    flag: '🇮🇹',
    denomination: 'Catholic',
    requestText: 'Please pray for my husband who recently lost his job. We need provision and hope.',
    description: 'I am from Rome, supporting my family while my husband searches for employment.',
    profileImages: [IMG_EURO_MAN],
    emergencyImages: [],
    prayersSentCount: 2,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1month',
    requesterId: 'user28',
  },
  {
    id: '29',
    name: 'Charles',
    letter: 'C',
    country: 'France',
    countryCode: 'FR',
    flag: '🇫🇷',
    denomination: 'Reformed',
    requestText: 'Pray for revival in our church. Attendance has declined and we need renewed passion.',
    description: 'I am an elder from Paris, serving in a historic church facing modern challenges.',
    profileImages: [IMG_EURO_MAN],
    emergencyImages: [],
    prayersSentCount: 1,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '6months',
    requesterId: 'user29',
  },
  {
    id: '30',
    name: 'David',
    letter: 'D',
    country: 'Australia',
    countryCode: 'AU',
    flag: '🇦🇺',
    denomination: 'Anglican',
    requestText: 'Please pray for our community recovering from bushfires. Many lost their homes.',
    description: 'I am a volunteer firefighter from rural Australia, helping neighbors rebuild.',
    profileImages: [IMG_EURO_MAN],
    emergencyImages: [IMG_LANDSCAPE],
    prayersSentCount: 5,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    autoDismissTime: '1year',
    requesterId: 'user30',
  },
];

// Chat Messages
export const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg1',
    countryCode: 'NG',
    senderId: 'user1',
    senderName: 'Emmanuel',
    senderCountry: 'Nigeria',
    senderFlag: '🇳🇬',
    text: 'Heavenly Father, we lift up our nation to you today. Grant us peace and unity. 🙏',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg2',
    countryCode: 'NG',
    senderId: 'user2',
    senderName: 'Sarah',
    senderCountry: 'United States',
    senderFlag: '🇺🇸',
    text: 'Praying with you from across the ocean. God bless Nigeria! 🌍',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg3',
    countryCode: 'UA',
    senderId: 'user3',
    senderName: 'Viktor',
    senderCountry: 'Ukraine',
    senderFlag: '🇺🇦',
    text: 'Lord, protect our land and bring peace to our people. We trust in You.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg4',
    countryCode: 'UA',
    senderId: 'user4',
    senderName: 'Maria',
    senderCountry: 'Poland',
    senderFlag: '🇵🇱',
    text: 'Standing with Ukraine in prayer. May God\'s mercy cover you all. 💙💛',
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg5',
    countryCode: 'KE',
    senderId: 'user5',
    senderName: 'Grace',
    senderCountry: 'Kenya',
    senderFlag: '🇰🇪',
    text: 'Father God, bless our beautiful Kenya. Provide for all who are in need.',
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
];

// Nation Prayer Points
export const NATION_PRAYER_POINTS: Record<string, string[]> = {
  NG: [
    'Pray for peace and unity among the diverse ethnic and religious groups',
    'Intercede for the government to make wise decisions for the people',
    'Pray for economic stability and opportunities for youth employment',
    'Ask God to protect communities from violence and insecurity',
    'Pray for the Church to be a beacon of hope and reconciliation',
    'Intercede for clean water and healthcare access in rural areas',
  ],
  UA: [
    'Pray for peace and an end to conflict in the region',
    'Intercede for protection of civilians and displaced families',
    'Pray for strength and courage for those serving and defending',
    'Ask God to comfort those who have lost loved ones',
    'Pray for humanitarian aid to reach those in need',
    'Intercede for wisdom for leaders seeking peaceful resolution',
  ],
  KE: [
    'Pray for good governance and integrity in leadership',
    'Intercede for economic growth and poverty reduction',
    'Pray for protection of wildlife and natural resources',
    'Ask God to bless the agricultural sector and bring rain in season',
    'Pray for unity among different communities and tribes',
    'Intercede for quality education accessible to all children',
  ],
  default: [
    'Pray for peace and stability throughout the nation',
    'Intercede for wise and just leadership',
    'Pray for the physical and spiritual well-being of the people',
    'Ask God to strengthen the local Church and believers',
    'Pray for economic opportunities and provision for families',
    'Intercede for protection and care of the vulnerable',
  ],
};

// Denominations list
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
];
