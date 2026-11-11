import { useState, useEffect, useRef, useCallback } from 'react';

// SpeechRecognition interface declarations for TypeScript
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface VoiceCommandAction {
  type: 'search' | 'channel_number' | 'play_pause' | 'mute' | 'fullscreen' | 'next' | 'prev' | 'category';
  payload?: any;
  rawText: string;
}

export function useVoiceDictation(onCommand?: (action: VoiceCommandAction) => void) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      setIsSupported(true);
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'it-IT'; // Default to Italian, recognizes names like Rai, Euronews, etc.

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
        setTranscript('');
        setInterimTranscript('');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (final) {
          const cleanText = final.trim();
          setTranscript(cleanText);
          setInterimTranscript('');
          handleVoiceCommand(cleanText);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage('Permesso microfono non concesso. Abilita il microfono nelle impostazioni del browser/TV.');
        } else if (event.error === 'no-speech') {
          setErrorMessage('Nessuna voce rilevata. Premi di nuovo il microfono e parla vicino al telecomando.');
        } else {
          setErrorMessage(`Errore vocale: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleVoiceCommand = useCallback((text: string) => {
    const lower = text.toLowerCase().trim();

    // Direct channel number detection (e.g. "canale 1", "canale uno", "metti 3", "numero 5")
    const numberWordsMap: Record<string, number> = {
      'uno': 1, 'due': 2, 'tre': 3, 'quattro': 4, 'cinque': 5,
      'sei': 6, 'sette': 7, 'otto': 8, 'nove': 9, 'dieci': 10
    };

    const channelNumMatch = lower.match(/(?:canale|metti|numero)\s+(\d+|uno|due|tre|quattro|cinque|sei|sette|otto|nove|dieci)/i);
    if (channelNumMatch) {
      const matchVal = channelNumMatch[1];
      const parsedNumber = isNaN(Number(matchVal)) ? numberWordsMap[matchVal] : Number(matchVal);
      if (parsedNumber && onCommand) {
        onCommand({
          type: 'channel_number',
          payload: parsedNumber,
          rawText: text
        });
        return;
      }
    }

    // Media commands
    if (lower.includes('pausa') || lower.includes('stop') || lower.includes('riprendi') || lower.includes('play')) {
      onCommand?.({ type: 'play_pause', rawText: text });
      return;
    }
    if (lower.includes('muto') || lower.includes('silenzioso') || lower.includes('audio')) {
      onCommand?.({ type: 'mute', rawText: text });
      return;
    }
    if (lower.includes('schermo intero') || lower.includes('fullscreen') || lower.includes('ingrandisci')) {
      onCommand?.({ type: 'fullscreen', rawText: text });
      return;
    }
    if (lower.includes('prossimo') || lower.includes('successivo') || lower.includes('avanti')) {
      onCommand?.({ type: 'next', rawText: text });
      return;
    }
    if (lower.includes('precedente') || lower.includes('indietro')) {
      onCommand?.({ type: 'prev', rawText: text });
      return;
    }

    // Category / genre detection
    const categories = ['notizie', 'news', 'sport', 'musica', 'documentari', 'bambini', 'italia'];
    for (const cat of categories) {
      if (lower.includes(cat)) {
        onCommand?.({ type: 'category', payload: cat, rawText: text });
        return;
      }
    }

    // Default to search
    const cleanSearch = lower.replace(/^(cerca|trova|metti|vai a)\s+/i, '').trim();
    onCommand?.({
      type: 'search',
      payload: cleanSearch || text,
      rawText: text
    });
  }, [onCommand]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      setErrorMessage(null);
      recognitionRef.current.start();
    } catch (err: any) {
      // If already started, stop then restart
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {
      // ignore
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    errorMessage,
    startListening,
    stopListening,
    toggleListening
  };
}
