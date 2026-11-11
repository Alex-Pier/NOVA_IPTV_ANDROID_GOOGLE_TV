import React from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, Radio } from 'lucide-react';
import { VoiceCommandAction } from '../hooks/useVoiceDictation';

interface VoiceDictationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  errorMessage: string | null;
  onToggleListening: () => void;
  onSimulateCommand: (action: VoiceCommandAction) => void;
}

export const VoiceDictationModal: React.FC<VoiceDictationModalProps> = ({
  isOpen,
  onClose,
  isListening,
  transcript,
  interimTranscript,
  errorMessage,
  onToggleListening,
  onSimulateCommand
}) => {
  if (!isOpen) return null;

  const quickPhrases: { label: string; action: VoiceCommandAction }[] = [
    { label: 'Canale 1 (Rai News)', action: { type: 'channel_number', payload: 1, rawText: 'Canale 1' } },
    { label: 'Canale 4 (Red Bull)', action: { type: 'channel_number', payload: 4, rawText: 'Canale 4' } },
    { label: 'Cerca Notizie', action: { type: 'search', payload: 'Notizie', rawText: 'Cerca Notizie' } },
    { label: 'Cerca Musica', action: { type: 'search', payload: 'Musica', rawText: 'Cerca Musica' } },
    { label: 'Pausa / Play', action: { type: 'play_pause', rawText: 'Pausa' } },
    { label: 'Schermo Intero', action: { type: 'fullscreen', rawText: 'Schermo Intero' } }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-cyan-950/50 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Controllo Vocale & Dettatura Google TV
        </div>

        <h3 className="text-2xl font-black text-white tracking-wide">
          {isListening ? 'Ti sto ascoltando...' : 'Premi il Microfono per Parlare'}
        </h3>
        <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
          Pronuncia il nome di un canale, un numero (es. &quot;Canale 2&quot;) o comandi come &quot;Pausa&quot; e &quot;Musica&quot;.
        </p>

        {/* Central Pulse Microphone Button */}
        <div className="my-8 flex justify-center">
          <button
            onClick={onToggleListening}
            className={`relative p-8 rounded-full transition-all duration-300 focus:outline-hidden ${
              isListening
                ? 'bg-gradient-to-tr from-cyan-500 to-blue-500 text-white shadow-2xl shadow-cyan-500/60 scale-110 ring-8 ring-cyan-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            {isListening ? (
              <>
                <span className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />
                <Mic className="w-12 h-12 relative z-10 animate-bounce" />
              </>
            ) : (
              <MicOff className="w-12 h-12" />
            )}
          </button>
        </div>

        {/* Real-time Dictation Transcript Display */}
        <div className="min-h-[64px] bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-center justify-center mb-6">
          {interimTranscript ? (
            <p className="text-cyan-300 text-lg font-medium italic animate-pulse">
              &ldquo;{interimTranscript}...&rdquo;
            </p>
          ) : transcript ? (
            <p className="text-emerald-400 text-lg font-semibold">
              &ldquo;{transcript}&rdquo;
            </p>
          ) : (
            <p className="text-slate-500 text-sm">
              {isListening ? 'Parla adesso chiaramente verso il microfono...' : 'Microfono in attesa. Clicca per attivarlo.'}
            </p>
          )}
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Quick Testing Voice Command Chips */}
        <div>
          <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 flex items-center justify-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            Oppure prova un comando rapido con 1-click:
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {quickPhrases.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSimulateCommand(phrase.action);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-500/40 text-slate-300 text-xs font-medium border border-slate-700 transition"
              >
                {phrase.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
