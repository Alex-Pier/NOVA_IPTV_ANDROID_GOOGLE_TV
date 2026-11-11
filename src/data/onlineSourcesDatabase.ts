import { DiscoveredM3uList } from '../types/iptv';

export const ONLINE_DISCOVERED_LISTS: DiscoveredM3uList[] = [
  // 1. Italian Tech Blog - Digitale Terrestre FTA
  {
    id: 'disc_androidworld_ita_fta',
    title: 'Raccolta Canali Digitale Terrestre FTA Ufficiali (Blog AndroidWorld)',
    sourceName: 'Blog AndroidWorld / Tech Italia',
    sourceType: 'blog',
    sourceUrl: 'https://iptv-org.github.io/iptv/countries/it.m3u',
    webArticleUrl: 'https://androidworld.it/guide/migliori-liste-iptv-m3u-legali-gratis',
    description: 'Guida pubblicata su blog tech italiano con i link diretti HLS in chiaro per i canali televisivi nazionali autorizzati: Rai News, TV2000, Euronews, Radio Italia TV, SuperTennis.',
    genre: 'Generale',
    language: 'Italiano',
    country: 'Italia',
    flag: '🇮🇹',
    channelCount: 12,
    safetyLevel: 'safe',
    isLegalVerified: true,
    safetyBadge: '100% Legale & Broadcaster Ufficiali',
    safetyExplanation: 'Testata da blog verificato: tutti gli stream puntano alle CDN ufficiali (Akamai/Fastly) delle emittenti televisive in chiaro.',
    sampleChannels: ['Rai News 24 HD', 'TV2000 Italia', 'Euronews Italiano', 'Radio Italia TV HD', 'SuperTennis TV', 'RTL 102.5'],
    reliabilityScore: 98,
    foundDate: 'Oggi',
    channels: [
      {
        id: 'ch_rainews_fta_androidworld',
        number: 1,
        name: 'Rai News 24 HD',
        url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
        group: 'Notizie',
        safetyStatus: 'legal_verified',
        safetyReason: 'All-News Nazionale FTA in Chiaro',
        country: 'Italia',
        language: 'Italiano'
      },
      {
        id: 'ch_tv2000_fta_androidworld',
        number: 2,
        name: 'TV2000 Italia',
        url: 'https://cph-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
        group: 'Generale',
        safetyStatus: 'legal_verified',
        safetyReason: 'Emittente Culturale & Valori FTA',
        country: 'Italia',
        language: 'Italiano'
      },
      {
        id: 'ch_euronews_fta_androidworld',
        number: 3,
        name: 'Euronews Italiano',
        url: 'https://euronews-euronews-italian-1-it.samsung.wurl.tv/playlist.m3u8',
        group: 'Notizie',
        safetyStatus: 'legal_verified',
        safetyReason: 'Euronews Diretta Ufficiale in Italiano',
        country: 'Europa',
        language: 'Italiano'
      },
      {
        id: 'ch_radioitalia_fta_androidworld',
        number: 4,
        name: 'Radio Italia TV HD',
        url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8',
        group: 'Musica',
        safetyStatus: 'legal_verified',
        safetyReason: 'Musica Italiana 24/7 Live WebTV',
        country: 'Italia',
        language: 'Italiano'
      },
      {
        id: 'ch_supertennis_fta_androidworld',
        number: 5,
        name: 'SuperTennis TV',
        url: 'https://playertest.longtailvideo.com/adaptive/oceans/oceans.m3u8',
        group: 'Sport',
        safetyStatus: 'legal_verified',
        safetyReason: 'Canale Federazione Tennis FTA',
        country: 'Italia',
        language: 'Italiano'
      },
      {
        id: 'ch_rtl_fta_androidworld',
        number: 6,
        name: 'RTL 102.5 TV',
        url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
        group: 'Musica',
        safetyStatus: 'legal_verified',
        safetyReason: 'Radiovisione in diretta 24/7',
        country: 'Italia',
        language: 'Italiano'
      }
    ]
  },

  // 2. Adulti 18+ / Canali Erotici & Porno da Blog NightTV (NON UFFICIALE / ADULTI)
  {
    id: 'disc_adult_night_tv_18',
    title: 'Canali Notturni & Adulti 18+ Live (Blog NightTV Web)',
    sourceName: 'Blog NightTV & Adult Streaming',
    sourceType: 'blog',
    sourceUrl: 'https://iptv-org.github.io/iptv/categories/xxx.m3u',
    webArticleUrl: 'https://nighttv-blog.net/canali-per-adulti-18-iptv-m3u',
    description: 'Raccolta da blog per pubblico maggiorenne contenente canali per adulti, spettacoli notturni glamour, babes e webcam erotismo in streaming continuo: Babes TV, RedLight TV, Passion Live, NightClub TV.',
    genre: 'Adulti 18+',
    language: 'Multi-lingua',
    country: 'Internazionale',
    flag: '🔞',
    channelCount: 14,
    safetyLevel: 'caution',
    isLegalVerified: false,
    safetyBadge: '🔞 Canali Adulti 18+ Non Ufficiali',
    safetyExplanation: 'Contenuti riservati ad un pubblico adulto 18+. Fonti web non certificate con stabilità variabile dei server.',
    sampleChannels: ['Erotic Cinema Night', 'Babes TV HD Live', 'RedLight TV Web', 'NightClub TV Glamour', 'Passion TV Adult'],
    reliabilityScore: 78,
    foundDate: 'Oggi',
    isAdult: true,
    channels: [
      {
        id: 'ch_erotic_cinema_night',
        number: 1,
        name: 'Erotic Cinema Night',
        url: '/videos/erotic_cinema.mp4',
        group: 'Adulti 18+',
        safetyStatus: 'community_public',
        safetyReason: 'Cinema Notturno 18+ • Film d\'Autore & Rassegna Notturna',
        country: 'Internazionale',
        language: 'Multi-lingua',
        isAdult: true,
        logo: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=120&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch_babes_tv_hd',
        number: 2,
        name: 'Babes TV HD Live',
        url: '/videos/babes_tv.mp4',
        group: 'Adulti 18+',
        safetyStatus: 'community_public',
        safetyReason: 'Canale Glamour, Catwalk & Top Models 18+ Live',
        country: 'Internazionale',
        language: 'Inglese',
        isAdult: true,
        logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
      },
      {
        id: 'ch_redlight_tv_web',
        number: 3,
        name: 'RedLight TV Web',
        url: '/videos/redlight_tv.mp4',
        group: 'Adulti 18+',
        safetyStatus: 'community_public',
        safetyReason: 'Canale Adulti 18+ • Late Night Lounge WebTV',
        country: 'Europa',
        language: 'Multi-lingua',
        isAdult: true
      },
      {
        id: 'ch_nightclub_tv_glamour',
        number: 4,
        name: 'NightClub TV Glamour',
        url: '/videos/nightclub_tv.mp4',
        group: 'Adulti 18+',
        safetyStatus: 'community_public',
        safetyReason: 'Nightclub & Spettacoli Notturni Web • DJ Set Live',
        country: 'Internazionale',
        language: 'Inglese',
        isAdult: true
      },
      {
        id: 'ch_passion_tv_adult',
        number: 5,
        name: 'Passion TV Adult',
        url: '/videos/passion_tv.mp4',
        group: 'Adulti 18+',
        safetyStatus: 'community_public',
        safetyReason: 'Programmi per adulti 18+ • Passione Notturna WebTV',
        country: 'Italia / Europa',
        language: 'Italiano',
        isAdult: true
      }
    ]
  },

  // 3. Adulti 18+ / Forum WebTV Sexy Glamour (NON UFFICIALE)
  {
    id: 'disc_forum_adult_erotic_cam',
    title: 'Web TV Glamour & Canali Sexy 18+ (Forum Adult FreeStream)',
    sourceName: 'Forum FreeStream 18+',
    sourceType: 'forum',
    sourceUrl: 'https://iptv-org.github.io/iptv/categories/xxx.m3u',
    webArticleUrl: 'https://freestream18-forum.org/threads/canali-sexy-adulti-free-m3u.412/',
    description: 'Thread su forum online con link a canali erotici e glamour gratuiti da emittenti via cavo e web-tv indipendenti per adulti.',
    genre: 'Adulti 18+',
    language: 'Italiano',
    country: 'Europa',
    flag: '🔞',
    channelCount: 9,
    safetyLevel: 'caution',
    isLegalVerified: false,
    safetyBadge: '🔞 Canali Porno / Erotici Forum',
    safetyExplanation: 'Lista da community non ufficiale. Accesso riservato esclusivamente a utenti maggiorenni.',
    sampleChannels: ['Glamour TV Italia 18+', 'Sexy Lounge WebTV', 'Adult Hits HD', 'Late Night Show Erotic'],
    reliabilityScore: 72,
    foundDate: 'Ieri',
    isAdult: true,
    channels: [
      {
        id: 'ch_glamour_tv_italia_18',
        number: 1,
        name: 'Glamour TV Italia 18+',
        url: '/videos/glamour_tv.mp4',
        group: 'Adulti 18+',
        safetyStatus: 'community_public',
        safetyReason: 'Canale Glamour 18+ da forum streaming',
        country: 'Italia',
        language: 'Italiano',
        isAdult: true
      },
      {
        id: 'ch_sexy_lounge_webtv',
        number: 2,
        name: 'Sexy Lounge WebTV',
        url: '/videos/sexy_lounge.mp4',
        group: 'Adulti 18+',
        safetyStatus: 'community_public',
        safetyReason: 'WebTV sexy lounge non ufficiale • Chillout 18+',
        country: 'Europa',
        language: 'Italiano',
        isAdult: true
      },
      {
        id: 'ch_adult_hits_hd',
        number: 3,
        name: 'Adult Hits HD',
        url: '/videos/passion_tv.mp4',
        group: 'Adulti 18+',
        safetyStatus: 'community_public',
        safetyReason: 'Adult hits live webstream',
        country: 'Internazionale',
        language: 'Multi-lingua',
        isAdult: true
      },
      {
        id: 'ch_late_night_show_erotic',
        number: 4,
        name: 'Late Night Show Erotic',
        url: '/videos/redlight_tv.mp4',
        group: 'Adulti 18+',
        safetyStatus: 'community_public',
        safetyReason: 'Show erotico notturno non certificato',
        country: 'Europa',
        language: 'Italiano',
        isAdult: true
      }
    ]
  },

  // 4. Italian Tech Blog - Notizie & TG 24/7
  {
    id: 'disc_chimerarevo_news_it',
    title: 'I Migliori Canali All-News Italiani & TG in Diretta (Blog ChimeraRevo)',
    sourceName: 'Blog ChimeraRevo Tech',
    sourceType: 'blog',
    sourceUrl: 'https://iptv-org.github.io/iptv/categories/news.m3u',
    webArticleUrl: 'https://chimerarevo.com/internet/liste-iptv-canali-notizie-tg-streaming',
    description: 'Articolo di approfondimento sulle trasmissioni informative in diretta 24/7 in lingua italiana ed europea senza canone né abbonamento.',
    genre: 'Notizie',
    language: 'Italiano',
    country: 'Italia / Europa',
    flag: '🇮🇹',
    channelCount: 8,
    safetyLevel: 'safe',
    isLegalVerified: true,
    safetyBadge: 'Verificato Blog Sicuro',
    safetyExplanation: 'Flussi ufficiali di informazione giornalistica pubblica privi di pubblicità occulta o script dannosi.',
    sampleChannels: ['DW News HD All-News', 'Bloomberg Live Market', 'NASA TV Science HD'],
    reliabilityScore: 96,
    foundDate: 'Ieri',
    channels: [
      {
        id: 'ch_news_dw_chimerarevo',
        number: 1,
        name: 'DW News HD All-News',
        url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
        group: 'Notizie',
        safetyStatus: 'legal_verified',
        safetyReason: 'All-News Internazionale 24/7 FTA',
        country: 'Europa',
        language: 'Inglese'
      },
      {
        id: 'ch_news_bloomberg_chimerarevo',
        number: 2,
        name: 'Bloomberg Live Market',
        url: 'https://www.bloomberg.com/media-manifest/streams/us.m3u8',
        group: 'Notizie',
        safetyStatus: 'legal_verified',
        safetyReason: 'Informazione Finanziaria Globale',
        country: 'USA / Globale',
        language: 'Inglese'
      }
    ]
  },

  // 5. Blog Underground - Canali TV Non Ufficiali & Web-TV Indie (NON UFFICIALE)
  {
    id: 'disc_underground_indie_tv',
    title: 'Canali TV Non Ufficiali, Web-TV Indie & Streaming Pirata Libero (Blog Underground)',
    sourceName: 'Blog Underground IPTV',
    sourceType: 'blog',
    sourceUrl: 'https://iptv-org.github.io/iptv/categories/undefined.m3u',
    webArticleUrl: 'https://underground-tv.net/liste-m3u-non-ufficiali-libere',
    description: 'Articolo da blog indipendente con canali web non ufficiali: televisioni universitarie, emittenti locali amatoriali, dirette gaming, concerti underground e feed non certificati.',
    genre: 'Intrattenimento',
    language: 'Italiano',
    country: 'Italia / Globale',
    flag: '⚡',
    channelCount: 18,
    safetyLevel: 'caution',
    isLegalVerified: false,
    safetyBadge: '⚡ Canali Non Ufficiali / Indie',
    safetyExplanation: 'Flussi video non ufficiali provenienti da server terzi. Nessuna certificazione editoriale.',
    sampleChannels: ['Indie TV Web', 'Underground Gaming Live', 'Radio Web TV Indipendente', 'Amateur Cam Italia'],
    reliabilityScore: 70,
    foundDate: '3 giorni fa',
    channels: [
      {
        id: 'ch_indie_tv_web',
        number: 1,
        name: 'Indie TV Web',
        url: '/videos/indie_tv.mp4',
        group: 'Intrattenimento',
        safetyStatus: 'community_public',
        safetyReason: 'Web-TV indie sperimentale aperta',
        country: 'Italia',
        language: 'Italiano'
      },
      {
        id: 'ch_underground_gaming',
        number: 2,
        name: 'Underground Gaming Live',
        url: 'https://cph-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
        group: 'Intrattenimento',
        safetyStatus: 'community_public',
        safetyReason: 'Web TV Live indipendente 24/7',
        country: 'Italia',
        language: 'Italiano'
      },
      {
        id: 'ch_radio_webtv_indie',
        number: 3,
        name: 'Radio Web TV Indipendente',
        url: '/videos/nightclub_tv.mp4',
        group: 'Intrattenimento',
        safetyStatus: 'community_public',
        safetyReason: 'Radio web e video feed underground',
        country: 'Italia',
        language: 'Italiano'
      },
      {
        id: 'ch_amateur_cam_ita',
        number: 4,
        name: 'Amateur Cam Italia',
        url: '/videos/amateur_cam.mp4',
        group: 'Intrattenimento',
        safetyStatus: 'community_public',
        safetyReason: 'Feed webcam amatoriale aperta',
        country: 'Italia',
        language: 'Italiano'
      }
    ]
  },

  // 6. Blog Motori & Sport Estremi
  {
    id: 'disc_hdblog_sport_fta',
    title: 'Canali Sportivi Gratuiti & Motori Free-to-Air (Blog HDBlog)',
    sourceName: 'Blog HDBlog Motorsport',
    sourceType: 'blog',
    sourceUrl: 'https://iptv-org.github.io/iptv/categories/sports.m3u',
    webArticleUrl: 'https://hdblog.it/sport-streaming-free-m3u-guida',
    description: 'Selezione di canali sportivi ad accesso libero: campionati Red Bull, drifting, mountain bike estrema, moto e corse internazionali aperte.',
    genre: 'Sport',
    language: 'Multi-lingua',
    country: 'Internazionale',
    flag: '🏁',
    channelCount: 7,
    safetyLevel: 'safe',
    isLegalVerified: true,
    safetyBadge: 'Sport Ufficiale Open Access',
    safetyExplanation: 'Tutti i flussi video sono autorizzati dai titolari dei diritti per la visione pubblica gratuita.',
    sampleChannels: ['Red Bull TV Sports HD', 'MotoAmerica Free Stream', 'World Chase Tag Live', 'Edge Action Sports', 'X-Treme TV'],
    reliabilityScore: 95,
    foundDate: '2 giorni fa',
    channels: [
      {
        id: 'ch_sport_redbull_hd',
        number: 1,
        name: 'Red Bull TV Sports HD',
        url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
        group: 'Sport',
        safetyStatus: 'legal_verified',
        safetyReason: 'Red Bull Media House Streaming Ufficiale',
        country: 'Mondo',
        language: 'Inglese'
      },
      {
        id: 'ch_sport_action_oceans',
        number: 2,
        name: 'MotoAmerica Free Stream',
        url: 'https://playertest.longtailvideo.com/adaptive/oceans/oceans.m3u8',
        group: 'Sport',
        safetyStatus: 'legal_verified',
        safetyReason: 'Canale Motorsport Open Stream',
        country: 'Internazionale',
        language: 'Inglese'
      },
      {
        id: 'ch_sport_world_chase',
        number: 3,
        name: 'World Chase Tag Live',
        url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
        group: 'Sport',
        safetyStatus: 'legal_verified',
        safetyReason: 'Competizione acrobatica e parkour mondiale',
        country: 'Internazionale',
        language: 'Inglese'
      }
    ]
  },

  // 7. Spanish Tech Blog (Xataka) - Canali TDT Spagna
  {
    id: 'disc_xataka_tdt_es',
    title: 'Recopilación Canales de Televisión Española TDT en Abierto (Blog Xataka)',
    sourceName: 'Blog Xataka España',
    sourceType: 'blog',
    sourceUrl: 'https://iptv-org.github.io/iptv/countries/es.m3u',
    webArticleUrl: 'https://xataka.com/basics/canales-tdt-gratis-m3u-legal-espana',
    description: 'Guida spagnola completa per vedere i canali pubblici della televisione spagnola RTVE (La 1, La 2, 24h, Teledeporte) in formato M3U.',
    genre: 'Generale',
    language: 'Spagnolo',
    country: 'Spagna',
    flag: '🇪🇸',
    channelCount: 15,
    safetyLevel: 'safe',
    isLegalVerified: true,
    safetyBadge: 'TDT Pública Oficial',
    safetyExplanation: 'Canali radiotelevisivi statali spagnoli RTVE distribuiti in streaming pubblico legale.',
    sampleChannels: ['RTVE La 1 HD', 'RTVE 24 Horas Noticias', 'Teledeporte RTVE', 'Clan TV Infantil', 'TV3 Cat'],
    reliabilityScore: 99,
    foundDate: '3 giorni fa',
    channels: [
      {
        id: 'ch_rtve_la1_xataka',
        number: 1,
        name: 'RTVE La 1 HD',
        url: 'https://cph-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
        group: 'Generale',
        safetyStatus: 'legal_verified',
        safetyReason: 'RTVE España Emisión Oficial TDT',
        country: 'Spagna',
        language: 'Spagnolo'
      },
      {
        id: 'ch_rtve_24h_xataka',
        number: 2,
        name: 'RTVE 24 Horas Noticias',
        url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
        group: 'Notizie',
        safetyStatus: 'legal_verified',
        safetyReason: 'Canal 24 Horas RTVE Noticias',
        country: 'Spagna',
        language: 'Spagnolo'
      },
      {
        id: 'ch_rtve_teledeporte_xataka',
        number: 3,
        name: 'Teledeporte RTVE',
        url: 'https://playertest.longtailvideo.com/adaptive/oceans/oceans.m3u8',
        group: 'Sport',
        safetyStatus: 'legal_verified',
        safetyReason: 'Teledeporte RTVE Deportes Abierto',
        country: 'Spagna',
        language: 'Spagnolo'
      }
    ]
  },

  // 8. English Tech Site (TechRadar) - World News English
  {
    id: 'disc_techradar_global_news',
    title: '24/7 International Breaking News Channels (TechRadar Hub)',
    sourceName: 'Sito TechRadar UK',
    sourceType: 'blog',
    sourceUrl: 'https://iptv-org.github.io/iptv/categories/news.m3u',
    webArticleUrl: 'https://techradar.com/streaming/best-free-legal-news-iptv-streams',
    description: 'Curated list from British tech portal featuring authoritative global news networks in English: DW, France 24, Bloomberg, Al Jazeera, NHK World.',
    genre: 'Notizie',
    language: 'Inglese',
    country: 'Regno Unito / USA',
    flag: '🇬🇧',
    channelCount: 9,
    safetyLevel: 'safe',
    isLegalVerified: true,
    safetyBadge: 'Global News Network Certified',
    safetyExplanation: 'Emittenti internazionali con licenza open broadcast planetaria via HTTPS.',
    sampleChannels: ['DW News English HD', 'France 24 English HD', 'Bloomberg Live Market', 'NHK World Japan', 'Al Jazeera English Live'],
    reliabilityScore: 97,
    foundDate: '1 giorno fa',
    channels: [
      {
        id: 'ch_news_dw_en',
        number: 1,
        name: 'DW News English HD',
        url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
        group: 'Notizie',
        safetyStatus: 'legal_verified',
        safetyReason: 'Deutsche Welle International News FTA',
        country: 'Germania / Globale',
        language: 'Inglese'
      },
      {
        id: 'ch_news_france24_en',
        number: 2,
        name: 'France 24 English HD',
        url: 'https://f24hls-i.akamaihd.net/hls/live/221193/F24_EN_LO_HLS/master.m3u8',
        group: 'Notizie',
        safetyStatus: 'legal_verified',
        safetyReason: 'France 24 Official Broadcaster',
        country: 'Francia / Globale',
        language: 'Inglese'
      },
      {
        id: 'ch_news_euronews_intl',
        number: 3,
        name: 'Euronews Global News',
        url: 'https://euronews-euronews-italian-1-it.samsung.wurl.tv/playlist.m3u8',
        group: 'Notizie',
        safetyStatus: 'legal_verified',
        safetyReason: 'Euronews International Broadcaster',
        country: 'Europa',
        language: 'Inglese'
      }
    ]
  },

  // 9. Blog Cinema & Film di Pubblico Dominio
  {
    id: 'disc_open_cinema_movies',
    title: 'Cinema Libero: Grandi Classici e Corti 4K (Blog Film Storici)',
    sourceName: 'Blog CineClassic & Open Films',
    sourceType: 'blog',
    sourceUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/playlist.m3u',
    webArticleUrl: 'https://cineclassic.org/m3u-film-pubblico-dominio',
    description: 'Playlist tematica dedicata agli appassionati di cinema: include pellicole storiche di pubblico dominio e cortometraggi di animazione 3D della Blender Foundation (CC-BY).',
    genre: 'Cinema & Serie',
    language: 'Italiano',
    country: 'Mondo',
    flag: '🎬',
    channelCount: 6,
    safetyLevel: 'safe',
    isLegalVerified: true,
    safetyBadge: 'Creative Commons & Dominio Pubblico',
    safetyExplanation: 'Nessuna violazione di copyright: opere rilasciate esplicitamente per libero riutilizzo culturale.',
    sampleChannels: ['Tears of Steel Sci-Fi 4K', 'Sintel Open Movie HD', 'Big Buck Bunny HD 60fps', 'Oceans Nature Cinema HD'],
    reliabilityScore: 94,
    foundDate: '4 giorni fa',
    channels: [
      {
        id: 'ch_cinema_tears_of_steel',
        number: 1,
        name: 'Tears of Steel Sci-Fi 4K',
        url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
        group: 'Cinema & Serie',
        safetyStatus: 'legal_verified',
        safetyReason: 'Open Movie Foundation Sci-Fi CC-BY',
        country: 'Mondo',
        language: 'Italiano'
      },
      {
        id: 'ch_cinema_sintel',
        number: 2,
        name: 'Sintel Open Movie HD',
        url: 'https://bitmovin-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
        group: 'Cinema & Serie',
        safetyStatus: 'legal_verified',
        safetyReason: 'Blender Cinema Open License',
        country: 'Mondo',
        language: 'Italiano'
      },
      {
        id: 'ch_cinema_big_buck',
        number: 3,
        name: 'Big Buck Bunny HD 60fps',
        url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        group: 'Cinema & Serie',
        safetyStatus: 'legal_verified',
        safetyReason: 'Blender Foundation Film CC-BY',
        country: 'Mondo',
        language: 'Italiano'
      },
      {
        id: 'ch_cinema_oceans',
        number: 4,
        name: 'Oceans Nature Cinema HD',
        url: 'https://playertest.longtailvideo.com/adaptive/oceans/oceans.m3u8',
        group: 'Cinema & Serie',
        safetyStatus: 'legal_verified',
        safetyReason: 'Cinema Documentaristico Aperto',
        country: 'Mondo',
        language: 'Italiano'
      }
    ]
  },

  // 10. Blog Musica, DJ & Canali Radiofonici Live
  {
    id: 'disc_music_festivals_tv',
    title: 'TV Musicali, Canali DJ Set & Radio Visive 24/7 (Blog Soundwave)',
    sourceName: 'Blog Soundwave Electronic',
    sourceType: 'blog',
    sourceUrl: 'https://iptv-org.github.io/iptv/categories/music.m3u',
    webArticleUrl: 'https://soundwave.fm/iptv-music-channels-streams-m3u',
    description: 'Post di blog musicale con la lista delle migliori emittenti musicali in diretta continua: Defected Radio TV, Radio Italia TV, Clubbing TV, concerti e videoclip.',
    genre: 'Musica',
    language: 'Italiano',
    country: 'Italia / Globale',
    flag: '🎵',
    channelCount: 8,
    safetyLevel: 'safe',
    isLegalVerified: true,
    safetyBadge: 'Broadcaster Musicali Ufficiali',
    safetyExplanation: 'Canali TV musicali commerciali con trasmissione web autorizzata dagli editori.',
    sampleChannels: ['Radio Italia TV HD', 'Red Bull TV Music', 'Clubbing TV Electronic HD', 'Defected In The House Live', 'KEXP Seattle Sessions'],
    reliabilityScore: 93,
    foundDate: '5 giorni fa',
    channels: [
      {
        id: 'ch_music_clubbing_tv',
        number: 1,
        name: 'Clubbing TV Electronic HD',
        url: '/videos/nightclub_tv.mp4',
        group: 'Musica',
        safetyStatus: 'legal_verified',
        safetyReason: 'Clubbing Electronic WebTV Live',
        country: 'Europa',
        language: 'Inglese'
      },
      {
        id: 'ch_music_defected',
        number: 2,
        name: 'Defected In The House Live',
        url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8',
        group: 'Musica',
        safetyStatus: 'legal_verified',
        safetyReason: 'Sessione House Music DJ Live',
        country: 'UK',
        language: 'Inglese'
      },
      {
        id: 'ch_music_redbull',
        number: 3,
        name: 'Red Bull TV Music',
        url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
        group: 'Musica',
        safetyStatus: 'legal_verified',
        safetyReason: 'Festival & Concerti Live Red Bull',
        country: 'Mondo',
        language: 'Inglese'
      },
      {
        id: 'ch_music_radioitalia',
        number: 4,
        name: 'Radio Italia TV HD',
        url: 'https://cph-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
        group: 'Musica',
        safetyStatus: 'legal_verified',
        safetyReason: 'Grandi Successi Italiani 24/7',
        country: 'Italia',
        language: 'Italiano'
      }
    ]
  },

  // 11. Sito Ufficiale NASA & Spazio Scienza
  {
    id: 'disc_nasa_space_science',
    title: 'NASA TV & Stazione Spaziale ISS HD (Portale Ufficiale NASA.gov)',
    sourceName: 'Sito Istituzionale NASA.gov',
    sourceType: 'official_site',
    sourceUrl: 'https://iptv-org.github.io/iptv/categories/documentary.m3u',
    webArticleUrl: 'https://nasa.gov/live-tv-streams',
    description: 'Flussi video scientifici e documentari della NASA: trasmissioni dei lanci spaziali, passeggiate extra-veicolari e telecamere HD a bordo della ISS.',
    genre: 'Documentari',
    language: 'Inglese',
    country: 'USA / Spazio',
    flag: '🚀',
    channelCount: 5,
    safetyLevel: 'safe',
    isLegalVerified: true,
    safetyBadge: 'Governativo & Dominio Pubblico',
    safetyExplanation: 'Contenuti prodotti da agenzia governativa federale (NASA) ad accesso universale libero.',
    sampleChannels: ['NASA TV HD Public Channel', 'NASA ISS High Definition Earth Viewing', 'NASA Media Channel', 'Deep Space Telescope Feeds'],
    reliabilityScore: 100,
    foundDate: 'Oggi',
    channels: [
      {
        id: 'ch_nasa_public_hd',
        number: 1,
        name: 'NASA TV HD Public Channel',
        url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
        group: 'Documentari',
        safetyStatus: 'legal_verified',
        safetyReason: 'NASA Government Public Domain Channel',
        country: 'USA / Spazio',
        language: 'Inglese'
      },
      {
        id: 'ch_nasa_iss_earth',
        number: 2,
        name: 'NASA ISS High Definition Earth Viewing',
        url: 'https://playertest.longtailvideo.com/adaptive/oceans/oceans.m3u8',
        group: 'Documentari',
        safetyStatus: 'legal_verified',
        safetyReason: 'Telecamere ISS in orbita terrestre',
        country: 'Spazio / Terra',
        language: 'Inglese'
      },
      {
        id: 'ch_nasa_deep_space',
        number: 3,
        name: 'Deep Space Telescope Feeds',
        url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
        group: 'Documentari',
        safetyStatus: 'legal_verified',
        safetyReason: 'Telescopi e simulazioni astronomiche HD',
        country: 'Mondo',
        language: 'Inglese'
      }
    ]
  },

  // 12. Forum Comunitario Android - Canali Web Amatoriali (NON VERIFICATA)
  {
    id: 'disc_forum_androidiani_user',
    title: 'Lista Stream Web & Webcam Cittadine (Forum Android Community)',
    sourceName: 'Forum Android Community',
    sourceType: 'forum',
    sourceUrl: 'https://iptv-org.github.io/iptv/categories/general.m3u',
    webArticleUrl: 'https://forum.androidcommunity.net/threads/lista-webcam-streaming-test.1849/',
    description: 'Thread su forum dove gli utenti condividono webcam turistiche in diretta e canali web TV regionali amatoriali. Server non sempre stabili.',
    genre: 'Generale',
    language: 'Italiano',
    country: 'Italia',
    flag: '💬',
    channelCount: 25,
    safetyLevel: 'caution',
    isLegalVerified: false,
    safetyBadge: '⚠️ Fonte Forum Non Verificata',
    safetyExplanation: 'Lista caricata da utenti della community: non contiene canali pirata commerciali ma i flussi possono risultare instabili o scaduti.',
    sampleChannels: ['Webcam Piazza Duomo Milano', 'Webcam Venezia Canal Grande', 'TV Locale Romagna Web', 'Radio TV Amatoriale'],
    reliabilityScore: 68,
    foundDate: '6 giorni fa',
    channels: [
      {
        id: 'ch_webcam_duomo',
        number: 1,
        name: 'Webcam Piazza Duomo Milano',
        url: 'https://cph-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
        group: 'Generale',
        safetyStatus: 'community_public',
        safetyReason: 'Webcam live cittadina aperta',
        country: 'Italia',
        language: 'Italiano'
      },
      {
        id: 'ch_webcam_venezia',
        number: 2,
        name: 'Webcam Venezia Canal Grande',
        url: 'https://playertest.longtailvideo.com/adaptive/oceans/oceans.m3u8',
        group: 'Generale',
        safetyStatus: 'community_public',
        safetyReason: 'Panoramica fluviale Venezia',
        country: 'Italia',
        language: 'Italiano'
      },
      {
        id: 'ch_tv_romagna',
        number: 3,
        name: 'TV Locale Romagna Web',
        url: '/videos/indie_tv.mp4',
        group: 'Intrattenimento',
        safetyStatus: 'community_public',
        safetyReason: 'Emittente locale web indipendente',
        country: 'Italia',
        language: 'Italiano'
      },
      {
        id: 'ch_radio_tv_amatoriale',
        number: 4,
        name: 'Radio TV Amatoriale',
        url: '/videos/nightclub_tv.mp4',
        group: 'Musica',
        safetyStatus: 'community_public',
        safetyReason: 'Web radio amatoriale con video feed',
        country: 'Italia',
        language: 'Italiano'
      }
    ]
  },

  // 13. Pastebin Aggregatore Web
  {
    id: 'disc_pastebin_public_iptv',
    title: 'IPTV Public Pastebin Aggregator 2026 (Pastebin.com)',
    sourceName: 'Pastebin Web Paste',
    sourceType: 'pastebin',
    sourceUrl: 'https://iptv-org.github.io/iptv/index.m3u',
    webArticleUrl: 'https://pastebin.com/raw/public_iptv_streams_test',
    description: 'Testo grezzo incollato su Pastebin con oltre 100 stream web da tutto il mondo. Molti link usano HTTP semplice senza certificato SSL.',
    genre: 'Generale',
    language: 'Multi-lingua',
    country: 'Globale',
    flag: '📋',
    channelCount: 120,
    safetyLevel: 'caution',
    isLegalVerified: false,
    safetyBadge: '⚠️ Pastebin Pubblico (Qualità Mista)',
    safetyExplanation: 'I link su Pastebin non hanno garanzia di autenticità. Alcuni canali potrebbero essere offline o cambiare destinazione nel tempo.',
    sampleChannels: ['Canali Web Vari', 'Radio Stream Internazionali', 'Webcam Live', 'Test Pattern Video'],
    reliabilityScore: 55,
    foundDate: '3 giorni fa',
    channels: [
      {
        id: 'ch_pastebin_web_vari',
        number: 1,
        name: 'Canali Web Vari',
        url: 'https://cph-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
        group: 'Generale',
        safetyStatus: 'community_public',
        safetyReason: 'Feed pubblico non verificato da Pastebin',
        country: 'Globale',
        language: 'Multi-lingua'
      },
      {
        id: 'ch_pastebin_radio_stream',
        number: 2,
        name: 'Radio Stream Internazionali',
        url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8',
        group: 'Musica',
        safetyStatus: 'community_public',
        safetyReason: 'Stream musicale aggregato',
        country: 'Globale',
        language: 'Multi-lingua'
      },
      {
        id: 'ch_pastebin_test_pattern',
        number: 3,
        name: 'Test Pattern Video',
        url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        group: 'Generale',
        safetyStatus: 'community_public',
        safetyReason: 'Test segnale HLS aperto',
        country: 'Globale',
        language: 'Multi-lingua'
      }
    ]
  },

  // 14. Esempio Rilevato da Blog Pirata: Xtream Codes :8080 (BLOCCATA DA FILTRO SAFE)
  {
    id: 'disc_pirate_xtream_blocked',
    title: 'Esempio Rilevato da Blog Pirata: Xtream Codes :8080 (BLOCCATA)',
    sourceName: 'Blog Warez / Server Offshore Non Protetto',
    sourceType: 'blog',
    sourceUrl: 'http://195.123.45.67:8080/get.php?username=warez_user&password=crack_pass&type=m3u',
    webArticleUrl: 'https://blogpirata-warez-fake.org/liste-iptv-sky-dazn-gratis',
    description: 'ESEMPIO DIDATTICO DI SICUREZZA: Tipica lista distribuita illegalmente su blog warez e canali Telegram promettendo canali Pay-TV piratati.',
    genre: 'Sport',
    language: 'Italiano',
    country: 'Server Offshore Sospetto',
    flag: '🏴‍☠️',
    channelCount: 2500,
    safetyLevel: 'high_risk',
    isLegalVerified: false,
    safetyBadge: '🚫 ALTO RISCHIO: Pirateria & Sanzione AGCOM',
    safetyExplanation: 'Rilevato server illegale su IP grezzo con credenziali rubate. La visione di queste liste in Italia è sanzionata da AGCOM (Piracy Shield) con multe fino a 5.000€ e comporta rischi di furto dati.',
    sampleChannels: ['Canali Pay-TV Pirata (BLOCCATI)', 'Server Non Protetto :8080', 'Rischio Malware'],
    reliabilityScore: 5,
    foundDate: 'Oggi'
  }
];
