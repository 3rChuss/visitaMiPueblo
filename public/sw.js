self.addEventListener("install", function(event) {
    event.waitUntil(preLoad());
  });
  
  var preLoad = function(){
    console.log("Installing web app");
    return caches.open("offline").then(function(cache) {
      console.log("caching index and important routes");
      return cache.addAll(
          [
            "/",
            "/que-ver",
            "/deifontes",
            "/deifontes/",
            "../img/palacio.webp",
            "/js/admin.js",
            "/js/apiAemet.js",
            "/js/apiCenso.js",
            "/js/index.js",
            "/css/style.css",
            "offline.html",
            "https://fonts.googleapis.com/css2?family=Covered+By+Your+Grace&family=Open+Sans:wght@400;700&family=Staatliches&display=swap"
            ]);
    });
  };
  
  self.addEventListener("fetch", function(event) {
    event.respondWith(checkResponse(event.request).catch(function() {
      return returnFromCache(event.request);
    }));
    event.waitUntil(addToCache(event.request));
  });
  
  var checkResponse = function(request){
    return new Promise(function(fulfill, reject) {
      fetch(request).then(function(response){
        if(response.status !== 404) {
          fulfill(response);
        } else {
          reject();
        }
      }, reject);
    });
  };
  
  var addToCache = function(request){
    return caches.open("offline").then(function (cache) {
      return fetch(request).then(function (response) {
        return cache.put(request, response);
      });
    });
  };
  
  var returnFromCache = function(request){
    return caches.open("offline").then(function (cache) {
      return cache.match(request).then(function (matching) {
       if(!matching || matching.status == 404) {
         return cache.match("offline.html");
       } else {
         return matching;
       }
      });
    });
  };

  self.addEventListener('push', function (e) {
    console.log('[Service Worker] Push recivido');
    console.log(`[Service Worker] Datos del push: ${e.data.text()}`);

    const titulo = 'Pimera prueba';
    const options = {
      body: 'Funciona!',
      icon: '/img/logoDeifontes.png'
    }
    
    const notificationPromise = self.registration.showNotification(titulo, options);
    e.waitUntil(notificationPromise);
    })

    self.addEventListener('notificationclick', function(event) {
      console.log('[Service Worker] Notification click Received.');
    
      event.notification.close();
    
      event.waitUntil(
        clients.openWindow('https://deifontes.online')
      );
    });