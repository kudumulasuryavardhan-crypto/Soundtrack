const CACHE_NAME = "soundtrack-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/albums.html",
  "/album.html",
  "/auth.html",
  "/admin.html",
  "/assets/css/main.css",
  "/assets/js/firebase.js",
  "/assets/js/player.js",
  "/favicon.ico"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
