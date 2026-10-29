/* Service Worker — فضاء أولياء دار الإحسان (Dar El Ihsan Parents Space)
   - يحفظ ملفات واجهة فضاء الأولياء لتعمل بسرعة وموثوقية في وضع PWA المستقل.
   - يعتمد استراتيجية الشبكة أولاً مع عدم تخزين البيانات الشخصية الحساسة في الكاش غير المشفر.
   - يدعم إشعارات Web Push الحقيقية والنغمة الصوتية والاهتزاز والروابط المباشرة (#msgs, #reports, #evaluations). */
'use strict';
var CACHE = 'de-parents-v1.0';
var SHELL = [
  './',
  'index.html',
  'parent.html',
  'parent.js',
  'de-core.js',
  'username.js',
  'pdf-writer.js',
  'cms-config.js',
  'navback.js',
  'parent-modern.css',
  'portal.css',
  'icons.css',
  'icons.js',
  'pwa.js',
  'pwa.css',
  'logo.png',
  'logo-sq.png',
  'icon-192.png',
  'icon-512.png',
  'manifest.webmanifest',
  'parent.webmanifest'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(SHELL.map(function (u) { return c.add(u).catch(function () {}); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request, url = new URL(req.url);
  // استثناء أي طلبات خارجية أو طلبات Supabase API لضمان جلب البيانات الحية وعدم كاش ملفات الأطفال
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(req).then(function (res) {
      if (res && res.ok && res.type === 'basic') {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) {
        if (hit) return hit;
        if (req.mode === 'navigate') return caches.match('index.html');
        return Response.error();
      });
    })
  );
});

/* ── أحداث الإشعارات على الهاتف المحمول (Web Push & Notification Click) ── */
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var targetUrl = (e.notification.data && e.notification.data.url) || './index.html';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if ((client.url.indexOf('index.html') !== -1 || client.url.indexOf('parent.html') !== -1) && 'focus' in client) {
          // توجيه النافذة المفتوحة إلى القسم المستهدف
          if ('navigate' in client && targetUrl) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});

self.addEventListener('push', function (e) {
  var payload = { title: 'دار الإحسان', body: 'لديك إشعار جديد في فضاء الأولياء' };
  try {
    if (e.data) payload = Object.assign(payload, e.data.json());
  } catch (err) {
    if (e.data) payload.body = e.data.text();
  }
  var options = {
    body: payload.body,
    icon: 'logo-sq.png',
    badge: 'logo-sq.png',
    vibrate: [200, 100, 200, 100, 400],
    tag: payload.tag || ('de-push-' + Date.now()),
    renotify: true,
    requireInteraction: true,
    data: { url: payload.url || './index.html' }
  };
  e.waitUntil(self.registration.showNotification(payload.title, options));
});
