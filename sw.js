/* 胸訴 Service Worker —— 離線使用與版本更新
   改版時把 VERSION 加一；新版不會自己強制接管，
   而是由頁面顯示「有新版本」讓使用者按下後才更新，避免填到一半被重新整理。 */
const VERSION = "wfchest-v9";
const CORE = [
  "./", "index.html", "i18n.js", "manifest.json",
  "assets/icon-192.png", "assets/icon-512.png", "assets/icon-maskable-512.png", "assets/apple-touch-icon.png",
  "assets/qr.svg", "assets/qr.png", "assets/img/index.json"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("message", e => { if (e.data === "SKIP_WAITING") self.skipWaiting(); });

/* 頁面與程式檔：網路優先（拿到最新版），離線才用快取
   圖示、音檔：快取優先 */
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  const url = new URL(req.url);
  const fresh = req.mode === "navigate" || /\.(html|js|json)$/.test(url.pathname) || url.pathname.endsWith("/");
  if (fresh){
    e.respondWith(fetch(req).then(r => {
      if (r.ok){ const c = r.clone(); caches.open(VERSION).then(ca => ca.put(req, c)); }
      return r;
    }).catch(() => caches.match(req, { ignoreSearch:true })
      .then(r => r || (req.mode === "navigate" ? caches.match("index.html") : undefined))));
  } else {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      if (res.ok){ const c = res.clone(); caches.open(VERSION).then(ca => ca.put(req, c)); }
      return res;
    })));
  }
});
