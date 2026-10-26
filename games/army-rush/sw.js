// Offline-Scope nur für Army Rush; Spielstände bleiben im Gerätespeicher.
const CACHE='army-rush-edition03-v3';
const FILES=['./index.html','./vendor/three.min.js','./manifest.webmanifest','./app-icon-192.png','./app-icon-512.png','./app-icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('army-rush-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||!u.href.startsWith(self.registration.scope))return;
 if(e.request.mode==='navigate')e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put('./index.html',copy)));}return r;}).catch(()=>caches.match('./index.html')));
 else e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request)));
});
