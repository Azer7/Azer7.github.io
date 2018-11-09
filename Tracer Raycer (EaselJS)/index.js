if('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('/a2hs/sw.js')
  /*just code to debug*/.then(function() { console.log('Service Worker Registered'); });
  }