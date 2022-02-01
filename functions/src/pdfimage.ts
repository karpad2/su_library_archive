import * as functions from "firebase-functions";
import {firestore, initializeApp,storage} from "firebase-admin";

const fromPathpdf = require("pdf2pic");
const mkdirp = require('mkdirp');
const pdf = require('pdf-parse');
const { mkdirsSync } = require("fs-extra");
const rimraf = require('rimraf');

import {basename,dirname,extname,normalize,join,format} from "path";

const os = require('os');
const fs = require('fs');


const extensions={
  pdf:".pdf",
  jpg:".jpg",
  json:".json"
};

export default  async (object:functions.storage.ObjectMetadata) => 
    {
    if(object==undefined) return;
    if (!object?.contentType?.startsWith("application/pdf")) {
      return null;
    }
    let filePath = String(object.name);
  
    let baseFileName = basename(filePath, extname(filePath));
    let fileDir = dirname(filePath);
    let JPGDIr = dirname (filePath)+"/pages";
   
    let PDFFilePath = normalize(format({dir: fileDir, name: baseFileName, ext: extensions.pdf }));
    let JPGFilePath = normalize(format({dir: JPGDIr, name: baseFileName, ext: extensions.jpg}));

    let JSONFilePath = normalize(format({dir: fileDir, name: `book`, ext: extensions.json}));
    let tempLocalFile = join(os.tmpdir(), filePath);
    let tempLocalDir = dirname(tempLocalFile);
    let tempLocalPDFFile = join(os.tmpdir(), PDFFilePath);
    let tempLocalJSONFile = join(os.tmpdir(), JSONFilePath);
    let tempLocalJPGDir = join(os.tmpdir(), JPGDIr);
    let RemoteJPGFilePath;
    let RemoteJSONFilePath;
    let keywords=[`keyword`];
    //let language="";
    let pn=0;
  

   initializeApp(functions.config().firebase);
  
    if (object?.contentType?.startsWith("application/pdf")) {
      functions.logger.log("PDF file. Start convert...");
    }
 const config_writer= async ()=>
 {
  await fs.writeFile(tempLocalJSONFile, JSON.stringify(json_conf),{
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

RemoteJSONFilePath = normalize(format({dir: fileDir, name: "book", ext: extensions.json}));
await bucket.upload(tempLocalJSONFile, {destination: RemoteJSONFilePath,validation:false});
 };

  
    functions.logger.log(object.bucket);
    let bucket = storage().bucket(object.bucket);
  
    rimraf.sync(tempLocalJPGDir);
    mkdirsSync(tempLocalJPGDir);
    mkdirp(tempLocalDir);
  
  
    await bucket.file(PDFFilePath).download({destination: tempLocalPDFFile,validation:false});
    functions.logger.log("The file has been downloaded to", tempLocalPDFFile);
    let dataBuffer = fs.readFileSync(tempLocalPDFFile);
     await pdf(dataBuffer).then((data:any)=>
    {
      pn=data.numpages;
    });
    functions.logger.log(`Page number: `,pn)
    
   
    let json_conf={
      progress:"start"
    };
    config_writer();
     
    const upload_store= (async(a:any)=>
    {
        await storeAsImage(a);
        RemoteJPGFilePath = normalize(format({dir: JPGDIr, name: `${a}`, ext: extensions.jpg}));
        JPGFilePath = normalize(format({dir: tempLocalJPGDir, name:  `a.${a}`, ext: extensions.jpg}));
        await bucket.upload(JPGFilePath, {destination: RemoteJPGFilePath,validation:false});
       
        if(a==1)
             {
               functions.logger.log("Try to make thumbnail: ");      
               RemoteJPGFilePath = normalize(format({dir: fileDir, name: "thumbnail", ext: extensions.jpg}));
               await bucket.upload(JPGFilePath, {destination: RemoteJPGFilePath,validation:false});
              }
    });

    let page_number=pn;
    
    const options = {
    density: 100,
    savePath: tempLocalJPGDir,
    saveFilename: "a",
    format: "jpg",
    width: 1280,
    height: 1808
  };
  
  const storeAsImage =  fromPathpdf(tempLocalPDFFile, options).subClass({ imageMagick: true });;
  
  for(var i=1;i<=page_number;i++)
  {   
   await upload_store(i);
  }
  
  functions.logger.log('~PDFImage finished');
  

  json_conf={
    progress:"finished"
  };

  config_writer();
  firestore().collection("books").doc(fileDir).set({
    "page_number":`${page_number}`,
    "uploading_date":new Date(),
    "author":"",
    "name":"",
    "keywords":keywords,
    "favorites":0,
    "language":"rs-RS"
  });

   fs.unlinkSync(JPGDIr);
   fs.unlinkSync(tempLocalFile);
   functions.logger.log('Delete files finished');
   //fs.unlinkSync(tempLocalDir);
   return null;
  }
