const CACHE='maeve-pocket-27f3385b9013';
const ASSETS=['./','./index.html','./data.json','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('maeve-pocket-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 event.respondWith(fetch(event.request).then(response=>{
  if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}
  return response;
 }).catch(async()=>{const cached=await caches.match(event.request);if(cached){const headers=new Headers(cached.headers);headers.set('X-Maeve-Cache','offline');return new Response(cached.body,{status:cached.status,headers});}if(event.request.mode==='navigate')return caches.match(new URL('./index.html',self.registration.scope).href);return Response.error();}));
});
