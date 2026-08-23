// Offline cache for the Claude Project Board.
//
// The page and tasks.json are fetched network-first so a Claude session's push
// shows up as soon as the phone is online; the cache is the offline fallback.
var CACHE = "claude-board-v1";
var FILES = [
  "./",
  "./index.html",
  "./tasks.json",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

function put(req, res){
  var copy = res.clone();
  caches.open(CACHE).then(function(c){ c.put(req, copy); });
  return res;
}

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(FILES); })
    .then(function(){ return self.skipWaiting(); }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){ return k === CACHE ? null : caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;
  var accept = req.headers.get("accept") || "";
  var fresh = req.mode === "navigate" ||
              accept.indexOf("text/html") !== -1 ||
              req.url.indexOf("tasks.json") !== -1;

  if(fresh){
    e.respondWith(
      fetch(req).then(function(res){ return put(req, res); })
        .catch(function(){
          return caches.match(req, {ignoreSearch:true}).then(function(hit){
            return hit || caches.match("./index.html");
          });
        })
    );
    return;
  }
  e.respondWith(caches.match(req).then(function(hit){
    var net = fetch(req).then(function(res){ return put(req, res); }).catch(function(){ return hit; });
    return hit || net;
  }));
});
