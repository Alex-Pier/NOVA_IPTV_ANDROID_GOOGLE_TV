import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DiscoveredM3uList, M3uGenre, M3uLanguage, SafetyAuditResult } from '../types/iptv';
import { ALL_WEB_M3U_SOURCES } from '../utils/m3uWebCrawler';
import { analyzeSafety } from '../utils/m3uParser';
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  Play,
  Globe,
  Radio,
  Layers,
  CheckCircle,
  XCircle,
  ExternalLink,
  Flame,
  Check,
  RefreshCw,
  Loader2,
  ShieldAlert,
  Plus
} from 'lucide-react';

interface OnlineM3uDirectoryProps {
  onLoadList: (list: DiscoveredM3uList, targetChannelIdentifier?: string) => void;
  onLoadCustomUrl: (url: string) => void;
}

export const OnlineM3uDirectory: React.FC<OnlineM3uDirectoryProps> = ({
  onLoadList,
  onLoadCustomUrl
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('Tutti');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Tutte');
  // Default to false so all sources, including non-official & adult 18+, are found without requiring a checkbox!
  const [strictLegalOnly, setStrictLegalOnly] = useState<boolean>(false);
  const [selectedSourceType, setSelectedSourceType] = useState<string>('Tutte');

  const [discoveredLists, setDiscoveredLists] = useState<DiscoveredM3uList[]>(ALL_WEB_M3U_SOURCES);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);

  // Custom URL analyzer state
  const [customInputUrl, setCustomInputUrl] = useState('');
  const [auditResult, setAuditResult] = useState<SafetyAuditResult | null>(null);

  const genres: (M3uGenre | 'Tutti')[] = [
    'Tutti',
    'Notizie',
    'Sport',
    'Cinema & Serie',
    'Musica',
    'Documentari',
    'Bambini & Ragazzi',
    'Intrattenimento',
    'Cultura & Scienza',
    'Adulti 18+',
    'Generale'
  ];

  const languages: (M3uLanguage | 'Tutte')[] = [
    'Tutte',
    'Italiano',
    'Inglese',
    'Spagnolo',
    'Francese',
    'Tedesco',
    'Multi-lingua'
  ];

  const sourceTypes = [
    { id: 'Tutte', label: 'Tutte le Fonti' },
    { id: 'blog', label: '📰 Blog Tech & Articoli' },
    { id: 'official_site', label: '🏛️ Broadcaster Ufficiali' },
    { id: 'forum', label: '💬 Forum & Community' },
    { id: 'pastebin', label: '📋 Pastebin & Web Paste' }
  ];

  // Perform search against backend API (Native search, no AI)
  const handlePerformOnlineSearch = useCallback(async (query: string) => {
    setIsSearchingOnline(true);
    try {
      const res = await fetch('/api/search-m3u-online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          filterSafeOnly: strictLegalOnly,
          selectedGenre,
          selectedLanguage
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.results && Array.isArray(data.results)) {
          setDiscoveredLists(data.results);
        }
      }
    } catch (err) {
      console.warn('Online search fetch error, falling back to local dataset:', err);
    } finally {
      setIsSearchingOnline(false);
    }
  }, [strictLegalOnly, selectedGenre, selectedLanguage]);

  // Trigger search on query change or filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      handlePerformOnlineSearch(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, handlePerformOnlineSearch]);

  // Client-side filtering on active source type
  const displayLists = useMemo(() => {
    return discoveredLists.filter((item) => {
      // Source type filter
      if (selectedSourceType !== 'Tutte' && item.sourceType !== selectedSourceType) {
        return false;
      }
      // Strict legal filter (only if checked)
      if (strictLegalOnly && !item.isLegalVerified) {
        return false;
      }
      // Genre filter
      if (selectedGenre !== 'Tutti' && item.genre !== selectedGenre) {
        return false;
      }
      // Language filter
      if (selectedLanguage !== 'Tutte' && item.language !== selectedLanguage) {
        return false;
      }
      return true;
    });
  }, [discoveredLists, selectedSourceType, strictLegalOnly, selectedGenre, selectedLanguage]);

  const handleAuditCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputUrl.trim()) return;
    const res = analyzeSafety(customInputUrl.trim());
    setAuditResult(res);
  };

  const handleLoadCustom = () => {
    if (!customInputUrl.trim()) return;
    onLoadCustomUrl(customInputUrl.trim());
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Search Discovery Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Globe className="w-4 h-4 text-cyan-400" />
            Motore di Ricerca M3U da Blog, Web & Community
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide">
            Cerca Liste M3U Online (Canali Ufficiali, Non Ufficiali & Adulti 18+)
          </h2>
          <p className="text-slate-300 text-sm md:text-base mt-2 leading-relaxed">
            Esplora le liste IPTV condivise su <strong>blog tecnologici, forum aperti, canali non ufficiali, canali per adulti 18+ e portali broadcast</strong>.
            Tutte le liste vengono categorizzate automaticamente per <strong>Genere</strong> e <strong>Lingua</strong> in base alla descrizione.
          </p>

          {/* Quick Filter: Certificato Ufficiale (Opzionale) */}
          <div className="mt-5 flex flex-wrap items-center gap-4 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 w-fit">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={strictLegalOnly}
                onChange={(e) => setStrictLegalOnly(e.target.checked)}
                className="w-5 h-5 rounded-md accent-emerald-500 cursor-pointer"
              />
              <div>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Mostra SOLO canali certificati ufficiali (FTA)
                </span>
                <span className="text-xs text-slate-400 block">
                  {strictLegalOnly
                    ? 'Attivo: filtra solo canali statali e commerciali con licenza formale'
                    : 'Disattivato (Predefinito): mostra TUTTI i canali trovati sul web, inclusi non ufficiali e 18+'}
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Main Text Search Bar */}
      <div className="bg-slate-900/90 p-4 md:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePerformOnlineSearch(searchQuery);
          }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cerca da testo... (es. 'film gratis blog', 'adulti 18+', 'sport red bull', 'canali non ufficiali', 'notizie')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm md:text-base focus:outline-hidden focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 shadow-inner"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isSearchingOnline && (
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            )}
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-sm"
            >
              Cerca
            </button>
          </div>
        </form>

        {/* Filters Grid: Genre, Language, Source Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
          {/* Genre Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Filtra per Genere:
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold focus:outline-hidden focus:border-cyan-400 cursor-pointer"
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g === 'Adulti 18+' ? '🔞 Adulti 18+' : g}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Filtra per Lingua / Nazione:
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold focus:outline-hidden focus:border-cyan-400 cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Source Type Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Tipo di Fonte Web:
            </label>
            <select
              value={selectedSourceType}
              onChange={(e) => setSelectedSourceType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold focus:outline-hidden focus:border-cyan-400 cursor-pointer"
            >
              {sourceTypes.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-400 text-[11px]">Ricerche popolari da blog:</span>
          {[
            'Digitale Terrestre Italia',
            'Adulti 18+',
            'Sport Red Bull',
            'Canali Non Ufficiali',
            'World News English',
            'Film Classici Open'
          ].map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setSearchQuery(chip);
                handlePerformOnlineSearch(chip);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-cyan-300 text-[11px] border border-slate-800 transition"
            >
              {chip === 'Adulti 18+' ? '🔞 Adulti 18+' : chip}
            </button>
          ))}
        </div>
      </div>

      {/* Discovered Lists Results Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">
          Liste M3U Trovate Online ({displayLists.length})
        </h3>
        <div className="text-xs text-slate-400">
          Categorizzazione automatica basata sulla descrizione
        </div>
      </div>

      {/* Discovered Lists Grid */}
      {displayLists.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
          <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-white mb-1">Nessuna lista trovata per questi criteri</h4>
          <p className="text-slate-400 text-xs max-w-sm mx-auto mb-4">
            Prova a modificare i termini di ricerca o disattivare la spunta dei canali certificati.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('Tutti');
              setSelectedLanguage('Tutte');
              setSelectedSourceType('Tutte');
              setStrictLegalOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Resetta Filtri
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayLists.map((list) => {
            const isSafe = list.safetyLevel === 'safe';
            const isCaution = list.safetyLevel === 'caution';
            const isAdult = list.isAdult || list.genre === 'Adulti 18+';

            return (
              <div
                key={list.id}
                className={`flex flex-col justify-between p-6 rounded-3xl bg-slate-900/80 border transition-all hover:-translate-y-1 hover:shadow-2xl ${
                  isAdult
                    ? 'border-pink-500/30 bg-pink-950/10 hover:border-pink-500/60'
                    : isSafe
                    ? 'border-slate-800 hover:border-cyan-500/50 hover:shadow-cyan-950/20'
                    : isCaution
                    ? 'border-amber-500/30 bg-amber-950/10'
                    : 'border-red-500/30 bg-red-950/10'
                }`}
              >
                <div>
                  {/* Top Bar: Source Type, Country Flag, Safety/Adult Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{list.flag}</span>
                      <div>
                        <span className="text-xs font-bold text-slate-200 block truncate max-w-[130px]">
                          {list.sourceName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {list.sourceType === 'blog'
                            ? 'Articolo Blog'
                            : list.sourceType === 'official_site'
                            ? 'Sito Ufficiale'
                            : list.sourceType === 'forum'
                            ? 'Forum Community'
                            : 'Pastebin Web'}
                        </span>
                      </div>
                    </div>

                    {/* Badge */}
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shrink-0 ${
                        isAdult
                          ? 'bg-pink-500/15 text-pink-300 border border-pink-500/40'
                          : isSafe
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                          : isCaution
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          : 'bg-red-500/10 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {isAdult ? (
                        <span>🔞 18+</span>
                      ) : isSafe ? (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isCaution ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-400" />
                      )}
                      {list.safetyBadge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base md:text-lg font-bold text-white mb-2 leading-snug">
                    {list.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {list.description}
                  </p>

                  {/* Automatic Categorization Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                      isAdult
                        ? 'bg-pink-950/60 text-pink-300 border border-pink-500/40'
                        : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      <Layers className="w-3 h-3" /> Genere: {list.genre}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-[11px] font-semibold flex items-center gap-1">
                      <Globe className="w-3 h-3 text-cyan-400" /> Lingua: {list.language}
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-slate-950 text-slate-400 border border-slate-800 text-[11px]">
                      {list.channelCount} Canali
                    </span>
                  </div>

                  {/* Sample Channels Preview - Clickable to directly tune into channel */}
                  {list.sampleChannels.length > 0 && (
                    <div className="mb-4">
                      <div className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider flex items-center justify-between">
                        <span>Canali nel Flusso (Aggiungi in Cima):</span>
                        <span className="text-[10px] text-cyan-400 font-bold">+ In Cima e Riproduci ▶</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {list.sampleChannels.map((ch, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onLoadList(list, ch);
                            }}
                            title={`Aggiunge "${ch}" in cima alla lista e riproduce`}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-cyan-500/20 hover:text-cyan-200 hover:border-cyan-400/50 text-slate-300 text-[11px] font-semibold border border-slate-800 transition flex items-center gap-1.5 cursor-pointer group active:scale-95 shadow-sm"
                          >
                            <Plus className="w-3 h-3 text-cyan-400 group-hover:scale-125 transition shrink-0 stroke-[3]" />
                            <span className="truncate max-w-[150px]">{ch}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Safety Explanation Box */}
                  <div
                    className={`p-3 rounded-2xl text-[11px] leading-relaxed mb-4 border ${
                      isAdult
                        ? 'bg-pink-950/20 border-pink-500/30 text-pink-200'
                        : isSafe
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                        : isCaution
                        ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                        : 'bg-red-950/20 border-red-500/30 text-red-200'
                    }`}
                  >
                    <span className="font-bold">Informazioni sul Flusso: </span>
                    {list.safetyExplanation}
                  </div>
                </div>

                {/* Bottom Action: Add channels to top and play */}
                <div>
                  <button
                    onClick={() => onLoadList(list)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                      isAdult
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-lg shadow-pink-600/30'
                        : isSafe
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-600/25 active:scale-98'
                        : isCaution
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-red-600 hover:bg-red-500 text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    {isAdult
                      ? `Aggiungi Canali 18+ in Cima (+${list.channelCount || list.sampleChannels.length})`
                      : isSafe
                      ? `Aggiungi Canali in Cima (+${list.channelCount || list.sampleChannels.length})`
                      : isCaution
                      ? `Aggiungi Canali Web in Cima (+${list.channelCount || list.sampleChannels.length})`
                      : 'Visualizza Avviso di Blocco'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* URL Safety Analyzer Section */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl mt-10">
        <div className="flex items-center gap-2.5 mb-2">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">
            Analizzatore di Sicurezza per Qualsiasi URL Esterno o Trovato sul Web
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Hai trovato un link .m3u o .m3u8 su un blog o post social? Incollalo per verificare crittografia SSL, autenticità dell&apos;host e assenza di server pirata illegali.
        </p>

        <form onSubmit={handleAuditCustomUrl} className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            placeholder="Incolla URL playlist M3U (es. https://emittente.it/canali.m3u o stream.m3u8)..."
            value={customInputUrl}
            onChange={(e) => setCustomInputUrl(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition shadow-lg shadow-cyan-600/20 whitespace-nowrap flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Scansione Sicurezza
          </button>
        </form>

        {auditResult && (
          <div className="mt-5 p-5 rounded-2xl bg-slate-950 border border-slate-800 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                    auditResult.verdict === 'SAFE_LEGAL'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : auditResult.verdict === 'COMMUNITY_UNVERIFIED'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-red-500/20 text-red-400 border border-red-500/40'
                  }`}
                >
                  {auditResult.score}%
                </div>
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    {auditResult.title}
                  </h4>
                  <p className="text-xs text-slate-400">{auditResult.description}</p>
                </div>
              </div>

              {auditResult.score >= 40 && (
                <button
                  type="button"
                  onClick={handleLoadCustom}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Carica e Guarda nel Player
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {auditResult.checks.map((check, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-start gap-2.5">
                  {check.passed ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">{check.name}</span>
                    <span className="text-[11px] text-slate-400">{check.details}</span>
                  </div>
                </div>
              ))}
            </div>

            {auditResult.recommendations.length > 0 && (
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>{auditResult.recommendations[0]}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
