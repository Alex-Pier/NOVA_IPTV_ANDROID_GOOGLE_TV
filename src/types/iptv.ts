export interface Channel {
  id: string;
  number: number;
  name: string;
  url: string;
  logo?: string;
  group: string;
  tvgId?: string;
  tvgName?: string;
  isRadio?: boolean;
  isFavorite?: boolean;
  resolution?: string;
  safetyStatus: 'legal_verified' | 'community_public' | 'suspicious';
  safetyReason?: string;
  country?: string;
  language?: string;
  liveStatus?: 'online' | 'offline' | 'checking' | 'unknown';
  pingMs?: number;
  isAdult?: boolean;
  sourceName?: string;
  sourceId?: string;
}

export interface CuratedM3USource {
  id: string;
  title: string;
  category: 'Italia' | 'News' | 'Sport' | 'Musica' | 'Documentari' | 'Mondo' | 'Bambini';
  description: string;
  channelCount: number;
  url: string;
  isLegalVerified: boolean;
  safetyLevel: 'safe' | 'caution' | 'high_risk';
  safetyBadge: string;
  safetyReason: string;
  country: string;
  flag: string;
  featured?: boolean;
  tags: string[];
  channelsPreview: string[];
}

export type M3uGenre = 
  | 'Notizie'
  | 'Sport'
  | 'Cinema & Serie'
  | 'Musica'
  | 'Documentari'
  | 'Bambini & Ragazzi'
  | 'Intrattenimento'
  | 'Cultura & Scienza'
  | 'Adulti 18+'
  | 'Generale';

export type M3uLanguage = 
  | 'Italiano'
  | 'Inglese'
  | 'Spagnolo'
  | 'Francese'
  | 'Tedesco'
  | 'Multi-lingua';

export interface DiscoveredM3uList {
  id: string;
  title: string;
  sourceName: string; // e.g. "Blog AndroidWorld", "Forum GeekTV", "GitHub iptv-org", "Sito Ufficiale Rai"
  sourceType: 'blog' | 'forum' | 'github_community' | 'official_site' | 'pastebin';
  sourceUrl: string;
  webArticleUrl?: string;
  description: string;
  genre: M3uGenre;
  language: M3uLanguage;
  country: string;
  flag: string;
  channelCount: number;
  safetyLevel: 'safe' | 'caution' | 'high_risk';
  isLegalVerified: boolean;
  safetyBadge: string;
  safetyExplanation: string;
  sampleChannels: string[];
  reliabilityScore: number; // 0 to 100
  foundDate: string;
  isAdult?: boolean;
  liveStatus?: 'online' | 'offline' | 'checking' | 'unknown';
  channels?: Channel[];
}

export interface SafetyAuditResult {
  score: number; // 0 to 100
  verdict: 'SAFE_LEGAL' | 'COMMUNITY_UNVERIFIED' | 'SUSPICIOUS_HIGH_RISK';
  title: string;
  description: string;
  checks: {
    name: string;
    passed: boolean;
    details: string;
  }[];
  recommendations: string[];
}

export interface PlayerStats {
  resolution?: string;
  bitrate?: number;
  latency?: number;
  buffered?: number;
  audioTracksCount?: number;
  currentAudioTrack?: string;
  fps?: number;
}
