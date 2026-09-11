/* 離線快取：門診 Wi-Fi 不穩時仍可使用。改版時把 VERSION 加一。 */
const VERSION = "wfchest-v1";
const CORE = ["./", "index.html", "manifest.json", "assets/icon-192.png", "assets/icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
/* 頁面：網路優先（拿到最新版），失敗才用快取；音檔與圖示：快取優先 */
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const isPage = req.mode === "navigate" || req.url.endsWith("index.html");
  if (isPage){
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(VERSION).then(ca => ca.put(req, c)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match("index.html"))));
  } else {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      if (res.ok && new URL(req.url).origin === location.origin){ const c = res.clone(); caches.open(VERSION).then(ca => ca.put(req, c)); }
      return res;
    })));
  }
});
