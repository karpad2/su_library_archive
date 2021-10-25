import {getAuth} from 'firebase/auth';
import user_default from "./user_default.json";
const { initializeAppCheck, ReCaptchaV3Provider } = require("firebase/app-check");
import {getDatabase,ref,set, onValue,onDisconnect,child} from 'firebase/database';
import { initializeApp } from "firebase/app";
import { enableIndexedDbPersistence } from "firebase/firestore";
import { getMessaging,getToken } from "firebase/messaging";
import { getPerformance } from "firebase/performance";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


import firebaseCredentials from './credentials';
const app = initializeApp(firebaseCredentials.config);
const messaging = getMessaging();
const perf = getPerformance(app);
const storage = getStorage(app);
const firestore = getFirestore(app);
const analytics = getAnalytics();
logEvent(analytics, 'notification_received');

const appCheck = initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider('6LckM_IcAAAAALovmVfNagj6x76dCQX1WkWCZb4M'),
  
	// Optional argument. If true, the SDK automatically refreshes App Check
	// tokens as needed.
	//isTokenAutoRefreshEnabled: true
  });
// key for recatchpa3 
//const appcheck=firebase.appCheck()


// Request Permission of Notifications



//appcheck.setTokenAutoRefreshEnabled();
const FirebaseAuth = getAuth();
//const Firebase = firebase;
const FireDb = getDatabase();
const presenceRef = ref(FireDb, "disconnectmessage");

onDisconnect(presenceRef).set("I disconnected!");


const connectedRef = ref(FireDb, ".info/connected");
onValue(connectedRef, (snap) => {
  if (snap.val() === true) {
	
    console.log("connected");
  } else {
    console.log("not connected");
  }
});


const userId = null;
const auth = getAuth();
const user= getAuth.currentUser;

//const user_data = child(dbRef, `users/${FirebaseAuth._currentUser.uid}`);
let user_data ="";
const change_Theme_Fb= (value)=>{
	const userId = FirebaseAuth.currentUser.uid;
	if( localStorage.getItem("userTheme")===null) localStorage.userTheme = "light";
	if (localStorage.userTheme=="light")
	{ localStorage.userTheme = "dark";
	set(ref(FireDb,`users/${userId}/user_profile_color`),"dark");
	}
	else
	{
		localStorage.userTheme = "light";
		set(ref(FireDb,`users/${userId}/user_profile_color`),"light");
		
	}
};

export {
	FirebaseAuth,
	storage,
	FireDb,
	firestore,
	change_Theme_Fb,
	user,
	userId
}

