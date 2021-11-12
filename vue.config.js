module.exports = {
    // ...other vue-cli plugin options...
    pwa: {
      name: 'Gradska Biblioteka Subotica',
      themeColor: '#4DBA87',
      msTileColor: '#000000',
      display: "standalone",
      scope: "/",
      start_url: "/",
      appleMobileWebAppCapable: 'yes',
      appleMobileWebAppStatusBarStyle: 'black',
      gcm_sender_id: "BPyi0nrKJ6ukkJjmYSE8B39cXNpz-l5qP0b2soEYQQ2SLjdXU5ede5O3oz_1UaoGpyGinen9m2PCp-QA-zUzBqU",
   
      // configure the workbox plugin
      workboxPluginMode: 'InjectManifest',
      workboxOptions: {
        // swSrc is required in InjectManifest mode.
        swSrc: 'src/serviceWorker/sw.js',
        // ...other Workbox options...
      }
    }
  }