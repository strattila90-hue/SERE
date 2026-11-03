/* SERE PIXEL service worker — azonnali indulás a tárból, frissítés a háttérben */
const VERSION = 'sere-pixel-v3.1.0';
const ASSETS = [
  './', 'index.html', 'manifest.webmanifest', 'qr.svg',
  'css/style.css', 'js/music.js', 'js/speak.js', 'js/sprites.js', 'js/content.js', 'js/data.js', 'js/quiz.js', 'js/i18n.js', 'js/i18n.en.js', 'js/i18n.sk.js', 'js/content.en.js', 'js/content.sk.js', 'js/app.js',
  'fonts/VT323-Regular.woff', 'fonts/PixelifySanswght.woff', 'fonts/Silkscreen-Bold.woff',
  'icons/icon-v3-192.png', 'icons/icon-v3-512.png', 'icons/maskable-v3-512.png', 'icons/apple-touch-icon-v3.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))));
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
    const net = fetch(e.request).then(res => { if (res.ok) c.put(e.request, res.clone()); return res; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    return (await net) || (await c.match('index.html')) || Response.error();
  }));
});
