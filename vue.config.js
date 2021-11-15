module.exports = {
    // ...other vue-cli plugin options...
    pwa: {
      name: 'Gradska Biblioteka Subotica',
      themeColor: '#ebaa6e',
      msTileColor: '#ebaa6e',
      display: "standalone",
      scope: "/",
      start_url: "/home",
      appleMobileWebAppCapable: 'yes',
      appleMobileWebAppStatusBarStyle: 'black',
      gcm_sender_id: "103953800507",
      icons: [
        {
          src: "src/assets/icons/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "src/assets/icons/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png"
        },
        {
          src: "src/assets/icons/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png"
        },
        {
          src: "src/assets/icons/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png"
        }
      ],
      // configure the workbox plugin
      workboxPluginMode: 'InjectManifest',
      workboxOptions: {
        // swSrc is required in InjectManifest mode.
        swSrc: 'src/serviceWorker/sw.js',
        // ...other Workbox options...
      }
    }
  }