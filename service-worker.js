
const CACHE_NAME = 'cafe-gallery-v1';

const urlsToCache = [
'/',
'index.html',
'dashboard.html',
'dashboard_pro.html',
'recipes.html',
'inventory.html',
'notes.html',
'contacts.html',
'calculator.html',
'timer.html',
'backup.html',
'settings.html'
];

self.addEventListener('install', event => {
 event.waitUntil(
   caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
 );
});

self.addEventListener('fetch', event => {
 event.respondWith(
   caches.match(event.request).then(response => {
     return response || fetch(event.request);
   })
 );
});
