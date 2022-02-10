
import * as functions from "firebase-functions";
import {initializeApp,storage} from "firebase-admin";
import {join} from "path";
const fs = require('fs');
const os = require('os');



export default (async (req:functions.https.Request,res:functions.Response)=>  {
    initializeApp(functions.config().firebase);
    
    let sitemap="";

    const bucket= storage().bucket("gs://su-library-archive.appspot.com");

    await bucket.file(`sitemap.xml`).download({destination: join(os.tmpdir(), `sitemap.xml`),validation:true});
    
   await fs.readFile(join(os.tmpdir(), `sitemap.xml`), 'utf8', function(err, data){
      
      // Display the file content
      sitemap=data;
      functions.logger.log(sitemap);
      functions.logger.log(err);
      res.set('Content-Type', 'text/xml');
      res.status(200).send(sitemap);
      fs.unlinkSync(join(os.tmpdir(), `sitemap.xml`));
    return;
  });


    
  
    
  
  })