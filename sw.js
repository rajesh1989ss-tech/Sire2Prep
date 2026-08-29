/* ============================================================================
   SIRE 2.0 Prep — service worker.

   Network-first so a redeployed page is picked up straight away, with the
   cache as the offline fallback. Bump CACHE_VERSION on every deploy.
   ========================================================================= */

const CACHE_VERSION = "sire2-v1.0.1";
const OFFLINE_URL = "./offline.html";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./offline.html",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./apple-touch-icon.png"
];

/* cache.addAll() is atomic: one missing file and nothing at all is cached,
   which would silently leave the app with no offline copy. Each asset is
   fetched on its own so a single failure cannot take the rest down. */
async function precache() {
  const cache = await caches.open(CACHE_VERSION);
  const results = await Promise.all(ASSETS.map(async url => {
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res || !res.ok) return { url: url, ok: false };
      await cache.put(url, res.clone());
      return { url: url, ok: true };
    } catch (e) {
      return { url: url, ok: false };
    }
  }));
  const missing = results.filter(r => !r.ok).map(r => r.url);
  if (missing.length) console.warn("[sw] not cached:", missing.join(", "));
  return missing;
}

self.addEventListener("install", event => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)));
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch (e) { }
    }
    await self.clients.claim();
  })());
});

self.addEventListener("message", event => {
  if (event.data === "skipWaiting" || (event.data && event.data.type === "SKIP_WAITING")) {
    self.skipWaiting();
  }
});

async function networkFirst(event) {
  const request = event.request;
  const cache = await caches.open(CACHE_VERSION);

  try {
    const preload = event.preloadResponse ? await event.preloadResponse : null;
    const res = preload || await fetch(request);
    if (res && res.ok && request.method === "GET") {
      cache.put(request, res.clone()).catch(() => { });
    }
    return res;
  } catch (e) {
    const hit = await cache.match(request);
    if (hit) return hit;

    if (request.mode === "navigate") {
      const index = await cache.match("./index.html");
      if (index) return index;
      const offline = await cache.match(OFFLINE_URL);
      if (offline) return offline;
    }
    return new Response("Offline and not cached.", {
      status: 503,
      headers: { "Content-Type": "text/plain" }
    });
  }
}

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   /* never touch other origins */

  event.respondWith(networkFirst(event));
});
