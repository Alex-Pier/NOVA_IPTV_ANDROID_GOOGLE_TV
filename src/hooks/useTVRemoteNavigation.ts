import { useEffect, useCallback } from 'react';

export interface TVRemoteKeyHandlers {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onSelect?: () => void;
  onBack?: () => void;
  onPlayPause?: () => void;
  onMute?: () => void;
  onChannelUp?: () => void;
  onChannelDown?: () => void;
  onDigit?: (digit: number) => void;
  onMic?: () => void;
  onInfo?: () => void;
}

export function useTVRemoteNavigation(handlers: TVRemoteKeyHandlers, enabled = true) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    // Do not intercept if user is typing in an active text input or textarea (unless it's an Escape or Enter)
    const target = e.target as HTMLElement;
    const isInputActive = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

    const key = e.key;
    const code = e.code;
    const keyCode = e.keyCode;

    // Android TV / D-Pad Up (19) or ArrowUp
    if (key === 'ArrowUp' || keyCode === 19) {
      if (!isInputActive) {
        e.preventDefault();
        handlers.onUp?.();
      }
      return;
    }

    // Android TV / D-Pad Down (20) or ArrowDown
    if (key === 'ArrowDown' || keyCode === 20) {
      if (!isInputActive) {
        e.preventDefault();
        handlers.onDown?.();
      }
      return;
    }

    // Android TV / D-Pad Left (21) or ArrowLeft
    if (key === 'ArrowLeft' || keyCode === 21) {
      if (!isInputActive) {
        e.preventDefault();
        handlers.onLeft?.();
      }
      return;
    }

    // Android TV / D-Pad Right (22) or ArrowRight
    if (key === 'ArrowRight' || keyCode === 22) {
      if (!isInputActive) {
        e.preventDefault();
        handlers.onRight?.();
      }
      return;
    }

    // Android TV / D-Pad Center OK (23) or Enter
    if (key === 'Enter' || keyCode === 23 || keyCode === 66) {
      if (!isInputActive) {
        e.preventDefault();
        handlers.onSelect?.();
      }
      return;
    }

    // Android TV / Back (4) or Escape / Backspace
    if (key === 'Escape' || keyCode === 4 || (key === 'Backspace' && !isInputActive)) {
      e.preventDefault();
      handlers.onBack?.();
      return;
    }

    // Play/Pause key (85, 126, 127) or Space
    if (key === 'MediaPlayPause' || keyCode === 85 || (key === ' ' && !isInputActive)) {
      e.preventDefault();
      handlers.onPlayPause?.();
      return;
    }

    // Channel Up (166) or PageUp
    if (key === 'ChannelUp' || keyCode === 166 || key === 'PageUp') {
      e.preventDefault();
      handlers.onChannelUp?.();
      return;
    }

    // Channel Down (167) or PageDown
    if (key === 'ChannelDown' || keyCode === 167 || key === 'PageDown') {
      e.preventDefault();
      handlers.onChannelDown?.();
      return;
    }

    // Mic shortcut ('v' or Android Voice search key)
    if ((key === 'v' || key === 'V' || keyCode === 84) && !isInputActive) {
      e.preventDefault();
      handlers.onMic?.();
      return;
    }

    // Mute key
    if ((key === 'm' || key === 'M' || keyCode === 164) && !isInputActive) {
      e.preventDefault();
      handlers.onMute?.();
      return;
    }

    // Info key (i or Guide)
    if ((key === 'i' || key === 'I' || keyCode === 165) && !isInputActive) {
      e.preventDefault();
      handlers.onInfo?.();
      return;
    }

    // Direct numeric input (0-9)
    if (!isInputActive && /^[0-9]$/.test(key)) {
      const digit = parseInt(key, 10);
      handlers.onDigit?.(digit);
    }
  }, [enabled, handlers]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
