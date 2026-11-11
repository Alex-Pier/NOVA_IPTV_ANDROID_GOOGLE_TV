import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  Mic,
  Delete,
  CornerDownLeft,
  X,
  RotateCcw,
  Space,
  Keyboard as KeyboardIcon,
  Sparkles
} from 'lucide-react';

interface VirtualKeyboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValue: string;
  onApplySearch: (text: string) => void;
  onOpenVoiceMic: () => void;
  isVoiceListening?: boolean;
  voiceTranscript?: string;
}

export const VirtualKeyboardModal: React.FC<VirtualKeyboardModalProps> = ({
  isOpen,
  onClose,
  initialValue,
  onApplySearch,
  onOpenVoiceMic,
  isVoiceListening = false,
  voiceTranscript = ''
}) => {
  const [text, setText] = useState(initialValue);
  const [focusedKeyIndex, setFocusedKeyIndex] = useState(0);

  // Sync initial value when opening
  useEffect(() => {
    if (isOpen) {
      setText(initialValue);
      setFocusedKeyIndex(0);
    }
  }, [isOpen, initialValue]);

  // Sync voice transcript if user talks while keyboard is open
  useEffect(() => {
    if (voiceTranscript) {
      setText(voiceTranscript);
    }
  }, [voiceTranscript]);

  // Virtual keyboard layout: 5 rows
  const KEYBOARD_ROWS = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '18+'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '.', '-', '+'],
    ['VOICE', 'SPACE', 'BACKSPACE', 'CLEAR', 'SUBMIT']
  ];

  // Flat list of keys for D-Pad index mapping
  const flatKeys = KEYBOARD_ROWS.flat();

  const handleKeyPress = useCallback((key: string) => {
    if (key === 'BACKSPACE') {
      setText((prev) => prev.slice(0, -1));
    } else if (key === 'CLEAR') {
      setText('');
    } else if (key === 'SPACE') {
      setText((prev) => prev + ' ');
    } else if (key === 'SUBMIT') {
      onApplySearch(text);
      onClose();
    } else if (key === 'VOICE') {
      onOpenVoiceMic();
    } else if (key === '18+') {
      setText('18+');
    } else {
      setText((prev) => prev + key);
    }
  }, [text, onApplySearch, onClose, onOpenVoiceMic]);

  // Physical Android TV Remote & Keyboard D-Pad Navigation inside the Virtual Keyboard
  useEffect(() => {
    if (!isOpen) return;

    const handleRemoteKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const keyCode = e.keyCode;

      // Enter / OK (Enter, keyCode 23, 66)
      if (key === 'Enter' || keyCode === 23 || keyCode === 66) {
        e.preventDefault();
        e.stopPropagation();
        const activeKey = flatKeys[focusedKeyIndex];
        if (activeKey) {
          handleKeyPress(activeKey);
        }
        return;
      }

      // Back / Escape (Escape, Backspace, keyCode 4)
      if (key === 'Escape' || keyCode === 4) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      // Navigation: Find current row and col
      let currentRow = 0;
      let currentCol = 0;
      let runningCount = 0;

      for (let r = 0; r < KEYBOARD_ROWS.length; r++) {
        const rowLen = KEYBOARD_ROWS[r].length;
        if (focusedKeyIndex < runningCount + rowLen) {
          currentRow = r;
          currentCol = focusedKeyIndex - runningCount;
          break;
        }
        runningCount += rowLen;
      }

      // ArrowUp (keyCode 19)
      if (key === 'ArrowUp' || keyCode === 19) {
        e.preventDefault();
        e.stopPropagation();
        if (currentRow > 0) {
          const targetRow = currentRow - 1;
          const targetCol = Math.min(currentCol, KEYBOARD_ROWS[targetRow].length - 1);
          let newIdx = 0;
          for (let r = 0; r < targetRow; r++) newIdx += KEYBOARD_ROWS[r].length;
          setFocusedKeyIndex(newIdx + targetCol);
        }
        return;
      }

      // ArrowDown (keyCode 20)
      if (key === 'ArrowDown' || keyCode === 20) {
        e.preventDefault();
        e.stopPropagation();
        if (currentRow < KEYBOARD_ROWS.length - 1) {
          const targetRow = currentRow + 1;
          const targetCol = Math.min(currentCol, KEYBOARD_ROWS[targetRow].length - 1);
          let newIdx = 0;
          for (let r = 0; r < targetRow; r++) newIdx += KEYBOARD_ROWS[r].length;
          setFocusedKeyIndex(newIdx + targetCol);
        }
        return;
      }

      // ArrowLeft (keyCode 21)
      if (key === 'ArrowLeft' || keyCode === 21) {
        e.preventDefault();
        e.stopPropagation();
        if (currentCol > 0) {
          setFocusedKeyIndex((prev) => prev - 1);
        }
        return;
      }

      // ArrowRight (keyCode 22)
      if (key === 'ArrowRight' || keyCode === 22) {
        e.preventDefault();
        e.stopPropagation();
        if (currentCol < KEYBOARD_ROWS[currentRow].length - 1) {
          setFocusedKeyIndex((prev) => prev + 1);
        }
        return;
      }

      // Direct physical keyboard typing support (for PC/USB keyboard)
      if (key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        setText((prev) => prev + key);
      } else if (key === 'Backspace') {
        setText((prev) => prev.slice(0, -1));
      }
    };

    window.addEventListener('keydown', handleRemoteKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleRemoteKeyDown, true);
    };
  }, [isOpen, focusedKeyIndex, flatKeys, handleKeyPress, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/50 rounded-3xl p-5 md:p-6 shadow-2xl shadow-cyan-950/80 flex flex-col gap-4">
        {/* Header with Title & Mic & Close */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <KeyboardIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black text-white flex items-center gap-2">
                Tastiera Virtuale TV & Ricerca
              </h3>
              <p className="text-[11px] text-slate-400">
                Usa le frecce del telecomando, il tocco, la voce o la tastiera fisica
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Microphone Button in Header */}
            <button
              type="button"
              onClick={onOpenVoiceMic}
              title="Attiva Dettatura Vocale (Tasto V o Microfono Telecomando)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                isVoiceListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isVoiceListening ? 'In ascolto...' : 'Dettatura Vocale'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Text Display Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
          <input
            type="text"
            readOnly
            value={text}
            placeholder="Cerca canale... (es. Rai 1, Red Bull, Sport, 18+)"
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-slate-950 border-2 border-cyan-500/50 text-white text-base md:text-lg font-bold placeholder-slate-500 tracking-wide select-none outline-hidden"
          />
          {text && (
            <button
              type="button"
              onClick={() => setText('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Svuota
            </button>
          )}
        </div>

        {/* Virtual Keyboard Grid (D-Pad Navigable & Clickable) */}
        <div className="space-y-2 select-none">
          {KEYBOARD_ROWS.map((row, rIdx) => {
            return (
              <div key={rIdx} className="flex justify-center gap-1.5">
                {row.map((k) => {
                  const keyIndex = flatKeys.indexOf(k);
                  const isKeyFocused = focusedKeyIndex === keyIndex;

                  let customStyle = 'bg-slate-950 hover:bg-slate-800 text-white border-slate-800';
                  let widthClass = 'flex-1 py-3';

                  if (k === 'SUBMIT') {
                    customStyle = 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/30';
                    widthClass = 'flex-2 py-3';
                  } else if (k === 'VOICE') {
                    customStyle = isVoiceListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold';
                    widthClass = 'flex-1.5 py-3';
                  } else if (k === 'BACKSPACE') {
                    customStyle = 'bg-slate-800 hover:bg-slate-700 text-slate-200';
                    widthClass = 'flex-1.5 py-3';
                  } else if (k === 'CLEAR') {
                    customStyle = 'bg-red-950/70 hover:bg-red-900 text-red-300 border-red-500/30';
                    widthClass = 'flex-1 py-3';
                  } else if (k === 'SPACE') {
                    widthClass = 'flex-2 py-3';
                  } else if (k === '18+') {
                    customStyle = 'bg-pink-950/80 text-pink-300 border-pink-500/40 font-black';
                  }

                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => handleKeyPress(k)}
                      onMouseEnter={() => setFocusedKeyIndex(keyIndex)}
                      className={`rounded-xl border font-bold text-sm md:text-base flex items-center justify-center transition-all cursor-pointer active:scale-95 ${widthClass} ${customStyle} ${
                        isKeyFocused
                          ? 'ring-4 ring-cyan-400 bg-cyan-400 text-slate-950 font-black scale-105 shadow-xl z-10'
                          : ''
                      }`}
                    >
                      {k === 'BACKSPACE' ? (
                        <div className="flex items-center gap-1 text-xs">
                          <Delete className="w-4 h-4" />
                          <span className="hidden sm:inline">Canc</span>
                        </div>
                      ) : k === 'SPACE' ? (
                        <div className="flex items-center gap-1 text-xs">
                          <Space className="w-4 h-4" />
                          <span>Spazio</span>
                        </div>
                      ) : k === 'CLEAR' ? (
                        <div className="flex items-center gap-1 text-xs">
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Azzera</span>
                        </div>
                      ) : k === 'VOICE' ? (
                        <div className="flex items-center gap-1 text-xs">
                          <Mic className="w-4 h-4" />
                          <span>Voce</span>
                        </div>
                      ) : k === 'SUBMIT' ? (
                        <div className="flex items-center gap-1 text-xs md:text-sm font-black">
                          <CornerDownLeft className="w-4 h-4" />
                          <span>CERCA TV</span>
                        </div>
                      ) : (
                        k
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Remote D-Pad Navigation Hint */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">D-Pad Frecce</kbd>
            <span>Sposta tasto</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">OK / Enter</kbd>
            <span>Digita</span>
          </div>

          <button
            type="button"
            onClick={() => {
              onApplySearch(text);
              onClose();
            }}
            className="text-cyan-400 font-bold hover:underline cursor-pointer"
          >
            Applica Ricerca →
          </button>
        </div>
      </div>
    </div>
  );
};
