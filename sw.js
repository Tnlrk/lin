// Lets the installed app open offline. Network first, so a new version shows up as soon as
// there is a connection; the last copy that loaded is the fallback. Chat requests go to
// OpenRouter (another origin) and are left alone.
const CACHE = 'lin-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(request, copy)); }
        return res;
      })
      .catch(() => caches.match(request, { ignoreSearch: true })),
  );
});
