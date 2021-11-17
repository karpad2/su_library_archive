import * as functions from "firebase-functions";
const admin = require('firebase-admin');
const PDFImage= require("pdf-image").PDFImage;
const fromPath =require("pdf2pic");
const mkdirp = require('mkdirp');
const { mkdirsSync } = require("fs-extra");

const rimraf = require('rimraf');

const path = require('path');
const os = require('os');
const fs = require('fs');

const PDF_EXTENSION = ".pdf";
const JPEG_EXTENSION = ".jpg";


export default  async (object:functions.storage.ObjectMetadata) => 
    {
    if(object==undefined) return;
    if (!object?.contentType?.startsWith("application/pdf")) {
      return null;
    }
    let filePath = object.name;
  

  

    let baseFileName = path.basename(filePath, path.extname(filePath));
    let fileDir = path.dirname(filePath);
    let JPGDIr = path.dirname (filePath)+"/pages";
   
    
    let PDFFilePath = path.normalize(path.format({dir: fileDir, name: baseFileName, ext: PDF_EXTENSION}));
    let JPGFilePath = path.normalize(path.format({dir: JPGDIr, name: baseFileName, ext: JPEG_EXTENSION}));
  
    let tempLocalFile = path.join(os.tmpdir(), filePath);
    let tempLocalDir = path.dirname(tempLocalFile);
    let tempLocalPDFFile = path.join(os.tmpdir(), PDFFilePath);
    let tempLocalJPGDir = path.join(os.tmpdir(), JPGDIr);
    let RemoteJPGFilePath;
  
    
    admin.initializeApp(functions.config().firebase);
  
    if (object?.contentType?.startsWith("application/pdf")) {
      functions.logger.log("PDF file. Start convert...");
    }
/*
    */
    const upload_store= (async(a:any)=>
    {
        await storeAsImage(a);
        RemoteJPGFilePath = path.normalize(path.format({dir: JPGDIr, name: `${a}`, ext: JPEG_EXTENSION}));
        JPGFilePath = path.normalize(path.format({dir: tempLocalJPGDir, name:  `a.${a}`, ext: JPEG_EXTENSION}));
        await bucket.upload(JPGFilePath, {destination: RemoteJPGFilePath,validation:false});
       
        if(a==1)
             {          
               RemoteJPGFilePath = path.normalize(path.format({dir: fileDir, name: "thumbnail", ext: JPEG_EXTENSION}));
               await bucket.upload(JPGFilePath, {destination: RemoteJPGFilePath,validation:false});
             }
             fs.unlinkSync(JPGFilePath);
    });

  
    functions.logger.log(object.bucket);
  
    let bucket = admin.storage().bucket(object.bucket);
  
    rimraf.sync(tempLocalJPGDir);
    mkdirsSync(tempLocalJPGDir);
    mkdirp(tempLocalDir);
  
  
    await bucket.file(PDFFilePath).download({destination: tempLocalPDFFile,validation:false});
    functions.logger.log("The file has been downloaded to", tempLocalPDFFile);
  
    let ik=new PDFImage(tempLocalPDFFile);
    let page_number=(await ik.getInfo()).Pages;
  
  const options = {
    density: 100,
    savePath: tempLocalJPGDir,
    saveFilename: "a",
    format: "jpg",
    width: 1280,
    height: 1808
  };
  
  const storeAsImage =  fromPath.fromPath(tempLocalPDFFile, options);
  

  
  
  
  for(var i=1;i<=page_number;i++)
  {   
  
         await upload_store(i);
     
  }
  
  functions.logger.log('~PDFImage finished');
  
   fs.unlinkSync(JPGDIr);
   fs.unlinkSync(tempLocalFile);
   functions.logger.log('Delete files finished');
   //fs.unlinkSync(tempLocalDir);
   return null;
  }
