import React, { useState } from 'react';
import {
  X,
  Upload,
  Link,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Play,
  Check
} from 'lucide-react';
import { Channel, SafetyAuditResult } from '../types/iptv';
import { parseM3U, analyzeSafety } from '../utils/m3uParser';

interface M3uUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaylistLoaded: (channels: Channel[], playlistName: string, sourceUrl?: string) => void;
}

export const M3uUploadModal: React.FC<M3uUploadModalProps> = ({
  isOpen,
  onClose,
  onPlaylistLoaded
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'file' | 'text'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewChannels, setPreviewChannels] = useState<Channel[]>([]);
  const [safetyAudit, setSafetyAudit] = useState<SafetyAuditResult | null>(null);

  if (!isOpen) return null;

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setPreviewChannels([]);
    setSafetyAudit(null);

    try {
      // First analyze safety of URL
      const audit = analyzeSafety(urlInput.trim());
      setSafetyAudit(audit);

      const res = await fetch(urlInput.trim());
      if (!res.ok) {
        throw new Error(`Risposta server non valida (HTTP ${res.status}). Verifica che l'URL sia corretto.`);
      }
      const text = await res.text();
      const channels = parseM3U(text, urlInput.trim());

      if (channels.length === 0) {
        throw new Error('Nessun canale valido trovato nella playlist M3U.');
      }

      setPreviewChannels(channels);
      // Re-run safety check with channels parsed
      const fullAudit = analyzeSafety(urlInput.trim(), channels);
      setSafetyAudit(fullAudit);
    } catch (err: any) {
      setErrorMsg(
        err.message?.includes('Failed to fetch')
          ? 'Errore CORS o rete: il server remoto non permette il fetch diretto dal browser. Puoi incollare il testo della lista nella scheda "Incolla Testo" oppure caricare il file scaricato.'
          : err.message || 'Impossibile scaricare la playlist.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg(null);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const channels = parseM3U(text);
        if (channels.length === 0) {
          setErrorMsg('Il file caricato non contiene definizioni di canali M3U valide.');
        } else {
          setPreviewChannels(channels);
          const audit = analyzeSafety(file.name, channels);
          setSafetyAudit(audit);
        }
      } catch (err) {
        setErrorMsg('Errore nella lettura del file M3U.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    setErrorMsg(null);
    try {
      const channels = parseM3U(textInput.trim());
      if (channels.length === 0) {
        setErrorMsg('Nessun canale individuato nel testo incollato. Assicurati che includa righe #EXTINF o URL di stream.');
      } else {
        setPreviewChannels(channels);
        const audit = analyzeSafety('testo_incollato.m3u', channels);
        setSafetyAudit(audit);
      }
    } catch {
      setErrorMsg('Errore nel parsing del testo M3U.');
    }
  };

  const handleConfirmLoad = () => {
    if (previewChannels.length === 0) return;
    const name = activeTab === 'url' ? 'Playlist da URL' : activeTab === 'file' ? fileName : 'Playlist Personalizzata';
    onPlaylistLoaded(previewChannels, name, activeTab === 'url' ? urlInput : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-cyan-950/60 max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl md:text-2xl font-black text-white">Carica Playlist M3U</h3>
          <p className="text-xs text-slate-400 mt-1">
            Importa la tua lista canali da URL remoto, file salvato (.m3u) o testo grezzo
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex rounded-2xl bg-slate-950 p-1 border border-slate-800 mb-6">
          <button
            onClick={() => { setActiveTab('url'); setErrorMsg(null); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'url' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Link className="w-4 h-4" /> Da URL
          </button>
          <button
            onClick={() => { setActiveTab('file'); setErrorMsg(null); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'file' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" /> Da File .m3u
          </button>
          <button
            onClick={() => { setActiveTab('text'); setErrorMsg(null); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'text' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> Incolla Testo
          </button>
        </div>

        {/* Tab 1: URL */}
        {activeTab === 'url' && (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                URL della lista M3U / M3U8:
              </label>
              <input
                type="url"
                required
                placeholder="https://esempio.com/canali.m3u o .m3u8"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-600/20 disabled:opacity-50"
            >
              {isLoading ? 'Analisi e download in corso...' : 'Scarica e Analizza Canali'}
            </button>
          </form>
        )}

        {/* Tab 2: File */}
        {activeTab === 'file' && (
          <div className="space-y-4">
            <div className="p-8 border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-2xl text-center bg-slate-950/60 transition group cursor-pointer relative">
              <input
                type="file"
                accept=".m3u,.m3u8,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-10 h-10 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition" />
              <div className="text-sm font-bold text-white mb-1">
                {fileName ? fileName : 'Seleziona o trascina un file .m3u o .m3u8'}
              </div>
              <div className="text-xs text-slate-400">
                Supporta playlist scaricate da pennetta USB, decoder o salvate su disco
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Paste Text */}
        {activeTab === 'text' && (
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Incolla il contenuto #EXTM3U:
              </label>
              <textarea
                rows={6}
                required
                placeholder="#EXTM3U&#10;#EXTINF:-1 tvg-id=&quot;Rai1.it&quot;,Rai 1 HD&#10;https://...&#10;#EXTINF:-1,Canale 2&#10;https://..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 font-mono text-xs focus:outline-hidden focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-600/20"
            >
              Estrai Canali da Testo
            </button>
          </form>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs leading-relaxed flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Safety & Channel Preview Result */}
        {previewChannels.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-4 animate-in fade-in">
            {/* Safety Banner */}
            {safetyAudit && (
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                  safetyAudit.verdict === 'SAFE_LEGAL'
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : safetyAudit.verdict === 'COMMUNITY_UNVERIFIED'
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                    : 'bg-red-950/20 border-red-500/30 text-red-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold block">{safetyAudit.title}</span>
                    <span className="text-[11px] text-slate-300">Punteggio sicurezza: {safetyAudit.score}/100</span>
                  </div>
                </div>
              </div>
            )}

            {/* Channels Count & Preview */}
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Canali trovati con successo:</span>
              <strong className="text-cyan-400 font-bold text-sm">{previewChannels.length} Canali</strong>
            </div>

            <div className="max-h-32 overflow-y-auto bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
              {previewChannels.slice(0, 10).map((ch, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 px-2 text-slate-300 border-b border-slate-900 last:border-none">
                  <span className="truncate">{ch.number}. {ch.name}</span>
                  <span className="text-[10px] text-slate-500 ml-2 shrink-0">{ch.group}</span>
                </div>
              ))}
              {previewChannels.length > 10 && (
                <div className="text-[11px] text-center text-slate-500 pt-1">
                  ...e altri {previewChannels.length - 10} canali
                </div>
              )}
            </div>

            {/* Confirm Load Button */}
            <button
              onClick={handleConfirmLoad}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold text-sm transition shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Carica Playlist nel Player Adesso
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
