import React, { useState } from 'react';
import {
  X,
  Tv,
  Download,
  Smartphone,
  ExternalLink,
  CheckCircle,
  Copy,
  Check,
  FileCode,
  Share2,
  Sparkles
} from 'lucide-react';
import { Channel } from '../types/iptv';
import { exportToM3U } from '../utils/m3uParser';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  onInstallPWA: () => void;
  channels: Channel[];
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  onInstallPWA,
  channels
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const currentAppUrl = window.location.href;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentAppUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleExportM3U = () => {
    const content = exportToM3U(channels, 'NovaTV_Playlist');
    const blob = new Blob([content], { type: 'audio/x-mpegurl;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'NovaTV_Canali_GoogleTV.m3u';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-cyan-950/50 max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-lg">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-white">
              Installa NovaTV su Google TV & Android APK
            </h3>
            <p className="text-slate-400 text-xs">
              Configura l&apos;app sul tuo televisore, box Android o crea il pacchetto APK
            </p>
          </div>
        </div>

        {/* 1-Click Install PWA Banner (if available) */}
        {isInstallable && (
          <div className="my-6 p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-blue-950/60 to-slate-900 border border-cyan-400/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Browser Compatibile Rilevato!
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Puoi installare NovaTV direttamente come applicazione indipendente senza scaricare file esterni.
              </p>
            </div>
            <button
              onClick={onInstallPWA}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/30 whitespace-nowrap flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Installa Subito
            </button>
          </div>
        )}

        {/* Step-by-Step Instructions */}
        <div className="space-y-5 my-6">
          {/* Method 1: Downloader / TV Bro su Google TV */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h4 className="text-sm font-bold text-white">
                Metodo Diretto Google TV / Android TV (Tramite Browser o Downloader)
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pl-8 mb-3">
              1. Apri l&apos;app <strong>Downloader</strong> o <strong>TV Bro Browser</strong> sulla tua Google TV.<br />
              2. Digita o incolla l&apos;URL di questa applicazione:<br />
            </p>
            <div className="ml-8 flex items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <code className="text-xs text-cyan-300 font-mono flex-1 truncate">
                {currentAppUrl}
              </code>
              <button
                onClick={handleCopyUrl}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedUrl ? 'Copiato!' : 'Copia'}
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pl-8 mt-3">
              3. Nel menu del browser TV seleziona <strong>&quot;Aggiungi alla schermata principale&quot;</strong> o <strong>&quot;Installa Applicazione TV&quot;</strong>. L&apos;app apparirà tra i canali della tua home Google TV con piena integrazione D-Pad!
            </p>
          </div>

          {/* Method 2: Convert to standalone Android APK (PWABuilder / Bubblewrap) */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h4 className="text-sm font-bold text-white">
                Come Generare il File APK per Android TV in 1 Minuto (PWABuilder)
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pl-8 mb-3">
              Questa applicazione include già il <code>manifest.webmanifest</code> ufficiale con supporto TV (orientation landscape, service worker per caching offline e icone HD):
            </p>
            <div className="ml-8 space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Vai sul convertitore gratuito ufficiale <strong>pwabuilder.com</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Incolla l&apos;URL di questa app e clicca <strong>&quot;Package for Android&quot;</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Spunta l&apos;opzione <strong>&quot;Android TV / Google TV Leanback Support&quot;</strong> e scarica il file <strong>.APK</strong> o l&apos;AAB per il Play Store!</span>
              </div>
            </div>
          </div>

          {/* Export M3U feature */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  Esporta Playlist Attuale (.M3U)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Scarica i {channels.length} canali attuali in un file .m3u per aprirli anche su Kodi, VLC o lettori esterni.
                </p>
              </div>
              <button
                onClick={handleExportM3U}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition border border-slate-700 flex items-center gap-2 whitespace-nowrap"
              >
                {downloadSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-cyan-400" />}
                {downloadSuccess ? 'Scaricato!' : 'Scarica .M3U'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/30 text-cyan-200 text-xs text-center">
          💡 Suggerimento: Su Google TV puoi usare i tasti freccia del telecomando fisico, il tasto centrale per confermare e il tasto indietro per uscire dalla riproduzione.
        </div>
      </div>
    </div>
  );
};
