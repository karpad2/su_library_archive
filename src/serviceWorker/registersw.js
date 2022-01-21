
import { register } from 'register-service-worker';
import {sw} from "./sw.js";

  register(sw, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB'
      );
    },
    registered(reg) {
      console.log('Service worker has been registered.');
      setInterval(() => {
        reg.update();
      }, 1000 * 60 * 60); // e.g. hourly checks
    },
    cached() {
      console.log('Content has been cached for offline use.');
    },
    updatefound() {
      console.log('New content is downloading.');
    },
    updated(reg) {
      console.log('New content is available; please refresh.');
      document.dispatchEvent(
        new CustomEvent('swUpdated', { detail: reg.waiting })
      );
    },
    offline() {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    }
  });

