// Minimal service worker — no caching, no offline support yet.
// Prevents 404/500 errors from browsers requesting this file via the PWA manifest.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
