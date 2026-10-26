// Minimal service worker: needed so browsers treat the site as installable (home screen app).
// It does not cache anything, so deployments always show the latest files.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (event) { event.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function () { /* network only */ });
