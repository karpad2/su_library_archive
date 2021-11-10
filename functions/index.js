const functions = require("firebase-functions");
const admin = require('firebase-admin');
const PDFImage = require("pdf-image").PDFImage;
const mkdirp = require('mkdirp');
const { Storage } = require('@google-cloud/storage');
admin.initializeApp();

const path = require('path');
const os = require('os');
const fs = require('fs');

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
      admin.auth().createCustomToken(context.params.userID,{admin:change.after.data()});
    });
    exports.add_role_member = functions.firestore
    .document('/users/{userID}/member').onWrite((change, context) => {
      // ... Your code here
      admin.auth().createCustomToken(context.params.userID,{member:change.after.data()});
    });
    
   

exports.render_pdf_to_image=functions.storage
.object().onFinalize(async (object)=>{
  const filePath = object.name;
  //'/books/{bookID}/book.pdf'
  const baseFileName = path.basename(filePath, path.extname(filePath));
  const fileDir = path.dirname(filePath);
  const JPGDIr = path.dirname (filePath+"/pages/");

  const PDFFilePath = path.normalize(path.format({dir: fileDir, name: baseFileName, ext: PDF_EXTENSION}));
  let JPGFilePath = path.normalize(path.format({dir: fileDir, name: baseFileName, ext: PDF_EXTENSION}));
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);
  const tempLocalPDFFile = path.join(os.tmpdir(), PDFFilePath);

  
  if (!object.contentType.startsWith('application/pdf')) {
    functions.logger.log('This is not an pdf.');
    return null;
  }

  if (object.contentType.startsWith('application/pdf')) {
    functions.logger.log('PDF file. Start convert...');
  }

  

  const bucket = admin.storage().bucket(object.bucket);


  await mkdirp(tempLocalDir);


  await bucket.file(PDFFilePath).download({destination: tempLocalPDFFile});
  functions.logger.log('The file has been downloaded to', tempLocalPDFFile);



var pdfImage = new PDFImage(tempLocalPDFFile);
 pdfImage.convertFile().then((images)=>
 {
    images.forEach(async (element,index)=>{
      let i=index+1;
      if(i==1)
      {

      }
      JPGFilePath = path.normalize(path.format({dir: JPGDIr, name: `${i}`, ext: JPEG_EXTENSION}));
      await bucket.upload(element, {destination: JPGFilePath});
      if(i==1)
      {
        JPGFilePath = path.normalize(path.format({dir: fileDir, name: `thumbnail`, ext: JPEG_EXTENSION}));
      }
      functions.logger.log('JPEG image uploaded to Storage at', JPGFilePath);
    })
 });


 fs.unlinkSync(tempLocalJPEGFile);
 fs.unlinkSync(tempLocalFile);
 fs.unlinkSync(tempLocalDir);
});