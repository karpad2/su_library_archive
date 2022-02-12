import {getAuth,setPersistence,inMemoryPersistence,browserSessionPersistence,browserLocalPersistence} from 'firebase/auth';
const { initializeAppCheck, ReCaptchaV3Provider } = require("firebase/app-check");
import {getDatabase,ref,set, onValue,onDisconnect,child} from 'firebase/database';
import { initializeApp } from "firebase/app";
import { getMessaging,getToken,onMessage } from "firebase/messaging";
import { onBackgroundMessage } from "firebase/messaging/sw";
import { getPerformance } from "firebase/performance";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getStorage,getDownloadURL } from "firebase/storage";
import Vue from 'vue';
import {get_text,languages,get_defaultlanguage,title_page} from "../languages";
import { getFunctions, httpsCallable } from "firebase/functions";
import {enableIndexedDbPersistence, getFirestore,doc,getDoc,collection,updateDoc,update,setDoc,getDocFromServer,CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import firebaseCredentials from '../firebase/credentials';
const app = initializeApp(firebaseCredentials.config);


const appCheck = initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider("6LckM_IcAAAAAJjv3sIzeQP535EjkBl-so0aCuPH"),
  
	// Optional argument. If true, the SDK automatically refreshes App Check
	// tokens as needed.
	isTokenAutoRefreshEnabled: true
  });

const sw = async () => {
  const messaging = getMessaging(app);
  const perf = getPerformance(app);
  const storage = getStorage(app);
  const firestore = getFirestore(app);
  const analytics = getAnalytics(app);
  const functions = getFunctions(app);

  if ('serviceWorker' in navigator) {
    
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
  // ...
    });

    onBackgroundMessage(messaging, (payload) => {
      console.log('[firebase-messaging-sw.js] Received background message ', payload);
      // Customize notification here
      const notificationTitle = title_page("");
      const notificationOptions = {
        body: 'Background Message body.',
        icon: 'logo.png'
      };
      self.registration.showNotification(notificationTitle,
        notificationOptions);
    });
      // you can safely insert your snippet here
      self.addEventListener('install', async function (event) {
        event.waitUntil(
          caches.open('su-library-archive').then(function (cache) {
            return cache.addAll([
              'index.html',
              'manifest.json',
              'logo.png',
              'https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Mu4mxK.woff2',
              'https://fonts.gstatic.com/s/materialicons/v121/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
              'https://fonts.gstatic.com/s/roboto/v29/KFOlCnqEu92Fr1MmEU9fBBc4.woff2',
              'https://fonts.gstatic.com/s/roboto/v29/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2',
              'https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Mu7GxKOzY.woff2'
            ]);
          }));
        // const newCache = await caches.open('new-cache');


      }

      )}
}


export {
  sw
}
