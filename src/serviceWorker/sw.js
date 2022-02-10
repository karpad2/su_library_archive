 const sw= ()=>{
  if ('serviceWorker' in navigator) {
  if ('caches' in window){
    // you can safely insert your snippet here
    self.addEventListener('install', function(event) {
      event.waitUntil(
        caches.open('v1').then(function(cache) {
          return cache.addAll([
            'index.html',
            'manifest.json',
            'logo.png'
          ]);
        })
      );
  
    const newCache = await caches.open('new-cache');
  
  }
  
  }
}
 }
 export {
   sw
 }
