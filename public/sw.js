const CACHE_PREFIX = "sadwrita-";
const CORE_CACHE = `${CACHE_PREFIX}core-v1`;
const PAGE_CACHE = `${CACHE_PREFIX}pages-v1`;
const ASSET_CACHE = `${CACHE_PREFIX}assets-v1`;
const CACHE_NAMES = [CORE_CACHE, PAGE_CACHE, ASSET_CACHE];
const CORE_URLS = [
  "/",
  "/works",
  "/readers-space",
  "/manifest.json",
  "/offline.html",
  "/images/Raven.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE).then(async (cache) => {
      await cache.addAll(CORE_URLS);
      await self.skipWaiting();
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith(CACHE_PREFIX) &&
                !CACHE_NAMES.includes(cacheName),
            )
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isCacheable(response) {
  return response.ok && response.type === "basic";
}

function getCacheKey(request) {
  const url = new URL(request.url);
  if (!url.searchParams.has("_rsc")) return request;

  url.searchParams.delete("_rsc");
  return new Request(url.toString(), request);
}

async function storeResponse(cacheName, request, response) {
  if (!isCacheable(response)) return;

  try {
    const cache = await caches.open(cacheName);
    await cache.put(getCacheKey(request), response.clone());
  } catch (error) {
    console.error("Unable to cache a SADWRITA archive response.", error);
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    await storeResponse(PAGE_CACHE, request, response);
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(getCacheKey(request));
    if (cachedResponse) return cachedResponse;

    if (request.mode === "navigate") {
      const offlinePage = await caches.match("/offline.html");
      if (offlinePage) return offlinePage;
    }

    throw error;
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  const response = await fetch(request);
  await storeResponse(ASSET_CACHE, request, response);
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isRouteDataRequest =
    url.pathname.startsWith("/_next/data/") ||
    url.searchParams.has("_rsc") ||
    request.headers.get("RSC") === "1";

  if (request.mode === "navigate" || isRouteDataRequest) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    ["font", "image", "script", "style"].includes(request.destination)
  ) {
    event.respondWith(cacheFirst(request));
  }
});
