#!/bin/bash
set -e
mkdir -p public/videos

# 1. RedLight TV Web (Crimson / Red Neon / 18+ Late Night Lounge)
ffmpeg -y -f lavfi -i "color=c=0x180006:s=1280x720:d=6:r=25" \
  -f lavfi -i "sine=frequency=110:sample_rate=44100:d=6" \
  -vf "drawbox=x=40:y=40:w=1200:h=640:color=0x4a0015@0.5:t=fill,\
drawbox=x=40:y=40:w=1200:h=640:color=0xff0044:t=3,\
drawbox=x=80:y=80:w=120:h=40:color=0xff0044:t=fill,\
drawtext=text='18+':fontcolor=white:fontsize=24:x=120:y=88,\
drawbox=x=220:y=80:w=160:h=40:color=0x220008:t=fill,\
drawtext=text='DIRETTA WEB':fontcolor=0xff4477:fontsize=20:x=235:y=90,\
drawtext=text='REDLIGHT TV WEB':fontcolor=0xff2255:fontsize=56:x=(w-text_w)/2:y=240,\
drawtext=text='CANALE ADULTI 18+ • LATE NIGHT LOUNGE':fontcolor=0xffb3c6:fontsize=26:x=(w-text_w)/2:y=330,\
drawtext=text='Programmazione Notturna Senza Filtri • Web Stream HD':fontcolor=0x885566:fontsize=20:x=(w-text_w)/2:y=390,\
drawbox=x=0:y=660:w=1280:h=60:color=0x0a0003@0.9:t=fill,\
drawtext=text='🔴 IN ONDA: RedLight Glamour Lounge 18+ • Solo per Maggiorenni • Live Streaming Web TV':fontcolor=0xff6688:fontsize=18:x=w-mod(t*180\,w+900):y=680" \
  -c:v libx264 -pix_fmt yuv420p -b:v 300k -c:a aac -b:a 64k public/videos/redlight_tv.mp4

# 2. Babes TV HD Live (Hot Pink / Magenta / Glamour Runway)
ffmpeg -y -f lavfi -i "color=c=0x180018:s=1280x720:d=6:r=25" \
  -f lavfi -i "sine=frequency=140:sample_rate=44100:d=6" \
  -vf "drawbox=x=40:y=40:w=1200:h=640:color=0x380038@0.5:t=fill,\
drawbox=x=40:y=40:w=1200:h=640:color=0xff00aa:t=3,\
drawbox=x=80:y=80:w=120:h=40:color=0xff00aa:t=fill,\
drawtext=text='18+':fontcolor=white:fontsize=24:x=120:y=88,\
drawtext=text='BABES TV HD LIVE':fontcolor=0xff33bb:fontsize=56:x=(w-text_w)/2:y=240,\
drawtext=text='GLAMOUR, CATWALK & FASHION RUNWAY 18+':fontcolor=0xffcce6:fontsize=26:x=(w-text_w)/2:y=330,\
drawtext=text='Top Models & Spettacoli Notturni • Trasmissione HD':fontcolor=0xaa7799:fontsize=20:x=(w-text_w)/2:y=390,\
drawbox=x=0:y=660:w=1280:h=60:color=0x0d000d@0.9:t=fill,\
drawtext=text='✨ IN ONDA: Babes Night Live • Glamour Fashion 18+ • Streaming Continuo HD':fontcolor=0xff88cc:fontsize=18:x=w-mod(t*180\,w+900):y=680" \
  -c:v libx264 -pix_fmt yuv420p -b:v 300k -c:a aac -b:a 64k public/videos/babes_tv.mp4

# 3. Erotic Cinema Night (Midnight Noir / Movie / Cinema 18+)
ffmpeg -y -f lavfi -i "color=c=0x080410:s=1280x720:d=6:r=25" \
  -f lavfi -i "sine=frequency=130:sample_rate=44100:d=6" \
  -vf "drawbox=x=40:y=40:w=1200:h=640:color=0x181028@0.5:t=fill,\
drawbox=x=40:y=40:w=1200:h=640:color=0xaa44ff:t=3,\
drawbox=x=80:y=80:w=120:h=40:color=0xaa44ff:t=fill,\
drawtext=text='18+':fontcolor=white:fontsize=24:x=120:y=88,\
drawtext=text='EROTIC CINEMA NIGHT':fontcolor=0xcc66ff:fontsize=56:x=(w-text_w)/2:y=240,\
drawtext=text='CINEMA NOTTURNO D AUTORE & FILM 18+':fontcolor=0xe6ccff:fontsize=26:x=(w-text_w)/2:y=330,\
drawtext=text='Rassegna Cinematografica Notturna • Qualita 1080p':fontcolor=0x9988aa:fontsize=20:x=(w-text_w)/2:y=390,\
drawbox=x=0:y=660:w=1280:h=60:color=0x040208@0.9:t=fill,\
drawtext=text='🎬 IN ONDA: CineNotte 18+ • Film Cult Notturni • Visione Riservata ad Adulti':fontcolor=0xcc88ff:fontsize=18:x=w-mod(t*180\,w+900):y=680" \
  -c:v libx264 -pix_fmt yuv420p -b:v 300k -c:a aac -b:a 64k public/videos/erotic_cinema.mp4

# 4. NightClub TV Glamour (Electric Blue / Clubbing / Laser)
ffmpeg -y -f lavfi -i "color=c=0x000c18:s=1280x720:d=6:r=25" \
  -f lavfi -i "sine=frequency=160:sample_rate=44100:d=6" \
  -vf "drawbox=x=40:y=40:w=1200:h=640:color=0x002040@0.5:t=fill,\
drawbox=x=40:y=40:w=1200:h=640:color=0x00aaff:t=3,\
drawbox=x=80:y=80:w=120:h=40:color=0x00aaff:t=fill,\
drawtext=text='18+':fontcolor=white:fontsize=24:x=120:y=88,\
drawtext=text='NIGHTCLUB TV GLAMOUR':fontcolor=0x33ccff:fontsize=54:x=(w-text_w)/2:y=240,\
drawtext=text='ELECTRONIC MUSIC & NIGHTCLUB SHOWS':fontcolor=0xb3ecff:fontsize=26:x=(w-text_w)/2:y=330,\
drawtext=text='Live DJ Sessions • Club Party • Ibiza & Miami Nights':fontcolor=0x6699aa:fontsize=20:x=(w-text_w)/2:y=390,\
drawbox=x=0:y=660:w=1280:h=60:color=0x00060d@0.9:t=fill,\
drawtext=text='🎧 IN ONDA: NightClub Live DJ Set • Party Glamour 18+ • Sound System High-Def':fontcolor=0x66ddff:fontsize=18:x=w-mod(t*180\,w+900):y=680" \
  -c:v libx264 -pix_fmt yuv420p -b:v 300k -c:a aac -b:a 64k public/videos/nightclub_tv.mp4

# 5. Passion TV Adult (Velvet Purple / Gold / Erotic TV)
ffmpeg -y -f lavfi -i "color=c=0x140410:s=1280x720:d=6:r=25" \
  -f lavfi -i "sine=frequency=125:sample_rate=44100:d=6" \
  -vf "drawbox=x=40:y=40:w=1200:h=640:color=0x300824@0.5:t=fill,\
drawbox=x=40:y=40:w=1200:h=640:color=0xff44aa:t=3,\
drawbox=x=80:y=80:w=120:h=40:color=0xff44aa:t=fill,\
drawtext=text='18+':fontcolor=white:fontsize=24:x=120:y=88,\
drawtext=text='PASSION TV ADULT':fontcolor=0xff66bb:fontsize=56:x=(w-text_w)/2:y=240,\
drawtext=text='CANALE PASSIONE & SEDUZIONE NOTTURNA 18+':fontcolor=0xffd9ec:fontsize=26:x=(w-text_w)/2:y=330,\
drawtext=text='Programmi Esclusivi Per Adulti • Web TV Italia':fontcolor=0xaa7788:fontsize=20:x=(w-text_w)/2:y=390,\
drawbox=x=0:y=660:w=1280:h=60:color=0x080206@0.9:t=fill,\
drawtext=text='🔥 IN ONDA: Passion Night Show • Spettacolo Erotico per Maggiorenni • Live Webcast':fontcolor=0xff88cc:fontsize=18:x=w-mod(t*180\,w+900):y=680" \
  -c:v libx264 -pix_fmt yuv420p -b:v 300k -c:a aac -b:a 64k public/videos/passion_tv.mp4

# 6. Glamour TV Italia 18+
ffmpeg -y -f lavfi -i "color=c=0x16000c:s=1280x720:d=6:r=25" \
  -f lavfi -i "sine=frequency=150:sample_rate=44100:d=6" \
  -vf "drawbox=x=40:y=40:w=1200:h=640:color=0x36001a@0.5:t=fill,\
drawbox=x=40:y=40:w=1200:h=640:color=0xff1493:t=3,\
drawbox=x=80:y=80:w=120:h=40:color=0xff1493:t=fill,\
drawtext=text='18+':fontcolor=white:fontsize=24:x=120:y=88,\
drawtext=text='GLAMOUR TV ITALIA 18+':fontcolor=0xff3399:fontsize=56:x=(w-text_w)/2:y=240,\
drawtext=text='EMITTENTE ITALIANA GLAMOUR & SPETTACOLO':fontcolor=0xffcce6:fontsize=26:x=(w-text_w)/2:y=330,\
drawtext=text='Streaming Notturno Forum Community':fontcolor=0x996688:fontsize=20:x=(w-text_w)/2:y=390,\
drawbox=x=0:y=660:w=1280:h=60:color=0x0d0006@0.9:t=fill,\
drawtext=text='💄 IN ONDA: Glamour Italia Late Night • Servizi Glamour & Top Models • 18+':fontcolor=0xff66b2:fontsize=18:x=w-mod(t*180\,w+900):y=680" \
  -c:v libx264 -pix_fmt yuv420p -b:v 300k -c:a aac -b:a 64k public/videos/glamour_tv.mp4

# 7. Sexy Lounge WebTV
ffmpeg -y -f lavfi -i "color=c=0x0f0014:s=1280x720:d=6:r=25" \
  -f lavfi -i "sine=frequency=135:sample_rate=44100:d=6" \
  -vf "drawbox=x=40:y=40:w=1200:h=640:color=0x260033@0.5:t=fill,\
drawbox=x=40:y=40:w=1200:h=640:color=0xba55d3:t=3,\
drawbox=x=80:y=80:w=120:h=40:color=0xba55d3:t=fill,\
drawtext=text='18+':fontcolor=white:fontsize=24:x=120:y=88,\
drawtext=text='SEXY LOUNGE WEBTV':fontcolor=0xcc66ee:fontsize=56:x=(w-text_w)/2:y=240,\
drawtext=text='CHILLOUT, COCKTAIL & AMBIENT VIBES 18+':fontcolor=0xf2ccff:fontsize=26:x=(w-text_w)/2:y=330,\
drawtext=text='Musica Lounge & Atmosfere Notturne Erotiche':fontcolor=0x9977aa:fontsize=20:x=(w-text_w)/2:y=390,\
drawbox=x=0:y=660:w=1280:h=60:color=0x08000a@0.9:t=fill,\
drawtext=text='🍸 IN ONDA: Sexy Lounge Deep Chill • Lounge Music 18+ • Canale Web Esclusivo':fontcolor=0xdd88ff:fontsize=18:x=w-mod(t*180\,w+900):y=680" \
  -c:v libx264 -pix_fmt yuv420p -b:v 300k -c:a aac -b:a 64k public/videos/sexy_lounge.mp4

# 8. Underground Indie TV
ffmpeg -y -f lavfi -i "color=c=0x0a0c10:s=1280x720:d=6:r=25" \
  -f lavfi -i "sine=frequency=180:sample_rate=44100:d=6" \
  -vf "drawbox=x=40:y=40:w=1200:h=640:color=0x141820@0.5:t=fill,\
drawbox=x=40:y=40:w=1200:h=640:color=0x00ffcc:t=3,\
drawbox=x=80:y=80:w=120:h=40:color=0x00ffcc:t=fill,\
drawtext=text='INDIE':fontcolor=black:fontsize=24:x=105:y=88,\
drawtext=text='UNDERGROUND INDIE TV':fontcolor=0x33ffdd:fontsize=54:x=(w-text_w)/2:y=240,\
drawtext=text='WEB-TV INDIPENDENTE & FEED ALTERNATIVI':fontcolor=0xccffee:fontsize=26:x=(w-text_w)/2:y=330,\
drawtext=text='Musica Underground • Corti Sperimentali • Feed Amatoriali':fontcolor=0x66aa99:fontsize=20:x=(w-text_w)/2:y=390,\
drawbox=x=0:y=660:w=1280:h=60:color=0x040508@0.9:t=fill,\
drawtext=text='⚡ IN ONDA: Underground Indie Live • Diretta Web TV Non Ufficiale':fontcolor=0x66ffdd:fontsize=18:x=w-mod(t*180\,w+900):y=680" \
  -c:v libx264 -pix_fmt yuv420p -b:v 300k -c:a aac -b:a 64k public/videos/indie_tv.mp4

# 9. Amateur Cam Italia
ffmpeg -y -f lavfi -i "color=c=0x04080c:s=1280x720:d=6:r=25" \
  -f lavfi -i "sine=frequency=190:sample_rate=44100:d=6" \
  -vf "drawbox=x=40:y=40:w=1200:h=640:color=0x081018@0.5:t=fill,\
drawbox=x=40:y=40:w=1200:h=640:color=0x00e676:t=3,\
drawbox=x=80:y=80:w=120:h=40:color=0x00e676:t=fill,\
drawtext=text='CAM':fontcolor=black:fontsize=24:x=115:y=88,\
drawtext=text='AMATEUR CAM ITALIA':fontcolor=0x33ff99:fontsize=56:x=(w-text_w)/2:y=240,\
drawtext=text='WEBCAM NOTTURNE & STREAMING AMATORIALE':fontcolor=0xccffe6:fontsize=26:x=(w-text_w)/2:y=330,\
drawtext=text='Feed Live Community Italia • Connessione Diretta':fontcolor=0x55aa77:fontsize=20:x=(w-text_w)/2:y=390,\
drawbox=x=0:y=660:w=1280:h=60:color=0x020406@0.9:t=fill,\
drawtext=text='🟢 LIVE: Cam Amatoriale Italia • Diretta Streaming Web Studio':fontcolor=0x66ffb3:fontsize=18:x=w-mod(t*180\,w+900):y=680" \
  -c:v libx264 -pix_fmt yuv420p -b:v 300k -c:a aac -b:a 64k public/videos/amateur_cam.mp4

echo "All channel videos successfully created in public/videos!"
