import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { Channel, PlayerStats } from '../types/iptv';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Radio,
  Tv,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Layers,
  Settings,
  PictureInPicture,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Scan,
  WifiOff
} from 'lucide-react';

interface VideoPlayerProps {
  channel: Channel | null;
  onPrevChannel?: () => void;
  onNextChannel?: () => void;
  isTVMode?: boolean;
  onToggleTVMode?: () => void;
  onOpenVoiceMic?: () => void;
  isDataSaver?: boolean;
  onToggleDataSaver?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  channel,
  onPrevChannel,
  onNextChannel,
  isTVMode,
  onOpenVoiceMic,
  isDataSaver = false,
  onToggleDataSaver
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const osdTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOSD, setShowOSD] = useState(true);
  const [screenFit, setScreenFit] = useState<'contain' | 'cover' | 'fill'>('cover');
  const [fitToast, setFitToast] = useState<string | null>(null);
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [stats, setStats] = useState<PlayerStats>({});
  const [availableQualities, setAvailableQualities] = useState<{ id: number; height: number; name: string }[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<number>(-1); // -1 = auto
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // Update clock for TV OSD
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTimeStr(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show OSD helper
  const triggerOSD = useCallback(() => {
    setShowOSD(true);
    if (osdTimerRef.current) clearTimeout(osdTimerRef.current);
    osdTimerRef.current = setTimeout(() => {
      setShowOSD(false);
    }, 4500);
  }, []);

  // Auto show OSD on channel change
  useEffect(() => {
    triggerOSD();
  }, [channel?.id, triggerOSD]);

  // Load and play stream with Hls.js or native video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Immediately stop and detach any previous stream to prevent audio/video residue
    video.pause();
    video.removeAttribute('src');
    video.load();

    if (!channel) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      setIsPlaying(false);
      setIsBuffering(false);
      return;
    }

    setHasError(false);
    setErrorMessage('');
    setIsBuffering(true);
    setIsPlaying(false);
    setAvailableQualities([]);
    setStats({});

    // Destroy existing Hls instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const streamUrl = channel.url;
    const isDirectMp4 = streamUrl.endsWith('.mp4') || streamUrl.includes('.mp4') || streamUrl.startsWith('/videos/');

    if (isDirectMp4) {
      video.loop = true;
      video.src = streamUrl;
      video.load();

      const onCanPlay = () => {
        setIsBuffering(false);
        setStats({
          resolution: `${video.videoWidth || 1280}x${video.videoHeight || 720}`,
          fps: 25
        });
        if (isDataSaver) {
          setIsPlaying(false);
          return;
        }
        video.play().then(() => setIsPlaying(true)).catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => setIsPlaying(true)).catch(console.warn);
        });
      };

      if (video.readyState >= 2) {
        onCanPlay();
      } else {
        video.addEventListener('canplay', onCanPlay, { once: true });
        video.addEventListener('loadeddata', onCanPlay, { once: true });
      }

      return () => {
        video.removeEventListener('canplay', onCanPlay);
        video.removeEventListener('loadeddata', onCanPlay);
        video.pause();
        video.removeAttribute('src');
        video.load();
      };
    }

    const isHlsSupported = Hls.isSupported();
    const isNativeHls = video.canPlayType('application/vnd.apple.mpegurl') !== '';

    if (isHlsSupported) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        liveSyncDurationCount: 3,
        xhrSetup: (xhr) => {
          xhr.withCredentials = false;
        }
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setIsBuffering(false);
        const qualities = data.levels.map((lvl, index) => ({
          id: index,
          height: lvl.height,
          name: lvl.height ? `${lvl.height}p` : `Qualità ${index + 1}`
        }));
        setAvailableQualities(qualities);
        if (isDataSaver) {
          setIsPlaying(false);
          return;
        }
        video.play().then(() => setIsPlaying(true)).catch(() => {
          // Autoplay policy might require mute
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => setIsPlaying(true)).catch(e => {
            console.warn('Playback error:', e);
          });
        });
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        const lvl = hls.levels[data.level];
        if (lvl) {
          setStats(prev => ({
            ...prev,
            resolution: `${lvl.width}x${lvl.height}`,
            bitrate: Math.round(lvl.bitrate / 1000)
          }));
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setHasError(true);
              setErrorMessage('Il server remoto del canale non risponde (errore di rete o restrizione broadcast). Prova un altro canale.');
              hls.destroy();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setHasError(true);
              setErrorMessage('Errore di decodifica formato video. Tentativo di ripristino...');
              hls.recoverMediaError();
              break;
            default:
              setHasError(true);
              setErrorMessage('Impossibile caricare il flusso live.');
              hls.destroy();
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else if (isNativeHls) {
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsBuffering(false);
        video.play().then(() => setIsPlaying(true)).catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().catch(e => console.warn(e));
        });
      });
    } else {
      // Direct video element fallback
      video.src = streamUrl;
      video.play().then(() => setIsPlaying(true)).catch(() => {
        setHasError(true);
        setErrorMessage('Formato video non supportato dal browser corrente.');
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
    };
  }, [channel?.url, channel?.id]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(console.warn);
    }
    triggerOSD();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    triggerOSD();
  };

  const handleVolumeChange = (newVol: number) => {
    if (!videoRef.current) return;
    videoRef.current.volume = newVol;
    setVolume(newVol);
    if (newVol === 0) {
      videoRef.current.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.warn);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.warn);
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current.requestPictureInPicture) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('PiP not available:', err);
    }
  };

  const cycleScreenFit = () => {
    let nextFit: 'contain' | 'cover' | 'fill' = 'cover';
    let label = 'Riempi Schermo Max (Nessuna barra)';
    if (screenFit === 'cover') {
      nextFit = 'fill';
      label = 'Esteso a Tutto Schermo (Stretch 100%)';
    } else if (screenFit === 'fill') {
      nextFit = 'contain';
      label = 'Originale 16:9 (Con barre nere)';
    } else {
      nextFit = 'cover';
      label = 'Riempi Schermo Max (Nessuna barra)';
    }
    setScreenFit(nextFit);
    setFitToast(`📐 ${label}`);
    setTimeout(() => setFitToast(null), 2500);
    triggerOSD();
  };

  const handleQualitySelect = (qualityId: number) => {
    setSelectedQuality(qualityId);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = qualityId;
    }
    setShowSettingsMenu(false);
    triggerOSD();
  };

  const retryPlayback = () => {
    if (!channel) return;
    setHasError(false);
    setIsBuffering(true);
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.src = channel.url;
      videoRef.current.play().catch(console.warn);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={triggerOSD}
      onClick={triggerOSD}
      className={`relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl transition-all border border-slate-800 group select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none h-screen' : 'aspect-video max-h-[75vh]'
      }`}
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        playsInline
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        className={`w-full h-full bg-black transition-all duration-300 ${
          screenFit === 'cover'
            ? 'object-cover'
            : screenFit === 'fill'
            ? 'object-fill'
            : 'object-contain'
        }`}
      />

      {/* Screen Fit Toast Feedback */}
      {fitToast && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 px-6 py-3 rounded-2xl bg-slate-900/95 border border-cyan-400 text-cyan-200 text-sm font-black shadow-2xl backdrop-blur-md animate-in zoom-in-95 pointer-events-none">
          {fitToast}
        </div>
      )}

      {/* Data Saver Standby Overlay */}
      {isDataSaver && !isPlaying && !isBuffering && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs z-20">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/40 text-center max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <WifiOff className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold text-base mb-1">Risparmio Banda Attivo</h4>
            <p className="text-slate-400 text-xs mb-4">
              Streaming sospeso per non consumare dati mobili (No Wi-Fi). Clicca per avviare il canale.
            </p>
            <button
              onClick={togglePlayPause}
              className="w-full py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Avvia Riproduzione TV</span>
            </button>
          </div>
        </div>
      )}

      {/* Buffering Indicator */}
      {isBuffering && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs z-20 pointer-events-none">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Tv className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <span className="mt-4 text-cyan-200 text-sm font-medium tracking-wider uppercase animate-pulse">
            Caricamento flusso live in corso...
          </span>
        </div>
      )}

      {/* Error Overlay with Fallback Action */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md z-30 p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Flusso Non Disponibile al Momento</h3>
          <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
            {errorMessage || 'Lo stream potrebbe essere temporaneamente offline o soggetto a restrizioni CORS del server sorgente.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={retryPlayback}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition shadow-lg shadow-cyan-600/30 ring-2 ring-cyan-400/50"
            >
              <RefreshCw className="w-4 h-4" />
              Riprova Flusso
            </button>
            {onNextChannel && (
              <button
                onClick={onNextChannel}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition border border-slate-700"
              >
                Canale Successivo
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* No Channel Selected */}
      {!channel && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 shadow-xl">
            <Tv className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Benvenuto su NovaTV Google TV</h3>
          <p className="text-slate-400 text-sm max-w-md mb-6">
            Seleziona un canale dalla guida, usa il telecomando D-Pad o premi il microfono per cercare con la voce.
          </p>
          {onOpenVoiceMic && (
            <button
              onClick={onOpenVoiceMic}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 transition ring-2 ring-cyan-300"
            >
              Premi per Dettatura Vocale
            </button>
          )}
        </div>
      )}

      {/* TOP TV OSD: Channel info header (like real Google TV / Android TV) */}
      <div
        className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent z-20 transition-all duration-300 pointer-events-none ${
          showOSD && channel ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Channel Number Badge */}
            <div className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-lg font-black tracking-wider shadow-inner">
              CH {channel ? String(channel.number).padStart(2, '0') : '--'}
            </div>

            {/* Channel Logo */}
            {channel?.logo && (
              <div className="w-12 h-12 rounded-xl bg-white/10 p-1 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-md">
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="max-h-full max-w-full object-contain drop-shadow"
                  onError={(e) => {
                    // Hide broken image
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Channel Title & Group */}
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide drop-shadow-md">
                  {channel?.name || 'NovaTV Player'}
                </h2>
                {channel?.isRadio && (
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-semibold flex items-center gap-1">
                    <Radio className="w-3 h-3" /> Radio
                  </span>
                )}
                {channel?.isAdult && (
                  <span className="px-2 py-0.5 rounded-md bg-pink-500/25 text-pink-300 border border-pink-400/40 text-xs font-bold flex items-center gap-1 shadow-sm">
                    🔞 18+ Adulti
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300 mt-1 font-medium">
                <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700">
                  {channel?.group || 'Generale'}
                </span>

                {/* Channel description / info */}
                {channel?.safetyReason && (
                  <span className="text-slate-300 text-xs hidden sm:inline max-w-md truncate bg-slate-900/60 px-2 py-0.5 rounded border border-white/5">
                    {channel.safetyReason}
                  </span>
                )}

                {/* Safety Badge */}
                {channel?.safetyStatus === 'legal_verified' && (
                  <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Legale & Verificato (FTA)
                  </span>
                )}
                {channel?.safetyStatus === 'suspicious' && (
                  <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Fonte Esterna Non Verificata
                  </span>
                )}

                {/* Resolution & Bitrate */}
                {stats.resolution && (
                  <span className="text-slate-400">
                    {stats.resolution} {stats.bitrate ? `• ${stats.bitrate} kbps` : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Clock & Screen Fit Quick Button & Live Badge */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={cycleScreenFit}
              title="Riadatta schermo al massimo (elimina barre nere o estendi a schermo intero)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/80 hover:bg-cyan-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-600/30 transition active:scale-95"
            >
              <Scan className="w-4 h-4" />
              <span>Adatta Schermo Max</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 font-bold text-xs tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              DIRETTA TV
            </div>
            <div className="flex items-center gap-2 text-white/90 text-sm font-semibold tracking-wider bg-slate-900/60 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
              <Clock className="w-4 h-4 text-cyan-400" />
              {currentTimeStr}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CONTROLS OSD: Full Smart TV bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-20 transition-all duration-300 ${
          showOSD ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left Playback Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            {onPrevChannel && (
              <button
                onClick={onPrevChannel}
                title="Canale Precedente (CH -)"
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition border border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-cyan-400 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={togglePlayPause}
              title={isPlaying ? 'Pausa (Spazio)' : 'Riproduci (Spazio)'}
              className="p-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow-lg shadow-cyan-500/30 focus:outline-hidden focus:ring-4 focus:ring-cyan-300 active:scale-95"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </button>

            {onNextChannel && (
              <button
                onClick={onNextChannel}
                title="Canale Successivo (CH +)"
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition border border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-cyan-400 active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Volume Control */}
            <div className="flex items-center gap-2 ml-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <button
                onClick={toggleMute}
                className="text-slate-300 hover:text-white transition focus:outline-hidden"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-red-400" />
                ) : (
                  <Volume2 className="w-5 h-5 text-cyan-400" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 md:w-24 accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
            </div>
          </div>

          {/* Right Utility & Format Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Screen Fit Switcher */}
            <button
              onClick={cycleScreenFit}
              title="Riadatta schermo: Cover (Max senza barre), Fill (Tutto schermo), o 16:9 originale"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 text-xs font-bold transition shadow-sm focus:outline-hidden focus:ring-2 focus:ring-cyan-400"
            >
              <Scan className="w-4 h-4 text-cyan-400" />
              <span>
                {screenFit === 'cover' ? '📐 Schermo Max (Cover)' : screenFit === 'fill' ? '📐 Schermo Intero (Fill)' : '📐 16:9 Originale'}
              </span>
            </button>

            {/* Quality Selector (if multiple levels available) */}
            {availableQualities.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  title="Qualità video"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-cyan-400"
                >
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <span>
                    {selectedQuality === -1 ? 'Auto HD' : availableQualities.find(q => q.id === selectedQuality)?.name || 'Qualità'}
                  </span>
                </button>

                {showSettingsMenu && (
                  <div className="absolute bottom-full right-0 mb-2 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-40">
                    <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Qualità HLS</div>
                    <button
                      onClick={() => handleQualitySelect(-1)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium ${
                        selectedQuality === -1 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      ✓ Auto Adattiva (Consigliata)
                    </button>
                    {availableQualities.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => handleQualitySelect(q.id)}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium ${
                          selectedQuality === q.id ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {q.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Picture in Picture */}
            <button
              onClick={togglePiP}
              title="Finestra Fluttuante (PiP)"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition border border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-cyan-400"
            >
              <PictureInPicture className="w-4 h-4 text-cyan-400" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Esci da schermo intero (F)' : 'Schermo Intero TV (F)'}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition border border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-cyan-400"
            >
              {isFullscreen ? <Minimize className="w-4 h-4 text-cyan-400" /> : <Maximize className="w-4 h-4 text-cyan-400" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
