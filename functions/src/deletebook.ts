
import * as functions from "firebase-functions";
import {initializeApp,storage} from "firebase-admin";
export default (async (doc:functions.firestore.DocumentSnapshot,res:any)=>  {
    initializeApp(functions.config().firebase);
    let id = doc.id;
    let bucket = storage().bucket(functions.config().firebase.storageBucket);
   bucket.deleteFiles({prefix:`books/${id}`}).then(()=>{
        functions.logger.log("Files are deleted");
    });
    return;
  })