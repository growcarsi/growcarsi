// service-worker.js
const CACHE_NAME = 'growcarsi-v1';
// Önbelleğe alınacak kritik statik dosyalar kanka:
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/auth.js',
  // Varsa logolarını veya ikonlarını da buraya ekleyebilirsin:
  // '/lib/assets/imgs/logo.png' 
];

// 1. Service Worker Yükleme (Install) - Dosyaları Önbelleğe Alma
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Statik dosyalar cache\'e alınıyor...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Aktivasyon (Activate) - Eski Cache Temizliği
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Eski önbellek siliniyor:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. İstekleri Yakalama (Fetch) - Önce Önbelleğe Bak, Yoksa İnternetten Çek
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Dosya cache'te varsa interneti hiç beklemeden anında yükle reis
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});