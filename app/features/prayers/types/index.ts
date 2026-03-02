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

export interface SentPrayer {
  id: string;
  requestId: string;
  requestSnapshot: PrayerRequest;
  prayerText: string;
  sentAt: string;
}

export interface PrayerState {
  sentPrayers: SentPrayer[];
}

export interface PrayerActions {
  addSentPrayer: (prayer: SentPrayer) => void;
  hasSentPrayer: (requestId: string) => boolean;
  getAvailableRequests: (allRequests: PrayerRequest[]) => PrayerRequest[];
  getRequestById: (allRequests: PrayerRequest[], id: string) => PrayerRequest | undefined;
  submitPrayer: (request: PrayerRequest, prayerText: string) => void;
}

export type PrayerStore = PrayerState & PrayerActions;
