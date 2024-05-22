const WEBCACHE = "kitchenTimer";
const CACHE_LIST = ["/", "/sound/ding.mp3", "/about/out.webm"];
const CACHE_FILE_TYPE = [
  "js",
  "css",
  "html",
  "jpg",
  "json",
  "png",
  "svg",
  "mp3",
  "wav",
  "mp4",
  "webm",
  "ttf",
  "woff2",
];

function isAcceptFile(url) {
  var r = new RegExp("\\.(" + CACHE_FILE_TYPE.join("|") + ")$");
  return r.test(url);
}
self.addEventListener("activate", function (event) {
  console.log("ServiceWorker activated.");
});

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(WEBCACHE).then(function (cache) {
      return cache.addAll(CACHE_LIST);
    })
  );
});

self.addEventListener("fetch", function (event) {
  const { method, url } = event.request;
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request)
          .then(function (response) {
            let responseClone = response.clone();
            if (method === "POST") {
              return response;
            }
            if (!isAcceptFile(url)) {
              return response;
            }
            caches.open(WEBCACHE).then(function (cache) {
              try{
                cache.put(event.request, responseClone);
              }catch(e) {}
            });
            console.log("response cached");
            return response;
          })
          .catch(function (error) {
            return Promise.reject(error);
          });
      }
    })
  );
});

self.addEventListener("media", function (event) {
  console.log(event);
});
