import * as functions from "firebase-functions";
const admin = require('firebase-admin');
const PDFImage= require("pdf-image").PDFImage;
const fromPath =require("pdf2pic");
const mkdirp = require('mkdirp');
const { mkdirsSync } = require("fs-extra");
const { Storage } = require('@google-cloud/storage');
const rimraf = require('rimraf');

const path = require('path');
const os = require('os');
const fs = require('fs');

export default () => () => ({
  pdfHandler: (async (object)=> 
  {

  if (!object.contentType.startsWith("application/pdf")) {
    return null;
  }
  let filePath = object.name;

  const gcs = new Storage();

const PDF_EXTENSION = ".pdf";
const JPEG_EXTENSION = ".jpg";

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

  if (object.contentType.startsWith("application/pdf")) {
    functions.logger.log("PDF file. Start convert...");
  }

  //functions.logger.log('jpg directory.',tempLocalJPGDir);

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

const upload_store= async(a)=>
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
}


let k=[];

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
})}) 

export default () => () => ({
  sitemapHandler: (async (req,res)=>  {
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
  admin.firestore().collection("books").get().then((a)=>
  {
  a.forEach( async b=>
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
})

