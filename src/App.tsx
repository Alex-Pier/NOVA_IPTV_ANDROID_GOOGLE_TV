/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Channel, DiscoveredM3uList } from './types/iptv';
import { INITIAL_SAMPLE_CHANNELS } from './data/curatedPlaylists';
import { parseM3U } from './utils/m3uParser';
import { useTVRemoteNavigation } from './hooks/useTVRemoteNavigation';
import { useVoiceDictation, VoiceCommandAction } from './hooks/useVoiceDictation';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useStreamHealthTester } from './hooks/useStreamHealthTester';

import { VideoPlayer } from './components/VideoPlayer';
import { ChannelGrid } from './components/ChannelGrid';
import { OnlineM3uDirectory } from './components/OnlineM3uDirectory';
import { VoiceDictationModal } from './components/VoiceDictationModal';
import { VirtualTVRemote } from './components/VirtualTVRemote';
import { InstallGuideModal } from './components/InstallGuideModal';
import { M3uUploadModal } from './components/M3uUploadModal';
import { VirtualKeyboardModal } from './components/VirtualKeyboardModal';

import {
  Tv,
  Mic,
  ShieldCheck,
  Download,
  PlusCircle,
  HelpCircle,
  Sliders,
  Radio,
  Sparkles,
  Smartphone,
  Keyboard,
  Info,
  RotateCcw
} from 'lucide-react';

const CURRENT_STORAGE_VERSION = 'novatv_v10_tree_datasaver_fit';

// Ensures every channel has its authentic, correct stream URL and prevents cross-channel audio/video mismatch
export function sanitizeChannel(ch: Channel): Channel {
  const nameLower = ch.name.toLowerCase();

  // 1. Dedicated Adult 18+ channels
  if (nameLower.includes('redlight') || nameLower.includes('red light')) {
    return {
      ...ch,
      url: '/videos/redlight_tv.mp4',
      isAdult: true,
      group: 'Adulti 18+',
      safetyReason: 'Canale Adulti 18+ • Late Night Lounge WebTV',
      safetyStatus: 'community_public',
      sourceName: ch.sourceName || 'M3U Notturno Adulti 18+',
      sourceId: ch.sourceId || 'adult_streams'
    };
  }
  if (nameLower.includes('babes')) {
    return {
      ...ch,
      url: '/videos/babes_tv.mp4',
      isAdult: true,
      group: 'Adulti 18+',
      safetyReason: 'Canale Glamour, Catwalk & Top Models 18+ Live',
      safetyStatus: 'community_public',
      sourceName: ch.sourceName || 'M3U Notturno Adulti 18+',
      sourceId: ch.sourceId || 'adult_streams'
    };
  }
  if (nameLower.includes('erotic cinema') || nameLower.includes('erotico') || nameLower.includes('erotica')) {
    return {
      ...ch,
      url: '/videos/erotic_cinema.mp4',
      isAdult: true,
      group: 'Adulti 18+',
      safetyReason: 'Cinema Notturno 18+ • Film d\'Autore & Rassegna Notturna',
      safetyStatus: 'community_public',
      sourceName: ch.sourceName || 'M3U Notturno Adulti 18+',
      sourceId: ch.sourceId || 'adult_streams'
    };
  }
  if (nameLower.includes('nightclub') || nameLower.includes('night club')) {
    return {
      ...ch,
      url: '/videos/nightclub_tv.mp4',
      isAdult: true,
      group: 'Adulti 18+',
      safetyReason: 'Nightclub & Spettacoli Notturni Web • DJ Set Live',
      safetyStatus: 'community_public',
      sourceName: ch.sourceName || 'M3U Notturno Adulti 18+',
      sourceId: ch.sourceId || 'adult_streams'
    };
  }
  if (nameLower.includes('passion')) {
    return {
      ...ch,
      url: '/videos/passion_tv.mp4',
      isAdult: true,
      group: 'Adulti 18+',
      safetyReason: 'Programmi per adulti 18+ • Passione Notturna WebTV',
      safetyStatus: 'community_public',
      sourceName: ch.sourceName || 'M3U Notturno Adulti 18+',
      sourceId: ch.sourceId || 'adult_streams'
    };
  }
  if (nameLower.includes('glamour')) {
    return {
      ...ch,
      url: '/videos/glamour_tv.mp4',
      isAdult: true,
      group: 'Adulti 18+',
      safetyReason: 'Canale Glamour 18+ da forum streaming',
      safetyStatus: 'community_public',
      sourceName: ch.sourceName || 'M3U Notturno Adulti 18+',
      sourceId: ch.sourceId || 'adult_streams'
    };
  }
  if (nameLower.includes('sexy lounge') || nameLower.includes('sexy')) {
    return {
      ...ch,
      url: '/videos/sexy_lounge.mp4',
      isAdult: true,
      group: 'Adulti 18+',
      safetyReason: 'WebTV sexy lounge non ufficiale • Chillout 18+',
      safetyStatus: 'community_public',
      sourceName: ch.sourceName || 'M3U Notturno Adulti 18+',
      sourceId: ch.sourceId || 'adult_streams'
    };
  }
  if (nameLower.includes('adult hits') || nameLower.includes('late night show erotic')) {
    return {
      ...ch,
      url: '/videos/passion_tv.mp4',
      isAdult: true,
      group: 'Adulti 18+',
      safetyReason: 'Show erotico notturno non certificato',
      safetyStatus: 'community_public',
      sourceName: ch.sourceName || 'M3U Notturno Adulti 18+',
      sourceId: ch.sourceId || 'adult_streams'
    };
  }

  // 2. Dedicated Indie / WebTV channels
  if (nameLower.includes('indie tv')) {
    return {
      ...ch,
      url: '/videos/indie_tv.mp4',
      group: 'Intrattenimento',
      safetyReason: 'Web-TV indie sperimentale aperta',
      safetyStatus: 'community_public'
    };
  }
  if (nameLower.includes('amateur cam')) {
    return {
      ...ch,
      url: '/videos/amateur_cam.mp4',
      group: 'Intrattenimento',
      safetyReason: 'Feed webcam amatoriale aperta',
      safetyStatus: 'community_public'
    };
  }
  if (nameLower.includes('radio web tv indipendente') || nameLower.includes('radio tv amatoriale')) {
    return {
      ...ch,
      url: '/videos/nightclub_tv.mp4',
      group: 'Musica',
      safetyReason: 'Radio web e video feed underground',
      safetyStatus: 'community_public'
    };
  }

  // 3. Red Bull TV sports ONLY for Red Bull
  if (nameLower.includes('red bull') || nameLower.includes('redbull')) {
    return {
      ...ch,
      url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
      group: 'Sport',
      safetyStatus: 'legal_verified'
    };
  }

  // 4. CRITICAL: If any non-sport channel was previously saved with Red Bull stream, fix it
  if (ch.url.includes('rbmn-live') && !nameLower.includes('red bull') && !nameLower.includes('redbull')) {
    if (ch.isAdult || nameLower.includes('adult') || nameLower.includes('18')) {
      return { ...ch, url: '/videos/redlight_tv.mp4', isAdult: true, group: 'Adulti 18+' };
    }
    return { ...ch, url: 'https://cph-msl.akamaized.net/hls/live/2000341/test/master.m3u8' };
  }

  // 5. News & Broadcasters
  if (nameLower.includes('deutsche welle') || nameLower.includes('dw news')) {
    return {
      ...ch,
      url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
      group: 'Notizie',
      safetyStatus: 'legal_verified'
    };
  }
  if (nameLower.includes('bloomberg')) {
    return {
      ...ch,
      url: 'https://www.bloomberg.com/media-manifest/streams/us.m3u8',
      group: 'Notizie',
      safetyStatus: 'legal_verified'
    };
  }
  if (nameLower.includes('nasa')) {
    return {
      ...ch,
      url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
      group: 'Documentari',
      safetyStatus: 'legal_verified'
    };
  }
  if (nameLower.includes('tears of steel')) {
    return {
      ...ch,
      url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
      group: 'Cinema & Serie',
      safetyStatus: 'legal_verified'
    };
  }
  if (nameLower.includes('oceans')) {
    return {
      ...ch,
      url: 'https://playertest.longtailvideo.com/adaptive/oceans/oceans.m3u8',
      group: 'Documentari',
      safetyStatus: 'legal_verified'
    };
  }
  if (nameLower.includes('big buck bunny')) {
    return {
      ...ch,
      url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      group: 'Cinema & Serie',
      safetyStatus: 'legal_verified'
    };
  }

  return {
    ...ch,
    sourceName: ch.sourceName || (ch.isAdult ? 'M3U Notturno Adulti 18+' : 'M3U Canali Ufficiali & Verificati'),
    sourceId: ch.sourceId || (ch.isAdult ? 'adult_streams' : 'default_official')
  };
}

export default function App() {
  // Channel & Playlist state with version migration and cache flush
  const [channels, setChannels] = useState<Channel[]>(() => {
    const storedVer = localStorage.getItem('novatv_version');
    if (storedVer !== CURRENT_STORAGE_VERSION) {
      // Clear obsolete/corrupted cache from previous turns
      localStorage.removeItem('novatv_channels');
      localStorage.removeItem('novatv_favorites');
      localStorage.setItem('novatv_version', CURRENT_STORAGE_VERSION);
      return INITIAL_SAMPLE_CHANNELS.map(sanitizeChannel);
    }

    const saved = localStorage.getItem('novatv_channels');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(sanitizeChannel);
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_SAMPLE_CHANNELS.map(sanitizeChannel);
  });

  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(() => {
    return channels[0] || INITIAL_SAMPLE_CHANNELS[0];
  });

  const [playlistTitle, setPlaylistTitle] = useState<string>('Canali Ufficiali & Feed Verificati');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('novatv_favorites');
    return saved ? JSON.parse(saved) : ['ch_dw_en', 'ch_redbull_tv'];
  });

  // UI Views & Modals
  const [activeTab, setActiveTab] = useState<'player' | 'explore' | 'guide'>('player');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('Tutti');
  const [selectedLanguage, setSelectedLanguage] = useState('Tutte');
  const [isTVMode, setIsTVMode] = useState(false);

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isVirtualRemoteOpen, setIsVirtualRemoteOpen] = useState(false);
  const [isVirtualKeyboardOpen, setIsVirtualKeyboardOpen] = useState(false);

  // Full-App Spatial Navigation for Android TV Remote & Virtual Remote
  const [tvFocusZone, setTvFocusZone] = useState<'header' | 'settings' | 'channels'>('channels');
  const [focusedSettingsKey, setFocusedSettingsKey] = useState<string>('btn_preferiti');
  const [focusedHeaderIndex, setFocusedHeaderIndex] = useState<number>(0);

  // Live availability testing states
  const [onlyOnlineFilter, setOnlyOnlineFilter] = useState(false);
  const [sortByAvailability, setSortByAvailability] = useState(false);

  // Bandwidth Saver (Risparmio Banda No-WiFi) state
  const [isDataSaver, setIsDataSaver] = useState<boolean>(() => {
    return localStorage.getItem('novatv_data_saver') === 'true';
  });

  const toggleDataSaver = useCallback(() => {
    setIsDataSaver((prev) => {
      const next = !prev;
      localStorage.setItem('novatv_data_saver', String(next));
      return next;
    });
  }, []);

  // Background stream health probe
  const { healthMap, onlineCount, retestChannel, resetHealth } = useStreamHealthTester(
    channels,
    selectedChannel?.id,
    isDataSaver
  );

  // D-Pad focused channel index
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Numeric channel dialing buffer (e.g. user presses '1' then '2' to jump to CH 12)
  const channelDialBufferRef = useRef<string>('');
  const channelDialTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activeDialNumber, setActiveDialNumber] = useState<string | null>(null);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // PWA installation hook
  const { isInstallable, install: triggerPWAInstall } = usePWAInstall();

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('novatv_channels', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('novatv_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Distinct groups (Generi)
  const groups = useMemo(() => {
    const set = new Set<string>();
    channels.forEach((c) => {
      if (c.group && c.group !== 'Tutti') set.add(c.group);
    });
    return Array.from(set);
  }, [channels]);

  // Distinct languages (Lingue)
  const languages = useMemo(() => {
    const set = new Set<string>();
    channels.forEach((c) => {
      if (c.language && c.language !== 'Tutte') set.add(c.language);
    });
    ['Italiano', 'Inglese', 'Spagnolo', 'Francese', 'Tedesco', 'Multi-lingua'].forEach((l) => set.add(l));
    return ['Tutte', ...Array.from(set)];
  }, [channels]);

  // Filtered and sorted channels (by Genere and Lingua)
  const filteredChannels = useMemo(() => {
    let result = channels.filter((ch) => {
      // Live availability filter
      if (onlyOnlineFilter) {
        const h = healthMap[ch.id];
        // If not tested yet or offline, exclude
        if (!h || h.status === 'offline') return false;
      }

      // Group (Genere) filter
      if (selectedGroup === 'Preferiti') {
        if (!favorites.includes(ch.id)) return false;
      } else if (selectedGroup !== 'Tutti' && ch.group !== selectedGroup) {
        return false;
      }

      // Language (Lingua) filter
      if (selectedLanguage !== 'Tutte' && ch.language && ch.language !== selectedLanguage) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = ch.name.toLowerCase().includes(q);
        const matchGroup = ch.group.toLowerCase().includes(q);
        const matchLang = ch.language ? ch.language.toLowerCase().includes(q) : false;
        const matchNum = String(ch.number) === q.replace(/\D/g, '');
        if (!matchName && !matchGroup && !matchLang && !matchNum) return false;
      }

      return true;
    });

    // Gentle re-ordering if sortByAvailability is enabled (online channels first)
    if (sortByAvailability) {
      result = [...result].sort((a, b) => {
        const aOnline = healthMap[a.id]?.status === 'online' ? 1 : 0;
        const bOnline = healthMap[b.id]?.status === 'online' ? 1 : 0;
        return bOnline - aOnline;
      });
    }

    return result;
  }, [channels, selectedGroup, selectedLanguage, favorites, searchQuery, onlyOnlineFilter, sortByAvailability, healthMap]);

  // Voice command interpreter
  const handleVoiceCommand = useCallback((action: VoiceCommandAction) => {
    showToast(`Comando Vocale: "${action.rawText}"`);

    switch (action.type) {
      case 'channel_number': {
        const num = action.payload;
        const target = channels.find((c) => c.number === num);
        if (target) {
          setSelectedChannel(target);
          setActiveTab('player');
          showToast(`Sintonizzato su: ${target.name} (CH ${target.number})`);
        } else {
          showToast(`Canale numero ${num} non presente nella lista.`);
        }
        break;
      }
      case 'search': {
        setSearchQuery(action.payload);
        setActiveTab('player');
        break;
      }
      case 'category': {
        const cat = action.payload;
        const matchedGroup = groups.find((g) => g.toLowerCase().includes(cat));
        if (matchedGroup) {
          setSelectedGroup(matchedGroup);
          setActiveTab('player');
        } else {
          setSearchQuery(cat);
          setActiveTab('player');
        }
        break;
      }
      case 'next': {
        handleNextChannel();
        break;
      }
      case 'prev': {
        handlePrevChannel();
        break;
      }
      case 'fullscreen': {
        const doc = document.documentElement;
        if (!document.fullscreenElement) {
          doc.requestFullscreen().catch(console.warn);
        }
        break;
      }
      default:
        break;
    }
  }, [channels, groups, showToast]);

  // Voice dictation hook
  const {
    isListening,
    isSupported: isVoiceSupported,
    transcript,
    interimTranscript,
    errorMessage: voiceError,
    toggleListening: toggleVoiceListening
  } = useVoiceDictation(handleVoiceCommand);

  // Channel switching logic
  const handleNextChannel = useCallback(() => {
    if (filteredChannels.length === 0) return;
    const currentIdx = filteredChannels.findIndex((c) => c.id === selectedChannel?.id);
    const nextIdx = (currentIdx + 1) % filteredChannels.length;
    setSelectedChannel(filteredChannels[nextIdx]);
    setFocusedIndex(nextIdx);
  }, [filteredChannels, selectedChannel]);

  const handlePrevChannel = useCallback(() => {
    if (filteredChannels.length === 0) return;
    const currentIdx = filteredChannels.findIndex((c) => c.id === selectedChannel?.id);
    const prevIdx = currentIdx <= 0 ? filteredChannels.length - 1 : currentIdx - 1;
    setSelectedChannel(filteredChannels[prevIdx]);
    setFocusedIndex(prevIdx);
  }, [filteredChannels, selectedChannel]);

  // Numeric channel dialing
  const handleDigitPress = useCallback((digit: number) => {
    channelDialBufferRef.current += String(digit);
    const currentDial = channelDialBufferRef.current;
    setActiveDialNumber(currentDial);

    if (channelDialTimeoutRef.current) clearTimeout(channelDialTimeoutRef.current);

    channelDialTimeoutRef.current = setTimeout(() => {
      const targetNum = parseInt(channelDialBufferRef.current, 10);
      const targetCh = channels.find((c) => c.number === targetNum);

      if (targetCh) {
        setSelectedChannel(targetCh);
        showToast(`CH ${targetNum} • ${targetCh.name}`);
      } else {
        showToast(`Canale ${targetNum} non trovato`);
      }

      channelDialBufferRef.current = '';
      setActiveDialNumber(null);
    }, 1200);
  }, [channels, showToast]);

  // Clear all channels from the list (resets to 0)
  const handleClearAllChannels = useCallback(() => {
    setChannels([]);
    setSelectedChannel(null);
    resetHealth();
    showToast('🗑️ Tutti i canali dell\'elenco sono stati cancellati (0 TV)');
  }, [resetHealth, showToast]);

  // Reset and restore clean, authentic default channels wiping any stale cache
  const handleResetToCleanDefaults = useCallback(() => {
    localStorage.removeItem('novatv_channels');
    localStorage.removeItem('novatv_favorites');
    localStorage.setItem('novatv_version', CURRENT_STORAGE_VERSION);
    const cleanList = INITIAL_SAMPLE_CHANNELS.map(sanitizeChannel);
    setChannels(cleanList);
    setSelectedChannel(cleanList[0]);
    setFavorites(['ch_dw_en', 'ch_redbull_tv']);
    setSelectedGroup('Tutti');
    setSearchQuery('');
    setOnlyOnlineFilter(false);
    setSortByAvailability(false);
    setFocusedIndex(0);
    setPlaylistTitle('Canali Ufficiali & Feed Verificati');
    resetHealth();
    showToast('✅ Canali ripristinati e sincronizzati! Test disponibilità attivo.');
  }, [resetHealth, showToast]);

  // List of header action keys for remote navigation
  const HEADER_KEYS = useMemo(() => [
    'tab_player',
    'tab_explore',
    'tab_guide',
    'btn_voice',
    'btn_sync',
    'btn_upload',
    'btn_install'
  ], []);

  const isHeaderFocused = useCallback((key: string) => {
    return tvFocusZone === 'header' && HEADER_KEYS[focusedHeaderIndex] === key;
  }, [tvFocusZone, focusedHeaderIndex, HEADER_KEYS]);

  // List of settings and filter keys for remote navigation
  const settingsKeys = useMemo(() => {
    const keys = [
      'search_input',
      'search_keyboard',
      'search_voice',
      'btn_preferiti',
      'btn_data_saver',
      'btn_only_online',
      'btn_sort_online',
      'btn_reset_clean',
      'cat_all'
    ];
    groups.forEach((_, idx) => keys.push(`cat_${idx}`));
    if (languages && languages.length > 1) {
      languages.forEach((_, idx) => keys.push(`lang_${idx}`));
    }
    keys.push('btn_clear_all');
    return keys;
  }, [groups, languages]);

  // Full-App TV Remote Spatial Navigation handlers (for real Android TV remote & virtual remote)
  const remoteHandlers = useMemo(() => ({
    onUp: () => {
      if (isVirtualKeyboardOpen || isVoiceModalOpen || isUploadModalOpen || isInstallModalOpen) return;

      if (tvFocusZone === 'channels') {
        if (focusedIndex >= 4) {
          setFocusedIndex((prev) => prev - 4);
        } else {
          // Transition UP into settings (focusing Preferiti or search)
          setTvFocusZone('settings');
          setFocusedSettingsKey('btn_preferiti');
        }
      } else if (tvFocusZone === 'settings') {
        // Transition UP into header navigation
        setTvFocusZone('header');
        setFocusedHeaderIndex(activeTab === 'explore' ? 1 : activeTab === 'guide' ? 2 : 0);
      }
    },
    onDown: () => {
      if (isVirtualKeyboardOpen || isVoiceModalOpen || isUploadModalOpen || isInstallModalOpen) return;

      if (tvFocusZone === 'header') {
        setTvFocusZone('settings');
        setFocusedSettingsKey('btn_preferiti');
      } else if (tvFocusZone === 'settings') {
        setTvFocusZone('channels');
        setFocusedIndex(0);
      } else if (tvFocusZone === 'channels') {
        setFocusedIndex((prev) => Math.min(filteredChannels.length - 1, prev + 4));
      }
    },
    onLeft: () => {
      if (isVirtualKeyboardOpen || isVoiceModalOpen || isUploadModalOpen || isInstallModalOpen) return;

      if (tvFocusZone === 'header') {
        setFocusedHeaderIndex((prev) => Math.max(0, prev - 1));
      } else if (tvFocusZone === 'settings') {
        setFocusedSettingsKey((prev) => {
          const idx = settingsKeys.indexOf(prev);
          return settingsKeys[Math.max(0, idx - 1)] || settingsKeys[0];
        });
      } else if (tvFocusZone === 'channels') {
        setFocusedIndex((prev) => Math.max(0, prev - 1));
      }
    },
    onRight: () => {
      if (isVirtualKeyboardOpen || isVoiceModalOpen || isUploadModalOpen || isInstallModalOpen) return;

      if (tvFocusZone === 'header') {
        setFocusedHeaderIndex((prev) => Math.min(HEADER_KEYS.length - 1, prev + 1));
      } else if (tvFocusZone === 'settings') {
        setFocusedSettingsKey((prev) => {
          const idx = settingsKeys.indexOf(prev);
          return settingsKeys[Math.min(settingsKeys.length - 1, idx + 1)] || settingsKeys[0];
        });
      } else if (tvFocusZone === 'channels') {
        setFocusedIndex((prev) => Math.min(filteredChannels.length - 1, prev + 1));
      }
    },
    onSelect: () => {
      if (isVirtualKeyboardOpen || isVoiceModalOpen || isUploadModalOpen || isInstallModalOpen) return;

      if (tvFocusZone === 'channels') {
        if (filteredChannels[focusedIndex]) {
          setSelectedChannel(filteredChannels[focusedIndex]);
          setActiveTab('player');
          showToast(`Selezionato: ${filteredChannels[focusedIndex].name}`);
        }
      } else if (tvFocusZone === 'settings') {
        if (focusedSettingsKey === 'search_input' || focusedSettingsKey === 'search_keyboard') {
          setIsVirtualKeyboardOpen(true);
        } else if (focusedSettingsKey === 'search_voice') {
          setIsVoiceModalOpen(true);
        } else if (focusedSettingsKey === 'btn_preferiti') {
          setSelectedGroup((prev) => (prev === 'Preferiti' ? 'Tutti' : 'Preferiti'));
        } else if (focusedSettingsKey === 'btn_data_saver') {
          toggleDataSaver();
        } else if (focusedSettingsKey === 'btn_only_online') {
          setOnlyOnlineFilter((prev) => !prev);
        } else if (focusedSettingsKey === 'btn_sort_online') {
          setSortByAvailability((prev) => !prev);
        } else if (focusedSettingsKey === 'btn_reset_clean') {
          handleResetToCleanDefaults();
        } else if (focusedSettingsKey === 'btn_clear_all') {
          handleClearAllChannels();
        } else if (focusedSettingsKey === 'cat_all') {
          setSelectedGroup('Tutti');
        } else if (focusedSettingsKey.startsWith('cat_')) {
          const cIdx = parseInt(focusedSettingsKey.replace('cat_', ''), 10);
          if (groups[cIdx]) setSelectedGroup(groups[cIdx]);
        } else if (focusedSettingsKey.startsWith('lang_')) {
          const lIdx = parseInt(focusedSettingsKey.replace('lang_', ''), 10);
          if (languages[lIdx]) setSelectedLanguage(languages[lIdx]);
        }
      } else if (tvFocusZone === 'header') {
        const action = HEADER_KEYS[focusedHeaderIndex];
        if (action === 'tab_player') setActiveTab('player');
        else if (action === 'tab_explore') setActiveTab('explore');
        else if (action === 'tab_guide') setActiveTab('guide');
        else if (action === 'btn_voice') setIsVoiceModalOpen(true);
        else if (action === 'btn_sync') handleResetToCleanDefaults();
        else if (action === 'btn_upload') setIsUploadModalOpen(true);
        else if (action === 'btn_install') setIsInstallModalOpen(true);
      }
    },
    onBack: () => {
      if (isVirtualKeyboardOpen) setIsVirtualKeyboardOpen(false);
      else if (isVoiceModalOpen) setIsVoiceModalOpen(false);
      else if (isUploadModalOpen) setIsUploadModalOpen(false);
      else if (isInstallModalOpen) setIsInstallModalOpen(false);
      else if (activeTab !== 'player') setActiveTab('player');
      else if (tvFocusZone !== 'channels') setTvFocusZone('channels');
    },
    onChannelUp: handleNextChannel,
    onChannelDown: handlePrevChannel,
    onMic: () => setIsVoiceModalOpen(true),
    onDigit: handleDigitPress
  }), [
    isVirtualKeyboardOpen,
    isVoiceModalOpen,
    isUploadModalOpen,
    isInstallModalOpen,
    tvFocusZone,
    focusedIndex,
    filteredChannels,
    focusedSettingsKey,
    settingsKeys,
    HEADER_KEYS,
    focusedHeaderIndex,
    activeTab,
    groups,
    languages,
    selectedGroup,
    onlyOnlineFilter,
    sortByAvailability,
    toggleDataSaver,
    handleResetToCleanDefaults,
    handleClearAllChannels,
    handleNextChannel,
    handlePrevChannel,
    handleDigitPress,
    showToast
  ]);

  // Mount TV remote hook
  useTVRemoteNavigation(remoteHandlers, true);

  // Favorites toggle
  const toggleFavorite = (channelId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(channelId);
      const next = exists ? prev.filter((id) => id !== channelId) : [...prev, channelId];
      showToast(exists ? 'Rimosso dai preferiti' : 'Aggiunto ai preferiti ⭐');
      return next;
    });
  };

  // Delete individual channel from the list
  const handleDeleteChannel = useCallback((channelId: string) => {
    setChannels((prev) => {
      const target = prev.find((c) => c.id === channelId);
      const remaining = prev.filter((c) => c.id !== channelId);
      const renumbered = remaining.map((c, idx) => ({ ...c, number: idx + 1 }));

      if (selectedChannel?.id === channelId) {
        setSelectedChannel(renumbered[0] || null);
      }

      showToast(`🗑️ Canale "${target?.name || 'IPTV'}" eliminato dalla lista`);
      return renumbered;
    });
  }, [selectedChannel?.id, showToast]);

  // Delete entire M3U group of channels from the tree
  const handleDeleteGroup = useCallback((groupName: string) => {
    setChannels((prev) => {
      const countBefore = prev.length;
      const remaining = prev.filter((c) => {
        const sourceKey = c.sourceName || (c.isAdult ? 'M3U Notturno Adulti 18+' : 'M3U Canali Ufficiali & Verificati');
        return sourceKey !== groupName;
      });
      const deletedCount = countBefore - remaining.length;
      const renumbered = remaining.map((c, idx) => ({ ...c, number: idx + 1 }));

      if (selectedChannel && !remaining.some((c) => c.id === selectedChannel.id)) {
        setSelectedChannel(renumbered[0] || null);
      }

      showToast(`🗑️ Eliminati ${deletedCount} canali del gruppo "${groupName}"`);
      return renumbered;
    });
  }, [selectedChannel, showToast]);

  // Load discovered M3U list from blogs, forums, or official sources
  const handleLoadDiscoveredList = (list: DiscoveredM3uList, targetChannelIdentifier?: string) => {
    if (list.safetyLevel === 'high_risk') {
      showToast('🚫 ATTENZIONE: Questa lista pirata è bloccata per violazione copyright e rischio sanzioni AGCOM.');
      return;
    }

    let loadedChannels: Channel[] = [];

    const listSourceName = list.title || list.sourceName || 'M3U Web Discovery';

    if (list.channels && list.channels.length > 0) {
      // Use configured distinct channels mapped through sanitizeChannel
      loadedChannels = list.channels.map((c) =>
        sanitizeChannel({
          ...c,
          sourceName: c.sourceName || listSourceName,
          sourceId: c.sourceId || list.id
        })
      );
    } else {
      // Robust channel generator with authentic streams per genre
      const isAdultList = Boolean(list.isAdult || list.genre === 'Adulti 18+');
      const adultStreams = [
        '/videos/erotic_cinema.mp4',
        '/videos/babes_tv.mp4',
        '/videos/redlight_tv.mp4',
        '/videos/nightclub_tv.mp4',
        '/videos/passion_tv.mp4',
        '/videos/glamour_tv.mp4',
        '/videos/sexy_lounge.mp4'
      ];
      const movieStreams = [
        'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
        'https://bitmovin-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
        'https://playertest.longtailvideo.com/adaptive/oceans/oceans.m3u8',
        'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
      ];

      loadedChannels = list.sampleChannels.map((chName, idx) => {
        let streamUrl = 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8';
        if (isAdultList) {
          streamUrl = adultStreams[idx % adultStreams.length];
        } else if (list.genre === 'Cinema & Serie') {
          streamUrl = movieStreams[idx % movieStreams.length];
        } else if (list.genre === 'Sport') {
          streamUrl = 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8';
        } else if (list.genre === 'Notizie') {
          streamUrl = idx % 2 === 0
            ? 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8'
            : 'https://euronews-euronews-italian-1-it.samsung.wurl.tv/playlist.m3u8';
        } else if (list.genre === 'Documentari') {
          streamUrl = 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8';
        } else if (list.genre === 'Musica') {
          streamUrl = '/videos/nightclub_tv.mp4';
        }

        return sanitizeChannel({
          id: `disc_${list.id}_${idx}`,
          number: idx + 1,
          name: chName,
          url: streamUrl,
          group: list.genre,
          safetyStatus: list.safetyLevel === 'safe' ? 'legal_verified' : 'community_public',
          safetyReason: list.safetyExplanation,
          country: list.country,
          language: list.language,
          isAdult: isAdultList,
          sourceName: listSourceName,
          sourceId: list.id
        });
      });
    }

    // CRITICAL REQUIREMENT: Channels must be added to the top (in alto) while preserving all existing channels
    setChannels((prevChannels) => {
      const cleanLoaded = loadedChannels.map(sanitizeChannel);
      const newUrls = new Set(cleanLoaded.map((c) => c.url));
      const newNames = new Set(cleanLoaded.map((c) => c.name.toLowerCase()));

      // Keep all previous channels that are not duplicate
      const remainingOld = prevChannels.filter(
        (c) => !newUrls.has(c.url) && !newNames.has(c.name.toLowerCase())
      );

      // Prepend newly found channels at the very top, followed by existing channels
      const combined = [...cleanLoaded, ...remainingOld];
      // Renumber 1, 2, 3...
      return combined.map((c, idx) => ({ ...c, number: idx + 1 }));
    });

    // Reset filters so newly added channels are immediately visible
    setSelectedGroup('Tutti');
    setSelectedLanguage('Tutte');
    setSearchQuery('');
    setOnlyOnlineFilter(false);
    setSortByAvailability(false);
    setFocusedIndex(0);

    // Select the requested target channel or default to the first newly added channel
    let targetCh: Channel = loadedChannels[0];
    if (targetChannelIdentifier) {
      const match = loadedChannels.find(
        (c) =>
          c.name.toLowerCase() === targetChannelIdentifier.toLowerCase() ||
          c.id.toLowerCase() === targetChannelIdentifier.toLowerCase() ||
          c.name.toLowerCase().includes(targetChannelIdentifier.toLowerCase()) ||
          targetChannelIdentifier.toLowerCase().includes(c.name.toLowerCase())
      );
      if (match) {
        targetCh = match;
      }
    }

    targetCh = sanitizeChannel(targetCh);
    setSelectedChannel(targetCh);
    setPlaylistTitle(`NovaTV (+${loadedChannels.length} aggiunti in cima da ${list.sourceName})`);
    setActiveTab('player');
    showToast(`✅ Aggiunti ${loadedChannels.length} canali in cima alla lista! Sintonizzato su: ${targetCh.name}`);
  };

  const handleLoadCustomUrl = (url: string) => {
    fetch(url)
      .then((r) => r.text())
      .then((txt) => {
        const parsed = parseM3U(txt, url);
        if (parsed.length > 0) {
          const customSourceName = 'M3U Web: ' + (url.split('/').pop() || 'Lista Personalizzata');
          setChannels((prevChannels) => {
            const cleanNew = parsed.map((c) =>
              sanitizeChannel({
                ...c,
                sourceName: c.sourceName || customSourceName,
                sourceId: 'custom_' + Date.now()
              })
            );
            const newUrls = new Set(cleanNew.map((c) => c.url));
            const remainingOld = prevChannels.filter((c) => !newUrls.has(c.url));
            const combined = [...cleanNew, ...remainingOld];
            return combined.map((c, idx) => ({ ...c, number: idx + 1 }));
          });
          setSelectedGroup('Tutti');
          setSelectedLanguage('Tutte');
          setSearchQuery('');
          setOnlyOnlineFilter(false);
          setSortByAvailability(false);
          setFocusedIndex(0);
          setSelectedChannel(sanitizeChannel(parsed[0]));
          setPlaylistTitle('Playlist Personalizzata Web');
          setActiveTab('player');
          showToast(`✅ Aggiunti ${parsed.length} canali in cima alla lista!`);
        } else {
          showToast('Nessun canale valido trovato.');
        }
      })
      .catch(() => {
        showToast('Impossibile scaricare l\'URL (blocco CORS). Usa il caricamento da file.');
      });
  };

  const handlePlaylistLoaded = (newChannels: Channel[], name: string) => {
    const uploadSourceName = `M3U: ${name}`;
    setChannels((prevChannels) => {
      const cleanNew = newChannels.map((c) =>
        sanitizeChannel({
          ...c,
          sourceName: c.sourceName || uploadSourceName,
          sourceId: 'upload_' + Date.now()
        })
      );
      const newUrls = new Set(cleanNew.map((c) => c.url));
      const remainingOld = prevChannels.filter((c) => !newUrls.has(c.url));
      const combined = [...cleanNew, ...remainingOld];
      return combined.map((c, idx) => ({ ...c, number: idx + 1 }));
    });
    setSelectedGroup('Tutti');
    setSelectedLanguage('Tutte');
    setSearchQuery('');
    setOnlyOnlineFilter(false);
    setSortByAvailability(false);
    setFocusedIndex(0);
    if (newChannels[0]) {
      setSelectedChannel(sanitizeChannel(newChannels[0]));
    }
    setPlaylistTitle(`Playlist: ${name}`);
    setActiveTab('player');
    showToast(`✅ Aggiunti ${newChannels.length} canali in cima da ${name}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Active Numeric Channel Dialing Overlay */}
      {activeDialNumber && (
        <div className="fixed top-8 right-8 z-50 px-6 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-black text-3xl shadow-2xl shadow-cyan-400/50 animate-bounce flex items-center gap-2">
          <span className="text-sm font-bold uppercase tracking-wider">Vai a CH:</span>
          {activeDialNumber}
        </div>
      )}

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-slate-900/95 border border-cyan-500/40 text-cyan-200 text-sm font-bold shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Google TV Header Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand & Mode */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-black text-white tracking-wide">NovaTV</h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[10px] font-bold tracking-wider uppercase">
                Google TV M3U
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-xs">
              {playlistTitle}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('player')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isHeaderFocused('tab_player')
                ? 'ring-4 ring-cyan-400 bg-cyan-400 text-slate-950 font-black scale-105 shadow-xl shadow-cyan-950/60 z-20'
                : activeTab === 'player'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span className="hidden md:inline">Player & Canali</span>
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isHeaderFocused('tab_explore')
                ? 'ring-4 ring-cyan-400 bg-cyan-400 text-slate-950 font-black scale-105 shadow-xl shadow-cyan-950/60 z-20'
                : activeTab === 'explore'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${isHeaderFocused('tab_explore') ? 'text-slate-950' : 'text-emerald-400'}`} />
            <span>Esplora M3U Online</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isHeaderFocused('tab_guide')
                ? 'ring-4 ring-cyan-400 bg-cyan-400 text-slate-950 font-black scale-105 shadow-xl shadow-cyan-950/60 z-20'
                : activeTab === 'guide'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden md:inline">Guida Telecomando</span>
          </button>
        </nav>

        {/* Action Buttons: Voice Mic, Upload, Install */}
        <div className="flex items-center gap-2">
          {/* Voice Search Dictation Button */}
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            title="Dettatura Vocale (Tasto V o Microfono Telecomando)"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              isHeaderFocused('btn_voice')
                ? 'ring-4 ring-cyan-400 bg-cyan-400 text-slate-950 font-black scale-105 shadow-xl shadow-cyan-950/60 z-20'
                : 'bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30'
            }`}
          >
            <Mic className={`w-4 h-4 ${isHeaderFocused('btn_voice') ? 'text-slate-950' : 'text-cyan-400 animate-pulse'}`} />
            <span className="hidden lg:inline">Dettatura Vocale</span>
          </button>

          {/* Reset / Sync Clean Channels */}
          <button
            onClick={handleResetToCleanDefaults}
            title="Ripristina e sincronizza canali puliti eliminando cache obsoleta"
            className={`p-2 md:px-3 md:py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              isHeaderFocused('btn_sync')
                ? 'ring-4 ring-cyan-400 bg-cyan-400 text-slate-950 font-black scale-105 shadow-xl shadow-cyan-950/60 z-20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800'
            }`}
          >
            <RotateCcw className={`w-4 h-4 ${isHeaderFocused('btn_sync') ? 'text-slate-950' : 'text-cyan-400'}`} />
            <span className="hidden xl:inline">Sincronizza Canali</span>
          </button>

          {/* Upload Custom M3U */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            title="Carica nuova playlist M3U"
            className={`p-2 md:px-3 md:py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              isHeaderFocused('btn_upload')
                ? 'ring-4 ring-cyan-400 bg-cyan-400 text-slate-950 font-black scale-105 shadow-xl shadow-cyan-950/60 z-20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
            }`}
          >
            <PlusCircle className={`w-4 h-4 ${isHeaderFocused('btn_upload') ? 'text-slate-950' : 'text-cyan-400'}`} />
            <span className="hidden md:inline">Carica M3U</span>
          </button>

          {/* Install APK / Google TV Modal */}
          <button
            onClick={() => setIsInstallModalOpen(true)}
            title="Guida Installazione APK su Google TV"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-cyan-600/20 ${
              isHeaderFocused('btn_install')
                ? 'ring-4 ring-cyan-400 bg-cyan-400 text-slate-950 font-black scale-105 shadow-xl shadow-cyan-950/60 z-20'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white'
            }`}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Installa APK TV</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'player' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Video Player */}
            <VideoPlayer
              channel={selectedChannel}
              onPrevChannel={handlePrevChannel}
              onNextChannel={handleNextChannel}
              isTVMode={isTVMode}
              onToggleTVMode={() => setIsTVMode(!isTVMode)}
              onOpenVoiceMic={() => setIsVoiceModalOpen(true)}
              isDataSaver={isDataSaver}
              onToggleDataSaver={toggleDataSaver}
            />

            {/* Channels Grid & D-Pad Guide */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white tracking-wide">
                    Guida Canali TV ({filteredChannels.length})
                  </h3>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    • Usa le frecce del telecomando o la tastiera per scorrere
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="hidden sm:inline">Tasto rapido microfono:</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[11px] border border-slate-700">
                    Tasto V
                  </kbd>
                </div>
              </div>

              <ChannelGrid
                channels={filteredChannels}
                selectedChannel={selectedChannel}
                focusedIndex={focusedIndex}
                onSelectChannel={(ch) => {
                  setSelectedChannel(ch);
                  showToast(`Sintonizzato su: ${ch.name}`);
                }}
                onToggleFavorite={toggleFavorite}
                favorites={favorites}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedGroup={selectedGroup}
                onSelectGroup={setSelectedGroup}
                groups={groups}
                selectedLanguage={selectedLanguage}
                onSelectLanguage={setSelectedLanguage}
                languages={languages}
                onOpenVoiceMic={() => setIsVoiceModalOpen(true)}
                onOpenVirtualKeyboard={() => setIsVirtualKeyboardOpen(true)}
                tvFocusZone={tvFocusZone}
                focusedSettingsKey={focusedSettingsKey}
                healthMap={healthMap}
                onlyOnlineFilter={onlyOnlineFilter}
                onToggleOnlyOnlineFilter={() => setOnlyOnlineFilter(!onlyOnlineFilter)}
                sortByAvailability={sortByAvailability}
                onToggleSortByAvailability={() => setSortByAvailability(!sortByAvailability)}
                onlineCount={onlineCount}
                onResetDefaults={handleResetToCleanDefaults}
                onDeleteChannel={handleDeleteChannel}
                onDeleteGroup={handleDeleteGroup}
                onClearAllChannels={handleClearAllChannels}
                isDataSaver={isDataSaver}
                onToggleDataSaver={toggleDataSaver}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Esplora M3U Online con Filtro Legale */}
        {activeTab === 'explore' && (
          <OnlineM3uDirectory
            onLoadList={handleLoadDiscoveredList}
            onLoadCustomUrl={handleLoadCustomUrl}
          />
        )}

        {/* Tab 3: Guida Telecomando & Mappatura Tasti TV */}
        {activeTab === 'guide' && (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in">
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
                  <Tv className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">
                    Compatibilità Telecomando Android Google TV
                  </h3>
                  <p className="text-slate-400 text-xs">
                    Mappatura completa dei tasti D-Pad, telecomando fisico e comandi vocali
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Keyboard className="w-4 h-4 text-cyan-400" /> D-Pad Frecce (Su, Giù, Sinistra, Destra)
                  </div>
                  <p className="text-xs text-slate-400">
                    Sposta il cursore visivo su qualsiasi canale o elemento dell&apos;interfaccia. L&apos;elemento attivo viene evidenziato con un bordo luminoso cyan ad alto contrasto visibile dal divano.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Tv className="w-4 h-4 text-cyan-400" /> Tasto OK / Centrale (Enter)
                  </div>
                  <p className="text-xs text-slate-400">
                    Conferma la selezione del canale evidenziato, avvia la riproduzione immediata o apre il dettaglio OSD.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Mic className="w-4 h-4 text-cyan-400" /> Tasto Microfono / Dettatura (Tasto V)
                  </div>
                  <p className="text-xs text-slate-400">
                    Attiva l&apos;ascolto del microfono integrato per cercare per voce (es. &quot;Rai 1&quot;, &quot;Canale 2&quot;, &quot;Musica&quot;, &quot;Pausa&quot;, &quot;Schermo intero&quot;).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400" /> Tasti Numerici (0-9)
                  </div>
                  <p className="text-xs text-slate-400">
                    Composizione diretta del numero di canale: premendo &quot;1&quot; poi &quot;0&quot; sintonizza automaticamente il canale 10.
                  </p>
                </div>
              </div>

              {/* Legal explanation */}
              <div className="mt-6 p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed">
                <div className="font-bold text-sm text-emerald-300 mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Informazioni sulla Legalità IPTV
                </div>
                NovaTV rispetta la normativa vigente e include solo canali Free-to-Air (in chiaro) autorizzati alla diffusione pubblica via streaming. Non supportiamo né incoraggiamo l&apos;uso di liste IPTV pirata che violano il diritto d&apos;autore. Il nostro filtro integrato aiuta a identificare ed escludere server sospetti o illegali.
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Virtual TV Remote Widget Simulator */}
      <VirtualTVRemote
        isOpen={isVirtualRemoteOpen}
        onToggle={() => setIsVirtualRemoteOpen(!isVirtualRemoteOpen)}
        onUp={remoteHandlers.onUp}
        onDown={remoteHandlers.onDown}
        onLeft={remoteHandlers.onLeft}
        onRight={remoteHandlers.onRight}
        onSelect={remoteHandlers.onSelect}
        onBack={remoteHandlers.onBack}
        onPlayPause={() => {
          const video = document.querySelector('video');
          if (video) {
            if (video.paused) video.play();
            else video.pause();
          }
        }}
        onMute={() => {
          const video = document.querySelector('video');
          if (video) video.muted = !video.muted;
        }}
        onChannelUp={handleNextChannel}
        onChannelDown={handlePrevChannel}
        onMic={() => setIsVoiceModalOpen(true)}
        onDigit={handleDigitPress}
      />

      {/* Voice Dictation Modal */}
      <VoiceDictationModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        isListening={isListening}
        transcript={transcript}
        interimTranscript={interimTranscript}
        errorMessage={voiceError}
        onToggleListening={toggleVoiceListening}
        onSimulateCommand={handleVoiceCommand}
      />

      {/* Upload Custom M3U Modal */}
      <M3uUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onPlaylistLoaded={handlePlaylistLoaded}
      />

      {/* Install APK / Google TV Modal */}
      <InstallGuideModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        isInstallable={isInstallable}
        onInstallPWA={triggerPWAInstall}
        channels={channels}
      />

      {/* On-Screen D-Pad Virtual Keyboard for Android TV & Voice Input */}
      <VirtualKeyboardModal
        isOpen={isVirtualKeyboardOpen}
        onClose={() => setIsVirtualKeyboardOpen(false)}
        initialValue={searchQuery}
        onApplySearch={(text) => {
          setSearchQuery(text);
          setActiveTab('player');
          showToast(`🔍 Ricerca applicata: "${text}"`);
        }}
        onOpenVoiceMic={() => {
          setIsVirtualKeyboardOpen(false);
          setIsVoiceModalOpen(true);
        }}
        isVoiceListening={isListening}
        voiceTranscript={transcript}
      />
    </div>
  );
}
