
import * as functions from "firebase-functions";
const admin = require('firebase-admin');

export default (async (req:any,res:any)=>  {
    admin.initializeApp(functions.config().firebase);
    const address=`https://su-library-archive.firebaseapp.com`;
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
      sitemap+=`<url><loc>${address}${element.path}</loc><lastmod>${element.last_modifcations}</lastmod></url>`;
    });
    admin.firestore().collection("books").get().then((a:any)=>
    {
    a.forEach( async (b:any)=>
      {
        let book=b.data();
        
        sitemap+=`<url><loc>${address}/book/${b.id}/${book.author_name}/${book.book_name}</loc><lastmod>${day}</lastmod></url>`;
  
      })
    });
  
    sitemap+="</body>\n</html>";
    
    res.set('Content-Type', 'text/xml');
    res.status(200).send(sitemap);
  
  
    return;
  
  })