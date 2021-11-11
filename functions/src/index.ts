import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import * as admin from "firebase-admin";

import {fromPath} from "pdf2pic";
import { Storage } from "@google-cloud/storage"
const mkdirp = require('mkdirp');
const { mkdirsSync } = require("fs-extra");

const rimraf = require("rimraf");
const PDFImage = require("pdf-image").PDFImage;

const path = require('path');
const os = require('os');
const fs = require('fs');
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });




 

const gcs = new Storage();

const PDF_EXTENSION = '.pdf';
const JPEG_EXTENSION = '.jpg';
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.add_role_admin = functions.firestore
    .document('/users/{userID}/admin').onWrite((change, context) => {
      // ... Your code here
      initializeApp(functions.config().firebase);
      admin.auth().createCustomToken(context.params.userID,{admin:change.after.data()});
      return null;
    });
    exports.add_role_member = functions.firestore
    .document('/users/{userID}/member').onWrite((change, context) => {
      // ... Your code here
      initializeApp(functions.config().firebase);
      admin.auth().createCustomToken(context.params.userID,{member:change.after.data()});
      return null;
    });
    
exports.renderpdftoimage=functions.storage
.object().onFinalize(async object => {
    initializeApp(functions.config().firebase);
  if (!object.contentType.startsWith('application/pdf')) {
   // functions.logger.log('This is not an pdf.');
    return null;
  }
  let filePath = object.name;
  //'/books/{bookID}/book.pdf'
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

  


  if (object.contentType.startsWith('application/pdf')) {
    functions.logger.log('PDF file. Start convert...');
  }

  //functions.logger.log('jpg directory.',tempLocalJPGDir);

  let bucket = admin.storage().bucket(object.bucket);

  rimraf.sync(tempLocalJPGDir);
  mkdirsSync(tempLocalJPGDir);
  mkdirp(tempLocalDir);


  await bucket.file(PDFFilePath).download({destination: tempLocalPDFFile,validation:false});
  functions.logger.log('The file has been downloaded to', tempLocalPDFFile);

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

const storeAsImage =  fromPath(tempLocalPDFFile, options);


for(var i=1;i<=page_number;i++)
{
await storeAsImage(i);
 RemoteJPGFilePath = path.normalize(path.format({dir: JPGDIr, name: `${i}`, ext: JPEG_EXTENSION}));
 JPGFilePath = path.normalize(path.format({dir: tempLocalJPGDir, name:  `a.${i}`, ext: JPEG_EXTENSION}));
 await bucket.upload(JPGFilePath, {destination: RemoteJPGFilePath,validation:false});

 if(i==1)
      {
        
        RemoteJPGFilePath = path.normalize(path.format({dir: fileDir, name: `thumbnail`, ext: JPEG_EXTENSION}));
        await bucket.upload(JPGFilePath, {destination: RemoteJPGFilePath,validation:false});
      }
      fs.unlinkSync(JPGFilePath);  
}
 functions.logger.log('~PDFImage finished');

 //fs.unlinkSync(JPGDIr);
 //fs.unlinkSync(tempLocalFile);
 //fs.unlinkSync(tempLocalDir);
 return null;
});