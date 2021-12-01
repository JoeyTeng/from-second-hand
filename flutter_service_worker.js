'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "audio/11-12:10:2021%20Patrick%20interview%20part2.mp3": "6ad93317c38741a18fb5b6b685a32610",
"audio/19-23:20:2021%E5%B0%8F%E5%A4%A9.mp3": "453df2cde0a555dcc396b5961e1dc54b",
"audio/19.2-%E5%B0%8F%E5%A4%A9after%20talk.mp3": "7c38ef6d35c1117c893f569242ae6105",
"audio/06-25:9:2021Patrick%20part%201.mp3": "e287014bd97179714e8940639b77215e",
"audio/02-30:8:2021%E5%92%8C%E8%AF%97%E7%8E%84%E8%81%8A%E8%81%8Adresscode%E5%92%8C%E5%85%B6%E4%BB%96.mp3": "cb8b713c557d60f73d5f7e59aa59a824",
"audio/14-13:10:2021%E5%AE%8B%E8%80%81%E5%B8%88interview.mp3": "389b01fc8b6cbce5be3f0ef7c44f1368",
"audio/08-4:10:2021%E8%AF%97%E7%8E%84%E5%AE%8B%E8%80%81%E5%B8%88%E4%BA%8C%E6%AC%A1interview.mp3": "8a1d8abe1fa0e5df71beb68bf0e48a2a",
"audio/01-26_8_2021%E5%92%8C%E5%AE%8B%E8%80%81%E5%B8%88%E8%81%8A%E8%81%8Adress%20code.mp3": "a161b9e933f04caab0fa8644b617c678",
"audio/04-2:9:2021%E5%92%8CPattie%E8%81%8A%E8%81%8Adress%20code%E5%92%8C%E6%80%A7%E5%88%AB%E8%AF%9D%E9%A2%98.mp3": "f35a0939259566f05d8454eae916d235",
"audio/12-12:10:2021%E8%83%9C%E7%94%B7interview+%E6%9C%88%E7%BB%8F%E8%B4%AB%E5%9B%B0.mp3": "16f826283f70abbbc02f46a8cafea8aa",
"audio/19.1-%E5%B0%8F%E5%A4%A9before%20session.mp3": "72ab3d67392b0e7b781dddf95f2d6194",
"manifest.json": "0d2ef5bf43d0a5d981e8400f48458541",
"version.json": "5ec9ef63d1b15bd6ec5538d088c3005b",
"icons/Icon-192.png": "c8a7e556b77250502e539785ed5d9515",
"icons/Icon-512.png": "84f84ce52b9c79cf96e540090c2d0c25",
"feed.xml": "85106b239639c0efd021181804b3bf73",
"favicon.png": "748094f0aed533169ba6fea373695cc8",
"subscribe.html": "f6f854a57a2e4db64827d584573819e8",
"main.dart.js": "472ca83b89e4026ffde992c233b2707a",
"index.html": "2dfdade837632d9630a6ca0d4a420179",
"/": "2dfdade837632d9630a6ca0d4a420179",
"assets/NOTICES": "a660b3a30533b9883eb81bf35103baf1",
"assets/AssetManifest.json": "99914b932bd37a50b983c5e7c90ae93b",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"img/US_UK_Apple_Podcasts_Listen_Badge_RGB.svg": "73e9586637bc3c66a109a02ff0e941cc",
"img/Blog.png": "ae8e2c5e343284f94b22cab36e116557",
"img/icon.jpg": "019abb8e8c648c4e353dd2646834147b",
"img/From-Second-Hand.png": "296eb8303a92b7999f88d3561cbe999f"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
