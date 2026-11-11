import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Undo2,
  Mic,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Tv,
  Hash,
  X,
  HelpCircle
} from 'lucide-react';

interface VirtualTVRemoteProps {
  isOpen: boolean;
  onToggle: () => void;
  onUp: () => void;
  onDown: () => void;
  onLeft: () => void;
  onRight: () => void;
  onSelect: () => void;
  onBack: () => void;
  onPlayPause: () => void;
  onMute: () => void;
  onChannelUp: () => void;
  onChannelDown: () => void;
  onMic: () => void;
  onDigit: (digit: number) => void;
}

export const VirtualTVRemote: React.FC<VirtualTVRemoteProps> = ({
  isOpen,
  onToggle,
  onUp,
  onDown,
  onLeft,
  onRight,
  onSelect,
  onBack,
  onPlayPause,
  onMute,
  onChannelUp,
  onChannelDown,
  onMic,
  onDigit
}) => {
  const [showKeypad, setShowKeypad] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        title="Apri Simulatore Telecomando Google TV"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-xl shadow-cyan-950/40 backdrop-blur-md transition group focus:outline-hidden ring-2 ring-cyan-500/20"
      >
        <Tv className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition" />
        <span className="text-xs font-bold tracking-wide">Telecomando TV</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-72 bg-slate-950/95 border border-cyan-500/40 rounded-3xl p-4 shadow-2xl shadow-cyan-950/80 backdrop-blur-xl animate-in slide-in-from-bottom-5">
      {/* Remote Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Telecomando Google TV
          </span>
        </div>
        <button
          onClick={onToggle}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Top Action Row: Mic, Play/Pause, Mute */}
      <div className="flex items-center justify-around gap-2 mb-4 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
        <button
          onClick={onMic}
          title="Dettatura Vocale (V)"
          className="p-3 rounded-full bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 transition shadow-inner"
        >
          <Mic className="w-5 h-5" />
        </button>
        <button
          onClick={onPlayPause}
          title="Play / Pausa (Spazio)"
          className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition border border-slate-700"
        >
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </button>
        <button
          onClick={onMute}
          title="Muto (M)"
          className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
        >
          <VolumeX className="w-5 h-5" />
        </button>
      </div>

      {/* D-PAD Spatial Circular Navigation */}
      <div className="relative w-48 h-48 mx-auto my-2 flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-slate-800 bg-slate-900 shadow-inner" />

        {/* UP Button */}
        <button
          onClick={onUp}
          title="Freccia Su (ArrowUp)"
          className="absolute top-2 w-12 h-10 flex items-center justify-center text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded-t-xl transition active:scale-95"
        >
          <ChevronUp className="w-7 h-7" />
        </button>

        {/* DOWN Button */}
        <button
          onClick={onDown}
          title="Freccia Giù (ArrowDown)"
          className="absolute bottom-2 w-12 h-10 flex items-center justify-center text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded-b-xl transition active:scale-95"
        >
          <ChevronDown className="w-7 h-7" />
        </button>

        {/* LEFT Button */}
        <button
          onClick={onLeft}
          title="Freccia Sinistra (ArrowLeft)"
          className="absolute left-2 h-12 w-10 flex items-center justify-center text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded-l-xl transition active:scale-95"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        {/* RIGHT Button */}
        <button
          onClick={onRight}
          title="Freccia Destra (ArrowRight)"
          className="absolute right-2 h-12 w-10 flex items-center justify-center text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded-r-xl transition active:scale-95"
        >
          <ChevronRight className="w-7 h-7" />
        </button>

        {/* CENTER OK BUTTON */}
        <button
          onClick={onSelect}
          title="Tasto OK / Selezione (Enter)"
          className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm tracking-widest shadow-lg shadow-cyan-600/30 flex items-center justify-center transition active:scale-90 ring-4 ring-slate-950"
        >
          OK
        </button>
      </div>

      {/* Row: Back & Channel Switcher */}
      <div className="grid grid-cols-2 gap-2 my-3">
        <button
          onClick={onBack}
          title="Tasto Indietro (Esc / Backspace)"
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition active:scale-95"
        >
          <Undo2 className="w-4 h-4" />
          INDIETRO
        </button>

        <button
          onClick={() => setShowKeypad(!showKeypad)}
          title="Tastierino Numerico Canali"
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition active:scale-95"
        >
          <Hash className="w-4 h-4 text-cyan-400" />
          NUMERI CH
        </button>
      </div>

      {/* Channel & Volume Rockers */}
      <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CANALI</span>
          <div className="flex gap-1 w-full">
            <button
              onClick={onChannelDown}
              className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
            >
              CH -
            </button>
            <button
              onClick={onChannelUp}
              className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
            >
              CH +
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">TASTIERA PC</span>
          <div className="text-[10px] text-slate-400 text-center leading-tight">
            Usa anche <kbd className="px-1 py-0.5 bg-slate-800 rounded text-cyan-300 font-mono">↑↓←→</kbd> e <kbd className="px-1 py-0.5 bg-slate-800 rounded text-cyan-300 font-mono">Invio</kbd>
          </div>
        </div>
      </div>

      {/* Numeric Keypad Drawer */}
      {showKeypad && (
        <div className="mt-3 pt-3 border-t border-slate-800 animate-in fade-in">
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <button
                key={num}
                onClick={() => onDigit(num)}
                className={`py-2 rounded-xl bg-slate-900 hover:bg-cyan-900/50 hover:text-cyan-300 text-white text-sm font-bold border border-slate-800 transition ${
                  num === 0 ? 'col-span-3' : ''
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
