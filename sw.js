// Offline cache for Robux Earned Tracker.
//
// The page itself is fetched network-first, so a new version shows up as soon
// as the phone is online — the cache is the offline fallback, not the default.
// Icons and other assets are served from cache for speed and refreshed in the
// background. Bump CACHE whenever the file list changes.
var CACHE = "robux-tracker-v6";
var FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/avatar.png"
];

function put(req, res){
  var copy = res.clone();
  caches.open(CACHE).then(function(c){ c.put(req, copy); });
  return res;
}

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c){ return c.addAll(FILES); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return k === CACHE ? null : caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;

  var accept = req.headers.get("accept") || "";
  var wantsPage = req.mode === "navigate" || accept.indexOf("text/html") !== -1;

  if(wantsPage){
    // network first: online means you always get the current build
    e.respondWith(
      fetch(req)
        .then(function(res){ return put(req, res); })
        .catch(function(){
          return caches.match(req).then(function(hit){
            return hit || caches.match("./index.html");
          });
        })
    );
    return;
  }

  // assets: cache first for speed, but refresh in the background
  e.respondWith(
    caches.match(req).then(function(hit){
      var net = fetch(req)
        .then(function(res){ return put(req, res); })
        .catch(function(){ return hit; });
      return hit || net;
    })
  );
});
