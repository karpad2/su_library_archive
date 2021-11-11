import {getAuth,setPersistence,inMemoryPersistence} from 'firebase/auth';
const { initializeAppCheck, ReCaptchaV3Provider } = require("firebase/app-check");
import {getDatabase,ref,set, onValue,onDisconnect,child} from 'firebase/database';
import { initializeApp } from "firebase/app";
import { getMessaging,getToken } from "firebase/messaging";
import { getPerformance } from "firebase/performance";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import Vue from 'vue';
import { getFunctions, httpsCallable } from "firebase/functions";
import {enableIndexedDbPersistence, getFirestore,doc,getDoc,collection,updateDoc,update,setDoc,getDocFromServer,CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import firebaseCredentials from './credentials';

const app = initializeApp(firebaseCredentials.config);
const messaging = getMessaging();
const perf = getPerformance(app);
const storage = getStorage(app);
const firestore = getFirestore(app);
const analytics = getAnalytics();
const functions = getFunctions(app);
logEvent(analytics, 'notification_received');

const appCheck = initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider((Vue.config.devtools)?firebaseCredentials.recatchpa_code:firebaseCredentials.recatchpa_deploy),
  
	// Optional argument. If true, the SDK automatically refreshes App Check
	// tokens as needed.
	//isTokenAutoRefreshEnabled: true
  });

// key for recatchpa3 
//const appcheck=firebase.appCheck()


// Request Permission of Notifications

async function isAdmin()
{
	let l= await getDocFromServer(doc(collection(firestore,"users"),getAuth().currentUser.uid));
	return l.data().admin==null?false:true;
}
async function get_user_language()
{
	let l= await getDocFromServer(doc(collection(firestore,"users"),getAuth().currentUser.uid));
	let k ="";
	if(l.data().language==null)
	{
		k="sr-RS"
	}
	else 
	{
		k=l.data().language;
	}

	return k;
}


//appcheck.setTokenAutoRefreshEnabled();
const FirebaseAuth = getAuth();
//setPersistence(FirebaseAuth,inMemoryPersistence);
//const Firebase = firebase;
const FireDb = getDatabase();


const presenceRef = ref(FireDb, "disconnectmessage");

onDisconnect(presenceRef).set("I disconnected!");


const connectedRef = ref(FireDb, ".info/connected");
onValue(connectedRef, (snap) => {
  if (snap.val() === true) {
	///Connected
  } else {
    ///Not connected
  }
});


let userId = null;
let auth = null;
let user=null;
let user_email_verified= null;
let user_is_admin= null;
(async () => {
    auth = await getAuth();
	user= auth.currentUser;
	user_email_verified= user==null? true : user.emailVerified;
	user_is_admin= user==null?false: await getDocFromServer(`users/${FirebaseAuth.currentUser.uid}`,"admin");
    // all of the script.... 

})();
//const user_data = child(dbRef, `users/${FirebaseAuth._currentUser.uid}`);
let user_data ="";
const change_Theme_Fb= async (value)=>{
	const userId = FirebaseAuth.currentUser.uid;
	if( localStorage.getItem("userTheme")===null) localStorage.userTheme = "light";
	if (localStorage.userTheme=="light")
	{ localStorage.userTheme = "dark";
	await setDoc(doc(firestore,"users",FirebaseAuth.currentUser.uid),{theme:localStorage.userTheme},{merge:true});
	//set(ref(FireDb,`users/${userId}/user_profile_color`),"dark");
	}
	else
	{
		localStorage.userTheme = "light";
		await	setDoc(doc(firestore,"users",FirebaseAuth.currentUser.uid),{theme:localStorage.userTheme},{merge:true});
	}
};

export {
	FirebaseAuth,
	storage,
	FireDb,
	firestore,
	change_Theme_Fb,
	user,
	userId,
	get_user_language,
	isAdmin,
	functions,
	user_is_admin,
	user_email_verified,
}

