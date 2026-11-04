/* SERE PIXEL service worker — azonnali indulás a tárból; új verzió csak egyben, a VERSION emelésével érkezik
   (korábban a háttérben fájlonként cserélődött, így egy indításon belül régi és új fájlok keveredhettek) */
const VERSION = 'sere-pixel-v3.8.0';
const ASSETS = [
  './', 'index.html', 'manifest.webmanifest', 'qr.svg',
  'css/style.css', 'js/music.js', 'js/speak.js', 'js/sprites.js', 'js/content.js', 'js/data.js', 'js/quiz.js', 'js/i18n.js', 'js/i18n.en.js', 'js/i18n.sk.js', 'js/content.en.js', 'js/content.sk.js', 'js/app.js',
  'fonts/VT323-Regular.woff', 'fonts/PixelifySanswght.woff', 'fonts/Silkscreen-Bold.woff',
  'icons/icon-v3-192.png', 'icons/icon-v3-512.png', 'icons/maskable-v3-512.png', 'icons/apple-touch-icon-v3.png'
];
self.addEventListener('install', e => {
  // ha az app a frissítés gombbal már előtöltötte ezt a verziót, nem tölti le újra
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(ASSETS.map(async u => { if (!(await c.match(u))) await c.add(new Request(u, { cache: 'reload' })); }))));
});
self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(caches.open(VERSION).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(e.request);
      if (res.ok) c.put(e.request, res.clone());
      return res;
    } catch (x) {
      return (e.request.mode === 'navigate' && await c.match('index.html')) || Response.error();
    }
  }));
});
