const CACHE = "nexus-daw-v7-dashboard";
const BASE = new URL("./", self.registration.scope);
const APP_SHELL = [
  new URL(".", BASE).href,
  new URL("index.html", BASE).href,
  new URL("manifest.webmanifest", BASE).href,
  new URL("icons/icon-192.png", BASE).href,
  new URL("icons/icon-512.png", BASE).href,
  new URL("nexus-frog.png", BASE).href,
  new URL("nexus-frog-core.png", BASE).href
];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request).then(response => {
    const copy = response.clone();
    if (response.ok && new URL(event.request.url).origin === self.location.origin) caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request).then(cached => cached || caches.match(new URL("index.html", BASE).href))));
});
