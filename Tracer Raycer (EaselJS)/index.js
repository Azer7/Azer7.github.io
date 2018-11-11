if('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('/Tracer Raycer (EaselJS)/sw.js')
  /*just code to debug*/.then(function() { console.log('Service Worker Registered'); });
  }