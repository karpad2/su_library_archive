import * as functions from "firebase-functions";
import sitemap from "./sitemap";
import createuser from "./createuser";
import fulltextsearch from "./fulltextsearch";


exports.buildSitemap = functions.https.onRequest((request: functions.https.Request,response: functions.Response)=>
{
 sitemap(request,response);
});

exports.fulltextsearchquery = functions.https.onRequest((request: functions.https.Request,response: functions.Response)=>
{
   fulltextsearch(request,response);
});

exports.createUserGoogle = functions.auth.user()
.onCreate((user:functions.auth.UserRecord, context:functions.EventContext)=>{
 createuser(user,context);
});

