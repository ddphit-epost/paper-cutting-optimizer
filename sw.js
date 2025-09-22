const CACHE_NAME = 'paper-optimizer-cache-v3'; // تم تحديث الإصدار
const urlsToCache = [
  './', // استخدام مسار نسبي صريح
  'paper_cutting_optimizer.html',
  'paper_cutting_optimizer.css',
  'paper_cutting_optimizer.js'
];

// تثبيت الـ Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// جلب المحتوى من ذاكرة التخزين المؤقت أولاً
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // إرجاع من ذاكرة التخزين المؤقت
        }
        return fetch(event.request); // جلب من الشبكة إذا لم يكن في ذاكرة التخزين المؤقت
      })
  );
});

// تفعيل الـ Service Worker وحذف ذاكرة التخزين المؤقت القديمة
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // حذف ذاكرة التخزين المؤقت القديمة
          }
        })
      );
    })
  );
});
