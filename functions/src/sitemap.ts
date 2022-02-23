
import * as functions from "firebase-functions";
import {initializeApp,storage} from "firebase-admin";
import {join} from "path";
const fs = require('fs');
const os = require('os');

const address=`https://www.digitalna.subiblioteka.rs`;
let routing_public=[{
  path:"home",
  title:"",                                                                                                                                                                                                                               
  description:""
},
{
  path:"support",
  title:"",                                                                                                                                                                                                                               
  description:""

},
{
  path:"account/login",
  title:"",                                                                                                                                                                                                                               
  description:""
  
}
];
var date = (new Date()).toISOString();
const day=date.substring(0,10);


export default (async (req:functions.https.Request,res:functions.Response)=>  {
    initializeApp(functions.config().firebase);
    
   // let sitemap=[];

    const bucket= storage().bucket("gs://su-library-archive.appspot.com");

    await bucket.file(`sitemap.json`).download({destination: join(os.tmpdir(), `sitemap.json`),validation:true});
    
   await fs.readFile(join(os.tmpdir(), `sitemap.xml`), 'utf8', function(err, data){
      
      // Display the file content
      //sitemap= JSON.parse(data);
      functions.logger.log(data);
      let text="";
      
      functions.logger.log(err);
    
    text+=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
     routing_public.forEach( async (element)=>
      {
        text+=`<url><loc>${address}/${element.path}</loc><lastmod>${day}</lastmod><changefreq>monthly</changefreq></url>\n`;
      
        functions.logger.log(text);
      });

     /* sitemap.forEach((a:any|null)=>{

        text+=`<url><loc>${address}/view/${a.profile}/${a.id}/${a.category_name}/chapter/${a.chapter_id}</loc><lastmod>${day}</lastmod><changefreq>monthly</changefreq></url>\n`;
        functions.logger.log(text);
  
        });*/
        text+="</urlset>";

      res.set('Content-Type', 'text/xml');
      res.status(200).send(text);
      fs.unlinkSync(join(os.tmpdir(), `sitemap.xml`));
    return;
  });
  })


