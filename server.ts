import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import https from 'https';
import { searchComprehensiveWebM3U, ALL_WEB_M3U_SOURCES } from './src/utils/m3uWebCrawler';
import {
  classifyGenreFromText,
  classifyLanguageFromText
} from './src/utils/m3uClassifier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Fast native web search and discovery endpoint across all web M3U playlists
app.post('/api/search-m3u-online', (req, res) => {
  try {
    const {
      query = '',
      filterSafeOnly = false,
      selectedGenre = 'Tutti',
      selectedLanguage = 'Tutte'
    } = req.body;

    const queryStr = String(query || '').trim();

    // Search comprehensive web catalog and dynamic crawler
    let matchedLists = searchComprehensiveWebM3U(
      queryStr,
      Boolean(filterSafeOnly),
      selectedGenre,
      selectedLanguage
    );

    // Verify genre and language from description
    matchedLists = matchedLists.map((item) => ({
      ...item,
      genre: classifyGenreFromText(item.description + ' ' + item.title + ' ' + item.genre),
      language: classifyLanguageFromText(item.description + ' ' + item.title + ' ' + item.language)
    }));

    if (!res.headersSent) {
      return res.json({
        success: true,
        query: queryStr,
        results: matchedLists,
        count: matchedLists.length
      });
    }
  } catch (err: any) {
    console.error('Search error:', err);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: err.message || 'Errore nella ricerca online delle liste M3U'
      });
    }
  }
});

// Fast background stream health probe endpoint (bypasses browser CORS)
app.post('/api/check-stream', async (req, res) => {
  const { url = '' } = req.body;
  if (!url || typeof url !== 'string') {
    return res.json({ online: false, reason: 'URL non valido' });
  }

  // Local video streams are always active and immediate
  if (url.startsWith('/')) {
    return res.json({ online: true, statusCode: 200, latencyMs: 5 });
  }

  if (!url.startsWith('http')) {
    return res.json({ online: false, reason: 'Protocollo non supportato' });
  }

  const startTime = Date.now();
  let responded = false;

  const sendResponse = (payload: any) => {
    if (responded || res.headersSent) return;
    responded = true;
    res.json(payload);
  };

  try {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const reqOptions: http.RequestOptions = {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (SmartTV; GoogleTV; Leanback) NovaTV/1.0',
        'Range': 'bytes=0-1024',
        'Accept': '*/*'
      },
      timeout: 2500 // Fast 2.5s timeout so it never blocks
    };

    const probeReq = client.request(url, reqOptions, (probeRes) => {
      const statusCode = probeRes.statusCode || 0;
      const latencyMs = Date.now() - startTime;
      try {
        probeRes.destroy(); // Close stream immediately after reading headers
      } catch (_) {}

      const isOnline = statusCode >= 200 && statusCode < 400;
      sendResponse({
        online: isOnline,
        statusCode,
        latencyMs
      });
    });

    probeReq.on('timeout', () => {
      try {
        probeReq.destroy();
      } catch (_) {}
      sendResponse({ online: false, timeout: true, latencyMs: 2500 });
    });

    probeReq.on('error', () => {
      sendResponse({ online: false, error: true });
    });

    probeReq.end();
  } catch (err) {
    sendResponse({ online: false, error: true });
  }
});

// Setup static video stream assets
app.use('/videos', express.static(path.resolve(__dirname, 'public/videos')));

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NovaTV Google TV Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
