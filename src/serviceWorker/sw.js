import {getAuth,setPersistence,inMemoryPersistence,browserSessionPersistence,browserLocalPersistence} from 'firebase/auth';
const { initializeAppCheck, ReCaptchaV3Provider } = require("firebase/app-check");
import {getDatabase,ref,set, onValue,onDisconnect,child} from 'firebase/database';
import { initializeApp } from "firebase/app";
import { getMessaging,getToken } from "firebase/messaging";
import { getPerformance } from "firebase/performance";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getStorage,getDownloadURL } from "firebase/storage";
import Vue from 'vue';
import { getFunctions, httpsCallable } from "firebase/functions";
import {enableIndexedDbPersistence, getFirestore,doc,getDoc,collection,updateDoc,update,setDoc,getDocFromServer,CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import firebaseCredentials from '../firebase/credentials';

// Initialize the Firebase app in the web worker.
const app = initializeApp(firebaseCredentials.config);
const appCheck = initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider("6LckM_IcAAAAAJjv3sIzeQP535EjkBl-so0aCuPH"),
  
	// Optional argument. If true, the SDK automatically refreshes App Check
	// tokens as needed.
	isTokenAutoRefreshEnabled: true
  });



const CACHE_NAME = 'cache-v1';
localStorage.setItem("urlstocache",[]);
getAuth().onAuthStateChanged((user) => {
  if (user) {
    //console.log('user signed in', user.uid);
  } else {
    //console.log('user signed out');
  }
});

/**
 * Returns a promise that resolves with an ID token if available.
 * @return {!Promise<?string>} The promise that resolves with an ID token if
 *     available. Otherwise, the promise resolves with null.
 */
const getIdToken = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        user.getIdToken().then((idToken) => {
          resolve(idToken);
        }, (error) => {
          resolve(null);
        });
      } else {
        resolve(null);
      }
    });
  }).catch((error) => {
    //console.log(error);
  });
};


/**
 * @param {string} url The URL whose origin is to be returned.
 * @return {string} The origin corresponding to given URL.
 */
const getOriginFromUrl = (url) => {
  // https://stackoverflow.com/questions/1420881/how-to-extract-base-url-from-a-string-in-javascript
  const pathArray = url.split('/');
  const protocol = pathArray[0];
  const host = pathArray[2];
  return protocol + '//' + host;
};


self.addEventListener('install', (event) => {
  // Perform install steps.
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
    // Add all URLs of resources we want to cache.
    return cache.addAll(JSON.parse(localStorage.getItem("urlstocache")))
        .catch((error) => {
          // Suppress error as some of the files may not be available for the
          // current page.
        });
  }));
});

// As this is a test app, let's only return cached data when offline.
self.addEventListener('fetch', (event) => {
  const fetchEvent = event;
  // Get underlying body if available. Works for text and json bodies.
  const getBodyContent = (req) => {
    return Promise.resolve().then(() => {
      if (req.method !== 'GET') {
        if (req.headers.get('Content-Type').indexOf('json') !== -1) {
          return req.json()
            .then((json) => {
              return JSON.stringify(json);
            });
        } else {
          return req.text();
        }
      }
    }).catch((error) => {
      // Ignore error.
    });
  };
  const requestProcessor = (idToken) => {
    let req = event.request;
    let processRequestPromise = Promise.resolve();
    // For same origin https requests, append idToken to header.
    if (self.location.origin == getOriginFromUrl(event.request.url) &&
        (self.location.protocol == 'https:' ||
         self.location.hostname == 'localhost') &&
        idToken) {
      // Clone headers as request headers are immutable.
      const headers = new Headers();
      for (let entry of req.headers.entries()) {
        headers.append(entry[0], entry[1]);
      }
      // Add ID token to header. We can't add to Authentication header as it
      // will break HTTP basic authentication.
      headers.append('Authorization', 'Bearer ' + idToken);
      processRequestPromise = getBodyContent(req).then((body) => {
        try {
          req = new Request(req.url, {
            method: req.method,
            headers: headers,
            mode: 'same-origin',
            credentials: req.credentials,
            cache: req.cache,
            redirect: req.redirect,
            referrer: req.referrer,
            body,
            bodyUsed: req.bodyUsed,
            context: req.context
          });
        } catch (e) {
          // This will fail for CORS requests. We just continue with the
          // fetch caching logic below and do not pass the ID token.
        }
      });
    }
    return processRequestPromise.then(() => {
      return fetch(req);
    })
    .then((response) => {
      // Check if we received a valid response.
      // If not, just funnel the error response.
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }
      // If response is valid, clone it and save it to the cache.
      const responseToCache = response.clone();
      // Save response to cache only for GET requests.
      // Cache Storage API does not support using a Request object whose method is
      // not 'GET'.
      if (req.method === 'GET') {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(fetchEvent.request, responseToCache);
        });
      }
      // After caching, return response.
      return response;
    })
    .catch((error) => {
      // For fetch errors, attempt to retrieve the resource from cache.
      return caches.match(fetchEvent.request.clone());
    })
    .catch((error) => {
      // If error getting resource from cache, do nothing.
      //console.log(error);
    });
  };
  // Try to fetch the resource first after checking for the ID token.
  event.respondWith(getIdToken().then(requestProcessor, requestProcessor));
});

self.addEventListener('activate', (event) => {
  // Update this list with all caches that need to remain cached.
  const cacheWhitelist = ['cache-v1'];
  event.waitUntil(caches.keys().then((cacheNames) => {
    return Promise.all(cacheNames.map((cacheName) => {
      // Check if cache is not whitelisted above.
      if (cacheWhitelist.indexOf(cacheName) === -1) {
        // If not whitelisted, delete it.
        return caches.delete(cacheName);
      }
    // Allow active service worker to set itself as the controller for all clients
    // within its scope. Otherwise, pages won't be able to use it until the next
    // load. This makes it possible for the login page to immediately use this.
    })).then(() => self.clients.claim());
  }));
});