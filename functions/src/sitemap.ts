
import * as functions from "firebase-functions";
import {initializeApp,firestore} from "firebase-admin";



export default (async (req:functions.https.Request,res:functions.Response)=>  {
    initializeApp(functions.config().firebase);
    const address=`https://su-library-archive.web.app`;
    const day=`${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDay()}`;
  
    let routing_public=[{
      path:"public/home",
      title:"",                                                                                                                                                                                                                               
      description:"",
      last_modifcations:day
    },
    {
      path:"public/support",
      title:"",                                                                                                                                                                                                                               
      description:"",
      last_modifcations:day
    },
    {
      path:"home",
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
    sitemap+="<html>\n<head/>\n<body>";
    routing_public.forEach((element)=>
    {
      sitemap+=`<url><loc>${address}/${element.path}</loc><lastmod>${element.last_modifcations}</lastmod></url>`;
    });
    await firestore().collection("books").get().then((a:any)=>
    {
    a.forEach( async (b:any)=>
      {
        let book=b.data();
        
        sitemap+=`<url><loc>${address}/public/book/${b.id}/${book.name}</loc><lastmod>${day}</lastmod></url>\n`;
  
      })
    });

    await firestore().collection("photoalbums").get().then((a:any)=>
    {
    a.forEach( async (b:any)=>
      {
        let photoalbums=b.data();
        
        sitemap+=`<url><loc>${address}/public/photoalbum/${photoalbums.id}/${photoalbums.photoalbum_name}</loc><lastmod>${day}</lastmod></url>\n`;
  
      })
    });

   

    await firestore().collection("newspapers").get().then((a:any)=>
    {
    a.forEach( async (b:any)=>
      {
        let newspaper=b.data();
        sitemap+=`<url><loc>${address}/public/newspaper/${newspaper.id}/${newspaper.name}</loc><lastmod>${day}</lastmod></url>\n`;
  
      })
    });

    await firestore().collection("notes").get().then((a:any)=>
    {
    a.forEach( async (b:any)=>
      {
        let note=b.data();
        sitemap+=`<url><loc>${address}/public/note/${note.id}/${note.note_name}</loc><lastmod>${day}</lastmod></url>\n`;
  
      })
    });
  
    sitemap+="</body>\n</html>";
    
    res.set('Content-Type', 'text/xml');
    res.status(200).send(sitemap);
  
  
    return;
  
  })