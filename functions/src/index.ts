import * as functions from "firebase-functions";
import pdfimage from "./pdfimage";
import sitemap from "./sitemap";

exports.buildSitemap = functions.https.onRequest((request: functions.Request,
     response: functions.Response)=>
{
 sitemap(request,response);
});
  

exports.renderpdftoimage=functions.runWith({
    timeoutSeconds: 540,
    memory: "4GB"
  })
  .storage.object().onFinalize((object)=>
  {
   pdfimage(object);
  });