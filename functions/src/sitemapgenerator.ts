
import * as functions from "firebase-functions";
import {initializeApp,firestore,storage} from "firebase-admin";
import {join} from "path";
import axios from "axios";
const fs = require('fs');
const os = require('os');




export default (async ()=>  {
    initializeApp(functions.config().firebase);
    const address=`https://www.digitalna.subiblioteka.rs`;
        var date = (new Date()).toISOString();
        const day=date.substring(0,10)
  
  const categories= [
    {
        "name":"books",
        "icon":"auto_stories"
    },
    {
        "name":"newspapers",
        "icon":"newspaper"
    },
    {
        "name":"photoalbums",
        "icon":"photo_library"
    },
    {
        "name":"notes",
        "icon":"library_music"
    },
    {
        "name":"posters",
        "icon":"ads_click"
    },
    {
        "name":"manuscripts",
        "icon":"history_edu"
    }
  ];

    let routing_public=[{
      path:"home",
      title:"",                                                                                                                                                                                                                               
      description:"",
      last_modifcations:day
    },
    {
      path:"support",
      title:"",                                                                                                                                                                                                                               
      description:"",
      last_modifcations:day
    },
    {
      path:"account/login",
      title:"",                                                                                                                                                                                                                               
      description:"",
      last_modifcations:day
    }
  ]
    let sitemap="";
    sitemap+=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    await routing_public.forEach( async (element)=>
    {
      sitemap+=`<url><loc>${address}/${element.path}</loc><lastmod>${element.last_modifcations}</lastmod><changefreq>monthly</changefreq></url>\n`;
    });
    await categories.forEach(async (category: any)=>{
      functions.logger.log(category.name);
      await firestore().collection(`/${category.name}`).get().then(async (a:any)=>{
      sitemap+=`<url><loc>${address}/views/${category.name}</loc><lastmod>${day}</lastmod><changefreq>monthly</changefreq></url>\n`;
     await a.forEach( async (b:any)=>{
          let book=b.data();
          sitemap+=`<url><loc>${address}/view/${category.name}/${b.id}/${book.name}</loc><lastmod>${day}</lastmod><changefreq>monthly</changefreq></url>\n`;
          await firestore().collection(`/${category.name}/chapters`).get().then(async (d:any)=>{
          await d.forEach( async (c:any)=>{
              sitemap+=`<url><loc>${address}/view/${category.name}/${b.id}/${book.name}/chapter/${c.id}</loc><lastmod>${day}</lastmod><changefreq>monthly</changefreq></url>\n`;
            });
          });
      });
    });
  });
    sitemap+="</urlset>";
    


    
    const bucket= storage().bucket("gs://su-library-archive.appspot.com");
    


    await fs.writeFile(join(os.tmpdir(), `sitemap.xml`), sitemap,{
        encoding: "utf8",
        flag: "w",
        mode: 0o666
      },
      (err:any) => {
        if (err)
        functions.logger.log(err);
        else {
          functions.logger.log("xml file write success")
        }
    });
    
   await bucket.upload(join(os.tmpdir(), `sitemap.xml`),{destination: `sitemap.xml`,validation:true});
   functions.logger.log("File uploaded");

   fs.unlinkSync(join(os.tmpdir(), `sitemap.xml`));
   functions.logger.log("File deleted");

   const google = `https://www.google.com/webmasters/sitemaps/ping?sitemap=https://www.digitalna.subiblioteka.rs/sitemap.xml`
   const bing = `https://www.bing.com/ping?sitemap=https://www.digitalna.subiblioteka.rs/sitemap.xml`
   functions.logger.log("Send axios querys");
   axios.get(google).catch(functions.logger.log)
   axios.get(bing).catch(functions.logger.log)
   functions.logger.log("Function ended");

  
    return;
  
  })