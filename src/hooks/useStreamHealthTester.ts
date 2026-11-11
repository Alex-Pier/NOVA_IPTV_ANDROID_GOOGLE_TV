import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Channel } from '../types/iptv';

export interface StreamHealth {
  status: 'online' | 'offline' | 'checking' | 'unknown';
  pingMs?: number;
  lastChecked: number;
}

export function useStreamHealthTester(
  channels: Channel[],
  activeChannelId?: string,
  isDataSaver: boolean = false
) {
  const [healthMap, setHealthMap] = useState<Record<string, StreamHealth>>(() => {
    // Initial pre-seed: local streams are immediately online
    const initial: Record<string, StreamHealth> = {};
    channels.forEach((c) => {
      if (c.url.startsWith('/') || c.url.includes('/videos/')) {
        initial[c.id] = { status: 'online', pingMs: 5, lastChecked: Date.now() };
      }
    });
    return initial;
  });

  const isCancelledRef = useRef(false);
  const isRunningRef = useRef(false);

  // Probes a single stream using backend proxy first, then browser no-cors fallback
  const checkSingleStream = useCallback(async (channelId: string, url: string): Promise<StreamHealth> => {
    if (!url) {
      return { status: 'offline', lastChecked: Date.now() };
    }

    // Local video streams are always active and immediate (<10ms)
    if (url.startsWith('/') || url.includes('/videos/')) {
      return {
        status: 'online',
        pingMs: 5,
        lastChecked: Date.now()
      };
    }

    const startTime = performance.now();

    // 1. Try server-side probe
    try {
      const serverRes = await fetch('/api/check-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (serverRes.ok) {
        const data = await serverRes.json();
        if (data.online) {
          return {
            status: 'online',
            pingMs: data.latencyMs || Math.round(performance.now() - startTime),
            lastChecked: Date.now()
          };
        }
      }
    } catch {
      // Continue to client-side fallback
    }

    // 2. Client-side probe fallback (works directly from user's TV/browser network)
    try {
      const clientStart = performance.now();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);

      await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      });

      clearTimeout(timeout);
      const ping = Math.round(performance.now() - clientStart);

      return {
        status: 'online',
        pingMs: ping,
        lastChecked: Date.now()
      };
    } catch {
      return {
        status: 'offline',
        lastChecked: Date.now()
      };
    }
  }, []);

  // Synchronize healthMap keys with current channels (prune stale keys from deleted or replaced playlists)
  useEffect(() => {
    const currentIds = new Set(channels.map((c) => c.id));
    setHealthMap((prev) => {
      if (channels.length === 0) return {};

      let hasStale = false;
      const next: Record<string, StreamHealth> = {};

      for (const [id, val] of Object.entries(prev)) {
        if (currentIds.has(id)) {
          next[id] = val;
        } else {
          hasStale = true;
        }
      }

      // Pre-seed newly added local channels
      channels.forEach((c) => {
        if ((c.url.startsWith('/') || c.url.includes('/videos/')) && !next[c.id]) {
          next[c.id] = { status: 'online', pingMs: 5, lastChecked: Date.now() };
          hasStale = true;
        }
      });

      return hasStale ? next : prev;
    });
  }, [channels]);

  // Background worker loop that tests channels smoothly in background
  useEffect(() => {
    isCancelledRef.current = false;

    if (channels.length === 0) return;

    const runBackgroundChecker = async () => {
      if (isRunningRef.current) return;
      isRunningRef.current = true;

      // In Data Saver mode, only check the active channel, do not scan other channels continuously
      const testList = isDataSaver
        ? channels.filter((c) => c.id === activeChannelId)
        : [...channels].sort((a, b) => {
            if (a.id === activeChannelId) return -1;
            if (b.id === activeChannelId) return 1;
            return 0;
          });

      for (let i = 0; i < testList.length; i++) {
        if (isCancelledRef.current) break;

        const ch = testList[i];

        // Skip if already tested as local video
        if (ch.url.startsWith('/') || ch.url.includes('/videos/')) {
          setHealthMap((prev) => ({
            ...prev,
            [ch.id]: { status: 'online', pingMs: 5, lastChecked: Date.now() }
          }));
          continue;
        }

        // Mark checking
        setHealthMap((prev) => ({
          ...prev,
          [ch.id]: prev[ch.id]?.status === 'online'
            ? prev[ch.id]
            : { status: 'checking', lastChecked: Date.now() }
        }));

        // Probe stream
        const result = await checkSingleStream(ch.id, ch.url);

        if (isCancelledRef.current) break;

        setHealthMap((prev) => ({
          ...prev,
          [ch.id]: result
        }));

        // Pause between background checks so CPU & network stay fast
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      isRunningRef.current = false;
    };

    const startTimeout = setTimeout(() => {
      runBackgroundChecker();
    }, 300);

    return () => {
      isCancelledRef.current = true;
      clearTimeout(startTimeout);
      isRunningRef.current = false;
    };
  }, [channels, checkSingleStream, activeChannelId, isDataSaver]);

  // Retest a specific channel on demand
  const retestChannel = useCallback(async (id: string, url: string) => {
    setHealthMap((prev) => ({
      ...prev,
      [id]: { status: 'checking', lastChecked: Date.now() }
    }));
    const res = await checkSingleStream(id, url);
    setHealthMap((prev) => ({
      ...prev,
      [id]: res
    }));
  }, [checkSingleStream]);

  // Reset health map completely
  const resetHealth = useCallback(() => {
    const initial: Record<string, StreamHealth> = {};
    channels.forEach((c) => {
      if (c.url.startsWith('/') || c.url.includes('/videos/')) {
        initial[c.id] = { status: 'online', pingMs: 5, lastChecked: Date.now() };
      }
    });
    setHealthMap(initial);
  }, [channels]);

  // Strictly calculate count only from channels currently present in the list
  const onlineCount = useMemo(() => {
    const channelIds = new Set(channels.map((c) => c.id));
    return channels.filter((c) => channelIds.has(c.id) && healthMap[c.id]?.status === 'online').length;
  }, [channels, healthMap]);

  const offlineCount = useMemo(() => {
    const channelIds = new Set(channels.map((c) => c.id));
    return channels.filter((c) => channelIds.has(c.id) && healthMap[c.id]?.status === 'offline').length;
  }, [channels, healthMap]);

  return {
    healthMap,
    onlineCount,
    offlineCount,
    retestChannel,
    resetHealth
  };
}
