import * as functions from "firebase-functions";
import {firestore, initializeApp,storage} from "firebase-admin";
//const vision = require('@google-cloud/vision');
const fromPath = require("pdf2pic");
const mkdirp = require('mkdirp');

const pdf = require('pdf-parse');
const { mkdirsSync } = require("fs-extra");


const rimraf = require('rimraf');

const path = require('path');
const os = require('os');
const fs = require('fs');

const PDF_EXTENSION = ".pdf";
const JPEG_EXTENSION = ".jpg";
const JSON_EXTENSION = ".json";


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

    let JSONFilePath = path.normalize(path.format({dir: fileDir, name: `book`, ext: JSON_EXTENSION}));
    let tempLocalFile = path.join(os.tmpdir(), filePath);
    let tempLocalDir = path.dirname(tempLocalFile);
    let tempLocalPDFFile = path.join(os.tmpdir(), PDFFilePath);
    let tempLocalJSONFile = path.join(os.tmpdir(), JSONFilePath);
    let tempLocalJPGDir = path.join(os.tmpdir(), JPGDIr);
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

RemoteJSONFilePath = path.normalize(path.format({dir: fileDir, name: "book", ext: JSON_EXTENSION}));
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
    
    /*
    const worker = createWorker({
      logger: m =>  functions.logger.log(`Tesseract: `,m)
    });
*/
    let json_conf={
      progress:"start"
    };

    config_writer();
    
   
    const upload_store= (async(a:any)=>
    {
        await storeAsImage(a);
        RemoteJPGFilePath = path.normalize(path.format({dir: JPGDIr, name: `${a}`, ext: JPEG_EXTENSION}));
        JPGFilePath = path.normalize(path.format({dir: tempLocalJPGDir, name:  `a.${a}`, ext: JPEG_EXTENSION}));
        await bucket.upload(JPGFilePath, {destination: RemoteJPGFilePath,validation:false});
       
        if(a==1)
             {
              functions.logger.log("Try to ocr image text:");      
               RemoteJPGFilePath = path.normalize(path.format({dir: fileDir, name: "thumbnail", ext: JPEG_EXTENSION}));
               await bucket.upload(JPGFilePath, {destination: RemoteJPGFilePath,validation:false});
               /*const client = new vision.ImageAnnotatorClient();
               const [result] = await client.textDetection(`gs://${RemoteJPGFilePath}`);
               const detections = result.textAnnotations;
               detections.forEach((element:any) => {
                 keywords.push(element.description);
                 let l=element.property.detectedLanguages[0].languageCode
                 language=`${l}-${String(l).toLocaleUpperCase()}`;
               });
                */
              

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
  
  const storeAsImage =  fromPath.fromPath(tempLocalPDFFile, options).subClass({ imageMagick: true });;
  
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
    "author_name":"",
    "book_name":"",
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
