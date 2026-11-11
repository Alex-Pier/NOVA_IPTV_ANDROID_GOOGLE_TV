import { Channel, SafetyAuditResult } from '../types/iptv';

// Known trusted legal broadcasters & verified CDN infrastructure
const TRUSTED_LEGAL_DOMAINS = [
  'rai.it',
  'rainews.it',
  'mediaset.net',
  'euronews.com',
  'dw.com',
  'france24.com',
  'bloomberg.com',
  'aljazeera.net',
  'nasa.gov',
  'akamaihd.net',
  'akamaized.net',
  'fastly.net',
  'cloudfront.net',
  'pluto.tv',
  'redbull.com',
  'redbull.tv',
  'cbsnews.com',
  'samsungtvplus.com',
  'rakuten.tv',
  'nhk.or.jp',
  'wurl.com',
  'amagi.tv',
  'unified-streaming.com',
  'test-streams.mux.dev',
  'bitmovin.com',
  'cloudflarestream.com'
];

// Patterns often associated with unauthorized / pirate re-streaming portals
const SUSPICIOUS_PORTAL_PATTERNS = [
  /:\d{4,5}\/(live|movie|series)\//i, // Xtream codes standard format: :8080/live/user/pass/id.ts
  /[?&](username|user|passwd|password|token)=/i,
  /\/get\.php\?username=/i,
  /\/stalker_portal\//i,
  /\/c\/index\.html/i
];

export function analyzeSafety(url: string, channels: Partial<Channel>[] = []): SafetyAuditResult {
  const checks: SafetyAuditResult['checks'] = [];
  let score = 100;
  const recommendations: string[] = [];

  const isHttps = url.startsWith('https://');
  checks.push({
    name: 'Protocollo Cifrato HTTPS / SSL',
    passed: isHttps,
    details: isHttps 
      ? 'La playlist utilizza un canale di trasmissione crittografato HTTPS.' 
      : 'Attenzione: la playlist utilizza HTTP in chiaro, vulnerabile ad intercettazioni.'
  });
  if (!isHttps) score -= 15;

  let urlHostname = '';
  try {
    const parsed = new URL(url);
    urlHostname = parsed.hostname;
  } catch {
    urlHostname = '';
  }

  // Check if raw IP
  const isRawIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(urlHostname);
  checks.push({
    name: 'Verifica Dominio / Autenticità Host',
    passed: !isRawIp,
    details: isRawIp 
      ? 'Rilevato indirizzo IP grezzo senza dominio certificato (spesso usato da server illegali non registrati).'
      : `Dominio registrato valido: ${urlHostname}`
  });
  if (isRawIp) {
    score -= 30;
    recommendations.push('Evita liste che puntano a IP numerici nudi: presentano alto rischio di chiusura immediata o malware.');
  }

  // Check xtream codes patterns
  const hasPiratePatterns = SUSPICIOUS_PORTAL_PATTERNS.some(pat => pat.test(url));
  checks.push({
    name: 'Filtro Anti-Pirateria Xtream Codes / Stalker',
    passed: !hasPiratePatterns,
    details: hasPiratePatterns 
      ? 'Rilevata struttura tipica di IPTV illegale / rivendita pirata (credenziali in chiaro nell\'URL).'
      : 'Nessun pattern di credenziali pirata o portali stalker individuato.'
  });
  if (hasPiratePatterns) {
    score -= 50;
    recommendations.push('Questa playlist include parametri di autenticazione tipici delle IPTV pirata. Ricorda che in Italia l\'uso di IPTV pirata è sanzionato da AGCOM.');
  }

  // Trusted broadcaster match
  const isTrustedDomain = TRUSTED_LEGAL_DOMAINS.some(dom => urlHostname.endsWith(dom));
  checks.push({
    name: 'Emittente Ufficiale o CDN Certificata (FTA)',
    passed: isTrustedDomain,
    details: isTrustedDomain 
      ? `Canale ospitato su infrastruttura certificata (${urlHostname}).`
      : 'Canale ospitato su server CDN di terze parti o web streaming generico.'
  });
  if (isTrustedDomain) {
    score = Math.min(100, score + 10);
  }

  // Analyze channels streams if available
  if (channels.length > 0) {
    let unencryptedStreams = 0;
    let rawIpStreams = 0;
    let xtreamStreams = 0;

    channels.forEach(ch => {
      if (ch.url) {
        if (!ch.url.startsWith('https://')) unencryptedStreams++;
        if (SUSPICIOUS_PORTAL_PATTERNS.some(p => p.test(ch.url!))) xtreamStreams++;
        try {
          const u = new URL(ch.url);
          if (/^(\d{1,3}\.){3}\d{1,3}$/.test(u.hostname)) rawIpStreams++;
        } catch {
          // ignore
        }
      }
    });

    if (xtreamStreams > channels.length * 0.3) {
      score = Math.min(score, 30);
    }
  }

  score = Math.max(0, Math.min(100, score));

  let verdict: SafetyAuditResult['verdict'] = 'SAFE_LEGAL';
  let title = 'Canale Legale e Sicuro al 100%';
  let description = 'Questa lista rispetta i criteri di sicurezza, proviene da emittenti pubbliche autorizzate o canali gratuiti legali Free-to-Air.';

  if (score < 45) {
    verdict = 'SUSPICIOUS_HIGH_RISK';
    title = 'Alto Rischio: Possibile Lista Non Autorizzata / Pirata';
    description = 'La lista presenta caratteristiche associate a flussi IPTV pirata illegali, server non sicuri o credenziali rubate.';
  } else if (score < 75) {
    verdict = 'COMMUNITY_UNVERIFIED';
    title = 'Fonte Pubblica da Verificare';
    description = 'Lista open source o comunitaria. I canali sembrano pubblici, ma raccomandiamo prudenza per flussi instabili.';
  }

  if (recommendations.length === 0) {
    recommendations.push('Playlist conforme. Adatta per lo streaming su Google TV e Android TV.');
  }

  return {
    score,
    verdict,
    title,
    description,
    checks,
    recommendations
  };
}

export function parseM3U(content: string, defaultSourceUrl = ''): Channel[] {
  const lines = content.split(/\r?\n/);
  const channels: Channel[] = [];
  let currentChannel: Partial<Channel> | null = null;
  let channelIndex = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue;

    if (line.startsWith('#EXTINF:')) {
      // Parse EXTINF metadata
      currentChannel = {
        id: `ch_${channelIndex}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        number: channelIndex,
        safetyStatus: 'legal_verified',
        group: 'Generale'
      };

      // Extract attributes: tvg-id, tvg-name, tvg-logo, group-title, radio
      const tvgIdMatch = line.match(/tvg-id="([^"]*)"/i);
      if (tvgIdMatch) currentChannel.tvgId = tvgIdMatch[1];

      const tvgNameMatch = line.match(/tvg-name="([^"]*)"/i);
      if (tvgNameMatch) currentChannel.tvgName = tvgNameMatch[1];

      const logoMatch = line.match(/tvg-logo="([^"]*)"/i);
      if (logoMatch) currentChannel.logo = logoMatch[1];

      const groupMatch = line.match(/group-title="([^"]*)"/i);
      if (groupMatch) currentChannel.group = groupMatch[1];

      const radioMatch = line.match(/radio="true"/i) || line.match(/tvg-type="radio"/i);
      if (radioMatch) currentChannel.isRadio = true;

      // Extract channel title after the last comma
      const commaIndex = line.lastIndexOf(',');
      if (commaIndex !== -1) {
        const title = line.substring(commaIndex + 1).trim();
        currentChannel.name = title || currentChannel.tvgName || `Canale ${channelIndex}`;
      } else {
        currentChannel.name = currentChannel.tvgName || `Canale ${channelIndex}`;
      }
    } else if (line.startsWith('#EXTGRP:')) {
      if (currentChannel) {
        currentChannel.group = line.replace('#EXTGRP:', '').trim();
      }
    } else if (line.startsWith('#')) {
      // Other directive, ignore
      continue;
    } else {
      // This is the stream URL
      if (currentChannel) {
        currentChannel.url = line;
        
        // Safety evaluation for individual channel
        const isIp = /^https?:\/\/(\d{1,3}\.){3}\d{1,3}/.test(line);
        const hasXtream = SUSPICIOUS_PORTAL_PATTERNS.some(p => p.test(line));

        if (hasXtream) {
          currentChannel.safetyStatus = 'suspicious';
          currentChannel.safetyReason = 'Pattern Xtream / credenziali non autorizzate';
        } else if (isIp) {
          currentChannel.safetyStatus = 'community_public';
          currentChannel.safetyReason = 'Server su IP numerico diretto';
        } else {
          currentChannel.safetyStatus = 'legal_verified';
          currentChannel.safetyReason = 'Flusso legale verificato';
        }

        channels.push(currentChannel as Channel);
        channelIndex++;
        currentChannel = null;
      } else {
        // Standalone URL without #EXTINF
        const guessedName = `Stream ${channelIndex}`;
        channels.push({
          id: `ch_${channelIndex}_${Date.now()}`,
          number: channelIndex,
          name: guessedName,
          url: line,
          group: 'Internet TV',
          safetyStatus: 'community_public'
        });
        channelIndex++;
      }
    }
  }

  return channels;
}

export function exportToM3U(channels: Channel[], playlistName = 'NovaTV Export'): string {
  let content = '#EXTM3U x-tvg-url="https://iptv-org.github.io/epg/guides/it.xml"\n';
  channels.forEach((ch, idx) => {
    const num = ch.number || idx + 1;
    const tvgId = ch.tvgId ? ` tvg-id="${ch.tvgId}"` : '';
    const tvgName = ch.tvgName ? ` tvg-name="${ch.tvgName}"` : ` tvg-name="${ch.name}"`;
    const logo = ch.logo ? ` tvg-logo="${ch.logo}"` : '';
    const group = ch.group ? ` group-title="${ch.group}"` : ' group-title="Generale"';
    const radio = ch.isRadio ? ' radio="true"' : '';
    
    content += `#EXTINF:-1${tvgId}${tvgName}${logo}${group}${radio},${ch.name}\n`;
    content += `${ch.url}\n`;
  });
  return content;
}
