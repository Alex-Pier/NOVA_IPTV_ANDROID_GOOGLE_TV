import { M3uGenre, M3uLanguage, DiscoveredM3uList } from '../types/iptv';

export function classifyGenreFromText(text: string): M3uGenre {
  const t = text.toLowerCase();

  // Adult / 18+ / Porno
  if (t.match(/\b(porno|adulti|18\+|xxx|erotico|erotica|sexy|hardcore|redlight|playboy|hustler|babes|nightclub|lingerie|glamour|cam|adult)\b/i)) {
    return 'Adulti 18+';
  }

  // News / Notizie
  if (t.match(/\b(notizie|news|tg|giornale|informazione|meteo|attualit|politica|ansa|reuters|euronews|rai news)\b/i)) {
    return 'Notizie';
  }

  // Sport / Motori
  if (t.match(/\b(sport|calcio|motori|formula|f1|moto|motogp|basket|tennis|bici|cycling|extreme|red bull|chase|championship|liga|serie a)\b/i)) {
    return 'Sport';
  }

  // Cinema & Film & Serie
  if (t.match(/\b(cinema|film|serie|movies|movie|telefilm|hollywood|cortometraggi|fiction|blender|drammatico|commedia)\b/i)) {
    return 'Cinema & Serie';
  }

  // Musica & Radio
  if (t.match(/\b(musica|music|radio|dj|dance|clip|videoclip|canzoni|hit|pop|rock|concerti|defected|radio italia|rtl)\b/i)) {
    return 'Musica';
  }

  // Documentari & Natura
  if (t.match(/\b(documentari|documentary|natura|nature|wildlife|animali|storia|archeologia|geografia|safari|terra)\b/i)) {
    return 'Documentari';
  }

  // Bambini & Ragazzi
  if (t.match(/\b(bambini|kids|cartoni|cartoon|cartoons|animazione|animation|anime|disney|didattico|scuola|ragazzi)\b/i)) {
    return 'Bambini & Ragazzi';
  }

  // Cultura & Scienza / Spazio
  if (t.match(/\b(scienza|spazio|space|nasa|iss|astronomia|cultura|arte|storia|divulgazione|tech|tecnologia)\b/i)) {
    return 'Cultura & Scienza';
  }

  // Intrattenimento / Varietà
  if (t.match(/\b(intrattenimento|talk|show|reality|game|quiz|comico|variet|lifestyle|cucina|cooking)\b/i)) {
    return 'Intrattenimento';
  }

  return 'Generale';
}

export function classifyLanguageFromText(text: string): M3uLanguage {
  const t = text.toLowerCase();

  // Italian indicators
  if (t.match(/\b(italiano|italia|italy|rai|mediaset|roma|milano|tg|canale|in chiaro|nazionale|digitale terrestre)\b/i)) {
    return 'Italiano';
  }

  // Spanish indicators
  if (t.match(/\b(spagnolo|spanish|español|spagna|espana|tdt|madrid|televisión|canales|noticias)\b/i)) {
    return 'Spagnolo';
  }

  // French indicators
  if (t.match(/\b(francese|french|français|france|paris|actualités|chaîne)\b/i)) {
    return 'Francese';
  }

  // German indicators
  if (t.match(/\b(tedesco|german|deutsch|germany|berlin|nachrichten|fernsehen)\b/i)) {
    return 'Tedesco';
  }

  // English indicators
  if (t.match(/\b(english|inglese|uk|usa|american|british|world news|broadcast|stream)\b/i)) {
    return 'Inglese';
  }

  return 'Multi-lingua';
}

export function filterAndRankDiscoveredLists(
  lists: DiscoveredM3uList[],
  query: string,
  filterSafeOnly: boolean,
  selectedGenre?: string,
  selectedLanguage?: string
): DiscoveredM3uList[] {
  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/).filter((t) => t.length > 0);

  const matched = lists.filter((item) => {
    // Only apply strict legal filter if explicitly requested (default is false)
    if (filterSafeOnly && !item.isLegalVerified) {
      return false;
    }

    // Genre Filter
    if (selectedGenre && selectedGenre !== 'Tutti' && item.genre !== selectedGenre) {
      return false;
    }

    // Language Filter
    if (selectedLanguage && selectedLanguage !== 'Tutte' && item.language !== selectedLanguage) {
      return false;
    }

    // If no query, pass filter
    if (tokens.length === 0) return true;

    // Check tokens across fields
    const searchableText = [
      item.title,
      item.sourceName,
      item.description,
      item.genre,
      item.language,
      item.country,
      ...(item.sampleChannels || []),
      ...(item.channels?.map((c) => c.name) || [])
    ]
      .join(' ')
      .toLowerCase();

    // At least one token must match
    return tokens.some((token) => searchableText.includes(token));
  });

  if (tokens.length === 0) return matched;

  // Rank by relevance score
  return matched.sort((a, b) => {
    const scoreA = calculateRelevanceScore(a, tokens);
    const scoreB = calculateRelevanceScore(b, tokens);
    return scoreB - scoreA;
  });
}

function calculateRelevanceScore(item: DiscoveredM3uList, tokens: string[]): number {
  let score = 0;
  const title = item.title.toLowerCase();
  const desc = item.description.toLowerCase();
  const source = item.sourceName.toLowerCase();
  const genre = item.genre.toLowerCase();
  const lang = item.language.toLowerCase();
  const channels = (item.sampleChannels || []).join(' ').toLowerCase();

  for (const token of tokens) {
    if (title.includes(token)) score += 60;
    if (channels.includes(token)) score += 50;
    if (genre.includes(token)) score += 35;
    if (lang.includes(token)) score += 30;
    if (desc.includes(token)) score += 20;
    if (source.includes(token)) score += 15;
  }

  return score;
}
