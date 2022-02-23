
import * as functions from "firebase-functions";
import {initializeApp,firestore,storage} from "firebase-admin";
import {join} from "path";
const fs = require('fs');
const os = require('os');

export default (async ()=>  {
    initializeApp(functions.config().firebase);
  
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

  const bucket= storage().bucket("gs://su-library-archive.appspot.com");

    


    let sitemap:any[]=[];
    let db=firestore();
    categories.forEach(async (category: any)=>{
      functions.logger.log(category.name);
      
      const mc=await db.collection(category.name).get();
      await mc.forEach(async (b:any)=>{
          let cat= await db.collection(category.name).doc(b.id).collection("chapters").get();
          await cat.forEach( async (c:any)=>{

              sitemap.push({
                profile:category.name,
                id:b.id,
                chapter_id:c.id,
                publisher:b.data().publisher,
                author_name:c.data().author_name,
                chapter_name:c.data().name,
                chapter_description:c.data().description,
                category_description:b.data().description,
                category_name:b.data().name,
                chapter_upload_date:c.data().upload_date,
                chapter_release_date:c.data().release_date
            });
            
            });
          });
      });
   
  
    


  functions.logger.log(sitemap);
    
    

    
    await fs.writeFile(join(os.tmpdir(), `sitemap.json`), JSON.stringify(sitemap),{
        encoding: "utf8",
        flag: "w",
        mode: 0o666
      },
      (err:any) => {
        if (err)
        functions.logger.log(err);
        else {
          functions.logger.log("json file write success")
        }
    });

   await bucket.upload(join(os.tmpdir(), `sitemap.json`),{destination: `sitemap.json`,validation:true});
   functions.logger.log("File uploaded");

   fs.unlinkSync(join(os.tmpdir(), `sitemap.json`));
   functions.logger.log("File deleted");
   functions.logger.log("Function ended");

  
    return;
  
  })