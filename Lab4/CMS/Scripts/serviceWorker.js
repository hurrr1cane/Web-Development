const allCaches = ["cacheSV1", "cacheDV1"];
const urls = ["../Layouts/index.html", "main.js", "../Styles/main.css"];

self.oninstall = async function () {
  const cache = await caches.open(allCaches[0]);
  await cache.addAll(urls);
};

self.onactivate = async function () {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((name) => allCaches.indexOf(name) === -1)
      .map((name) => caches.delete(name))
  );
};

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached ?? (await fetch(request));
}
async function networkFirst(request) {
  const cache = await caches.open(allCaches[1]);
  const networked = await fetch(request);
  if (networked) {
    cache.put(request, networked.clone());
    return networked;
  }
  return await caches.match(request);
}

self.onfetch = function (event) {
  const url = new URL(event.request.url);
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(event.request));
  } else {
    event.respondWith(networkFirst(event.request));
  }
};
