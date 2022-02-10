
import * as functions from "firebase-functions";
import {initializeApp,firestore} from "firebase-admin";



export default (async (user:functions.auth.UserRecord,context:functions.EventContext)=>  {
    initializeApp(functions.config().firebase);
    let link= firestore().doc(`users/${user.uid}`);
    let userdata={
        email:user.email,
        member:false,
        admin:false,
        name:user.displayName,
        h4cker:false,
        language:"rs-RS",
        oath:true
    };
    link.create(userdata);


    
    
    
  
  
    return;
  
  })