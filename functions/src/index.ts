import * as functions from "firebase-functions";
//import pdfimage from "./pdfimage";
import sitemap from "./sitemap";
//import sitemapgenerator from "./sitemapgenerator";
import createuser from "./createuser";
//import discordbugmessager from "./discordbugmessager";
//import deletebook from "./deletebook";
/*
exports.buildSitemap = functions.https.onRequest((request: functions.https.Request,response: functions.Response)=>
{
  discordbugmessager(request,response);
});*/
/*
exports.DiscordBugMessager = functions.firestore.document("tickets/{ticketid}").onCreate(
  (snap:functions.firestore.DocumentSnapshot, context:functions.EventContext)=>{
    discordbugmessager(snap,context);
});*/

exports.buildSitemap = functions.https.onRequest((request: functions.https.Request,response: functions.Response)=>
{
 sitemap(request,response);
});
/*
exports.buildSitemapGenerator = functions.pubsub.schedule('every 48 hours').onRun((context)=>
{
 sitemapgenerator();
});*/
 
exports.createUserGoogle = functions.auth.user()
.onCreate((user:functions.auth.UserRecord, context:functions.EventContext)=>{
 createuser(user,context);
});
/*
exports.deletebook = functions.firestore.document("books/{bookID}").onDelete(
     (snap:functions.firestore.DocumentSnapshot, context:functions.EventContext)=>{
          deletebook(snap,context);
});*/
/*
exports.renderpdftoimage=functions.runWith({
     timeoutSeconds: 540,
     memory: "4GB"
   })
   .storage.object().onFinalize(async (object:functions.storage.ObjectMetadata)=>
   {
     await pdfimage(object);
   });
*/