// PrepUAG Service Worker — Aggressive offline-first caching
const CACHE_NAME = "prepuag-v3-" + Date.now();

// Install: cache critical pages immediately
self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Pre-cache all critical pages for offline
      const urls = [
        "/",
        "/areas",
        "/formulas",
        "/examen",
        "/estadisticas",
        "/offline",
        "/manifest.webmanifest",
        "/api/quiz",
        "/api/quiz?mode=exam",
        "/icons/icon-192.png",
        "/icons/icon-512.png",
      ];
      console.log("[SW] Pre-caching", urls.length, "URLs");
      try {
        await cache.addAll(urls);
        console.log("[SW] Pre-cache complete");
      } catch (e) {
        console.warn("[SW] Some pre-cache failed (will retry on access):", e);
      }
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches, take control
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

// Fetch: STALE-WHILE-REVALIDATE for all navigations + cache-first for static
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET
  if (request.method !== "GET") return;

  // HTML navigations: network first, cache fallback
  if (request.mode === "navigate" || 
      (request.headers.get("accept") || "").includes("text/html")) {
    event.respondWith(htmlStrategy(request));
    return;
  }

  // API data: network first, cache fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets (JS, CSS, images, fonts): cache first
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$/) ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/icons/")
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Everything else: network first with cache fallback
  event.respondWith(networkFirst(request));
});

// HTML: try network, fallback to cache, then offline page
async function htmlStrategy(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    const offline = await caches.match("/offline");
    return offline || new Response("Offline", { status: 200 });
  }
}

// Network first with cache fallback
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response(JSON.stringify([]), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// Cache first with network fallback
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("", { status: 404 });
  }
}
