self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('azer7-raycer-store').then(function(cache) {
     return cache.addAll([
       '/Tracer Raycer (EaselJS)/',
       '/Tracer Raycer (EaselJS)/index.html',
       '/Tracer Raycer (EaselJS)/index.js'
     ]);
   })
 );
});

self.addEventListener('fetch', function(e) {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});