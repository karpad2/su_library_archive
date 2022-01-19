import * as functions from "firebase-functions";
import {initializeApp,storage} from "firebase-admin";
//import {getDatabase} from "firebase-admin/database";


const mkdirp = require('mkdirp');
const { mkdirsSync } = require("fs-extra");
const rimraf = require('rimraf');


import {basename,dirname,extname,normalize,join,format} from "path";

const os = require('os');
const fs = require('fs');
//const md5 = require('md5');


const extensions={
  pdf:".pdf",
  jpg:".jpg",
  json:".json"
};

export default  async (object:functions.storage.ObjectMetadata) => 
    {
    if(object==undefined) return;
    if (!object?.contentType?.startsWith("image/jpeg")) {
      return null;
    }
    let filePath = String(object.name);
  
    let baseFileName = basename(filePath, extname(filePath));
    let fileDir = dirname(filePath);
    let JPGDIr = dirname (filePath)+"/pages";
   
    let PDFFilePath = normalize(format({dir: fileDir, name: baseFileName, ext: extensions.jpg }));
 

    let tempLocalFile = join(os.tmpdir(), filePath);
    let tempLocalDir = dirname(tempLocalFile);
    let tempLocalPDFFile = join(os.tmpdir(), PDFFilePath);

    let tempLocalJPGDir = join(os.tmpdir(), JPGDIr);


  

   initializeApp(functions.config().firebase);
   //const db = getDatabase();
  
    if (object?.contentType?.startsWith("image/jpeg")) {
      functions.logger.log("jpg file. Start convert...");
    }

  
    functions.logger.log(object.bucket);
    let bucket = storage().bucket(object.bucket);
  
    rimraf.sync(tempLocalJPGDir);
    mkdirsSync(tempLocalJPGDir);
    mkdirp(tempLocalDir);
  
  
    await bucket.file(PDFFilePath).download({destination: tempLocalPDFFile,validation:false});
    functions.logger.log("The file has been downloaded to", tempLocalPDFFile);
    
    
   /* fs.readFile(tempLocalPDFFile,(err:,buf:)=>{
      db.ref(fileDir).set({"info":md5(buf.data)});
      
    });*/


   fs.unlinkSync(JPGDIr);
   fs.unlinkSync(tempLocalFile);
   functions.logger.log('Delete file finished');
   //fs.unlinkSync(tempLocalDir);
   return null;
  }
