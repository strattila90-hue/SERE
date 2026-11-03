/* SERE PIXEL service worker — offline + automatikus frissítés (hálózat először, gyorsítótár tartalék) */
const VERSION = 'sere-pixel-v1.5.0';
const ASSETS = [
  './', 'index.html', 'manifest.webmanifest', 'qr.svg',
  'css/style.css', 'js/music.js', 'js/sprites.js', 'js/content.js', 'js/data.js', 'js/app.js',
  'fonts/VT323-Regular.woff', 'fonts/PixelifySanswght.woff', 'fonts/Silkscreen-Bold.woff',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png'
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
  const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3500));
  e.respondWith(
    Promise.race([fetch(e.request, { cache: 'no-cache' }), timeout]).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(hit => hit || caches.match('index.html')))
  );
});
