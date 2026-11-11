import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Channel } from '../types/iptv';
import {
  Tv,
  Star,
  ShieldCheck,
  AlertTriangle,
  Play,
  Radio,
  Search,
  Mic,
  Activity,
  Zap,
  CheckCircle2,
  XCircle,
  Loader2,
  SlidersHorizontal,
  RotateCcw,
  Globe,
  Trash2,
  Folder,
  FolderOpen,
  Plus,
  Minus,
  X,
  WifiOff,
  Keyboard as KeyboardIcon
} from 'lucide-react';
import { StreamHealth } from '../hooks/useStreamHealthTester';

interface ChannelGridProps {
  channels: Channel[];
  selectedChannel: Channel | null;
  focusedIndex: number;
  onSelectChannel: (channel: Channel) => void;
  onToggleFavorite: (channelId: string) => void;
  favorites: string[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedGroup: string;
  onSelectGroup: (grp: string) => void;
  groups: string[];
  selectedLanguage?: string;
  onSelectLanguage?: (lang: string) => void;
  languages?: string[];
  onOpenVoiceMic: () => void;
  onOpenVirtualKeyboard?: () => void;
  healthMap?: Record<string, StreamHealth>;
  onlyOnlineFilter?: boolean;
  onToggleOnlyOnlineFilter?: () => void;
  sortByAvailability?: boolean;
  onToggleSortByAvailability?: () => void;
  onlineCount?: number;
  onResetDefaults?: () => void;
  onDeleteChannel: (channelId: string) => void;
  onDeleteGroup: (groupName: string) => void;
  onClearAllChannels: () => void;
  isDataSaver?: boolean;
  onToggleDataSaver?: () => void;
  tvFocusZone?: 'header' | 'player_controls' | 'settings' | 'channels';
  focusedSettingsKey?: string;
}

export const ChannelGrid: React.FC<ChannelGridProps> = ({
  channels,
  selectedChannel,
  focusedIndex,
  onSelectChannel,
  onToggleFavorite,
  favorites,
  searchQuery,
  onSearchChange,
  selectedGroup,
  onSelectGroup,
  groups,
  selectedLanguage = 'Tutte',
  onSelectLanguage,
  languages = [],
  onOpenVoiceMic,
  onOpenVirtualKeyboard,
  healthMap = {},
  onlyOnlineFilter = false,
  onToggleOnlyOnlineFilter,
  sortByAvailability = false,
  onToggleSortByAvailability,
  onlineCount = 0,
  onResetDefaults,
  onDeleteChannel,
  onDeleteGroup,
  onClearAllChannels,
  isDataSaver = false,
  onToggleDataSaver,
  tvFocusZone = 'channels',
  focusedSettingsKey = ''
}) => {
  const channelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // Smooth scroll focused element into view when navigating via D-Pad
  useEffect(() => {
    if (tvFocusZone === 'channels' && focusedIndex >= 0 && channelRefs.current[focusedIndex]) {
      channelRefs.current[focusedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [focusedIndex, tvFocusZone]);

  // Group channels by their M3U source / playlist for tree view
  const groupedChannels = useMemo(() => {
    const map = new Map<string, { name: string; channels: Channel[] }>();

    channels.forEach((ch) => {
      const sourceKey = ch.sourceName || (ch.isAdult ? 'M3U Notturno Adulti 18+' : 'M3U Canali Ufficiali & Verificati');
      if (!map.has(sourceKey)) {
        map.set(sourceKey, { name: sourceKey, channels: [] });
      }
      map.get(sourceKey)!.channels.push(ch);
    });

    return Array.from(map.values());
  }, [channels]);

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  const expandAllGroups = () => {
    setCollapsedGroups(new Set());
  };

  const collapseAllGroups = () => {
    setCollapsedGroups(new Set(groupedChannels.map((g) => g.name)));
  };

  const isSettingFocused = (key: string) => tvFocusZone === 'settings' && focusedSettingsKey === key;

  return (
    <div className="space-y-4">
      {/* Top Filter & Search Bar with Preferiti and Risparmio Banda WiFi IN ALTO */}
      <div className="space-y-3 bg-slate-900/90 p-3.5 md:p-4 rounded-2xl border border-slate-800 shadow-lg">
        {/* UPPER ROW: Search Input + PREFERITI + RISPARMIO BANDA WIFI + Availability Toggles */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search input with integrated TV Virtual Keyboard & Mic */}
          <div
            id="nav-search_input"
            className={`relative flex-1 rounded-xl transition-all ${
              isSettingFocused('search_input')
                ? 'ring-4 ring-cyan-400 scale-[1.01] shadow-lg shadow-cyan-500/30'
                : ''
            }`}
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cerca canale... (apri tastiera o premi OK)"
              value={searchQuery}
              onClick={onOpenVirtualKeyboard}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-36 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-cyan-400 cursor-pointer"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                id="nav-search_keyboard"
                type="button"
                onClick={onOpenVirtualKeyboard}
                title="Apri Tastiera Virtuale TV (Telecomando D-Pad)"
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer ${
                  isSettingFocused('search_keyboard')
                    ? 'ring-4 ring-cyan-400 bg-cyan-400 text-slate-950 font-black'
                    : 'bg-slate-800 hover:bg-slate-700 text-cyan-300'
                }`}
              >
                <KeyboardIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tastiera</span>
              </button>

              <button
                id="nav-search_voice"
                type="button"
                onClick={onOpenVoiceMic}
                title="Dettatura Vocale (Tasto V o Microfono Telecomando)"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer ${
                  isSettingFocused('search_voice')
                    ? 'ring-4 ring-cyan-400 bg-cyan-400 text-slate-950 font-black'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Voce</span>
              </button>
            </div>
          </div>

          {/* UPPER ACTION BUTTONS: PREFERITI e RISPARMIO BANDA WIFI messi DI SOPRA di fianco a preferiti! */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* ⭐ PREFERITI (Di sopra) */}
            <button
              id="nav-btn_preferiti"
              type="button"
              onClick={() => onSelectGroup(selectedGroup === 'Preferiti' ? 'Tutti' : 'Preferiti')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                isSettingFocused('btn_preferiti')
                  ? 'ring-4 ring-cyan-400 bg-amber-400 text-slate-950 font-black scale-105 shadow-xl'
                  : selectedGroup === 'Preferiti'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-amber-400/30 ring-2 ring-amber-300'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-amber-300'
              }`}
              title="Filtra e mostra solo i canali salvati nei Preferiti"
            >
              <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>Preferiti ({favorites.length})</span>
            </button>

            {/* 📶 RISPARMIO BANDA WIFI (Di sopra di fianco a preferiti e NON nelle categorie) */}
            {onToggleDataSaver && (
              <button
                id="nav-btn_data_saver"
                type="button"
                onClick={onToggleDataSaver}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                  isSettingFocused('btn_data_saver')
                    ? 'ring-4 ring-cyan-400 bg-amber-400 text-slate-950 font-black scale-105 shadow-xl'
                    : isDataSaver
                    ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/30 ring-2 ring-amber-300'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-amber-300'
                }`}
                title="Risparmio dati mobile (No Wi-Fi): sospende lo streaming continuo a meno che non si prema Play"
              >
                <WifiOff className={`w-3.5 h-3.5 ${isDataSaver ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>Risparmio Banda {isDataSaver ? 'ATTIVO (No WiFi)' : 'OFF'}</span>
              </button>
            )}

            {/* Solo Attivi Ora */}
            {onToggleOnlyOnlineFilter && (
              <button
                id="nav-btn_only_online"
                type="button"
                onClick={onToggleOnlyOnlineFilter}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                  isSettingFocused('btn_only_online')
                    ? 'ring-4 ring-cyan-400 bg-emerald-500 text-slate-950 font-black scale-105 shadow-xl'
                    : onlyOnlineFilter
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
                title="Mostra solo canali testati come attivi e funzionanti adesso"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Solo Attivi</span>
                {onlineCount > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${onlyOnlineFilter ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'}`}>
                    {onlineCount}
                  </span>
                )}
              </button>
            )}

            {/* In Cima Attivi */}
            {onToggleSortByAvailability && (
              <button
                id="nav-btn_sort_online"
                type="button"
                onClick={onToggleSortByAvailability}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isSettingFocused('btn_sort_online')
                    ? 'ring-4 ring-cyan-400 bg-cyan-400 text-slate-950 font-black scale-105 shadow-xl'
                    : sortByAvailability
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
                title="Ordina la lista mettendo in cima i canali funzionanti"
              >
                <Activity className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">In Cima Attivi</span>
              </button>
            )}

            {/* Ripristina Canali */}
            {onResetDefaults && (
              <button
                id="nav-btn_reset_clean"
                type="button"
                onClick={onResetDefaults}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isSettingFocused('btn_reset_clean')
                    ? 'ring-4 ring-cyan-400 bg-cyan-400 text-slate-950 font-black scale-105 shadow-xl'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800'
                }`}
                title="Ripristina la lista canali iniziale pulita e cancella cache memorizzata obsoleta"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">Ripristina</span>
              </button>
            )}
          </div>
        </div>

        {/* LOWER ROW: CATEGORIES ONLY (TUTTI, NOTIZIE, SPORT, CINEMA, 18+...) - NO PREFERITI E NO RISPARMIO BANDA */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            id="nav-cat_all"
            type="button"
            onClick={() => onSelectGroup('Tutti')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              isSettingFocused('cat_all')
                ? 'ring-4 ring-cyan-400 bg-cyan-400 text-slate-950 font-black scale-105 shadow-xl'
                : selectedGroup === 'Tutti'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            Tutti i Canali ({channels.length})
          </button>
          {groups.map((grp, gIdx) => (
            <button
              key={grp}
              id={`nav-cat_${gIdx}`}
              type="button"
              onClick={() => onSelectGroup(grp)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isSettingFocused(`cat_${gIdx}`)
                  ? 'ring-4 ring-cyan-400 bg-cyan-400 text-slate-950 font-black scale-105 shadow-xl'
                  : selectedGroup === grp
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {grp === 'Adulti 18+' ? '🔞 Adulti 18+' : grp}
            </button>
          ))}
        </div>

        {/* Language Filter Pills */}
        {languages && languages.length > 1 && onSelectLanguage && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 border-t border-slate-800/80 scrollbar-thin">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> Lingua:
            </span>
            {languages.map((lng, lIdx) => {
              const flag =
                lng === 'Italiano' ? '🇮🇹' :
                lng === 'Inglese' ? '🇬🇧' :
                lng === 'Spagnolo' ? '🇪🇸' :
                lng === 'Francese' ? '🇫🇷' :
                lng === 'Tedesco' ? '🇩🇪' :
                lng === 'Multi-lingua' ? '🌐' : '🏳️';

              return (
                <button
                  key={lng}
                  id={`nav-lang_${lIdx}`}
                  type="button"
                  onClick={() => onSelectLanguage(lng)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                    isSettingFocused(`lang_${lIdx}`)
                      ? 'ring-4 ring-cyan-400 bg-blue-500 text-white font-black scale-105 shadow-xl'
                      : selectedLanguage === lng
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span>{flag}</span>
                  <span>{lng}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tree View Controls & Global Clear Button on the Left */}
      <div className="flex items-center justify-between px-2 pt-1">
        <div className="flex items-center gap-2">
          {/* X SEMPRE A SINISTRA PER CANCELLARE TUTTO L'ELENCO */}
          <button
            id="nav-btn_clear_all"
            type="button"
            onClick={onClearAllChannels}
            title="Cancella tutto l'elenco dei canali IPTV"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer ${
              isSettingFocused('btn_clear_all')
                ? 'ring-4 ring-cyan-400 bg-red-600 text-white font-black scale-105 shadow-xl'
                : 'bg-red-950/60 hover:bg-red-900/90 text-red-300 hover:text-white border-red-500/40'
            }`}
          >
            <X className="w-4 h-4 text-red-400" />
            <span>Cancella Tutto l'Elenco</span>
          </button>

          {/* Quick expand/collapse all tree groups */}
          {groupedChannels.length > 1 && (
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-0.5">
              <button
                type="button"
                onClick={expandAllGroups}
                className="px-2 py-1 text-[11px] font-bold text-slate-300 hover:text-cyan-300 transition cursor-pointer"
                title="Espandi tutti i gruppi M3U"
              >
                + Espandi Tutti
              </button>
              <span className="text-slate-700">|</span>
              <button
                type="button"
                onClick={collapseAllGroups}
                className="px-2 py-1 text-[11px] font-bold text-slate-400 hover:text-white transition cursor-pointer"
                title="Chiudi tutti i gruppi M3U"
              >
                − Chiudi Tutti
              </button>
            </div>
          )}
        </div>

        {/* Channels Counter summary */}
        <div className="text-xs text-slate-400 font-semibold">
          Canali: <span className="text-white font-bold">{channels.length}</span>
          {onlineCount > 0 && (
            <span className="ml-2 text-emerald-400 font-bold">
              • {onlineCount} Attivi
            </span>
          )}
        </div>
      </div>

      {/* Channels Tree / Accordion View */}
      {channels.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
          <Tv className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-white mb-1">Nessun Canale Presente</h4>
          <p className="text-slate-400 text-xs max-w-sm mx-auto mb-4">
            L'elenco canali è vuoto o nessun canale corrisponde alla ricerca. Puoi ripristinare i canali predefiniti o cercarne di nuovi.
          </p>
          <div className="flex items-center justify-center gap-3">
            {onResetDefaults && (
              <button
                onClick={onResetDefaults}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-md shadow-cyan-600/30 cursor-pointer"
              >
                Ripristina Canali Predefiniti
              </button>
            )}
            <button
              onClick={() => {
                onSearchChange('');
                onSelectGroup('Tutti');
                if (onlyOnlineFilter && onToggleOnlyOnlineFilter) onToggleOnlyOnlineFilter();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              Azzera Filtri
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1 pb-4 scrollbar-thin">
          {groupedChannels.map((group) => {
            const isCollapsed = collapsedGroups.has(group.name);
            const onlineInGroup = group.channels.filter((c) => healthMap[c.id]?.status === 'online').length;

            return (
              <div
                key={group.name}
                className="rounded-2xl border border-slate-800/90 bg-slate-900/40 overflow-hidden shadow-md"
              >
                {/* M3U Group Tree Header: + / - on the left & X on the left to delete entire group */}
                <div className="flex items-center justify-between px-3 py-2.5 bg-slate-900/90 border-b border-slate-800">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* + or - Button for Tree view expansion/collapse on the left */}
                    <button
                      type="button"
                      onClick={() => toggleGroupCollapse(group.name)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 flex items-center justify-center font-black text-sm border border-slate-700 transition cursor-pointer shrink-0"
                      title={isCollapsed ? 'Espandi lista M3U (+)' : 'Chiudi/comprimi lista M3U (−)'}
                    >
                      {isCollapsed ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                    </button>

                    {/* X on the left to delete the whole group / M3U list */}
                    <button
                      type="button"
                      onClick={() => onDeleteGroup(group.name)}
                      className="w-7 h-7 rounded-lg bg-red-950/70 hover:bg-red-600 text-red-300 hover:text-white flex items-center justify-center font-bold text-xs border border-red-500/30 transition cursor-pointer shrink-0"
                      title={`Cancella tutti i ${group.channels.length} canali di questa lista M3U (${group.name})`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Group Title and channel badge */}
                    <div
                      onClick={() => toggleGroupCollapse(group.name)}
                      className="flex items-center gap-2 truncate cursor-pointer select-none"
                    >
                      <Folder className="w-4 h-4 text-cyan-400 shrink-0" />
                      <h4 className="text-sm font-bold text-white truncate hover:text-cyan-300 transition">
                        {group.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold shrink-0">
                        {group.channels.length} canali
                      </span>
                      {onlineInGroup > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold shrink-0">
                          {onlineInGroup} attivi
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right side of header: quick expand click */}
                  <button
                    type="button"
                    onClick={() => toggleGroupCollapse(group.name)}
                    className="text-xs text-slate-400 hover:text-cyan-300 transition shrink-0 cursor-pointer"
                  >
                    {isCollapsed ? 'Espandi +' : 'Comprimi −'}
                  </button>
                </div>

                {/* Channels Cards Grid inside this M3U Group */}
                {!isCollapsed && (
                  <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {group.channels.map((ch, idx) => {
                      const isPlaying = selectedChannel?.id === ch.id;
                      const globalIdx = channels.findIndex((c) => c.id === ch.id);
                      const isFocused = tvFocusZone === 'channels' && globalIdx === focusedIndex;
                      const isFav = favorites.includes(ch.id);
                      const health = healthMap[ch.id];

                      // Latency rule: if online and ping > 200ms => Giallo (Yellow)
                      const isOnline = health?.status === 'online';
                      const ping = health?.pingMs ?? 0;
                      const isSlow = isOnline && ping > 200;

                      return (
                        <div
                          key={ch.id || `ch_${idx}`}
                          ref={(el) => {
                            if (globalIdx >= 0) channelRefs.current[globalIdx] = el;
                          }}
                          onClick={() => onSelectChannel(ch)}
                          tabIndex={0}
                          className={`relative group cursor-pointer p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-2.5 select-none ${
                            isFocused
                              ? 'ring-4 ring-cyan-400 bg-cyan-950/70 border-cyan-400 text-white scale-[1.03] shadow-xl shadow-cyan-950/60 z-20'
                              : isPlaying
                              ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-950/20'
                              : 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          {/* Left: Number & Logo & Live Status indicator */}
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            {/* Channel Number with Ping / Availability Indicator */}
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 relative ${
                                isPlaying
                                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                                  : isFocused
                                  ? 'bg-cyan-400 text-slate-950'
                                  : 'bg-slate-900 text-slate-400 border border-slate-800'
                              }`}
                            >
                              {isPlaying ? <Play className="w-3.5 h-3.5 fill-current" /> : ch.number}

                              {/* Live Availability Dot: Giallo se > 200ms, Verde se <= 200ms */}
                              {isOnline && !isSlow && (
                                <span
                                  title={`Canale Attivo Veloce (Ping: ${ping}ms <= 200ms)`}
                                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-md animate-pulse"
                                />
                              )}
                              {isOnline && isSlow && (
                                <span
                                  title={`Canale Attivo Latenza Elevata (Ping: ${ping}ms > 200ms)`}
                                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-slate-950 shadow-md shadow-amber-400/50 animate-pulse"
                                />
                              )}
                              {health?.status === 'checking' && (
                                <span
                                  title="Verifica disponibilità in corso..."
                                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-950 animate-ping"
                                />
                              )}
                              {health?.status === 'offline' && (
                                <span
                                  title="Flusso momentaneamente offline"
                                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-slate-950 opacity-80"
                                />
                              )}
                            </div>

                            {/* Logo or placeholder icon */}
                            <div className="w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden relative">
                              {ch.logo ? (
                                <img
                                  src={ch.logo}
                                  alt={ch.name}
                                  className="max-h-full max-w-full object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : ch.isRadio ? (
                                <Radio className="w-4 h-4 text-purple-400" />
                              ) : (
                                <Tv className="w-4 h-4 text-slate-500" />
                              )}
                            </div>

                            {/* Title & Group & Live Signal */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs md:text-sm font-bold text-white truncate group-hover:text-cyan-300 transition">
                                  {ch.name}
                                </h4>
                                {ch.isAdult && (
                                  <span className="px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 text-[9px] font-black border border-pink-500/40 shrink-0">
                                    18+
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 flex-wrap">
                                <span className="truncate max-w-[80px] px-1 py-0.2 rounded bg-slate-900 text-slate-300">{ch.group || 'Generale'}</span>
                                {ch.language && (
                                  <span className="truncate max-w-[60px] px-1 py-0.2 rounded bg-blue-950/60 border border-blue-500/30 text-blue-300">
                                    {ch.language === 'Italiano' ? '🇮🇹 IT' :
                                     ch.language === 'Inglese' ? '🇬🇧 EN' :
                                     ch.language === 'Spagnolo' ? '🇪🇸 ES' :
                                     ch.language === 'Francese' ? '🇫🇷 FR' :
                                     ch.language === 'Tedesco' ? '🇩🇪 DE' : '🌐 Multi'}
                                  </span>
                                )}

                                {/* Live ping or availability text: Giallo se > 200ms */}
                                {isOnline && !isSlow && (
                                  <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>{ping ? `${ping}ms` : 'Attivo'}</span>
                                  </span>
                                )}
                                {isOnline && isSlow && (
                                  <span className="text-amber-400 font-bold flex items-center gap-1 shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                    <span>Lento {ping}ms</span>
                                  </span>
                                )}
                                {health?.status === 'checking' && (
                                  <span className="text-cyan-400 flex items-center gap-0.5 shrink-0">
                                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                    <span>Test...</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right Controls: Star / Favorite button + Delete Channel Button */}
                          <div className="flex items-center gap-0.5 shrink-0">
                            {/* Star / Favorite button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite(ch.id);
                              }}
                              title={isFav ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                              className={`p-1.5 rounded-lg transition cursor-pointer ${
                                isFav
                                  ? 'text-amber-400 hover:text-amber-300'
                                  : 'text-slate-600 hover:text-slate-300 opacity-60 group-hover:opacity-100'
                              }`}
                            >
                              <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                            </button>

                            {/* PULSANTE DI FIANCO A OGNI IPTV PER CANCELLARLA DALLA LISTA */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteChannel(ch.id);
                              }}
                              title="Cancella questa IPTV dalla lista"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition opacity-60 group-hover:opacity-100 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
