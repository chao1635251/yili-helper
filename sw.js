const CACHE_NAME = 'yili-offline-v2';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './sw.js',
  './assets/icon-192.png', './assets/icon-512.png', './assets/apple-touch-icon.png', './assets/splash-1170x2532.png', './assets/route-map.png',
  './docs/正反方向双执行版_可打印.pdf', './docs/沿途打卡点_正反方向双版_可打印.pdf', './docs/路线地图示意图_可打印.jpg'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(res => {
    const copy = res.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(()=>{});
    return res;
  }).catch(() => caches.match('./index.html'))));
});